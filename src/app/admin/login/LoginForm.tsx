"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
      <label className="block">
        <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">
          Şifre
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
        />
      </label>
      <button
        disabled={busy}
        className="pill-cta pill-cta--red mt-2 w-full justify-center disabled:opacity-60"
        type="submit"
      >
        {busy ? "Giriş..." : "Giriş Yap"}
      </button>
      {err && <p className="text-rosso text-sm text-center">{err}</p>}
    </form>
  );
}
