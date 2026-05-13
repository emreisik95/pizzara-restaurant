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
    <div className="min-h-screen bg-crema-light text-ink">
      {!isLogin && session ? (
        <header className="bg-rosso text-crema grain">
          <div className="relative z-10 mx-auto max-w-5xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <Link href="/admin" className="font-display tracking-[0.18em] uppercase text-base md:text-lg">
              Pizzara · Admin
            </Link>
            <nav className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] font-semibold">
              <Link className="rounded-full px-3 py-1.5 hover:bg-crema/10" href="/admin">Menü</Link>
              <Link className="rounded-full px-3 py-1.5 hover:bg-crema/10" href="/admin/reservations">Rezervasyon</Link>
              <Link className="rounded-full px-3 py-1.5 hover:bg-crema/10" href="/admin/settings">Ayarlar</Link>
              <Link className="rounded-full px-3 py-1.5 hover:bg-crema/10" href="/" target="_blank">Site</Link>
              <form action="/api/admin/logout" method="post">
                <button className="rounded-full px-3 py-1.5 bg-crema/15 hover:bg-crema/25">Çıkış</button>
              </form>
            </nav>
          </div>
        </header>
      ) : null}
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
