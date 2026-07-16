import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";
import { createNotification } from "@/lib/notification-helper";

// GET system announcements
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const announcements = await prisma.systemAnnouncement.findMany({
      where: {
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: now } },
        ],
      },
      orderBy: [
        { isPinned: "desc" },
        { createdDate: "desc" },
      ],
    });

    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error("GET Announcements Error:", error);
    return NextResponse.json({ error: "Failed to retrieve announcements" }, { status: 500 });
  }
}

// POST publish announcement (Restricted to OWNER, ADMIN, SUPERVISOR)
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
      return NextResponse.json({ error: "Only Owners, Admins, and Supervisors can publish Announcements" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, expiryDate, isPinned } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Announcement title cannot be empty" }, { status: 400 });
    }

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Announcement message cannot be empty" }, { status: 400 });
    }

    const newAnnouncement = await prisma.systemAnnouncement.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        createdBy: session.username,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isPinned: !!isPinned,
      },
    });

    // Notify all active users via existing Notification System
    await createNotification({
      title: "New System Announcement",
      description: `[Pinned: ${isPinned ? "YES" : "NO"}] ${title}: ${message.slice(0, 60)}${message.length > 60 ? "..." : ""}`,
      module: "ANNOUNCEMENT",
      objectId: newAnnouncement.id,
      // Target everyone
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("POST Publish Announcement Error:", error);
    return NextResponse.json({ error: "Failed to publish announcement" }, { status: 500 });
  }
}
