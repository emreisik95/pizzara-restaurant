import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { readSession } from "@/lib/auth";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");

export async function GET() {
  if (!(await readSession())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const out: Record<string, unknown> = {
    cwd: process.cwd(),
    UPLOAD_DIR,
    publicJoinCwd: path.join(process.cwd(), "public", "uploads"),
  };
  try {
    const stat = fs.statSync(UPLOAD_DIR);
    out.statMode = stat.mode.toString(8);
    out.statUid = stat.uid;
    out.statGid = stat.gid;
  } catch (e) {
    out.statError = String(e);
  }
  try {
    const files = fs.readdirSync(UPLOAD_DIR).slice(-30);
    out.files = files;
  } catch (e) {
    out.readdirError = String(e);
  }
  try {
    const alt = path.join(process.cwd(), "public", "uploads");
    if (alt !== UPLOAD_DIR) {
      out.altFiles = fs.readdirSync(alt).slice(-30);
    }
  } catch (e) {
    out.altError = String(e);
  }
  return NextResponse.json(out);
}
