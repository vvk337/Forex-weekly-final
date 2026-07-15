import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";
import { createAuditLog } from "@/lib/audit-helper";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (session) {
      // Mark offline
      if (session.userId !== "admin-legacy") {
        await prisma.user.update({
          where: { id: session.userId },
          data: { isOnline: false },
        });
      }

      await createAuditLog(
        request,
        session,
        "Logged Out",
        "AUTH",
        session.userId,
        session.username
      );
    }

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("admin_token");

    return response;
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json({ error: "Failed to logout session" }, { status: 500 });
  }
}
