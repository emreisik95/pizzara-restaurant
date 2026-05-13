import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth";

const schema = z.object({ status: z.enum(["pending", "confirmed", "cancelled"]) });

async function guard() {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  return null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const v = schema.parse(body);
  db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(v.status, id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  db.prepare("DELETE FROM reservations WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
