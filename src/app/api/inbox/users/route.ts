import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

// GET active users for selection list
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    const users = await prisma.user.findMany({
      where: {
        isArchived: false,
        OR: [
          { fullName: { contains: query } },
          { username: { contains: query } },
          { email: { contains: query } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        profilePhoto: true,
        role: {
          select: { name: true },
        },
        departments: {
          select: { name: true },
        },
      },
      take: 20,
    });

    // Map departments to flat array
    const mapped = users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      username: u.username,
      profilePhoto: u.profilePhoto,
      role: u.role?.name || "EMPLOYEE",
      departments: u.departments.map((d) => d.name),
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error("GET Inbox Users Error:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
