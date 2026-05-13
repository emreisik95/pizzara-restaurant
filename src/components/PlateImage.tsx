"use client";
import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  shape?: "round" | "square";
  className?: string;
  label?: string;
};

export function PlateImage({ src, alt, shape = "round", className = "" }: Props) {
  const [errored, setErrored] = useState(false);
  const showImg = src && !errored;
  const radius = shape === "round" ? "rounded-full" : "rounded-2xl";

  return (
    <div
      className={`relative overflow-hidden ${radius} ${className}`}
      style={{
        background:
          "radial-gradient(120% 120% at 30% 25%, rgba(255,255,255,0.06) 0%, rgba(20,12,8,0.18) 35%, rgba(20,12,8,0.34) 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 -10px 30px rgba(0,0,0,0.25)",
      }}
      aria-label={alt}
    >
      {showImg && (
        <img
          src={src!}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
