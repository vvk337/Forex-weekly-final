import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.userId === "admin-legacy") {
      return NextResponse.json({
        id: "admin-legacy",
        fullName: "Legacy Admin",
        username: session.username,
        email: "admin@forexweekly.com",
        role: "OWNER",
        status: "ACTIVE",
        departments: ["Editorial"],
        workspaces: ["Publication"],
        phone: "",
        dob: "",
        profilePhoto: "/images/default-avatar.png",
        activeSince: new Date().toISOString(),
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        role: true,
        departments: true,
        workspaces: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Session user not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      role: user.role?.name || "EMPLOYEE",
      departments: user.departments.map((d) => d.name),
      workspaces: user.workspaces.map((w) => w.name),
      permissions: [], // Deprecated
    }, { status: 200 });
  } catch (error) {
    console.error("GET Users Me Error:", error);
    return NextResponse.json({ error: "Failed to fetch session profile" }, { status: 500 });
  }
}
