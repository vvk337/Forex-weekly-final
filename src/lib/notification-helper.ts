import prisma from "./db";

interface NotificationOptions {
  title: string;
  description: string;
  module: "ARTICLE" | "BREAKING_NEWS" | "ANNOUNCEMENT" | "SYSTEM";
  objectId?: string;
  roleScope?: string[];      // Array of role names that should receive this (e.g. ["SUPERVISOR"])
  departmentScope?: string;  // Target department name (e.g. "Publications")
  excludeUser?: string;      // Username of the actor to exclude
  targetUsername?: string;   // Optional direct recipient username
}

export async function createNotification({
  title,
  description,
  module,
  objectId,
  roleScope,
  departmentScope,
  excludeUser,
  targetUsername,
}: NotificationOptions) {
  try {
    // 1. If direct recipient username is specified
    if (targetUsername) {
      const u = await prisma.user.findUnique({
        where: { username: targetUsername },
        include: { notificationSetting: true },
      });
      if (u && !u.isArchived) {
        const settings = u.notificationSetting;
        if (settings) {
          if (module === "ARTICLE" && !settings.articlesEnabled) return;
          if (module === "BREAKING_NEWS" && !settings.breakingNewsEnabled) return;
          if (module === "ANNOUNCEMENT" && !settings.announcementsEnabled) return;
          if (module === "SYSTEM" && !settings.systemEnabled) return;
        }
        await prisma.notification.create({
          data: {
            title,
            description,
            module,
            objectId,
            status: "UNREAD",
            username: targetUsername,
          },
        });
      }
      return;
    }

    // 2. Fetch all active users
    const activeUsers = await prisma.user.findMany({
      where: { isArchived: false },
      include: {
        role: true,
        departments: true,
        notificationSetting: true,
      },
    });

    const notificationsToCreate = [];

    for (const u of activeUsers) {
      if (excludeUser && u.username === excludeUser) continue;

      // Check user preferences
      const settings = u.notificationSetting;
      if (settings) {
        if (module === "ARTICLE" && !settings.articlesEnabled) continue;
        if (module === "BREAKING_NEWS" && !settings.breakingNewsEnabled) continue;
        if (module === "ANNOUNCEMENT" && !settings.announcementsEnabled) continue;
        if (module === "SYSTEM" && !settings.systemEnabled) continue;
      }

      // Check role assignment / Owner bypass (Owner gets everything!)
      const userRole = u.role?.name || "EMPLOYEE";
      if (userRole === "OWNER") {
        // Owner gets everything
      } else {
        // Check role scopes
        if (roleScope && !roleScope.includes(userRole)) continue;

        // Check department context (e.g. supervisor of this department)
        if (departmentScope) {
          const userDepts = u.departments.map((d) => d.name);
          if (!userDepts.includes(departmentScope)) continue;
        }
      }

      notificationsToCreate.push({
        title,
        description,
        module,
        objectId,
        status: "UNREAD",
        username: u.username,
      });
    }

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({
        data: notificationsToCreate,
      });
    }
  } catch (err) {
    console.error("Failed to create notifications:", err);
  }
}

export async function autoArchiveOldNotifications() {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Archive unread and read notifications older than 90 days
    await prisma.notification.updateMany({
      where: {
        timestamp: { lte: ninetyDaysAgo },
        status: { not: "ARCHIVED" },
      },
      data: { status: "ARCHIVED" },
    });
  } catch (err) {
    console.error("Failed to auto archive old notifications:", err);
  }
}

/**
 * Direct Message notification hook (Prepared only, for future direct messaging integration)
 */
export async function prepareDirectMessageNotification(senderUsername: string, recipientUsername: string, messagePreview: string) {
  // Dispatched as direct message alert to the target recipient user
  await createNotification({
    title: `New Message from @${senderUsername}`,
    description: messagePreview.length > 50 ? `${messagePreview.slice(0, 47)}...` : messagePreview,
    module: "SYSTEM", // classified under system alerts until messaging module is ready
    targetUsername: recipientUsername,
  });
}
