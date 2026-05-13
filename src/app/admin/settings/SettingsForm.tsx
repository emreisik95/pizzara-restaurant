"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      setMsg("Kaydedildi.");
      router.refresh();
    } else setMsg("Kaydedilemedi.");
  }

  return (
    <div className="grid gap-4 max-w-xl">
      {fields.map(([key, label, type]) => (
        <label key={key} className="block">
          <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">{label}</span>
          {type === "textarea" ? (
            <textarea
              rows={3}
              value={values[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2 text-sm outline-none focus:border-cream/50"
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
                className="text-xs"
              />
              {values[key] && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={values[key]} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <code className="text-xs text-cream/70 break-all">{values[key]}</code>
                </div>
              )}
            </div>
          ) : (
            <input
              value={values[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2.5 text-sm outline-none focus:border-cream/50"
            />
          )}
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button disabled={busy} onClick={save} className="btn-primary disabled:opacity-60">
          {busy ? "..." : "Kaydet"}
        </button>
        {msg && <span className="text-cream/70 text-sm">{msg}</span>}
      </div>
    </div>
  );
}
