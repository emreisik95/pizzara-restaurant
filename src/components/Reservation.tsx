"use client";
import { useState } from "react";
import { Sparkle } from "./Sparkle";

export function Reservation() {
  const [open, setOpen] = useState(false);
  return (
    <section id="reservation" className="relative bg-rosso text-crema grain overflow-hidden">
      <Sparkle size={18} className="absolute top-8 right-[28%] text-crema/80" rotate={20} />
      <Sparkle size={14} className="absolute bottom-10 left-[20%] text-crema/70" rotate={45} />
      <Sparkle size={22} className="absolute top-1/2 right-[12%] text-crema/70" />

      <div className="container-wrap relative z-10 grid md:grid-cols-2 items-center gap-10 py-20 md:py-28">
        <div className="max-w-lg fade-up">
          <h2 className="section-title uppercase">Bir Masa Ayırtın</h2>
          <p className="font-serif italic text-lg md:text-xl mt-3 text-crema/90 max-w-md">
            Lezzet dolu bir deneyim için sizi bekliyoruz.
          </p>
          <div className="mt-7 md:mt-9">
            <button
              onClick={() => setOpen(true)}
              className="pill-cta pill-cta--outline-cream"
            >
              Rezervasyon Yap
            </button>
          </div>
        </div>

        <TableArt />
      </div>

      {open && <ReservationDialog onClose={() => setOpen(false)} />}
    </section>
  );
}

function ReservationDialog({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setMsg("");
    try {
      const r = await fetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(fd)),
        headers: { "content-type": "application/json" },
      });
      if (!r.ok) throw new Error((await r.json()).error || "Hata");
      setState("ok");
      setMsg("Rezervasyon talebiniz alındı. Sizi en kısa sürede arayacağız.");
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-bosco-900/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-crema text-ink w-full max-w-md rounded-3xl p-6 md:p-8 shadow-card grain">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl uppercase text-rosso">Rezervasyon</h3>
          <button onClick={onClose} aria-label="Kapat" className="h-9 w-9 rounded-full hover:bg-ink/10 inline-flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 text-left">
          <Field label="Ad Soyad" name="name" required />
          <Field label="Telefon" name="phone" type="tel" required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarih & Saat" name="date" type="datetime-local" required />
            <Field label="Kişi" name="guests" type="number" min={1} max={20} defaultValue={2} required />
          </div>
          <Field label="Not (opsiyonel)" name="note" />
          <button
            disabled={state === "sending"}
            className="pill-cta pill-cta--red mt-2 w-full justify-center disabled:opacity-60"
            type="submit"
          >
            {state === "sending" ? "Gönderiliyor..." : "Onayla"}
          </button>
          {msg && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm mt-1 text-center ${state === "ok" ? "text-bosco-700" : "text-rosso-700"}`}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", required, min, max, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean; min?: number; max?: number; defaultValue?: string | number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
      />
    </label>
  );
}

function TableArt() {
  return (
    <div className="relative h-48 md:h-64 fade-up text-crema/85">
      <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* floor line */}
        <path d="M20 150 H300" />
        {/* table top + leg */}
        <path d="M90 110 H230" />
        <path d="M160 110 V150" />
        <path d="M140 150 H180" />
        {/* vase on table */}
        <ellipse cx="160" cy="108" rx="9" ry="3" />
        <path d="M155 108 v-10 q5 -4 10 0 v10" />
        {/* tiny flower */}
        <circle cx="160" cy="92" r="3.2" />
        {/* left chair */}
        <path d="M70 150 V90" />
        <circle cx="70" cy="84" r="8" />
        <path d="M70 92 V108" />
        <path d="M62 110 H78" />
        {/* right chair */}
        <path d="M250 150 V90" />
        <circle cx="250" cy="84" r="8" />
        <path d="M250 92 V108" />
        <path d="M242 110 H258" />
      </svg>
      <Sparkle size={14} className="absolute top-2 right-10 text-crema" />
      <Sparkle size={10} className="absolute bottom-4 left-8 text-crema" rotate={30} />
      <Sparkle size={12} className="absolute top-10 left-[42%] text-crema/80" rotate={20} />
    </div>
  );
}
