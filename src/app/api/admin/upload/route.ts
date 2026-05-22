import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { readSession } from "@/lib/auth";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/data/uploads";
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX = 6 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "type" }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "too big" }, { status: 413 });

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);

  return NextResponse.json({ url: `/uploads/${name}` });
}
