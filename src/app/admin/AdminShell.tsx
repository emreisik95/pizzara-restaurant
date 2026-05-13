"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const NAV = [
  { href: "/admin", label: "Menü", icon: MenuIcon },
  { href: "/admin/reservations", label: "Rezervasyon", icon: CalendarIcon },
  { href: "/admin/settings", label: "Ayarlar", icon: GearIcon },
] as const;

export function AdminShell({
  children,
  pathname: serverPathname,
}: {
  children: React.ReactNode;
  pathname?: string;
}) {
  const clientPath = usePathname();
  const path = clientPath || serverPathname || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-crema-light text-ink flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:w-72 lg:w-80 shrink-0 bg-bosco text-crema flex-col relative grain">
        <SidebarContent path={path} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Sidebar — mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-bosco-900/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 w-[78%] max-w-[320px] bg-bosco text-crema flex flex-col grain shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarContent path={path} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar — mobile only, also visible on desktop for context */}
        <div className="md:hidden sticky top-0 z-30 bg-crema-light/85 backdrop-blur border-b border-ink/8 flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Menüyü aç"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-bosco text-crema"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <Link href="/admin" className="font-display tracking-[0.22em] uppercase text-rosso text-sm">
            Pizzara
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-[10px] uppercase tracking-[0.24em] font-semibold rounded-full bg-rosso text-crema px-3 py-1.5"
          >
            Site
          </Link>
        </div>

        <main className="flex-1 px-5 md:px-10 lg:px-14 py-8 md:py-12">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  path,
  onNavigate,
}: {
  path: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="relative z-10 px-7 pt-9 pb-8">
        <Link href="/admin" onClick={onNavigate} className="block group">
          <div className="font-display tracking-[0.04em] uppercase text-2xl lg:text-3xl text-crema leading-none">
            Pizzara
          </div>
          <div className="font-serif italic text-crema/70 text-sm mt-1">
            Yönetim Paneli
          </div>
        </Link>
      </div>

      <nav className="relative z-10 px-4 flex-1 flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? path === "/admin" || path === "/admin/"
              : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
                active
                  ? "text-bosco bg-crema shadow-[0_10px_24px_-18px_rgba(0,0,0,0.6)]"
                  : "text-crema/85 hover:text-crema hover:bg-crema/8"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-active-pill"
                  className="absolute inset-0 bg-crema rounded-2xl -z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-3">
                <Icon active={active} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 px-4 pb-7 pt-4 mt-2 border-t border-crema/12 flex flex-col gap-2">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.22em] font-semibold bg-crema/10 text-crema hover:bg-crema/15 transition-colors"
        >
          <span>Siteyi Aç</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </Link>
        <form action="/api/admin/logout" method="post">
          <button className="w-full flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.22em] font-semibold bg-rosso text-crema hover:bg-rosso-dark transition-colors">
            <span>Çıkış</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

function MenuIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}
function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function GearIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
