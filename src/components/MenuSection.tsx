"use client";
import { useMemo, useState } from "react";
import { tl } from "@/lib/format";
import { Sparkle } from "./Sparkle";
import { PlateImage } from "./PlateImage";

export type CategoryDTO = { slug: string; name: string };
export type ItemDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_slug: string;
  image: string | null;
};

const CARD_TONES = ["red", "green", "cream"] as const;
type Tone = (typeof CARD_TONES)[number];

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
    <section id="menu" className="relative bg-crema-light text-ink py-20 md:py-28 grain">
      <div className="container-wrap">
        <div className="text-center fade-up">
          <div className="ornament-line text-rosso mb-4">
            <Sparkle size={16} className="text-rosso" />
          </div>
          <h2 className="section-title text-rosso uppercase">Menü</h2>
          <p className="font-serif italic text-bosco-700 mt-2 text-lg md:text-xl">
            En sevilen lezzetlerimiz
          </p>
        </div>

        <div className="mt-10 flex justify-start md:justify-center gap-1 md:gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {categories.map((c) => {
            const on = active === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`tab-pill shrink-0 ${on ? "tab-pill--active" : "tab-pill--idle"}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <ul className="mt-10 md:mt-14 grid gap-5 md:gap-6 max-w-3xl mx-auto">
          {filtered.map((item, idx) => {
            const tone: Tone = CARD_TONES[idx % CARD_TONES.length];
            return <MenuCard key={item.id} item={item} tone={tone} />;
          })}
          {filtered.length === 0 && (
            <li className="text-center text-ink/60 py-10">Bu kategoride ürün yok.</li>
          )}
        </ul>
      </div>
    </section>
  );
}

function MenuCard({ item, tone }: { item: ItemDTO; tone: Tone }) {
  const klass =
    tone === "red"
      ? "menu-card menu-card--red"
      : tone === "green"
      ? "menu-card menu-card--green"
      : "menu-card menu-card--cream";

  const sparkleColor =
    tone === "cream" ? "text-rosso" : "text-crema";

  return (
    <li className={`${klass} fade-up`}>
      <div className="pl-1 md:pl-2">
        <PlateImage src={item.image} alt={item.name} shape="round" className="plate" label="Yükle" />
      </div>
      <div className="min-w-0 py-2 md:py-3 pr-2 relative">
        <h3 className="font-display uppercase text-[clamp(1.4rem,4.6vw,2.2rem)] leading-tight tracking-tightest">
          {item.name}
        </h3>
        <p className="mt-1 md:mt-2 text-sm md:text-base leading-snug opacity-90 line-clamp-2 max-w-[42ch]">
          {item.description}
        </p>
        <p className="mt-2 md:mt-3 font-display text-2xl md:text-3xl tracking-tight">
          ₺{tl(item.price)}
        </p>

        <Sparkle size={12} className={`absolute -right-1 top-2 ${sparkleColor}`} />
        <Sparkle size={10} className={`absolute -right-2 bottom-4 ${sparkleColor}`} rotate={30} />
      </div>
    </li>
  );
}
