import { readdirSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    const chunks = readdirSync(join(process.cwd(), ".next/static/chunks"));
    if (chunks.length === 0) {
      return new Response("static chunks missing", { status: 503 });
    }
    return Response.json({ ok: true, chunks: chunks.length });
  } catch (e) {
    return new Response(`healthcheck failed: ${(e as Error).message}`, { status: 503 });
  }
}
