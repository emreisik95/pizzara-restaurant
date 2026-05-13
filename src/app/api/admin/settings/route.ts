import { NextResponse } from "next/server";
import { setSetting } from "@/lib/db";
import { readSession } from "@/lib/auth";

const ALLOWED = new Set([
  "hero_eyebrow",
  "hero_title",
  "hero_subtitle",
  "hero_image",
  "address",
  "phone",
  "instagram",
  "hours",
]);

export async function POST(req: Request) {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (typeof body !== "object" || body === null) return NextResponse.json({ error: "bad" }, { status: 400 });
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (!ALLOWED.has(k)) continue;
    if (typeof v !== "string") continue;
    setSetting(k, v.slice(0, 4000));
  }
  return NextResponse.json({ ok: true });
}
