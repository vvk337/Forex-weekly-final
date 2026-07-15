import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signJWT } from "@/lib/auth";
import { ensureDbSeeded } from "@/lib/db-seed";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Call DB seeder to make sure default Roles, Departments, Workspaces, and OWNER exist
    await ensureDbSeeded();

    // Auto-seed legacy Admin table for database backward compatibility
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });
    }

    // Lookup user in DB User table first, including role and workspaces relation
    const dbUser = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
        workspaces: true,
      },
    });

    let targetUserPassword = "";
    let isLegacyAdmin = false;

    if (dbUser) {
      if (dbUser.isArchived) {
        return NextResponse.json(
          { error: "Your account has been archived. Access denied." },
          { status: 403 }
        );
      }
      targetUserPassword = dbUser.password;
    } else {
      // Fallback: Check legacy Admin table
      const legacyAdmin = await prisma.admin.findUnique({
        where: { username },
      });
      if (!legacyAdmin) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
      targetUserPassword = legacyAdmin.password;
      isLegacyAdmin = true;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, targetUserPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Update login status for User model
    if (dbUser && !isLegacyAdmin) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          lastLogin: new Date(),
          lastActivity: new Date(),
          isOnline: true,
        },
      });
    }

    // Generate JWT payload with ID, username, and Role name
    const payload = {
      id: dbUser ? dbUser.id : "admin-legacy",
      username,
      role: dbUser?.role?.name || "OWNER",
      workspaceId: dbUser?.workspaces?.[0]?.name || "Publication",
    };
    const token = await signJWT(payload);

    // Set cookie response
    const response = NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200 }
    );

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 6, // 6 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
