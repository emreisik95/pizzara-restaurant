"use client";
import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(hover: none)")?.matches ?? false);

type DOEStatic = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export type DeviceTilt = { x: MotionValue<number>; y: MotionValue<number> };

export function useDeviceTilt(): DeviceTilt {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isTouchDevice()) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (!("DeviceOrientationEvent" in window)) return;

    let targetX = 0;
    let targetY = 0;
    let raf = 0;
    let attached = false;

    const onTilt = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left-right (-90..90)
      const beta = e.beta ?? 0; // front-back (-180..180)
      targetX = Math.max(-1, Math.min(1, gamma / 25));
      targetY = Math.max(-1, Math.min(1, (beta - 45) / 25));
    };

    const loop = () => {
      const cx = x.get();
      const cy = y.get();
      x.set(cx + (targetX - cx) * 0.12);
      y.set(cy + (targetY - cy) * 0.12);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (attached) return;
      attached = true;
      window.addEventListener("deviceorientation", onTilt);
      raf = requestAnimationFrame(loop);
    };

    const DOE = window.DeviceOrientationEvent as DOEStatic;
    let askHandler: (() => Promise<void>) | null = null;

    if (typeof DOE.requestPermission === "function") {
      askHandler = async () => {
        try {
          const r = await DOE.requestPermission!();
          if (r === "granted") start();
        } catch {
          // ignore
        }
      };
      window.addEventListener("touchend", askHandler, { once: true });
      window.addEventListener("click", askHandler, { once: true });
    } else {
      start();
    }

    return () => {
      if (attached) window.removeEventListener("deviceorientation", onTilt);
      if (askHandler) {
        window.removeEventListener("touchend", askHandler);
        window.removeEventListener("click", askHandler);
      }
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y]);

  return { x, y };
}
