"use client";
import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  shape?: "round" | "square";
  className?: string;
  label?: string;
};

export function PlateImage({ src, alt, shape = "round", className = "", label }: Props) {
  const [errored, setErrored] = useState(false);
  const showImg = src && !errored;
  const radius = shape === "round" ? "rounded-full" : "rounded-2xl";

  return (
    <div
      className={`relative overflow-hidden ${radius} ${className}`}
      style={{ background: "rgba(20,12,8,0.18)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}
    >
      {showImg ? (
        <img
          src={src!}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs uppercase tracking-[0.28em] text-current opacity-50 text-center px-2">
          {label ?? "Görsel"}
        </div>
      )}
    </div>
  );
}
