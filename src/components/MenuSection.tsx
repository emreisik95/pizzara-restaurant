"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { tl } from "@/lib/format";
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

const ALL_CATEGORY = "tumu";
const EASE = [0.22, 1, 0.36, 1] as const;

const headVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function MenuSection({
  categories,
  items,
}: {
  categories: CategoryDTO[];
  items: ItemDTO[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(ALL_CATEGORY);
  const [selectedItem, setSelectedItem] = useState<ItemDTO | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const detailRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.slug, category.name])),
    [categories],
  );
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>([[ALL_CATEGORY, items.length]]);
    for (const item of items) {
      counts.set(item.category_slug, (counts.get(item.category_slug) ?? 0) + 1);
    }
    return counts;
  }, [items]);
  const visibleCategories = useMemo(
    () => [
      { slug: ALL_CATEGORY, name: "Tümü" },
      ...categories.filter((category) => category.slug !== ALL_CATEGORY),
    ],
    [categories],
  );
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");
    return items.filter(
      (item) =>
        (active === ALL_CATEGORY || item.category_slug === active) &&
        (!term ||
          `${item.name} ${item.description}`
            .toLocaleLowerCase("tr")
            .includes(term)),
    );
  }, [active, items, query]);

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get(
      "kategori",
    );
    if (category && categories.some((item) => item.slug === category)) {
      setActive(category);
    }
  }, [categories]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selectedItem) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
        return;
      }
      if (event.key !== "Tab" || !detailRef.current) return;

      const focusable = Array.from(
        detailRef.current.querySelectorAll<HTMLElement>(
          "button, a[href], [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [selectedItem]);

  function openItem(item: ItemDTO) {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setSelectedItem(item);
  }

  function selectCategory(slug: string) {
    setActive(slug);
    const url = new URL(window.location.href);
    if (slug === ALL_CATEGORY) url.searchParams.delete("kategori");
    else url.searchParams.set("kategori", slug);
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="menu"
        aria-labelledby="menu-title"
        className="menu-section grain"
      >
        <div className="container-wrap relative z-10">
          <motion.header
            className="menu-intro"
            initial={false}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={headVariants}
          >
            <div>
              <p className="menu-kicker">SOFRADA BULUŞALIM</p>
              <h2 id="menu-title" className="menu-heading text-balance">
                Ne yesek?
              </h2>
            </div>
            <div className="menu-intro-copy">
              <p className="menu-intro-description">
                Canın ne çekiyorsa. Pizzalar ve sofrayı tamamlayan
                küçük mutluluklar.
              </p>
              <div className="menu-facts" aria-label="Menü bilgileri">
                <span>{items.length} lezzet</span>
                <span aria-hidden>•</span>
                <span>Fiyatlar ₺ cinsinden</span>
              </div>
            </div>
          </motion.header>

          <div className="menu-tabs-sticky">
            <nav
              className="menu-tabs no-scrollbar"
              aria-label="Menü kategorileri"
            >
              {visibleCategories.map((category) => {
                const selected = active === category.slug;
                return (
                  <motion.button
                    key={category.slug}
                    type="button"
                    onClick={(event) => {
                      selectCategory(category.slug);
                      event.currentTarget.scrollIntoView({
                        block: "nearest",
                        inline: "nearest",
                        behavior: reduce ? "instant" : "smooth",
                      });
                    }}
                    aria-pressed={selected}
                    className={`menu-tab ${selected ? "menu-tab--active" : ""}`}
                    whileHover={reduce || selected ? undefined : { y: -2 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                  >
                    <span>{category.name}</span>
                    <span
                      className="menu-tab-count"
                      aria-label={`${categoryCounts.get(category.slug) ?? 0} ürün`}
                    >
                      {categoryCounts.get(category.slug) ?? 0}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="menu-tools">
            <p className="menu-results" aria-live="polite">
              <strong>
                {active === ALL_CATEGORY
                  ? "Tüm lezzetler"
                  : categoryNames.get(active)}
              </strong>
              <span>{filtered.length} seçenek</span>
            </p>
            <div className="menu-search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                type="search"
                aria-label="Menüde ara"
                placeholder="Bir lezzet ara…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Aramayı temizle"
                  onClick={() => setQuery("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {filtered.length} ürün gösteriliyor.
          </p>

          <motion.ul layout className="menu-list">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((item, index) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  categoryName={
                    categoryNames.get(item.category_slug) ?? item.category_slug
                  }
                  index={index}
                  reduce={reduce}
                  onOpen={() => openItem(item)}
                />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.li
                className="menu-empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>
                  {query
                    ? `“${query}” için bir lezzet bulunamadı.`
                    : "Bu bölümde henüz bir lezzet yok."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    selectCategory(ALL_CATEGORY);
                  }}
                >
                  Tüm menüyü gör ↗
                </button>
              </motion.li>
            )}
          </motion.ul>
        </div>
      </section>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedItem && (
              <MenuDetail
                item={selectedItem}
                categoryName={
                  categoryNames.get(selectedItem.category_slug) ??
                  selectedItem.category_slug
                }
                detailRef={detailRef}
                closeButtonRef={closeButtonRef}
                onClose={() => setSelectedItem(null)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </MotionConfig>
  );
}

function MenuItem({
  item,
  categoryName,
  index,
  reduce,
  onOpen,
}: {
  item: ItemDTO;
  categoryName: string;
  index: number;
  reduce: boolean | null;
  onOpen: () => void;
}) {
  return (
    <motion.li
      layout
      className="menu-item"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.16 } }}
      transition={{
        duration: 0.42,
        delay: Math.min(index * 0.025, 0.22),
        ease: EASE,
      }}
      whileHover={reduce ? undefined : { y: -3 }}
    >
      <article className="menu-item-inner">
        <PlateImage
          src={item.image}
          alt={item.name}
          shape="square"
          className="menu-item-photo"
          sizes="(max-width: 640px) 108px, 156px"
          fallbackLabel="Fotoğraf yakında"
        />

        <div className="menu-item-copy">
          <p className="menu-item-category">{categoryName}</p>
          <div className="menu-item-title-row">
            <h3 className="menu-item-title text-pretty">{item.name}</h3>
            <span className="menu-item-dots" aria-hidden />
            <p className="menu-item-price">₺{tl(item.price)}</p>
          </div>
          {item.description.trim() && (
            <p className="menu-item-description text-pretty">
              {item.description}
            </p>
          )}
          <span className="menu-item-detail-cue" aria-hidden>
            Detayı Gör <span>↗</span>
          </span>
        </div>
        <button
          type="button"
          className="menu-item-open"
          onClick={onOpen}
          aria-label={`${item.name} ayrıntılarını görüntüle`}
        >
          <span className="sr-only">{item.name} ayrıntılarını görüntüle</span>
        </button>
      </article>
    </motion.li>
  );
}

function MenuDetail({
  item,
  categoryName,
  detailRef,
  closeButtonRef,
  onClose,
}: {
  item: ItemDTO;
  categoryName: string;
  detailRef: React.RefObject<HTMLDivElement>;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}) {
  const titleId = `menu-detail-title-${item.id}`;
  const descriptionId = `menu-detail-description-${item.id}`;

  return (
    <motion.div
      className="menu-detail-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        ref={detailRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={item.description.trim() ? descriptionId : undefined}
        className="menu-detail-sheet"
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="menu-detail-close"
          aria-label="Ürün ayrıntılarını kapat"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="menu-detail-grid">
          <PlateImage
            src={item.image}
            alt={item.name}
            shape="square"
            className="menu-detail-photo"
            sizes="(max-width: 767px) calc(100vw - 48px), 430px"
            fallbackLabel="Fotoğraf yakında"
          />
          <div className="menu-detail-copy">
            <p className="menu-detail-category">{categoryName}</p>
            <h3 id={titleId} className="menu-detail-title text-balance">
              {item.name}
            </h3>
            <p className="menu-detail-price">₺{tl(item.price)}</p>
            {item.description.trim() && (
              <p
                id={descriptionId}
                className="menu-detail-description text-pretty"
              >
                {item.description}
              </p>
            )}
            <p className="menu-allergen-note">
              Alerjen bilgisi için lütfen ekibimize danışın.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="menu-detail-return"
            >
              Menüye Dön
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
