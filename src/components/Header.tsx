"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function Header({
  brand,
  reservationEnabled = true,
}: {
  brand: string;
  reservationEnabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const links = [
    ["#menu", "Menü"],
    ...(reservationEnabled ? [["#reservation", "Rezervasyon"]] : []),
    ["#contact", "İletişim"],
  ];
  return (
    <header className="site-header">
      <div className="container-wrap site-header-inner">
        <Link href="/" className="site-brand" aria-label={`${brand} anasayfa`}>
          <span>{brand.split(/\s+/)[0].toLocaleLowerCase("tr")}</span>
        </Link>
        <span className="header-caption">İYİ MALZEME, GERÇEK LEZZET.</span>
        <nav className="desktop-nav" aria-label="Ana navigasyon">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
              <span aria-hidden>↗</span>
            </a>
          ))}
        </nav>
        <div className="mobile-header-actions">
          <a
            href="#menu"
            className="mobile-menu-cta"
            onClick={() => setOpen(false)}
          >
            Menü <span aria-hidden>↘</span>
          </a>
          <button
            ref={toggle}
            type="button"
            aria-label={open ? "Navigasyonu kapat" : "Navigasyonu aç"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
            className="mobile-nav-toggle"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden
            >
              {open ? (
                <path d="m6 6 12 12M6 18 18 6" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation container-wrap"
          aria-label="Mobil navigasyon"
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <span aria-hidden>↗</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
