"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

export function SettingsForm({
  initial,
  fields,
}: {
  initial: Record<string, string>;
  fields: [string, string, string][];
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  function set(k: string, v: string) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function uploadImage(k: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (r.ok) {
      const { url } = await r.json();
      set(k, url);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");
    const r = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    setBusy(false);
    if (r.ok) {
      setOk(true);
      setMsg("Kaydedildi.");
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } else {
      setOk(false);
      setMsg("Kaydedilemedi.");
    }
  }

  return (
    <motion.div
      className="grid gap-4 max-w-xl bg-crema rounded-3xl p-6 md:p-8 shadow-[0_18px_40px_-28px_rgba(20,12,8,0.4)] ring-1 ring-ink/5"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
      }}
    >
      {fields.map(([key, label, type]) => (
        <motion.label
          key={key}
          className="block"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">
            {label}
          </span>
          {type === "textarea" ? (
            <textarea
              rows={3}
              value={values[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-2.5 text-sm outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 transition-shadow"
            />
          ) : type === "image" ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(key, f);
                }}
                className="text-xs text-ink/70"
              />
              {values[key] && (
                <motion.div
                  className="mt-2 flex items-center gap-3"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img src={values[key]} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-ink/10" />
                  <code className="text-xs text-ink/60 break-all">{values[key]}</code>
                </motion.div>
              )}
            </div>
          ) : (
            <input
              value={values[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 transition-shadow"
            />
          )}
        </motion.label>
      ))}
      <div className="flex items-center gap-3 mt-2">
        <motion.button
          disabled={busy}
          onClick={save}
          className="pill-cta pill-cta--red disabled:opacity-60"
          whileHover={busy ? undefined : { scale: 1.03 }}
          whileTap={busy ? undefined : { scale: 0.97 }}
        >
          {busy ? "..." : "Kaydet"}
        </motion.button>
        <AnimatePresence>
          {msg && (
            <motion.span
              className={`text-sm ${ok ? "text-bosco-700" : "text-rosso"}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              {msg}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
