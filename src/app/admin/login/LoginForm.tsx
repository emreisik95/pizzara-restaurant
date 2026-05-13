"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function LoginForm() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    setBusy(false);
    if (r.ok) router.replace("/admin");
    else setErr("Şifre hatalı.");
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="mt-6 grid gap-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
      }}
    >
      <motion.label
        className="block"
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">
          Şifre
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 transition-shadow"
        />
      </motion.label>
      <motion.button
        disabled={busy}
        className="pill-cta pill-cta--red mt-2 w-full justify-center disabled:opacity-60"
        type="submit"
        variants={{
          hidden: { opacity: 0, y: 10, scale: 0.97 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        }}
        whileHover={busy ? undefined : { scale: 1.02 }}
        whileTap={busy ? undefined : { scale: 0.97 }}
      >
        {busy ? "Giriş..." : "Giriş Yap"}
      </motion.button>
      <AnimatePresence>
        {err && (
          <motion.p
            className="text-rosso text-sm text-center"
            initial={{ opacity: 0, y: -6, x: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              x: [-6, 6, -4, 4, 0],
              transition: { x: { duration: 0.4 }, opacity: { duration: 0.2 } },
            }}
            exit={{ opacity: 0 }}
          >
            {err}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
