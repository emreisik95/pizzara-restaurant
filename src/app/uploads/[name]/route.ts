import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const PRIMARY = process.env.UPLOAD_DIR || "/data/uploads";
const FALLBACK = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  if (!name || name.includes("/") || name.includes("..") || name.startsWith(".")) {
    return new NextResponse("bad name", { status: 400 });
  }
  let full = path.join(PRIMARY, name);
  if (!fs.existsSync(full)) {
    const alt = path.join(FALLBACK, name);
    if (!fs.existsSync(alt)) return new NextResponse("not found", { status: 404 });
    full = alt;
  }
  const stat = fs.statSync(full);
  const ext = path.extname(name).toLowerCase();
  const buf = fs.readFileSync(full);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "content-type": MIME[ext] || "application/octet-stream",
      "content-length": String(stat.size),
      "cache-control": "public, max-age=31536000, immutable",
      "last-modified": stat.mtime.toUTCString(),
    },
  });
}
