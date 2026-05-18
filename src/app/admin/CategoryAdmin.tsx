"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Cat = { id: number; slug: string; name: string; sort_order: number };

function slugify(s: string) {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return s
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function CategoryAdmin({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);

  function refresh() {
    start(() => router.refresh());
  }

  async function remove(c: Cat) {
    if (!confirm(`"${c.name}" kategorisi silinsin mi?`)) return;
    const r = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      if (j?.error === "in-use") {
        alert(`Bu kategoride ${j.count} ürün var. Önce ürünleri taşı veya sil.`);
      } else if (j?.error === "tumu-locked") {
        alert('"Tümü" kategorisi silinemez.');
      } else {
        alert("Silinemedi");
      }
      return;
    }
    refresh();
  }

  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div>
          <h2 className="font-display uppercase text-xl sm:text-2xl text-bosco">Kategoriler</h2>
          <p className="text-ink/60 text-xs sm:text-sm">{categories.length} kategori</p>
        </div>
        <motion.button
          className="pill-cta pill-cta--green text-xs sm:text-sm px-4 sm:px-5 py-2.5"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          + Yeni Kategori
        </motion.button>
      </div>

      <ul className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {categories.map((c) => (
            <motion.li
              layout
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group inline-flex items-stretch rounded-full bg-crema ring-1 ring-ink/10 overflow-hidden shadow-[0_8px_20px_-16px_rgba(20,12,8,0.5)]"
            >
              <button
                onClick={() => {
                  setEditing(c);
                  setOpen(true);
                }}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-bosco/5"
                title="Düzenle"
              >
                <span className="font-display uppercase tracking-tight">{c.name}</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink/45">
                  {c.slug}
                </span>
              </button>
              {c.slug !== "tumu" && (
                <button
                  onClick={() => remove(c)}
                  aria-label="Sil"
                  className="px-2.5 border-l border-ink/10 text-ink/40 hover:text-rosso hover:bg-rosso/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {open && (
          <CategoryDialog
            cat={editing}
            existingSlugs={categories.map((c) => c.slug)}
            onClose={() => setOpen(false)}
            onSaved={() => {
              setOpen(false);
              refresh();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function CategoryDialog({
  cat,
  existingSlugs,
  onClose,
  onSaved,
}: {
  cat: Cat | null;
  existingSlugs: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(cat?.name ?? "");
  const [slug, setSlug] = useState(cat?.slug ?? "");
  const [sort, setSort] = useState<number>(cat?.sort_order ?? 0);
  const [slugTouched, setSlugTouched] = useState(!!cat);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const slugLocked = cat?.slug === "tumu";

  function onNameChange(v: string) {
    setName(v);
    if (!slugTouched && !slugLocked) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    if (!trimmedName) return setErr("Ad zorunlu");
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(trimmedSlug)) {
      return setErr("Slug: küçük harf, rakam, tire");
    }
    const clash = existingSlugs.some(
      (s) => s === trimmedSlug && s !== cat?.slug
    );
    if (clash) return setErr("Bu slug zaten var");

    const payload = { name: trimmedName, slug: trimmedSlug, sort_order: sort };
    setBusy(true);
    const url = cat ? `/api/admin/categories/${cat.id}` : "/api/admin/categories";
    const method = cat ? "PUT" : "POST";
    const r = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      if (j?.error === "slug-exists") setErr("Bu slug zaten var");
      else if (j?.error === "tumu-slug-locked") setErr('"tumu" slug değiştirilemez');
      else setErr("Kaydedilemedi");
      return;
    }
    onSaved();
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
        className="bg-crema text-ink rounded-3xl w-full max-w-md p-6 md:p-8 shadow-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl md:text-3xl uppercase text-rosso">
            {cat ? "Kategori Düzenle" : "Yeni Kategori"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="h-9 w-9 rounded-full hover:bg-ink/10 inline-flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">
              Ad
            </span>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
            />
          </label>

          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">
              Slug {slugLocked && <span className="text-ink/40 normal-case tracking-normal">(kilitli)</span>}
            </span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              disabled={slugLocked}
              required
              className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30 font-mono text-sm disabled:opacity-60"
            />
            <span className="block text-[11px] text-ink/50 mt-1">URL ve veri için. Küçük harf + tire.</span>
          </label>

          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">
              Sıra
            </span>
            <input
              type="number"
              value={sort}
              onChange={(e) => setSort(Number(e.target.value) || 0)}
              className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
            />
          </label>

          {err && <p className="text-rosso text-sm">{err}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] bg-ink/10 hover:bg-ink/15"
            >
              İptal
            </button>
            <motion.button
              disabled={busy}
              className="pill-cta pill-cta--red flex-1 justify-center disabled:opacity-60"
              type="submit"
              whileHover={busy ? undefined : { scale: 1.02 }}
              whileTap={busy ? undefined : { scale: 0.97 }}
            >
              {busy ? "..." : "Kaydet"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
