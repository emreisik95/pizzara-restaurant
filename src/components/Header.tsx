"use client";
import { useState } from "react";
import Link from "next/link";

export function Header({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-brand-900/60 border-b border-cream/10">
      <div className="container-app flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg tracking-[0.22em] uppercase">
            {brand}
          </span>
        </Link>
        <button
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 ring-1 ring-cream/20 hover:bg-cream/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="container-app pb-4 grid gap-2 text-sm">
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
              className="rounded-lg px-3 py-2 hover:bg-cream/10"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" className="text-cream">
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.12" />
      <path
        d="M16 4 L26 22 L6 22 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="13" cy="17" r="1.4" fill="#581210" />
      <circle cx="18" cy="15" r="1.4" fill="#581210" />
      <circle cx="16" cy="19" r="1.2" fill="#581210" />
    </svg>
  );
}
