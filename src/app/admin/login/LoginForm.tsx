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
        <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">
          Şifre
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2.5 text-sm outline-none focus:border-cream/50"
        />
      </label>
      <button disabled={busy} className="btn-primary mt-2 disabled:opacity-60" type="submit">
        {busy ? "Giriş..." : "GİRİŞ YAP"}
      </button>
      {err && <p className="text-amber-200 text-sm text-center">{err}</p>}
    </form>
  );
}
