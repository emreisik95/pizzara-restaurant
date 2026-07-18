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
  const showImage = Boolean(src) && !errored;
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
          className="plate-img object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <>
          <Image
            src="/placeholder/menu-placeholder.webp"
            alt=""
            fill
            priority={priority}
            sizes={sizes ?? "(max-width: 640px) 220px, 260px"}
            quality={72}
            className="object-cover scale-110 blur-[2px] saturate-[0.7] brightness-[0.62]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" aria-hidden />
          {fallbackLabel && (
            <span className="fallback-photo-label">
              <span className="fallback-photo-mark" aria-hidden>✦</span>
              {fallbackLabel}
            </span>
          )}
        </>
      )}
    </div>
  );
}
