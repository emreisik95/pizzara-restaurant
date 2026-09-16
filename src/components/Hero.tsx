"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  hours: string;
  reservationEnabled: boolean;
};
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  title,
  subtitle,
  image,
  hours,
  reservationEnabled,
}: Props) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 90, damping: 20 });
  const rotateY = useSpring(mx, { stiffness: 90, damping: 20 });
  const source =
    !image || image.startsWith("/placeholder/") || failed
      ? "/images/pizzara-hero.webp"
      : image;
  const lines = title.split("\n").filter(Boolean);

  return (
    <section
      id="hero"
      className="poster-hero"
      ref={ref}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        mx.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
        my.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -10);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="poster-grid container-wrap">
        <div className="poster-copy">
          <p className="poster-eyebrow">
            <span /> İTALYAN RUHU. PIZZARA YORUMU.
          </p>
          <h1 className="poster-title">
            {lines.map((line, i) => (
              <span className="poster-line" key={i}>
                <span style={{ animationDelay: `${i * 0.1}s` }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="poster-subtitle">{subtitle}</p>
          <div className="poster-actions">
            <a className="poster-menu-link" href="#menu">
              Menüyü keşfet <span aria-hidden>↘</span>
            </a>
            <a
              className="poster-secondary"
              href={reservationEnabled ? "#reservation" : "#contact"}
            >
              {reservationEnabled ? "Masa ayırt" : "Bize ulaş"}{" "}
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
        <div className="pizza-stage">
          <span className="pizza-orbit" aria-hidden />
          <motion.div
            className="pizza-object"
            style={reduce ? undefined : { rotateX, rotateY }}
            initial={false}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <div className="pizza-float">
              <Image
                src={source}
                alt="Fesleğen ve mozzarella ile İtalyan pizzası"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 58vw"
                quality={86}
                className="pizza-image"
                onError={() => setFailed(true)}
              />
            </div>
          </motion.div>
          <div className="appetito-seal" aria-hidden>
            <span>BUON</span>
            <span>APPETITO!</span>
            <svg viewBox="0 0 40 18">
              <path
                d="M3 3 Q20 24 37 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="pizza-note" aria-hidden>
            Bir dilim daha?
          </span>
        </div>
        <div className="poster-bottom">
          <span>{hours}</span>
          <a href="#menu">
            Güzel bir sofraya doğru <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
      <div className="trattoria-strip" aria-hidden>
        <span>PIZZA</span>
        <i>e</i>
        <span>PANUOZZO</span>
        <i>e</i>
        <span>BUONA VITA</span>
        <span className="strip-star">✳</span>
        <span>PIZZARA</span>
        <span className="strip-star">✳</span>
        <span>PIZZA</span>
        <i>e</i>
        <span>PANUOZZO</span>
        <i>e</i>
        <span>BUONA VITA</span>
      </div>
    </section>
  );
}
