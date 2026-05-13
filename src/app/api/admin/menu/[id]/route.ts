import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";

const fullSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(1000).default(""),
  price: z.coerce.number().int().min(0).max(100000),
  category_slug: z.string().trim().min(1).max(40),
  image: z.string().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

const patchSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional(),
    price: z.coerce.number().int().min(0).max(100000).optional(),
    category_slug: z.string().min(1).max(40).optional(),
    image: z.string().nullable().optional(),
    sort_order: z.coerce.number().int().optional(),
    is_active: z.boolean().optional(),
  })
  .strict();

async function guard() {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  return null;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const v = fullSchema.parse(body);
  db.prepare(
    `UPDATE menu_items SET name=?, description=?, price=?, category_slug=?, image=?, sort_order=?, is_active=? WHERE id=?`
  ).run(v.name, v.description, v.price, v.category_slug, v.image ?? null, v.sort_order, v.is_active ? 1 : 0, id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const v = patchSchema.parse(body);
  const fields = Object.keys(v) as (keyof typeof v)[];
  if (fields.length === 0) return NextResponse.json({ ok: true });
  const sets = fields.map((k) => `${k} = ?`).join(", ");
  const values = fields.map((k) => {
    if (k === "is_active") return v.is_active ? 1 : 0;
    return v[k] as string | number | null;
  });
  db.prepare(`UPDATE menu_items SET ${sets} WHERE id = ?`).run(...values, id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  db.prepare("DELETE FROM menu_items WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
