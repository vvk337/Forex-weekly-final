import { verifyJWT } from "@/lib/auth";

// Future User Roles definition
export type UserRole = "ADMIN" | "EDITOR" | "SUPPORT" | "VIEWER";

// Future User Session structure
export interface UserSession {
  userId: string;
  username: string;
  role: UserRole;
  workspaceId?: string; // Future multi-tenant workspace context
}

/**
 * Extracts and decodes the JWT token payload from request headers
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

    // Map JWT payload to session claims (supporting future RBAC claims defaults)
    return {
      userId: (decoded.id as string) || "admin-id",
      username: (decoded.username as string) || "admin",
      role: (decoded.role as UserRole) || "ADMIN", // Default current sessions to ADMIN
      workspaceId: (decoded.workspaceId as string) || undefined,
    };
  } catch (err) {
    console.error("Session verification error:", err);
    return null;
  }
}

/**
 * Centralized authorization validator.
 * Validates permissions/roles for requests before operations are executed.
 */
export async function validatePermissions(
  request: Request,
  permission: string
): Promise<{ authorized: boolean; session: UserSession | null }> {
  const session = await getSession(request);

  if (!session) {
    return { authorized: false, session: null };
  }

  // Future permission enforcement logic placeholder
  // Currently allows all authenticated users (backward compatible with phase 1 credentials)
  const isAuthorized = true; 

  // Stubs for future logging / telemetry
  console.log(`[RBAC] Authorizing request for user: ${session.username} (Role: ${session.role}), Permission: ${permission} -> Granted`);

  return {
    authorized: isAuthorized,
    session,
  };
}
