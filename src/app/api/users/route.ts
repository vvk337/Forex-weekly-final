import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";

// GET List Users
export async function GET(request: Request) {
  try {
    const { authorized } = await validatePermissions(request, "users:manage");
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const department = searchParams.get("department") || "";
    const archived = searchParams.get("archived"); // 'true' or 'false'
    const sort = searchParams.get("sort") || "fullName";
    const order = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const where: any = {};

    // Apply filters
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { username: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (archived === "true") {
      where.isArchived = true;
    } else if (archived === "false") {
      where.isArchived = false;
    } else {
      // Default to non-archived if not specified
      where.isArchived = false;
    }

    if (department) {
      where.departments = { contains: `"${department}"` };
    }

    // Pagination query parameters
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Format serialized fields back to JS Arrays
    const formatted = users.map((u) => ({
      ...u,
      departments: JSON.parse(u.departments),
      workspaces: JSON.parse(u.workspaces),
      permissions: JSON.parse(u.permissions),
    }));

    return NextResponse.json({ users: formatted, total, page, limit }, { status: 200 });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users list" }, { status: 500 });
  }
}

// POST Create User
export async function POST(request: Request) {
  try {
    const { authorized, session } = await validatePermissions(request, "users:manage");
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      username,
      email,
      password,
      role,
      departments,
      workspaces,
      phone,
      dob,
      forcePasswordChange,
    } = body;

    // Validation checks
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "Required fields are missing: fullName, username, email, password" },
        { status: 400 }
      );
    }

    // Check unique constraints
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        password: hashedPassword,
        role: role || "EMPLOYEE",
        status: "ACTIVE",
        profilePhoto: "/images/default-avatar.png",
        departments: Array.isArray(departments) ? JSON.stringify(departments) : "[]",
        workspaces: Array.isArray(workspaces) ? JSON.stringify(workspaces) : "[]",
        permissions: "[]",
        phone: phone || "",
        dob: dob || "",
        isArchived: false,
        createdBy: session?.username || "Admin",
        forcePasswordChange: !!forcePasswordChange,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Create User Error:", error);
    return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
  }
}
