"use client";
import { Sparkle } from "./Sparkle";
import { PlateImage } from "./PlateImage";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "motion/react";
import { useRef } from "react";
import { useDeviceTilt } from "@/lib/useDeviceTilt";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const lineUp: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

const plateIn: Variants = {
  hidden: { x: 80, opacity: 0, scale: 0.92 },
  show: { x: 0, opacity: 1, scale: 1, transition: { duration: 1.1, ease: EASE, delay: 0.05 } },
};

const sparkleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.6, delay: 1.0, ease: EASE } },
};

export function Hero({ eyebrow, title, subtitle, image }: Props) {
  const lines = title.split("\n").filter(Boolean);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const plateY = useTransform(scrollY, [0, 700], reduce ? [0, 0] : [0, 110]);

  const tilt = useDeviceTilt();
  const plateTx = useTransform(tilt.x, (v) => v * 16);
  const plateTy = useTransform(tilt.y, (v) => v * 14);
  const plateRotY = useTransform(tilt.x, (v) => v * 6);
  const plateRotX = useTransform(tilt.y, (v) => -v * 6);
  const sparkleTx = useTransform(tilt.x, (v) => -v * 12);
  const sparkleTy = useTransform(tilt.y, (v) => -v * 10);
  const sparkleTx2 = useTransform(tilt.x, (v) => -v * 18);
  const sparkleTy2 = useTransform(tilt.y, (v) => -v * 14);

  return (
    <motion.section
      ref={ref}
      id="hero"
      className="relative bg-bosco text-crema overflow-hidden grain"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Pasta image — bleeds off the right edge */}
      <motion.div
        className="absolute inset-y-0 right-0 w-[78%] md:w-[60%] z-0 pointer-events-none"
        variants={plateIn}
        style={{ y: plateY, perspective: 1200 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            x: plateTx,
            y: plateTy,
            rotateY: plateRotY,
            rotateX: plateRotX,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="absolute top-1/2 right-[-22%] md:right-[-14%] w-[125%] md:w-[110%] aspect-square"
            style={{ y: "-50%" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <PlateImage
              src={image}
              alt="Pizzara signature pasta"
              shape="round"
              priority
              sizes="(max-width: 768px) 90vw, 50vw"
              className="w-full h-full ring-0 shadow-[0_50px_100px_-32px_rgba(0,0,0,0.7)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Sparkle accents (twinkle loop) — counter-tilt for depth */}
      <motion.div className="absolute top-16 left-[38%]" style={{ x: sparkleTx, y: sparkleTy }}>
        <motion.div
          variants={sparkleIn}
          animate={reduce ? "show" : { scale: [0.6, 1, 0.6], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <Sparkle size={18} className="text-crema/80" rotate={20} />
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-24 left-[6%]" style={{ x: sparkleTx2, y: sparkleTy2 }}>
        <motion.div
          variants={sparkleIn}
          animate={reduce ? "show" : { scale: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Sparkle size={14} className="text-crema/70" rotate={45} />
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute top-[40%] right-[8%] hidden md:block"
        style={{ x: sparkleTx, y: sparkleTy }}
      >
        <motion.div
          variants={sparkleIn}
          animate={reduce ? "show" : { scale: [0.6, 1, 0.6], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        >
          <Sparkle size={22} className="text-crema/70" />
        </motion.div>
      </motion.div>

      <div className="container-wrap relative z-10 grid md:grid-cols-2 items-center gap-8 pt-14 pb-20 md:py-32">
        <div className="max-w-xl">
          <motion.div className="flex items-center gap-3 mb-6 md:mb-8" variants={fadeUp}>
            <span className="section-eyebrow tracking-[0.36em]">{eyebrow}</span>
            <Sparkle size={12} className="text-crema/80" />
            <span className="inline-block h-px w-10 md:w-16 bg-crema/30" />
          </motion.div>

          <h1 className="font-display uppercase text-[clamp(2.5rem,9.5vw,5.5rem)] leading-[1.05] tracking-[0.005em]">
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span className="block" variants={lineUp}>
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 md:mt-8 max-w-md text-crema/90 text-base md:text-lg leading-relaxed"
            variants={fadeUp}
          >
            {subtitle}
          </motion.p>

          <motion.div className="mt-7 md:mt-9" variants={fadeUp}>
            <motion.span
              className="relative inline-flex"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <a href="#menu" className="pill-cta pill-cta--red">
                Menüyü Keşfet
              </a>
              <Sparkle size={20} className="sparkle-accent text-crema" />
            </motion.span>
          </motion.div>
        </div>

        {/* Spacer for image column on md+ */}
        <div className="hidden md:block" aria-hidden />
      </div>

      {/* Scroll cue */}
      <motion.div
        className="relative z-10 pb-6 md:pb-8 flex justify-center text-crema/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <a
          href="#menu"
          aria-label="Aşağı kaydır"
          className="inline-flex items-center justify-center h-9 w-9 rounded-full ring-1 ring-crema/30 hover:bg-crema/10 transition"
        >
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={reduce ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </a>
      </motion.div>
    </motion.section>
  );
}
