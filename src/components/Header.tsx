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
      className="site-header grain"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-wrap site-header-inner">
        <Link
          href="/"
          className="site-brand focus-visible-ring"
          aria-label={`${brand} anasayfa`}
        >
          <span className="md:hidden">{brand.split(/\s+/)[0]}</span>
          <span className="hidden md:inline-flex items-center gap-2">
            <Mark className="text-crema" />
            {brand}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.28em] font-semibold" aria-label="Ana navigasyon">
          {NAV.map(([href, label]) => (
            <motion.a
              key={href}
              href={href}
              className="relative rounded-sm hover:text-white focus-visible-ring"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.a>
          ))}
        </nav>
        <div className="md:hidden flex items-center gap-1.5">
          <a href="#menu" className="mobile-menu-cta focus-visible-ring">Menü</a>
          <button
            type="button"
            aria-label={open ? "Navigasyonu kapat" : "Navigasyonu aç"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
            className="mobile-nav-toggle focus-visible-ring"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {open ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></> : <><path d="M4 8h16" /><path d="M4 16h16" /></>}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-navigation container-wrap"
            aria-label="Mobil navigasyon"
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
                className="rounded-xl px-3 py-3.5 hover:bg-crema/10 focus-visible-ring"
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
    <svg width="26" height="26" viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.14" />
      <path d="M16 4 L27 22 L5 22 Z" fill="currentColor" />
      <circle cx="12" cy="17" r="1.4" fill="#a82622" />
      <circle cx="18" cy="15" r="1.4" fill="#a82622" />
      <circle cx="16" cy="20" r="1.3" fill="#a82622" />
    </svg>
  );
}
