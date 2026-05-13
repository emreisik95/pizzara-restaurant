import { NextResponse } from "next/server";
import { adminPassword, setSessionCookie, signSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || password !== adminPassword()) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  const jwt = await signSession({ sub: "admin" });
  await setSessionCookie(jwt);
  return NextResponse.json({ ok: true });
}
