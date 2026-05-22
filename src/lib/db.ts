import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, "pizzara.db");

declare global {
  // eslint-disable-next-line no-var
  var __pizzara_db: Database.Database | undefined;
}

export const db: Database.Database =
  globalThis.__pizzara_db ?? (globalThis.__pizzara_db = new Database(dbPath, { timeout: 10000 }));

function withRetry<T>(fn: () => T, attempts = 5): T {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return fn();
    } catch (e) {
      lastErr = e;
      const code = (e as { code?: string }).code;
      if (code !== "SQLITE_BUSY" && code !== "SQLITE_LOCKED") throw e;
      const wait = 100 * (i + 1);
      const end = Date.now() + wait;
      while (Date.now() < end) {} // sync sleep — module init must be synchronous
    }
  }
  throw lastErr;
}

withRetry(() => db.pragma("journal_mode = WAL"));

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL,
    category_slug TEXT NOT NULL,
    image TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    guests INTEGER NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export type Category = { id: number; slug: string; name: string; sort_order: number };
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_slug: string;
  image: string | null;
  sort_order: number;
  is_active: number;
};
export type Reservation = {
  id: number;
  name: string;
  phone: string;
  guests: number;
  date: string;
  note: string | null;
  status: string;
  created_at: string;
};

export function getSetting(key: string, fallback = ""): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? fallback;
}

export function setSetting(key: string, value: string) {
  db.prepare(
    "INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value"
  ).run(key, value);
}

export function listCategories(): Category[] {
  return db
    .prepare("SELECT * FROM categories ORDER BY sort_order, id")
    .all() as Category[];
}

export function listMenu(activeOnly = true): MenuItem[] {
  const where = activeOnly ? "WHERE is_active = 1" : "";
  return db
    .prepare(`SELECT * FROM menu_items ${where} ORDER BY sort_order, id`)
    .all() as MenuItem[];
}

export function listReservations(): Reservation[] {
  return db
    .prepare("SELECT * FROM reservations ORDER BY id DESC LIMIT 200")
    .all() as Reservation[];
}
