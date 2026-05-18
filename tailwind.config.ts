import type { Config } from "tailwindcss";

const rgbVar = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rosso: {
          DEFAULT: rgbVar("rosso"),
          dark: rgbVar("rosso-dark"),
          50: "#fbeeee",
          100: "#f6d2d0",
          200: "#ecaaa6",
          300: "#e07f7a",
          400: "#d35652",
          500: "#c8302c",
          600: "#a82622",
          700: "#891f1c",
          800: "#6b1816",
          900: "#4f1110",
          950: "#2e0807",
        },
        bosco: {
          DEFAULT: rgbVar("bosco"),
          dark: rgbVar("bosco-dark"),
          50: "#eef3ef",
          100: "#d4dfd6",
          200: "#a8bfac",
          300: "#7c9e83",
          400: "#577a5e",
          500: "#3d5840",
          600: "#314934",
          700: "#283b2b",
          800: "#1e2d21",
          900: "#152019",
          950: "#0c1310",
        },
        crema: {
          DEFAULT: rgbVar("crema"),
          light: rgbVar("crema-light"),
          50: "#fbf6e8",
          100: "#f7eddb",
          200: "#f1e6cf",
          300: "#e4d3ad",
          400: "#cdb583",
          500: "#b69561",
          600: "#94774b",
          700: "#735c3a",
          800: "#52422a",
          900: "#34291a",
        },
        ink: {
          DEFAULT: rgbVar("ink"),
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "'Antonio'", "Impact", "sans-serif"],
        serif: ["var(--font-serif)", "'Cormorant Garamond'", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wider2: "0.18em",
      },
      boxShadow: {
        sticker: "0 18px 40px -18px rgba(20, 12, 8, 0.55)",
        card: "0 28px 60px -28px rgba(20, 12, 8, 0.6)",
        sunken: "inset 0 2px 0 rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
