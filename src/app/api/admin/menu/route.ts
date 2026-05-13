import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(1000).default(""),
  price: z.coerce.number().int().min(0).max(100000),
  category_slug: z.string().trim().min(1).max(40),
  image: z.string().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const v = schema.parse(body);
  const r = db
    .prepare(
      "INSERT INTO menu_items(name, description, price, category_slug, image, sort_order, is_active) VALUES(?,?,?,?,?,?,?)"
    )
    .run(v.name, v.description, v.price, v.category_slug, v.image ?? null, v.sort_order, v.is_active ? 1 : 0);
  return NextResponse.json({ id: r.lastInsertRowid });
}
