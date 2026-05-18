"use client";
import { useMemo, useState } from "react";
import { tl } from "@/lib/format";
import { Sparkle } from "./Sparkle";
import { PlateImage } from "./PlateImage";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

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

const EASE = [0.22, 1, 0.36, 1] as const;

const headVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function MenuSection({
  categories,
  items,
}: {
  categories: CategoryDTO[];
  items: ItemDTO[];
}) {
  const [active, setActive] = useState("tumu");
  const reduce = useReducedMotion();
  const filtered = useMemo(
    () => (active === "tumu" ? items : items.filter((i) => i.category_slug === active)),
    [active, items]
  );

  return (
    <section id="menu" className="relative bg-crema-light text-ink py-20 md:py-28 grain">
      <div className="container-wrap">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={headVariants}
        >
          <div className="ornament-line text-rosso mb-4">
            <Sparkle size={16} className="text-rosso" />
          </div>
          <h2 className="section-title text-rosso uppercase">Menü</h2>
          <p className="font-serif italic text-bosco-700 mt-2 text-lg md:text-xl">
            En sevilen lezzetlerimiz
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex justify-start md:justify-center gap-1 md:gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x snap-mandatory"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
          }}
        >
          {categories.map((c) => {
            const on = active === c.slug;
            return (
              <motion.button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`tab-pill shrink-0 snap-start relative ${on ? "tab-pill--active" : "tab-pill--idle"}`}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
                }}
                whileHover={reduce || on ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.96 }}
              >
                {on && (
                  <motion.span
                    layoutId="tab-pill-bg"
                    className="absolute inset-0 rounded-full bg-rosso -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{c.name}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <ul className="mt-10 md:mt-14 grid gap-5 md:gap-6 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => {
              const tone: Tone = CARD_TONES[idx % CARD_TONES.length];
              return <MenuCard key={item.id} item={item} tone={tone} idx={idx} reduce={reduce} />;
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.li
              className="text-center text-ink/60 py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Bu kategoride ürün yok.
            </motion.li>
          )}
        </ul>
      </div>
    </section>
  );
}

function MenuCard({
  item,
  tone,
  idx,
  reduce,
}: {
  item: ItemDTO;
  tone: Tone;
  idx: number;
  reduce: boolean | null;
}) {
  const klass =
    tone === "red"
      ? "menu-card menu-card--red"
      : tone === "green"
      ? "menu-card menu-card--green"
      : "menu-card menu-card--cream";

  const accentColor = tone === "cream" ? "text-rosso" : "text-crema";

  return (
    <motion.li
      layout
      className={klass}
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{
        duration: 0.45,
        delay: Math.min(idx * 0.05, 0.35),
        ease: EASE,
      }}
      whileHover={reduce ? undefined : { y: -4, scale: 1.005 }}
    >
      <div className="pl-1 md:pl-2">
        <PlateImage src={item.image} alt={item.name} shape="round" className="plate" />
      </div>
      <div className="min-w-0 py-2 md:py-3 pr-2 relative">
        <h3 className="font-display uppercase text-[clamp(1.3rem,4.2vw,2rem)] leading-[1.04] tracking-[0.005em]">
          {item.name}
        </h3>
        <p className="mt-1 md:mt-2 text-[13px] md:text-sm leading-snug opacity-90 line-clamp-2 max-w-[42ch]">
          {item.description}
        </p>
        <p className="mt-2 md:mt-3 font-display text-2xl md:text-3xl tracking-tight">
          ₺{tl(item.price)}
        </p>

        <motion.span
          aria-hidden
          className={`absolute -right-2 top-1 inline-flex items-center justify-center h-6 w-6 ${accentColor} opacity-80`}
          whileHover={reduce ? undefined : { rotate: 90, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
        <Sparkle size={10} className={`absolute -right-2 bottom-5 ${accentColor} opacity-70`} rotate={30} />
      </div>
    </motion.li>
  );
}
