"use client";
import { useState } from "react";

export function Reservation() {
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
    <section id="reservation" className="py-14">
      <div className="container-app text-center">
        <h2 className="font-display text-4xl">BİR MASA AYIRTIN</h2>
        <p className="text-cream/75 mt-3 text-sm max-w-[34ch] mx-auto">
          Lezzet dolu bir deneyim için sizi bekliyoruz.
        </p>

        <TableArt />

        <form
          onSubmit={onSubmit}
          className="mt-6 grid gap-3 text-left bg-brand-900/40 rounded-2xl p-5 ring-1 ring-cream/10"
        >
          <Field label="Ad Soyad" name="name" required />
          <Field label="Telefon" name="phone" type="tel" required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarih & Saat" name="date" type="datetime-local" required />
            <Field label="Kişi Sayısı" name="guests" type="number" min={1} max={20} defaultValue={2} required />
          </div>
          <Field label="Not (opsiyonel)" name="note" />
          <button
            disabled={state === "sending"}
            className="btn-primary mt-2 disabled:opacity-60"
            type="submit"
          >
            {state === "sending" ? "GÖNDERİLİYOR..." : "REZERVASYON OLUŞTUR"}
          </button>
          {msg && (
            <p
              className={`text-sm mt-1 text-center ${
                state === "ok" ? "text-emerald-200" : "text-amber-200"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
  max,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  defaultValue?: string | number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2.5 text-sm outline-none focus:border-cream/50"
      />
    </label>
  );
}

function TableArt() {
  return (
    <svg viewBox="0 0 240 90" className="mx-auto mt-4 w-full max-w-xs text-cream/70" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M30 70h180" />
      <path d="M60 70v-22h120v22" />
      <circle cx="60" cy="40" r="10" />
      <circle cx="180" cy="40" r="10" />
      <path d="M120 48v22" />
      <path d="M105 70h30" />
      <circle cx="120" cy="36" r="5" />
    </svg>
  );
}
