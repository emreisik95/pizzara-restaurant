"use client";

export function PlateImage({ src, alt }: { src: string; alt: string }) {
  return (
    <picture>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-200/30 via-brand-600/40 to-brand-900/70">
        <svg width="120" height="120" viewBox="0 0 64 64" className="text-cream/80" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="32" cy="32" r="26" />
          <circle cx="32" cy="32" r="20" />
          <path d="M22 30c2 3 4 4 6 4M40 26c-2 1-3 2-3 4M30 40c1 2 3 3 5 3" />
        </svg>
      </div>
    </picture>
  );
}
