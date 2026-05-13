"use client";
import { useState } from "react";
import { Sparkle } from "./Sparkle";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function Reservation() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <section id="reservation" className="relative bg-rosso text-crema grain overflow-hidden">
      <motion.div
        className="absolute top-8 right-[28%]"
        animate={reduce ? undefined : { scale: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkle size={18} className="text-crema/80" rotate={20} />
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-[20%]"
        animate={reduce ? undefined : { scale: [0.6, 1, 0.6], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <Sparkle size={14} className="text-crema/70" rotate={45} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-[12%]"
        animate={reduce ? undefined : { scale: [0.7, 1, 0.7], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <Sparkle size={22} className="text-crema/70" />
      </motion.div>

      <motion.div
        className="container-wrap relative z-10 grid md:grid-cols-2 items-center gap-10 py-20 md:py-28"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <div className="max-w-lg">
          <motion.h2 className="section-title uppercase" variants={fadeUp}>
            Bir Masa Ayırtın
          </motion.h2>
          <motion.p
            className="font-serif italic text-lg md:text-xl mt-3 text-crema/90 max-w-md"
            variants={fadeUp}
          >
            Lezzet dolu bir deneyim için sizi bekliyoruz.
          </motion.p>
          <motion.div className="mt-7 md:mt-9" variants={fadeUp}>
            <motion.button
              onClick={() => setOpen(true)}
              className="pill-cta pill-cta--outline-cream"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              Rezervasyon Yap
            </motion.button>
          </motion.div>
        </div>

        <TableArt />
      </motion.div>

      <AnimatePresence>
        {open && <ReservationDialog onClose={() => setOpen(false)} />}
      </AnimatePresence>
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
    <motion.div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-bosco-900/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="bg-crema text-ink w-full max-w-md rounded-3xl p-6 md:p-8 shadow-card grain"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl uppercase text-rosso">Rezervasyon</h3>
          <button onClick={onClose} aria-label="Kapat" className="h-9 w-9 rounded-full hover:bg-ink/10 inline-flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <motion.form
          onSubmit={onSubmit}
          className="mt-4 grid gap-3 text-left"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
        >
          <Field label="Ad Soyad" name="name" required />
          <Field label="Telefon" name="phone" type="tel" required />
          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <Field label="Tarih & Saat" name="date" type="datetime-local" required noVariant />
            <Field label="Kişi" name="guests" type="number" min={1} max={20} defaultValue={2} required noVariant />
          </motion.div>
          <Field label="Not (opsiyonel)" name="note" />
          <motion.button
            disabled={state === "sending"}
            className="pill-cta pill-cta--red mt-2 w-full justify-center disabled:opacity-60"
            type="submit"
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.97 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {state === "sending" ? "Gönderiliyor..." : "Onayla"}
          </motion.button>
          {msg && (
            <motion.p
              role="status"
              aria-live="polite"
              className={`text-sm mt-1 text-center ${state === "ok" ? "text-bosco-700" : "text-rosso-700"}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg}
            </motion.p>
          )}
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label, name, type = "text", required, min, max, defaultValue, noVariant,
}: {
  label: string; name: string; type?: string; required?: boolean; min?: number; max?: number; defaultValue?: string | number; noVariant?: boolean;
}) {
  const inner = (
    <label className="block">
      <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 transition-shadow"
      />
    </label>
  );
  if (noVariant) return inner;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {inner}
    </motion.div>
  );
}

function TableArt() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);
  return (
    <motion.div
      ref={ref}
      className="relative h-48 md:h-64 text-crema/85"
      style={{ y }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
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
    </motion.div>
  );
}
