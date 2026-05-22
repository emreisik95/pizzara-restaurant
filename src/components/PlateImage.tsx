"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  shape?: "round" | "square";
  className?: string;
  label?: string;
  priority?: boolean;
  sizes?: string;
};

export function PlateImage({
  src,
  alt,
  shape = "round",
  className = "",
  priority,
  sizes,
}: Props) {
  const [errored, setErrored] = useState(false);
  const showImg = src && !errored;
  const radius = shape === "round" ? "rounded-full" : "rounded-2xl";
  const initial = alt?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div
      className={`plate-surface relative overflow-hidden ${radius} ${className}`}
      style={{
        background:
          "radial-gradient(130% 130% at 30% 22%, rgba(255,255,255,0.08) 0%, rgba(20,12,8,0.32) 32%, rgba(20,12,8,0.55) 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 -16px 40px rgba(0,0,0,0.35)",
      }}
      aria-label={alt}
    >
      {showImg ? (
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 640px) 220px, 260px"}
          quality={85}
          className="plate-img object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-display text-crema/80 select-none"
          style={{
            fontSize: "min(58%, 5rem)",
            letterSpacing: "0.02em",
            textShadow: "0 2px 12px rgba(0,0,0,0.45)",
          }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
