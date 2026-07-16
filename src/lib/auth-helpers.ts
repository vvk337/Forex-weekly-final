import prisma from "./db";
import { verifyJWT } from "@/lib/auth";

export type UserRole = "OWNER" | "ADMIN" | "SUPERVISOR" | "EMPLOYEE";

export interface UserSession {
  userId: string;
  username: string;
  role: UserRole;
  workspaceId?: string; // Current selected/active workspace context
  impersonatedBy?: string; // Holds Owner's ID if impersonating
}

/**
 * Decodes the JWT token from request cookies to retrieve session details
 */
export async function getSession(request: Request): Promise<UserSession | null> {
  const token = request.headers.get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("admin_token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = await verifyJWT(token) as any;
    if (!decoded) return null;

    return {
      userId: decoded.id || "admin-legacy",
      username: decoded.username || "admin",
      role: (decoded.role as UserRole) || "EMPLOYEE",
      workspaceId: decoded.workspaceId || undefined,
      impersonatedBy: decoded.impersonatedBy || undefined,
    };
  } catch (err) {
    console.error("Session verification error:", err);
    return null;
  }
}

/**
 * Validates role-based permission access for API calls, incorporating Acting Supervisor expiry checks.
 */
export async function validatePermissions(
  request: Request,
  permission: string
): Promise<{ authorized: boolean; session: UserSession | null }> {
  const session = await getSession(request);
  if (!session) {
    return { authorized: false, session: null };
  }

  // Legacy fallback override (if old admin table record has logged in)
  if (session.userId === "admin-legacy") {
    console.log(`[RBAC] Authorizing legacy administrator -> Granted`);
    return { authorized: true, session };
  }

  // Load user from database including roles and relationships
  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      role: true,
      departments: true,
      workspaces: true,
    },
  });

  if (!dbUser || dbUser.isArchived) {
    return { authorized: false, session: null };
  }

  const roleName = dbUser.role?.name || "EMPLOYEE";
  let activeRole = roleName;

  // Check if user is currently serving as an active Acting Supervisor
  const now = new Date();
  const activeActingAssignments = await prisma.department.findFirst({
    where: {
      actingSupervisorId: dbUser.id,
      actingStart: { lte: now },
      actingEnd: { gte: now },
    },
  });

  if (activeActingAssignments) {
    // Escalate active role context to SUPERVISOR temporarily
    if (activeRole === "EMPLOYEE") {
      activeRole = "SUPERVISOR";
      console.log(`[RBAC] User ${dbUser.username} escalated to SUPERVISOR role via acting assignment on dept ${activeActingAssignments.name}`);
    }
  }

  // Role permissions gate
  let isAuthorized = false;

  if (activeRole === "OWNER") {
    // Owner bypasses all security checks
    isAuthorized = true;
  } else if (activeRole === "ADMIN") {
    // Admin permissions
    const adminPermissions = [
      "users:manage",
      "users:view",
      "users:manage:dept",
      "workspaces:view",
      "articles:view",
      "articles:create",
      "articles:edit:own",
      "articles:submit",
      "articles:approve",
      "articles:edit:published",
      "articles:publish",
      "articles:delete",
      "breaking-news:create",
      "breaking-news:manage",
      "sponsors:manage:workspace",
      "sponsors:view",
      "sponsors:manage",
      "inbox:view",
      "reports:view",
      "dashboard:view",
      "profile:edit",
      "messaging:use",
    ];
    isAuthorized = adminPermissions.includes(permission);
  } else if (activeRole === "SUPERVISOR") {
    // Supervisor permissions
    const supervisorPermissions = [
      "users:view",
      "users:manage:dept",
      "articles:view",
      "articles:approve",
      "articles:edit:published",
      "articles:publish",
      "articles:delete",
      "breaking-news:manage",
      "sponsors:manage:workspace",
      "sponsors:view",
    ];
    isAuthorized = supervisorPermissions.includes(permission);
  } else if (activeRole === "EMPLOYEE") {
    // Employee permissions
    const employeePermissions = [
      "dashboard:view",
      "profile:edit",
      "articles:create",
      "articles:edit:own",
      "articles:submit",
      "breaking-news:create",
      "messaging:use",
    ];
    isAuthorized = employeePermissions.includes(permission);
  }

  console.log(
    `[RBAC] Authorizing request for user: ${dbUser.username} (Role: ${roleName}, Active: ${activeRole}), Permission: ${permission} -> ${
      isAuthorized ? "Granted" : "Denied"
    }`
  );

  return {
    authorized: isAuthorized,
    session: {
      ...session,
      role: roleName as UserRole, // Return user's database role
    },
  };
}
