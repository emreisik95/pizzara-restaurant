"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { PlateImage } from "./PlateImage";
import { Sparkle } from "./Sparkle";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  hours: string;
  reservationEnabled: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const lineUp: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.82, ease: EASE } },
};
const fadeUp: Variants = {
  hidden: { y: 16, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.58, ease: EASE } },
};

export function Hero({ eyebrow, title, subtitle, image, hours, reservationEnabled }: Props) {
  const lines = title.split("\n").filter(Boolean);
  const reduce = useReducedMotion();

  return (
    <motion.section
      id="hero"
      className="hero-section grain"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div
        className="hero-plate"
        initial={{ opacity: 0, x: 70, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.05, ease: EASE }}
        aria-hidden
      >
        <motion.div
          className="h-full w-full"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        >
          <PlateImage
            src={image}
            alt="Pizzara imza pizzası"
            shape="round"
            priority
            sizes="(max-width: 768px) 105vw, 58vw"
            className="h-full w-full shadow-[0_48px_90px_-30px_rgba(0,0,0,0.72)]"
          />
        </motion.div>
      </motion.div>

      <div className="hero-scrim" aria-hidden />
      <Sparkle size={17} className="hero-sparkle hero-sparkle--one text-crema/80" rotate={18} />
      <Sparkle size={11} className="hero-sparkle hero-sparkle--two text-crema/70" rotate={42} />

      <div className="container-wrap hero-layout">
        <div className="hero-copy">
          <motion.div className="hero-eyebrow" variants={fadeUp}>
            <span>{eyebrow}</span>
            <span aria-hidden className="hero-eyebrow-line" />
          </motion.div>

          <h1 className="hero-title text-balance">
            {lines.map((line, index) => (
              <span key={index} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span className="block" variants={lineUp}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="hero-subtitle text-pretty" variants={fadeUp}>
            {subtitle}
          </motion.p>

          <motion.div className="hero-facts" variants={fadeUp}>
            <span className="hero-fact">
              <ClockIcon />
              {hours}
            </span>
            <span aria-hidden className="hero-fact-divider" />
            <a href="#contact" className="hero-fact hero-fact-link">
              <PinIcon />
              Konum &amp; İletişim
            </a>
          </motion.div>

          <motion.div className="hero-actions" variants={fadeUp}>
            <motion.a
              href="#menu"
              className="pill-cta pill-cta--red"
              whileHover={reduce ? undefined : { scale: 1.025 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              Menüyü Gör
            </motion.a>
            <a href={reservationEnabled ? "#reservation" : "#contact"} className="hero-secondary-link">
              {reservationEnabled ? "Masa Ayırt" : "Bize Ulaş"}
              <span aria-hidden>↗</span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s6-6.5 6-11a6 6 0 1 0-12 0c0 4.5 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}
