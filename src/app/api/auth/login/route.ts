import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signJWT } from "@/lib/auth";
import { ensureDbSeeded } from "@/lib/db-seed";
import { createAuditLog } from "@/lib/audit-helper";

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

    // Lookup user in DB User table first, including role and workspaces relation
    const dbUser = await prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
        workspaces: true,
      },
    });

    if (!dbUser) {
      await createAuditLog(request, { userId: "", username }, "Failed Login Attempt", "AUTH", null, username, "FAILURE", "Username not found");
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (dbUser.isArchived) {
      await createAuditLog(request, { userId: dbUser.id, username }, "Failed Login Attempt", "AUTH", dbUser.id, username, "FAILURE", "Account archived");
      return NextResponse.json(
        { error: "Your account has been archived. Access denied." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      await createAuditLog(request, { userId: dbUser.id, username }, "Failed Login Attempt", "AUTH", dbUser.id, username, "FAILURE", "Password mismatch");
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Update login status for User model
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        lastLogin: new Date(),
        lastActivity: new Date(),
        isOnline: true,
      },
    });

    // Generate JWT payload with ID, username, and Role name
    const payload = {
      id: dbUser.id,
      username,
      role: dbUser.role?.name || "EMPLOYEE",
      workspaceId: dbUser.workspaces?.[0]?.name || "Publication",
    };
    const token = await signJWT(payload);

    // Create Audit Log
    await createAuditLog(request, { userId: dbUser.id, username }, "Logged In", "AUTH", dbUser.id, username);

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
    });

    return response;
  } catch (error) {
    console.error("POST Login Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during login" }, { status: 500 });
  }
}
