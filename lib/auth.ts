import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "tchokos_secret";
const key = new TextEncoder().encode(JWT_SECRET);

export interface AdminPayload {
  id: string;
  email: string;
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as AdminPayload;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    return null;
  }
}

/**
 * Get the current admin from the request cookie (server-side)
 */
export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

