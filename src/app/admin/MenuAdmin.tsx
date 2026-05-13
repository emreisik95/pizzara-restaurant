"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
      <div className="flex items-center justify-between mb-4">
        <p className="text-cream/70 text-sm">{items.length} ürün</p>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          + Yeni Ürün
        </button>
      </div>

      <ul className="grid gap-3">
        {items.map((it) => (
          <li
            key={it.id}
            className={`card-menu p-4 ${!it.is_active ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-brand-700 ring-1 ring-cream/15 overflow-hidden">
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
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{it.name}</h3>
                  <span className="text-[10px] tracking-widest uppercase bg-cream/10 px-2 py-0.5 rounded">
                    {categories.find((c) => c.slug === it.category_slug)?.name ?? it.category_slug}
                  </span>
                </div>
                <p className="text-cream/70 text-xs line-clamp-1">{it.description}</p>
              </div>
              <p className="font-display text-lg text-gold">₺{it.price}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => toggle(it)}
                  className="rounded px-2 py-1 text-xs bg-cream/10 hover:bg-cream/20"
                >
                  {it.is_active ? "Gizle" : "Göster"}
                </button>
                <button
                  onClick={() => setEditing(it)}
                  className="rounded px-2 py-1 text-xs bg-cream/10 hover:bg-cream/20"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => remove(it.id)}
                  className="rounded px-2 py-1 text-xs bg-red-500/30 hover:bg-red-500/50"
                >
                  Sil
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

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
      {pending && <p className="text-cream/60 text-xs mt-3">Güncelleniyor...</p>}
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-brand-900 rounded-2xl w-full max-w-md p-5 ring-1 ring-cream/20">
        <h2 className="font-display text-2xl mb-4">{item ? "Ürün Düzenle" : "Yeni Ürün"}</h2>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Field name="name" label="Ad" defaultValue={item?.name} required />
          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">Açıklama</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={item?.description}
              className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2 text-sm outline-none focus:border-cream/50"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field name="price" label="Fiyat (₺)" type="number" defaultValue={item?.price} required />
            <label className="block">
              <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">Kategori</span>
              <select
                name="category_slug"
                defaultValue={item?.category_slug}
                className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2.5 text-sm outline-none focus:border-cream/50"
              >
                {categories.filter((c) => c.slug !== "tumu").map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
          <Field name="sort_order" label="Sıra" type="number" defaultValue={item?.sort_order ?? 0} />
          <label className="block">
            <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">Görsel</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadImage(f);
              }}
              className="text-xs"
            />
            {imagePath && (
              <div className="mt-2 flex items-center gap-2">
                <img src={imagePath} alt="" className="h-12 w-12 rounded object-cover" />
                <span className="text-xs text-cream/70 break-all">{imagePath}</span>
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
          {err && <p className="text-amber-200 text-sm">{err}</p>}
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">İptal</button>
            <button disabled={busy} className="btn-primary flex-1 disabled:opacity-60" type="submit">
              {busy ? "..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
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
      <span className="block text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg bg-brand-950/60 border border-cream/15 px-3 py-2.5 text-sm outline-none focus:border-cream/50"
      />
    </label>
  );
}
