import prisma from "./db";
import { getSession } from "./auth-helpers";

export async function createAuditLog(
  request: Request | null,
  sessionUser: { userId: string; username: string } | null,
  action: string,
  module: "ARTICLE" | "USER" | "SPONSOR" | "BREAKING_NEWS" | "AUTH" | "SYSTEM",
  objectId: string | null,
  objectName: string | null,
  result: "SUCCESS" | "FAILURE" = "SUCCESS",
  details: string | null = null
) {
  try {
    let username = sessionUser?.username || "SYSTEM";
    let ipAddress = null;

    if (request) {
      if (!sessionUser) {
        const session = await getSession(request);
        if (session) {
          username = session.username;
        }
      }
      ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    }

    await prisma.auditLog.create({
      data: {
        username,
        action,
        module,
        objectId,
        objectName,
        result,
        ipAddress,
        details,
      },
    });
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
}
