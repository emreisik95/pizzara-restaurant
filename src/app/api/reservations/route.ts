import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  date: z.string().trim().min(5).max(40),
  guests: z.coerce.number().int().min(1).max(20),
  note: z.string().trim().max(500).optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Lütfen tüm alanları doğru doldurun." },
      { status: 400 }
    );
  }
  const v = parsed.data;
  db.prepare(
    "INSERT INTO reservations(name, phone, guests, date, note) VALUES(?,?,?,?,?)"
  ).run(v.name, v.phone, v.guests, v.date, v.note);
  return NextResponse.json({ ok: true });
}
