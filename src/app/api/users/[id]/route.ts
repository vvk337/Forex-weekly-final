import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single user details
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { authorized } = await validatePermissions(request, "users:manage");
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format serialized JSON strings back to Arrays
    const formatted = {
      ...user,
      departments: JSON.parse(user.departments),
      workspaces: JSON.parse(user.workspaces),
      permissions: JSON.parse(user.permissions),
    };

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET User Details Error:", error);
    return NextResponse.json({ error: "Failed to fetch user metadata" }, { status: 500 });
  }
}

// PUT update user profile/credentials/archives
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      fullName,
      email,
      role,
      status,
      departments,
      workspaces,
      phone,
      dob,
      password,
      forcePasswordChange,
      tempPassword,
      isArchived,
      profilePhoto,
    } = body;

    // Check if the user is self-updating their profile or if it's an admin managing accounts
    const { authorized, session } = await validatePermissions(request, "users:manage");
    const isSelfUpdate = session?.userId === id;

    if (!authorized && !isSelfUpdate) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Basic details (always editable)
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
    if (authorized) {
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;
      if (departments !== undefined) updateData.departments = JSON.stringify(departments);
      if (workspaces !== undefined) updateData.workspaces = JSON.stringify(workspaces);
      if (forcePasswordChange !== undefined) updateData.forcePasswordChange = !!forcePasswordChange;
      if (tempPassword !== undefined) updateData.tempPassword = tempPassword;

      if (isArchived !== undefined) {
        updateData.isArchived = isArchived;
        // If archived, set status to INACTIVE, otherwise restore to ACTIVE
        if (isArchived) {
          updateData.status = "INACTIVE";
          updateData.isOnline = false;
        } else {
          updateData.status = "ACTIVE";
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isArchived: updatedUser.isArchived,
      },
    });
  } catch (error) {
    console.error("PUT Update User Error:", error);
    return NextResponse.json({ error: "Failed to update user account details" }, { status: 500 });
  }
}
