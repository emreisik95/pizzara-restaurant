"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

function parseIngredients(desc: string): string[] {
  if (!desc) return [];
  const trimmed = desc.trim().replace(/\.$/, "");
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function MenuSection({
  categories,
  items,
}: {
  categories: CategoryDTO[];
  items: ItemDTO[];
}) {
  const [active, setActive] = useState("tumu");
  const [lightbox, setLightbox] = useState<ItemDTO | null>(null);
  const reduce = useReducedMotion();
  const filtered = useMemo(
    () => (active === "tumu" ? items : items.filter((i) => i.category_slug === active)),
    [active, items]
  );

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const chips = lightbox ? parseIngredients(lightbox.description) : [];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

        <div className="menu-tabs-sticky mt-10 -mx-5 px-0">
          <motion.div
            className="overflow-x-auto no-scrollbar snap-x snap-mandatory py-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
            }}
          >
            <div className="flex w-max mx-auto gap-1 md:gap-2 px-12 sm:px-16">
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
            </div>
          </motion.div>
        </div>

        <ul className="mt-10 md:mt-14 grid gap-5 md:gap-6 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => {
              const tone: Tone = CARD_TONES[idx % CARD_TONES.length];
              return (
                <MenuCard
                  key={item.id}
                  item={item}
                  tone={tone}
                  idx={idx}
                  reduce={reduce}
                  onOpen={() => setLightbox(item)}
                  priority={idx < 3}
                />
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.li
              className="text-center py-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-rosso/10 flex items-center justify-center mb-3">
                <Sparkle size={20} className="text-rosso" />
              </div>
              <p className="font-serif italic text-lg text-ink/70">Bu menü bölümü henüz fırında</p>
            </motion.li>
          )}
        </ul>
      </div>

      {mounted && createPortal(
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.name}
          >
            <motion.div
              className="absolute inset-0 bg-ink/75 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-full max-w-md bg-crema-light text-ink rounded-[28px] shadow-2xl overflow-visible"
              initial={{ y: 30, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.97, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.36, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Kapat"
                className="absolute right-3 top-3 z-20 h-9 w-9 rounded-full bg-ink/70 text-crema flex items-center justify-center hover:bg-ink/90 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>

              <motion.div
                layoutId={`plate-${lightbox.id}`}
                className="relative -mt-16 mx-auto plate-lg"
                transition={{ duration: 0.45, ease: EASE }}
              >
                <PlateImage
                  src={lightbox.image}
                  alt={lightbox.name}
                  shape="round"
                  className="w-full h-full"
                  sizes="(max-width: 640px) 220px, 260px"
                />
              </motion.div>

              <div className="px-6 pt-4 pb-6 sm:px-7 sm:pt-5 sm:pb-7 text-center">
                <motion.h3
                  layoutId={`name-${lightbox.id}`}
                  className="font-display uppercase text-3xl sm:text-4xl leading-tight text-rosso"
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {lightbox.name}
                </motion.h3>

                {chips.length > 1 ? (
                  <motion.ul
                    className="mt-4 flex flex-wrap justify-center gap-1.5"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
                    }}
                  >
                    {chips.map((c, i) => (
                      <motion.li
                        key={i}
                        className="px-3 py-1 rounded-full bg-bosco/10 text-bosco-dark text-xs font-medium tracking-wide"
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
                        }}
                      >
                        {c}
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  lightbox.description && (
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink/80">
                      {lightbox.description}
                    </p>
                  )
                )}

                <motion.p
                  layoutId={`price-${lightbox.id}`}
                  className="mt-5 font-display text-4xl tracking-tight text-bosco"
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  ₺{tl(lightbox.price)}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </section>
  );
}

function MenuCard({
  item,
  tone,
  idx,
  reduce,
  onOpen,
  priority,
}: {
  item: ItemDTO;
  tone: Tone;
  idx: number;
  reduce: boolean | null;
  onOpen: () => void;
  priority?: boolean;
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
      className={`${klass} cursor-pointer group`}
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{
        duration: 0.45,
        delay: Math.min(idx * 0.05, 0.35),
        ease: EASE,
      }}
      whileHover={reduce ? undefined : { y: -4, scale: 1.005 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <motion.div layoutId={`plate-${item.id}`} className="pl-1 md:pl-2" transition={{ duration: 0.45, ease: EASE }}>
        <PlateImage
          src={item.image}
          alt={item.name}
          shape="round"
          className="plate"
          priority={priority}
          sizes="(max-width: 640px) 220px, 260px"
        />
      </motion.div>
      <div className="min-w-0 py-4 md:py-5 pr-2 relative">
        <motion.h3
          layoutId={`name-${item.id}`}
          className="font-display uppercase text-[clamp(1.3rem,4.2vw,2rem)] leading-[1.04] tracking-[0.005em]"
          transition={{ duration: 0.45, ease: EASE }}
        >
          {item.name}
        </motion.h3>
        <p className="mt-3 md:mt-3 text-[13px] md:text-sm leading-relaxed opacity-90 md:line-clamp-2 md:max-w-[42ch]">
          {item.description}
        </p>
        <motion.p
          layoutId={`price-${item.id}`}
          className="mt-4 md:mt-4 font-display text-2xl md:text-3xl tracking-tight"
          transition={{ duration: 0.45, ease: EASE }}
        >
          ₺{tl(item.price)}
        </motion.p>

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
