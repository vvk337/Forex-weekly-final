import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";
import { createAuditLog } from "@/lib/audit-helper";
import { createNotification } from "@/lib/notification-helper";

// GET List Users (relational mapping)
export async function GET(request: Request) {
  try {
    const { authorized, session } = await validatePermissions(request, "users:view");
    if (!authorized || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const roleNameParam = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const departmentName = searchParams.get("department") || "";
    const archived = searchParams.get("archived"); // 'true' or 'false'
    const sort = searchParams.get("sort") || "fullName";
    const order = searchParams.get("order") || "asc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Load active logged-in user to check Owner/Supervisor constraints
    const activeUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true },
    });

    const isOwner = activeUser?.role?.name === "OWNER";

    const where: any = {};

    // Apply search matches on names, usernames, and emails
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { username: { contains: search } },
        { email: { contains: search } },
      ];
    }

    // Role filtering (with Owner account masking)
    if (roleNameParam) {
      // If filtering for OWNER but not OWNER ourselves, return empty list or force EMPLOYEE filter
      if (roleNameParam === "OWNER" && !isOwner) {
        return NextResponse.json({ users: [], total: 0, page, limit }, { status: 200 });
      }
      where.role = { name: roleNameParam };
    } else if (!isOwner) {
      // Hide OWNER profiles from listings for non-owner roles
      where.role = { name: { not: "OWNER" } };
    }

    if (status) {
      where.status = status;
    }

    if (archived === "true") {
      where.isArchived = true;
    } else if (archived === "false") {
      where.isArchived = false;
    } else {
      where.isArchived = false;
    }

    if (departmentName) {
      where.departments = {
        some: { name: departmentName },
      };
    }

    const skip = (page - 1) * limit;

    // Build sorting parameters (Prisma dynamic queries)
    let orderBy: any = {};
    if (sort === "role") {
      orderBy = { role: { name: order } };
    } else {
      orderBy = { [sort]: order };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          role: true,
          departments: true,
          workspaces: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Format relational schemas back to flat format expected by components
    const formatted = users.map((u) => ({
      ...u,
      role: u.role?.name || "EMPLOYEE",
      departments: u.departments.map((d) => d.name),
      workspaces: u.workspaces.map((w) => w.name),
      permissions: [], // Deprecated in favor of DB Roles
    }));

    return NextResponse.json({ users: formatted, total, page, limit }, { status: 200 });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users list" }, { status: 500 });
  }
}

// POST Create User (relational mapping)
export async function POST(request: Request) {
  try {
    const { authorized, session } = await validatePermissions(request, "users:manage");
    if (!authorized || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      username,
      email,
      password,
      role, // OWNER, ADMIN, SUPERVISOR, EMPLOYEE
      departments, // String Array e.g. ["Publication"]
      workspaces,  // String Array e.g. ["Publication"]
      phone,
      dob,
      forcePasswordChange,
    } = body;

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "Required fields are missing: fullName, username, email, password" },
        { status: 400 }
      );
    }

    // Role checks (Admins cannot assign OWNER role)
    if (role === "OWNER" && session.role !== "OWNER") {
      return NextResponse.json({ error: "Only Owners can create Owner accounts" }, { status: 403 });
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

    // Resolve Role model ID
    const targetRole = await prisma.role.findUnique({
      where: { name: role || "EMPLOYEE" },
    });
    if (!targetRole) {
      return NextResponse.json({ error: "Invalid user role specified" }, { status: 400 });
    }

    // Build connections query for departments & workspaces
    const deptsConnect = Array.isArray(departments)
      ? departments.map((d: string) => ({ name: d }))
      : [];
    const wsConnect = Array.isArray(workspaces)
      ? workspaces.map((w: string) => ({ name: w }))
      : [];

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        password: hashedPassword,
        roleId: targetRole.id,
        status: "ACTIVE",
        profilePhoto: "/images/default-avatar.png",
        phone: phone || "",
        dob: dob || "",
        isArchived: false,
        createdBy: session?.username || "Admin",
        forcePasswordChange: !!forcePasswordChange,
        departments: {
          connect: deptsConnect,
        },
        workspaces: {
          connect: wsConnect,
        },
        notificationSetting: {
          create: {},
        },
      },
      include: {
        role: true,
      },
    });

    await createAuditLog(
      request,
      session,
      "User Created",
      "SYSTEM",
      newUser.id,
      newUser.username
    );

    await createNotification({
      title: "User Invitation",
      description: `Welcome to the platform! Your new account @${newUser.username} is active.`,
      module: "SYSTEM",
      objectId: newUser.id,
      targetUsername: newUser.username,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role?.name || "EMPLOYEE",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Create User Error:", error);
    return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
  }
}
