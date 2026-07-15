import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validatePermissions, getSession } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const objectId = searchParams.get("objectId");
    const userFilter = searchParams.get("user");
    const moduleFilter = searchParams.get("module");
    const actionFilter = searchParams.get("action");
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");

    // Gated Access logic
    if (!objectId) {
      // Global audit logs: Owner and Admin roles only
      const isOwnerOrAdmin = session.role === "OWNER" || session.role === "ADMIN";
      if (!isOwnerOrAdmin) {
        return NextResponse.json({ error: "Forbidden: Global logs are restricted to Owner/Admin roles" }, { status: 403 });
      }
    } else {
      // Object-specific logs: enforce relevant RBAC permissions
      const isOwnerOrAdmin = session.role === "OWNER" || session.role === "ADMIN";
      
      if (!isOwnerOrAdmin) {
        // Check if employee is querying their own history
        const isSelfUserQuery = session.userId === objectId;
        if (!isSelfUserQuery) {
          // Check if article timeline query
          const articleCheck = await prisma.article.findUnique({ where: { id: objectId } });
          if (articleCheck) {
            const { authorized } = await validatePermissions(request, "articles:view");
            if (!authorized) {
              return NextResponse.json({ error: "Forbidden: You do not have permission to view article timelines" }, { status: 403 });
            }
          } else {
            // Check if supervisor querying department user history
            const userCheck = await prisma.user.findUnique({
              where: { id: objectId },
              include: { departments: true }
            });
            if (userCheck && session.role === "SUPERVISOR") {
              const dbSupervisor = await prisma.user.findUnique({
                where: { id: session.userId },
                include: { supervisedDepartments: true }
              });
              const supervisedDeptIds = dbSupervisor?.supervisedDepartments.map(d => d.id) || [];
              const targetDeptIds = userCheck.departments.map(d => d.id);
              const intersection = targetDeptIds.some(id => supervisedDeptIds.includes(id));
              if (!intersection) {
                return NextResponse.json({ error: "Forbidden: You can only view activity of department users" }, { status: 403 });
              }
            } else {
              return NextResponse.json({ error: "Forbidden: Unauthorized access to activity log" }, { status: 403 });
            }
          }
        }
      }
    }

    // Build filters
    const where: any = {};
    if (objectId) {
      where.objectId = objectId;
    }
    if (userFilter) {
      where.username = { contains: userFilter };
    }
    if (moduleFilter) {
      where.module = moduleFilter;
    }
    if (actionFilter) {
      where.action = actionFilter;
    }
    if (dateStart || dateEnd) {
      where.timestamp = {};
      if (dateStart) where.timestamp.gte = new Date(dateStart);
      if (dateEnd) where.timestamp.lte = new Date(dateEnd);
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("GET Audit Logs Error:", error);
    return NextResponse.json({ error: "Failed to fetch audit activity logs" }, { status: 500 });
  }
}
