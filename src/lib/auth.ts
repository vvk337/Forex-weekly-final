import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "forex-weekly-super-secure-secret-key-2026-xyz"
);

/**
 * Signs a payload to generate an admin JWT.
 */
export async function signJWT(payload: { username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6h") // 6 hours validity
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token. Returns payload or null if invalid.
 */
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { username: string };
  } catch {
    return null;
  }
}
