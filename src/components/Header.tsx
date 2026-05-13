"use client";
import { useState } from "react";
import Link from "next/link";

export function Header({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-rosso text-crema-200 grain">
      <div className="container-wrap relative z-10 flex items-center justify-between py-4 md:py-5">
        <Link href="/" className="flex items-center gap-2 font-display tracking-wider2 text-base md:text-lg uppercase">
          <Mark className="text-crema" />
          <span>{brand}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.28em] font-semibold">
          <a href="#hero" className="hover:opacity-80">Anasayfa</a>
          <a href="#menu" className="hover:opacity-80">Menü</a>
          <a href="#reservation" className="hover:opacity-80">Rezervasyon</a>
          <a href="#contact" className="hover:opacity-80">İletişim</a>
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
      {open && (
        <nav className="md:hidden container-wrap pb-4 grid gap-1 text-sm uppercase tracking-[0.22em] font-semibold">
          {[
            ["#hero", "Anasayfa"],
            ["#menu", "Menü"],
            ["#reservation", "Rezervasyon"],
            ["#contact", "İletişim"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 hover:bg-crema/10"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
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
