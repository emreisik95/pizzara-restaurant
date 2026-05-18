"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

const BASE_NAV: Array<[string, string]> = [
  ["#hero", "Anasayfa"],
  ["#menu", "Menü"],
  ["#reservation", "Rezervasyon"],
  ["#contact", "İletişim"],
];

export function Header({ brand, reservationEnabled = true }: { brand: string; reservationEnabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const NAV = reservationEnabled
    ? BASE_NAV
    : BASE_NAV.filter(([href]) => href !== "#reservation");
  return (
    <motion.header
      className="sticky top-0 z-50 bg-rosso text-crema-200 grain"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-wrap relative z-10 flex items-center justify-between py-4 md:py-5">
        <Link
          href="/"
          className="font-display tracking-[0.04em] text-base md:text-lg uppercase text-crema"
        >
          <span className="md:hidden">{brand.replace(/\s+/g, "")}</span>
          <span className="hidden md:inline-flex items-center gap-2">
            <Mark className="text-crema" />
            {brand}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.28em] font-semibold">
          {NAV.map(([href, label]) => (
            <motion.a
              key={href}
              href={href}
              className="relative hover:opacity-90"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.a>
          ))}
        </nav>
        <button
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-full hover:bg-crema/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></> : <><path d="M3 7h18" /><path d="M3 17h18" /></>}
          </svg>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            className="md:hidden container-wrap pb-4 grid gap-1 text-sm uppercase tracking-[0.22em] font-semibold overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-crema/10 transition-colors"
              >
                {label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.14" />
      <path d="M16 4 L27 22 L5 22 Z" fill="currentColor" />
      <circle cx="12" cy="17" r="1.4" fill="#a82622" />
      <circle cx="18" cy="15" r="1.4" fill="#a82622" />
      <circle cx="16" cy="20" r="1.3" fill="#a82622" />
    </svg>
  );
}
