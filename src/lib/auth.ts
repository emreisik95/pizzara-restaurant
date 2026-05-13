import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "pizzara-dev-secret-change-me-please-32+bytes"
);
const COOKIE = "pizzara_admin";

export async function signSession(payload: { sub: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function readSession(): Promise<{ sub: string } | null> {
  const jar = await cookies();
  const tok = jar.get(COOKIE)?.value;
  if (!tok) return null;
  try {
    const { payload } = await jwtVerify(tok, SECRET);
    return { sub: String(payload.sub) };
  } catch {
    return null;
  }
}

export async function setSessionCookie(jwt: string) {
  const jar = await cookies();
  jar.set(COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "pizzara2026";
}
