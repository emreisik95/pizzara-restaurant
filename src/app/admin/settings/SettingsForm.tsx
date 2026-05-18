"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

export type SettingsField = {
  key: string;
  label: string;
  type: "input" | "textarea" | "image" | "toggle" | "color";
  section?: string;
  help?: string;
};

export function SettingsForm({
  initial,
  fields,
}: {
  initial: Record<string, string>;
  fields: SettingsField[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  function set(k: string, v: string) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  useEffect(() => {
    const root = document.documentElement;
    const preview = (cssVar: string, hex: string) => {
      root.style.setProperty(`--${cssVar}`, hex);
      const n = parseInt(hex.slice(1), 16);
      const triple = `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
      root.style.setProperty(`--${cssVar}-rgb`, triple);
    };
    const map: Record<string, string> = {
      theme_primary: "rosso",
      theme_primary_dark: "rosso-dark",
      theme_secondary: "bosco",
      theme_secondary_dark: "bosco-dark",
      theme_bg: "crema",
      theme_bg_light: "crema-light",
      theme_text: "ink",
    };
    for (const [k, cssVar] of Object.entries(map)) {
      const v = values[k];
      if (v && /^#[0-9a-fA-F]{6}$/.test(v)) preview(cssVar, v);
    }
  }, [values]);

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

  const grouped: { section: string; fields: SettingsField[] }[] = [];
  for (const f of fields) {
    const sec = f.section || "";
    const last = grouped[grouped.length - 1];
    if (last && last.section === sec) last.fields.push(f);
    else grouped.push({ section: sec, fields: [f] });
  }

  return (
    <motion.div
      className="grid gap-5 max-w-2xl"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
      }}
    >
      {grouped.map((group, gi) => (
        <motion.section
          key={gi}
          className="bg-crema rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_40px_-28px_rgba(20,12,8,0.4)] ring-1 ring-ink/5"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {group.section && (
            <h2 className="font-display uppercase tracking-[0.04em] text-rosso text-xl sm:text-2xl mb-4">
              {group.section}
            </h2>
          )}
          <div className="grid gap-4">
            {group.fields.map((f) => (
              <FieldRow
                key={f.key}
                field={f}
                value={values[f.key] || ""}
                onChange={(v) => set(f.key, v)}
                onUpload={(file) => uploadImage(f.key, file)}
              />
            ))}
          </div>
        </motion.section>
      ))}

      <div className="sticky bottom-3 z-20 flex items-center gap-3 bg-crema-light/95 backdrop-blur rounded-full p-2 pl-5 ring-1 ring-ink/10 shadow-[0_18px_40px_-22px_rgba(20,12,8,0.5)]">
        <AnimatePresence>
          {msg && (
            <motion.span
              className={`text-sm flex-1 ${ok ? "text-bosco-700" : "text-rosso"}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              {msg}
            </motion.span>
          )}
        </AnimatePresence>
        {!msg && <span className="flex-1 text-xs text-ink/55">Değişiklikler önizlenir, kaydedince siteye uygulanır.</span>}
        <motion.button
          disabled={busy}
          onClick={save}
          className="pill-cta pill-cta--red disabled:opacity-60 px-6 py-3"
          whileHover={busy ? undefined : { scale: 1.03 }}
          whileTap={busy ? undefined : { scale: 0.97 }}
        >
          {busy ? "..." : "Kaydet"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function FieldRow({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: SettingsField;
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1.5">
        {field.label}
      </span>
      {field.type === "textarea" ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-2.5 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 transition-shadow"
        />
      ) : field.type === "image" ? (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
            className="block w-full text-xs text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-bosco file:text-crema file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.18em] file:font-semibold"
          />
          {value && (
            <motion.div
              className="mt-2 flex items-center gap-3"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-ink/10" />
              <code className="text-xs text-ink/60 break-all">{value}</code>
            </motion.div>
          )}
        </div>
      ) : field.type === "toggle" ? (
        <button
          type="button"
          onClick={() => onChange(value === "1" ? "0" : "1")}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            value === "1" ? "bg-bosco" : "bg-ink/20"
          }`}
          aria-pressed={value === "1"}
        >
          <motion.span
            className="inline-block h-6 w-6 rounded-full bg-crema shadow"
            animate={{ x: value === "1" ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      ) : field.type === "color" ? (
        <ColorRow value={value} onChange={onChange} />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 transition-shadow"
        />
      )}
      {field.help && <p className="text-[11px] text-ink/55 mt-1.5">{field.help}</p>}
    </label>
  );
}

function ColorRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isValid = /^#[0-9a-fA-F]{6}$/.test(value);
  const safe = isValid ? value : "#000000";
  return (
    <div className="flex items-center gap-3">
      <label className="relative h-12 w-12 rounded-2xl overflow-hidden ring-1 ring-ink/10 shadow-inner shrink-0 cursor-pointer">
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span className="block h-full w-full" style={{ background: safe }} />
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#c8302c"
        spellCheck={false}
        className={`w-full rounded-xl bg-white/70 border px-3.5 py-3 text-base font-mono uppercase outline-none focus:ring-2 focus:ring-rosso/30 ${
          isValid ? "border-ink/15 focus:border-rosso" : "border-rosso/60"
        }`}
      />
    </div>
  );
}
