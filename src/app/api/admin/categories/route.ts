import { NextResponse } from "next/server";
import { z } from "zod";
import { db, listCategories } from "@/lib/db";
import { readSession } from "@/lib/auth";

const slugRe = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const schema = z.object({
  slug: z.string().trim().min(1).max(40).regex(slugRe, "lowercase, digits, hyphens"),
  name: z.string().trim().min(1).max(60),
  sort_order: z.coerce.number().int().default(0),
});

export async function GET() {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  return NextResponse.json(listCategories());
}

export async function POST(req: Request) {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const v = schema.parse(body);
  const existing = db.prepare("SELECT id FROM categories WHERE slug = ?").get(v.slug);
  if (existing) return NextResponse.json({ error: "slug-exists" }, { status: 409 });
  const r = db
    .prepare("INSERT INTO categories(slug, name, sort_order) VALUES(?,?,?)")
    .run(v.slug, v.name, v.sort_order);
  return NextResponse.json({ id: r.lastInsertRowid });
}
