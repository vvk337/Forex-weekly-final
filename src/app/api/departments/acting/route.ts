import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const { authorized, session } = await validatePermissions(request, "users:manage");
    if (!authorized || !session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const {
      departmentId,
      actingSupervisorId,
      actingStart,
      actingEnd,
      actingReason,
    } = body;

    if (!departmentId) {
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    // Verify department exists
    const dept = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!dept) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    let updateData: any = {};

    if (actingSupervisorId === null || actingSupervisorId === "") {
      // Clear temporary supervisor assignment
      updateData = {
        actingSupervisorId: null,
        actingStart: null,
        actingEnd: null,
        actingReason: null,
        actingAssignedBy: null,
      };
      console.log(`[RBAC] Acting Supervisor assignment cleared for department ${dept.name} by ${session.username}`);
    } else {
      // Verify acting supervisor user exists
      const user = await prisma.user.findUnique({ where: { id: actingSupervisorId } });
      if (!user) {
        return NextResponse.json({ error: "Acting supervisor user not found" }, { status: 404 });
      }

      if (!actingStart || !actingEnd) {
        return NextResponse.json({ error: "Start and End dates are required for temporary assignment" }, { status: 400 });
      }

      updateData = {
        actingSupervisorId,
        actingStart: new Date(actingStart),
        actingEnd: new Date(actingEnd),
        actingReason: actingReason || "",
        actingAssignedBy: session.username,
      };

      console.log(`[RBAC] Temporary Acting Supervisor assigned to department ${dept.name} (User: ${user.username}) by ${session.username}`);
    }

    await prisma.department.update({
      where: { id: departmentId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: "Acting Supervisor settings updated successfully" });
  } catch (error) {
    console.error("Acting Supervisor API Error:", error);
    return NextResponse.json({ error: "Failed to update acting supervisor settings" }, { status: 500 });
  }
}
