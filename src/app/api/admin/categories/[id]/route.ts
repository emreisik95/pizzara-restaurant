import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";

const slugRe = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const schema = z.object({
  slug: z.string().trim().min(1).max(40).regex(slugRe, "lowercase, digits, hyphens"),
  name: z.string().trim().min(1).max(60),
  sort_order: z.coerce.number().int().default(0),
});

async function guard() {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  return null;
}

type Row = { slug: string };

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const v = schema.parse(body);

  const cur = db.prepare("SELECT slug FROM categories WHERE id = ?").get(id) as Row | undefined;
  if (!cur) return NextResponse.json({ error: "not-found" }, { status: 404 });

  if (cur.slug === "tumu" && v.slug !== "tumu") {
    return NextResponse.json({ error: "tumu-slug-locked" }, { status: 400 });
  }

  if (v.slug !== cur.slug) {
    const clash = db.prepare("SELECT id FROM categories WHERE slug = ? AND id != ?").get(v.slug, id);
    if (clash) return NextResponse.json({ error: "slug-exists" }, { status: 409 });
    const tx = db.transaction(() => {
      db.prepare("UPDATE categories SET slug=?, name=?, sort_order=? WHERE id=?")
        .run(v.slug, v.name, v.sort_order, id);
      db.prepare("UPDATE menu_items SET category_slug=? WHERE category_slug=?")
        .run(v.slug, cur.slug);
    });
    tx();
  } else {
    db.prepare("UPDATE categories SET name=?, sort_order=? WHERE id=?")
      .run(v.name, v.sort_order, id);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const cur = db.prepare("SELECT slug FROM categories WHERE id = ?").get(id) as Row | undefined;
  if (!cur) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (cur.slug === "tumu") {
    return NextResponse.json({ error: "tumu-locked" }, { status: 400 });
  }
  const used = db
    .prepare("SELECT COUNT(*) as n FROM menu_items WHERE category_slug = ?")
    .get(cur.slug) as { n: number };
  if (used.n > 0) {
    return NextResponse.json({ error: "in-use", count: used.n }, { status: 409 });
  }
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
