import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fbeeee",
          100: "#f5d0d0",
          500: "#c8302c",
          600: "#a82622",
          700: "#8b1e1b",
          800: "#6f1815",
          900: "#581210",
          950: "#3e0c0a",
        },
        cream: "#f4e9d8",
        gold: "#d6a55a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 30px 60px -20px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [],
} satisfies Config;
