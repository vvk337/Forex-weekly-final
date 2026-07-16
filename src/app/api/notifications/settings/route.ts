import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

// GET user notification preferences
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.notificationSetting.findUnique({
      where: { userId: session.userId },
    });

    // Create settings if they don't exist (self-healing fallback)
    if (!settings && session.userId !== "admin-legacy") {
      settings = await prisma.notificationSetting.create({
        data: { userId: session.userId },
      });
    }

    return NextResponse.json(settings || {
      articlesEnabled: true,
      breakingNewsEnabled: true,
      announcementsEnabled: true,
      systemEnabled: true,
    }, { status: 200 });
  } catch (error) {
    console.error("GET Notification Settings Error:", error);
    return NextResponse.json({ error: "Failed to retrieve notification preferences" }, { status: 500 });
  }
}

// PUT update user notification preferences
export async function PUT(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { articlesEnabled, breakingNewsEnabled, announcementsEnabled, systemEnabled } = body;

    const dataToUpdate: any = {};
    if (articlesEnabled !== undefined) dataToUpdate.articlesEnabled = !!articlesEnabled;
    if (breakingNewsEnabled !== undefined) dataToUpdate.breakingNewsEnabled = !!breakingNewsEnabled;
    if (announcementsEnabled !== undefined) dataToUpdate.announcementsEnabled = !!announcementsEnabled;
    if (systemEnabled !== undefined) dataToUpdate.systemEnabled = !!systemEnabled;

    const updated = await prisma.notificationSetting.upsert({
      where: { userId: session.userId },
      update: dataToUpdate,
      create: {
        userId: session.userId,
        ...dataToUpdate,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Notification Settings Error:", error);
    return NextResponse.json({ error: "Failed to update notification preferences" }, { status: 500 });
  }
}
