"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Cat = { slug: string; name: string };
type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_slug: string;
  image: string | null;
  is_active: boolean;
  sort_order: number;
};

export function MenuAdmin({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);

  function refresh() {
    start(() => router.refresh());
  }

  async function remove(id: number) {
    if (!confirm("Bu ürün silinsin mi?")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    refresh();
  }

  async function toggle(it: Item) {
    await fetch(`/api/admin/menu/${it.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_active: !it.is_active }),
    });
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-ink/70 text-sm">{items.length} ürün</p>
        <motion.button
          className="pill-cta pill-cta--red text-xs md:text-sm px-5 py-2.5"
          onClick={() => setCreating(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          + Yeni Ürün
        </motion.button>
      </div>

      <ul className="grid gap-3">
        <AnimatePresence initial={false}>
        {items.map((it, idx) => (
          <motion.li
            layout
            key={it.id}
            className={`rounded-2xl bg-crema p-4 shadow-[0_18px_40px_-28px_rgba(20,12,8,0.4)] ring-1 ring-ink/5 ${!it.is_active ? "opacity-60" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: it.is_active ? 1 : 0.6, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.25), ease: EASE }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-bosco/15 ring-1 ring-ink/5 overflow-hidden shrink-0">
                {it.image && (
                  <img
                    src={it.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display uppercase tracking-tight text-lg">{it.name}</h3>
                  <span className="text-[10px] tracking-[0.22em] uppercase bg-bosco/10 text-bosco-700 px-2 py-0.5 rounded-full font-semibold">
                    {categories.find((c) => c.slug === it.category_slug)?.name ?? it.category_slug}
                  </span>
                </div>
                <p className="text-ink/70 text-xs line-clamp-1 mt-0.5">{it.description}</p>
              </div>
              <p className="font-display text-xl text-rosso shrink-0">₺{it.price}</p>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => toggle(it)}
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] bg-bosco/10 text-bosco-700 hover:bg-bosco/20"
                >
                  {it.is_active ? "Gizle" : "Göster"}
                </button>
                <button
                  onClick={() => setEditing(it)}
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] bg-ink/10 hover:bg-ink/15"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => remove(it.id)}
                  className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] bg-rosso/15 text-rosso-700 hover:bg-rosso/25"
                >
                  Sil
                </button>
              </div>
            </div>
          </motion.li>
        ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
      {(editing || creating) && (
        <ItemDialog
          categories={categories}
          item={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreating(false);
            refresh();
          }}
        />
      )}
      </AnimatePresence>
      {pending && <p className="text-ink/50 text-xs mt-3">Güncelleniyor...</p>}
    </div>
  );
}

function ItemDialog({
  categories,
  item,
  onClose,
  onSaved,
}: {
  categories: Cat[];
  item: Item | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [imagePath, setImagePath] = useState(item?.image ?? "");
  const [err, setErr] = useState("");

  async function uploadImage(file: File) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setBusy(false);
    if (!r.ok) {
      setErr("Yüklenemedi");
      return;
    }
    const { url } = await r.json();
    setImagePath(url);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      price: Number(fd.get("price") || 0),
      category_slug: String(fd.get("category_slug") || "atistirmalik"),
      image: imagePath || null,
      sort_order: Number(fd.get("sort_order") || 0),
      is_active: fd.get("is_active") === "on",
    };
    setBusy(true);
    setErr("");
    const url = item ? `/api/admin/menu/${item.id}` : "/api/admin/menu";
    const method = item ? "PUT" : "POST";
    const r = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!r.ok) {
      setErr("Kaydedilemedi");
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
            {item ? "Ürün Düzenle" : "Yeni Ürün"}
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
          <Field name="name" label="Ad" defaultValue={item?.name} required />
          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">Açıklama</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={item?.description}
              className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-2.5 text-sm outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field name="price" label="Fiyat (₺)" type="number" defaultValue={item?.price} required />
            <label className="block">
              <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">Kategori</span>
              <select
                name="category_slug"
                defaultValue={item?.category_slug}
                className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
              >
                {categories.filter((c) => c.slug !== "tumu").map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
          <Field name="sort_order" label="Sıra" type="number" defaultValue={item?.sort_order ?? 0} />
          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">Görsel</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f);
              }}
              className="text-xs text-ink/70"
            />
            {imagePath && (
              <div className="mt-2 flex items-center gap-2">
                <img src={imagePath} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-ink/10" />
                <span className="text-xs text-ink/60 break-all">{imagePath}</span>
              </div>
            )}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={item ? item.is_active : true}
            />
            <span>Aktif (menüde göster)</span>
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

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/70 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-xl bg-white/70 border border-ink/15 px-3.5 py-3 text-base outline-none focus:border-rosso focus:ring-2 focus:ring-rosso/30"
      />
    </label>
  );
}
