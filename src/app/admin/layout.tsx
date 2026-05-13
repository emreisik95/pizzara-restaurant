import { redirect } from "next/navigation";
import Link from "next/link";
import { readSession } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || "";
  const session = await readSession();
  const isLogin = pathname.endsWith("/admin/login");

  if (!session && !isLogin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-paper">
      {!isLogin && session ? (
        <header className="border-b border-cream/10 bg-brand-950/60">
          <div className="mx-auto max-w-4xl px-5 py-3 flex items-center justify-between">
            <Link href="/admin" className="font-display tracking-[0.2em] uppercase text-sm">
              Pizzara · Admin
            </Link>
            <nav className="flex items-center gap-2 text-xs">
              <Link className="rounded px-3 py-1.5 hover:bg-cream/10" href="/admin">Menü</Link>
              <Link className="rounded px-3 py-1.5 hover:bg-cream/10" href="/admin/reservations">Rezervasyon</Link>
              <Link className="rounded px-3 py-1.5 hover:bg-cream/10" href="/admin/settings">Ayarlar</Link>
              <Link className="rounded px-3 py-1.5 hover:bg-cream/10 underline" href="/" target="_blank">Site</Link>
              <form action="/api/admin/logout" method="post">
                <button className="rounded px-3 py-1.5 bg-cream/10 hover:bg-cream/20">Çıkış</button>
              </form>
            </nav>
          </div>
        </header>
      ) : null}
      <main className="mx-auto max-w-4xl px-5 py-6">{children}</main>
    </div>
  );
}
