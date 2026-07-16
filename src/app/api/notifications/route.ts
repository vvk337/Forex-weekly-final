import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";
import { autoArchiveOldNotifications } from "@/lib/notification-helper";

// GET notifications for logged-in user
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Auto-archive any logs older than 90 days first
    await autoArchiveOldNotifications();

    const notifications = await prisma.notification.findMany({
      where: {
        username: session.username,
        status: { not: "ARCHIVED" }, // Exclude archived items
      },
      orderBy: { timestamp: "desc" },
    });

    const unreadCount = await prisma.notification.count({
      where: {
        username: session.username,
        status: "UNREAD",
      },
    });

    return NextResponse.json({ notifications, unreadCount }, { status: 200 });
  } catch (error) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
  }
}

// PUT mark notifications as READ
export async function PUT(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, all } = body;

    if (all) {
      // Mark all as read
      await prisma.notification.updateMany({
        where: {
          username: session.username,
          status: "UNREAD",
        },
        data: { status: "READ" },
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read" }, { status: 200 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing notification id parameter" }, { status: 400 });
    }

    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing || existing.username !== session.username) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { status: "READ" },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Notifications Error:", error);
    return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
  }
}
