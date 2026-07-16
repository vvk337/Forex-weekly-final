import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

// GET groups the logged-in user belongs to
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.chatConversation.findMany({
      where: { type: "GROUP" },
      orderBy: { createdDate: "desc" },
    });

    const filtered = conversations.filter((c) => {
      try {
        const members = JSON.parse(c.memberUsernames || "[]");
        const deleted = JSON.parse(c.deletedByUsernames || "[]");
        return members.includes(session.username) && !deleted.includes(session.username);
      } catch {
        return false;
      }
    });

    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    console.error("GET Groups Error:", error);
    return NextResponse.json({ error: "Failed to load groups list" }, { status: 500 });
  }
}

// POST create new Group Chat (Restricted to OWNER, ADMIN, SUPERVISOR)
export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role restriction check
    const userRole = session.role;
    const isAuthorized = userRole === "OWNER" || userRole === "ADMIN" || userRole === "SUPERVISOR";
    if (!isAuthorized) {
      return NextResponse.json({ error: "Only Owners, Admins, and Supervisors can create Groups" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, members } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Group name cannot be empty" }, { status: 400 });
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "Group must have at least one member" }, { status: 400 });
    }

    // Ensure creator is always in the member list
    const memberSet = new Set(members);
    memberSet.add(session.username);
    const finalMembers = Array.from(memberSet);

    const newGroup = await prisma.chatConversation.create({
      data: {
        type: "GROUP",
        name: name.trim(),
        description: description ? description.trim() : "",
        createdBy: session.username,
        memberUsernames: JSON.stringify(finalMembers),
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("POST Create Group Error:", error);
    return NextResponse.json({ error: "Failed to create group chat" }, { status: 500 });
  }
}
