import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single user details (relational mapping)
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { authorized, session } = await validatePermissions(request, "users:view");
    if (!authorized || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        departments: true,
        workspaces: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mask OWNER from non-owners
    const isOwner = session.role === "OWNER";
    if (user.role?.name === "OWNER" && !isOwner) {
      return NextResponse.json({ error: "Unauthorized Access" }, { status: 403 });
    }

    const formatted = {
      ...user,
      role: user.role?.name || "EMPLOYEE",
      departments: user.departments.map((d) => d.name),
      workspaces: user.workspaces.map((w) => w.name),
      permissions: [], // Deprecated
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET User Details Error:", error);
    return NextResponse.json({ error: "Failed to fetch user metadata" }, { status: 500 });
  }
}

// PUT update user profile/credentials/archives with Supervisor & Owner boundary checks
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      fullName,
      email,
      role, // OWNER, ADMIN, SUPERVISOR, EMPLOYEE
      status,
      departments, // String Array e.g. ["Publication"]
      workspaces,  // String Array e.g. ["Publication"]
      phone,
      dob,
      password,
      forcePasswordChange,
      tempPassword,
      isArchived,
      profilePhoto,
    } = body;

    const { authorized, session } = await validatePermissions(request, "users:manage");
    const isSelfUpdate = session?.userId === id;

    // Check boundary auth rules
    if (!authorized && !isSelfUpdate) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true, departments: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isTargetOwner = existingUser.role?.name === "OWNER";
    const isTargetAdmin = existingUser.role?.name === "ADMIN";

    // 1. OWNER Safeguards (cannot be archived or deleted, cannot be modified by non-owners)
    if (isTargetOwner) {
      if (session?.role !== "OWNER") {
        return NextResponse.json({ error: "Only Owners can modify Owner accounts" }, { status: 403 });
      }
      if (isArchived === true) {
        return NextResponse.json({ error: "Owner accounts cannot be archived" }, { status: 400 });
      }
    }

    // 2. SUPERVISOR Boundary Safeguards
    if (session?.role === "SUPERVISOR" && !isSelfUpdate) {
      // Cannot manage Owner or Admin
      if (isTargetOwner || isTargetAdmin) {
        return NextResponse.json({ error: "Supervisors cannot manage Admins or Owner" }, { status: 403 });
      }

      // Check if target user belongs to a department supervised by this supervisor
      const activeUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { supervisedDepartments: true },
      });

      const supervisedDeptIds = activeUser?.supervisedDepartments.map((d) => d.id) || [];
      const targetUserDeptIds = existingUser.departments.map((d) => d.id);
      
      const hasDeptIntersection = targetUserDeptIds.some((id) => supervisedDeptIds.includes(id));
      if (!hasDeptIntersection) {
        return NextResponse.json({ error: "Supervisors can only manage users within their department" }, { status: 403 });
      }
    }

    const updateData: any = {};

    // Basic metadata (always updateable)
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (dob !== undefined) updateData.dob = dob;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    // Email check (must be unique if changed)
    if (email !== undefined && email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({ where: { email } });
      if (emailConflict) {
        return NextResponse.json({ error: "Email is already taken by another account" }, { status: 400 });
      }
      updateData.email = email;
    }

    // Password Update & Resets
    if (password !== undefined && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
      updateData.tempPassword = "";
      updateData.forcePasswordChange = false;
    }

    // Role / Workspace / Departments settings (restricted to administrative actions, cannot self-assign roles)
    const isAdminOrOwner = session?.role === "ADMIN" || session?.role === "OWNER" || session?.role === "SUPERVISOR";
    if (isAdminOrOwner && !isSelfUpdate) {
      if (status !== undefined) updateData.status = status;
      if (forcePasswordChange !== undefined) updateData.forcePasswordChange = !!forcePasswordChange;
      if (tempPassword !== undefined) updateData.tempPassword = tempPassword;

      if (role !== undefined) {
        // Prevent assigning OWNER unless requester is OWNER
        if (role === "OWNER" && session?.role !== "OWNER") {
          return NextResponse.json({ error: "Only Owners can assign OWNER role" }, { status: 403 });
        }
        
        const targetRoleObj = await prisma.role.findUnique({ where: { name: role } });
        if (targetRoleObj) {
          updateData.roleId = targetRoleObj.id;
        }
      }

      if (isArchived !== undefined) {
        updateData.isArchived = isArchived;
        if (isArchived) {
          updateData.status = "INACTIVE";
          updateData.isOnline = false;
        } else {
          updateData.status = "ACTIVE";
        }
      }

      // Sync Departments
      if (departments !== undefined && Array.isArray(departments)) {
        // Disconnect all previous departments and connect new list
        const deptsConnect = departments.map((d: string) => ({ name: d }));
        updateData.departments = {
          set: [],
          connect: deptsConnect,
        };
      }

      // Sync Workspaces
      if (workspaces !== undefined && Array.isArray(workspaces)) {
        // Disconnect all previous workspaces and connect new list
        const wsConnect = workspaces.map((w: string) => ({ name: w }));
        updateData.workspaces = {
          set: [],
          connect: wsConnect,
        };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role?.name || "EMPLOYEE",
        isArchived: updatedUser.isArchived,
      },
    });
  } catch (error) {
    console.error("PUT Update User Error:", error);
    return NextResponse.json({ error: "Failed to update user account details" }, { status: 500 });
  }
}
