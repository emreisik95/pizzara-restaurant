"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  shape?: "round" | "square";
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackLabel?: string;
};

export function PlateImage({
  src,
  alt,
  shape = "round",
  className = "",
  priority,
  sizes,
  fallbackLabel,
}: Props) {
  const [errored, setErrored] = useState(false);
  const showImage =
    Boolean(src) && !src?.startsWith("/placeholder/") && !errored;
  const radius = shape === "round" ? "rounded-full" : "rounded-[20px]";

  return (
    <div
      className={`plate-surface relative overflow-hidden ${radius} ${className}`}
      aria-label={showImage ? undefined : `${alt} için fotoğraf yakında`}
      role={showImage ? undefined : "img"}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 640px) 220px, 260px"}
          quality={86}
          className="plate-img object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="photo-placeholder" aria-hidden="true">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <circle cx="40" cy="40" r="27" />
            <circle cx="40" cy="40" r="21" />
            <path d="M5 18v15m4-15v15m4-15v15M5 30q4 10 8 0M9 37v25M72 18v44m0-44q-10 15 0 22" />
          </svg>
          {fallbackLabel && <span>Fotoğraf yakında</span>}
        </div>
      )}
    </div>
  );
}
