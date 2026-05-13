"use client";
import { useMemo, useState } from "react";
import { tl } from "@/lib/format";

export type CategoryDTO = { slug: string; name: string };
export type ItemDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_slug: string;
  image: string | null;
};

export function MenuSection({
  categories,
  items,
}: {
  categories: CategoryDTO[];
  items: ItemDTO[];
}) {
  const [active, setActive] = useState("tumu");
  const filtered = useMemo(
    () => (active === "tumu" ? items : items.filter((i) => i.category_slug === active)),
    [active, items]
  );

  return (
    <section id="menu" className="pt-2 pb-16">
      <div className="container-app">
        <h2 className="text-center font-display text-4xl">MENÜ</h2>
        <p className="text-center text-cream/70 text-xs tracking-[0.28em] uppercase mt-2">
          En sevilen lezzetlerimiz
        </p>

        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {categories.map((c) => {
            const on = active === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition ring-1 ${
                  on
                    ? "tab-active ring-cream"
                    : "bg-brand-900/40 text-cream/80 ring-cream/15 hover:bg-brand-900/70"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <ul className="mt-6 grid gap-4">
          {filtered.map((item) => (
            <li key={item.id} className="card-menu p-4 fade-in">
              <div className="flex items-center gap-4">
                <Thumb src={item.image} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                  <p className="mt-1 text-cream/75 text-[13px] line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-gold">₺{tl(item.price)}</p>
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-center text-cream/60 py-10">Bu kategoride ürün yok.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

function Thumb({ src }: { src: string | null }) {
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-cream/15 bg-brand-700">
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
        />
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center text-cream/70">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9" />
          <path d="M7 12c1 2 3 3 5 3M14 9c-1 0-2 1-2 2" />
        </svg>
      </div>
    </div>
  );
}
