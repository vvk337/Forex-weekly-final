import prisma from "./db";
import bcrypt from "bcryptjs";

export async function ensureDbSeeded() {
  try {
    // 1. Seed Roles
    const defaultRoles = ["OWNER", "ADMIN", "SUPERVISOR", "EMPLOYEE"];
    const rolesMap: { [key: string]: string } = {};

    for (const roleName of defaultRoles) {
      let r = await prisma.role.findUnique({ where: { name: roleName } });
      if (!r) {
        r = await prisma.role.create({ data: { name: roleName } });
      }
      rolesMap[roleName] = r.id;
    }

    // 2. Seed Departments
    const defaultDepts = ["Publication", "Marketing", "Research", "Support"];
    const deptsMap: { [key: string]: string } = {};
    for (const deptName of defaultDepts) {
      let d = await prisma.department.findUnique({ where: { name: deptName } });
      if (!d) {
        d = await prisma.department.create({ data: { name: deptName } });
      }
      deptsMap[deptName] = d.id;
    }

    // 3. Seed Workspaces
    const defaultWorkspaces = ["Publication", "Marketing", "Research"];
    const wsMap: { [key: string]: string } = {};
    for (const wsName of defaultWorkspaces) {
      let w = await prisma.workspace.findUnique({ where: { name: wsName } });
      if (!w) {
        w = await prisma.workspace.create({ data: { name: wsName } });
      }
      wsMap[wsName] = w.id;
    }

    // 4. Check User Seeding
    const ownerRole = rolesMap["OWNER"];
    const adminRole = rolesMap["ADMIN"];
    const hashedPassword = await bcrypt.hash("admin123", 10);

    let ownerUser = await prisma.user.findUnique({
      where: { username: "admin" }
    });

    if (!ownerUser) {
      ownerUser = await prisma.user.create({
        data: {
          fullName: "System Owner",
          username: "admin",
          email: "owner@forexweekly.com",
          password: hashedPassword,
          roleId: ownerRole,
          status: "ACTIVE",
          phone: "",
          dob: "",
          createdBy: "System",
          departments: {
            connect: { id: deptsMap["Publication"] },
          },
          workspaces: {
            connect: { id: wsMap["Publication"] },
          },
        },
      });

      // Assign as Supervisor of Publication Department
      await prisma.department.update({
        where: { id: deptsMap["Publication"] },
        data: { supervisorId: ownerUser.id },
      });

      console.log("[DB SEED] Default OWNER user seeded successfully.");
    }

    let adminUser = await prisma.user.findUnique({
      where: { username: "administrator" }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          fullName: "System Admin",
          username: "administrator",
          email: "admin@forexweekly.com",
          password: hashedPassword,
          roleId: adminRole,
          status: "ACTIVE",
          phone: "",
          dob: "",
          createdBy: "System",
          departments: {
            connect: { id: deptsMap["Publication"] },
          },
          workspaces: {
            connect: { id: wsMap["Publication"] },
          },
        },
      });
      console.log("[DB SEED] Default ADMIN user seeded successfully.");
    }

    // Align any users with missing roleId (Self-healing migration path)
    const orphanUsers = await prisma.user.findMany({
      where: { roleId: null },
    });

    if (orphanUsers.length > 0) {
      const employeeRole = rolesMap["EMPLOYEE"];
      for (const u of orphanUsers) {
        await prisma.user.update({
          where: { id: u.id },
          data: {
            roleId: employeeRole,
            departments: {
              connect: { id: deptsMap["Publication"] },
            },
            workspaces: {
              connect: { id: wsMap["Publication"] },
            },
          },
        });
      }
      console.log(`[DB SEED] Migrated ${orphanUsers.length} legacy orphan users to EMPLOYEE role.`);
    }

    // Initialize notification settings for any users missing them
    const usersWithoutSettings = await prisma.user.findMany({
      where: { notificationSetting: null },
    });
    for (const u of usersWithoutSettings) {
      await prisma.notificationSetting.create({
        data: {
          userId: u.id,
        },
      });
    }
  } catch (error) {
    console.error("[DB SEED] Seeding failed:", error);
  }
}
