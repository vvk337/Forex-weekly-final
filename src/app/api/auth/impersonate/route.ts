import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { signJWT } from "@/lib/auth";
import { validatePermissions } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const { authorized, session } = await validatePermissions(request, "users:manage");
    
    // Only OWNER is allowed to impersonate other users
    if (!authorized || !session || session.role !== "OWNER") {
      return NextResponse.json({ error: "Only Owners can trigger account impersonation" }, { status: 403 });
    }

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json({ error: "Target User ID is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { role: true, workspaces: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (targetUser.role?.name === "OWNER") {
      return NextResponse.json({ error: "Cannot impersonate other Owners" }, { status: 400 });
    }

    // Sign new JWT representing the target user, adding impersonator identity metadata
    const payload = {
      id: targetUser.id,
      username: targetUser.username,
      role: targetUser.role?.name || "EMPLOYEE",
      workspaceId: targetUser.workspaces?.[0]?.name || "Publication",
      impersonatedBy: session.userId,
    };

    const token = await signJWT(payload);

    const response = NextResponse.json({
      success: true,
      message: `Impersonating user @${targetUser.username}`,
      targetUser: {
        id: targetUser.id,
        fullName: targetUser.fullName,
        role: targetUser.role?.name || "EMPLOYEE",
      },
    }, { status: 200 });

    // Set token cookie
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    console.log(`[RBAC] OWNER ${session.username} is impersonating @${targetUser.username}`);

    return response;
  } catch (error) {
    console.error("Impersonation API Error:", error);
    return NextResponse.json({ error: "Failed to impersonate user" }, { status: 500 });
  }
}
