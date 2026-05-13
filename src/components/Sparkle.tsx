type Props = {
  size?: number;
  className?: string;
  rotate?: number;
  "aria-hidden"?: boolean;
};

export function Sparkle({ size = 22, className = "", rotate = 0 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden
    >
      <path
        d="M12 1 L13.4 8.2 C13.7 9.7 14.3 10.3 15.8 10.6 L23 12 L15.8 13.4 C14.3 13.7 13.7 14.3 13.4 15.8 L12 23 L10.6 15.8 C10.3 14.3 9.7 13.7 8.2 13.4 L1 12 L8.2 10.6 C9.7 10.3 10.3 9.7 10.6 8.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StarBurst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g fill="currentColor">
        <circle cx="32" cy="32" r="2.4" />
        <path d="M32 6v18M32 40v18M6 32h18M40 32h18M14 14l12 12M38 38l12 12M50 14L38 26M14 50l12-12" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </g>
    </svg>
  );
}
