const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("[RESET] Starting production system reset...");

  try {
    // 1. Reset all Department supervisor assignments to prevent relation conflicts
    await prisma.department.updateMany({
      data: {
        supervisorId: null,
        actingSupervisorId: null,
        actingStart: null,
        actingEnd: null,
        actingReason: null,
        actingAssignedBy: null,
      },
    });
    console.log("[RESET] Department supervisors cleared.");

    // 2. Delete all notifications, chat logs, and audits to ensure clean state
    await prisma.notification.deleteMany({});
    await prisma.chatMessage.deleteMany({});
    await prisma.chatConversation.deleteMany({});
    await prisma.auditLog.deleteMany({});
    console.log("[RESET] System logs, notifications, and chats cleared.");

    // 3. Keep exactly two accounts: OWNER and ADMIN. Delete all other users.
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        NOT: {
          username: {
            in: ["admin", "administrator"],
          },
        },
      },
    });
    console.log(`[RESET] Cleaned up ${deletedUsers.count} non-system users.`);

    // 4. Ensure roles, depts, and default workspaces are seeded
    const defaultRoles = ["OWNER", "ADMIN", "SUPERVISOR", "EMPLOYEE"];
    const rolesMap = {};
    for (const rName of defaultRoles) {
      let r = await prisma.role.findUnique({ where: { name: rName } });
      if (!r) {
        r = await prisma.role.create({ data: { name: rName } });
      }
      rolesMap[rName] = r.id;
    }

    const defaultDepts = ["Publication", "Marketing", "Research", "Support"];
    const deptsMap = {};
    for (const dName of defaultDepts) {
      let d = await prisma.department.findUnique({ where: { name: dName } });
      if (!d) {
        d = await prisma.department.create({ data: { name: dName } });
      }
      deptsMap[dName] = d.id;
    }

    const defaultWorkspaces = ["Publication", "Marketing", "Research"];
    const wsMap = {};
    for (const wsName of defaultWorkspaces) {
      let w = await prisma.workspace.findUnique({ where: { name: wsName } });
      if (!w) {
        w = await prisma.workspace.create({ data: { name: wsName } });
      }
      wsMap[wsName] = w.id;
    }

    // 5. Ensure System Owner user exists
    const hashedPassword = await bcrypt.hash("admin123", 10);
    let ownerUser = await prisma.user.findUnique({ where: { username: "admin" } });
    if (!ownerUser) {
      ownerUser = await prisma.user.create({
        data: {
          fullName: "System Owner",
          username: "admin",
          email: "owner@forexweekly.com",
          password: hashedPassword,
          roleId: rolesMap["OWNER"],
          status: "ACTIVE",
          phone: "",
          dob: "",
          departments: {
            connect: { id: deptsMap["Publication"] },
          },
          workspaces: {
            connect: { id: wsMap["Publication"] },
          },
        },
      });
      console.log("[RESET] Seeded default OWNER account (admin).");
    } else {
      await prisma.user.update({
        where: { id: ownerUser.id },
        data: { roleId: rolesMap["OWNER"] },
      });
      console.log("[RESET] Aligned OWNER account role mapping.");
    }

    // Assign Owner as Supervisor of Publication Department
    await prisma.department.update({
      where: { id: deptsMap["Publication"] },
      data: { supervisorId: ownerUser.id },
    });

    // 6. Ensure System Admin user exists
    let adminUser = await prisma.user.findUnique({ where: { username: "administrator" } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          fullName: "System Admin",
          username: "administrator",
          email: "admin@forexweekly.com",
          password: hashedPassword,
          roleId: rolesMap["ADMIN"],
          status: "ACTIVE",
          phone: "",
          dob: "",
          departments: {
            connect: { id: deptsMap["Publication"] },
          },
          workspaces: {
            connect: { id: wsMap["Publication"] },
          },
        },
      });
      console.log("[RESET] Seeded default ADMIN account (administrator).");
    } else {
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { roleId: rolesMap["ADMIN"] },
      });
      console.log("[RESET] Aligned ADMIN account role mapping.");
    }

    // Initialize notification settings for the system accounts if missing
    for (const uId of [ownerUser.id, adminUser.id]) {
      const setting = await prisma.notificationSetting.findUnique({ where: { userId: uId } });
      if (!setting) {
        await prisma.notificationSetting.create({
          data: { userId: uId },
        });
      }
    }

    // 7. Verify the final users directory state
    const remainingUsers = await prisma.user.findMany({
      include: { role: true },
    });
    console.log("\n--- Verification Report ---");
    console.log(`Total Users in DB: ${remainingUsers.length}`);
    remainingUsers.forEach((u) => {
      console.log(`- Username: @${u.username} | Name: ${u.fullName} | Role: ${u.role.name}`);
    });
    console.log("---------------------------\n");
    console.log("[RESET] System reset completed successfully!");
  } catch (error) {
    console.error("[RESET] Error executing system reset:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
