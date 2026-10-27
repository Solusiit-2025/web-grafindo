import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Backward-compatible aliases used by older admin screens.
        theme: {
          primary: "rgb(var(--c-primary) / <alpha-value>)",
          secondary: "rgb(var(--c-secondary) / <alpha-value>)",
          accent: "rgb(var(--c-accent) / <alpha-value>)",
          neutral: "#6B7280",
          surface: "rgb(var(--c-surface) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          900: "rgb(var(--c-primary-900) / <alpha-value>)",
          800: "rgb(var(--c-primary-800) / <alpha-value>)",
          700: "rgb(var(--c-primary-700) / <alpha-value>)",
          600: "rgb(var(--c-primary-600) / <alpha-value>)",
          500: "rgb(var(--c-primary-500) / <alpha-value>)",
          400: "rgb(var(--c-primary-400) / <alpha-value>)",
          300: "rgb(var(--c-primary-300) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--c-secondary) / <alpha-value>)",
          700: "rgb(var(--c-secondary-700) / <alpha-value>)",
          500: "rgb(var(--c-secondary-500) / <alpha-value>)",
          400: "rgb(var(--c-secondary-400) / <alpha-value>)",
          300: "rgb(var(--c-secondary-300) / <alpha-value>)",
          100: "rgb(var(--c-secondary-100) / <alpha-value>)",
          50: "rgb(var(--c-secondary-50) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          700: "rgb(var(--c-accent-700) / <alpha-value>)",
          500: "rgb(var(--c-accent-500) / <alpha-value>)",
          400: "rgb(var(--c-accent-400) / <alpha-value>)",
          300: "rgb(var(--c-accent-300) / <alpha-value>)",
          100: "rgb(var(--c-accent-100) / <alpha-value>)",
          50: "rgb(var(--c-accent-50) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)",
          100: "rgb(var(--c-surface-100) / <alpha-value>)",
          200: "rgb(var(--c-surface-200) / <alpha-value>)",
          300: "rgb(var(--c-surface-300) / <alpha-value>)",
          400: "rgb(var(--c-surface-400) / <alpha-value>)",
        },
        success: { DEFAULT: "#2F855A", 50: "#EAF6EF", 100: "#CFEBD9" },
        warning: { DEFAULT: "#B7791F", 50: "#FCF4E4", 100: "#F6E3BC" },
        danger: { DEFAULT: "#C53030", 50: "#FCECEC", 100: "#F5D1D1" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Urbanist", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-md": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        "2xl": "36px",
      },
      boxShadow: {
        e1: "0 1px 2px rgba(15,17,21,.06)",
        e2: "0 8px 24px -8px rgba(15,17,21,.12)",
        e3: "0 24px 48px -12px rgba(15,17,21,.18)",
        "glow-gold":
          "0 0 0 1px rgb(var(--c-accent) / .4), 0 8px 32px -8px rgb(var(--c-accent) / .45)",
        "glow-soft": "0 18px 60px -20px rgb(var(--c-accent) / .5)",
      },
      backgroundImage: {
        "grad-hero": "var(--grad-hero)",
        "grad-gold": "var(--grad-gold)",
        "grad-steel": "var(--grad-steel)",
        "grad-soft": "var(--grad-soft)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--c-accent) / .45)" },
          "70%": { boxShadow: "0 0 0 16px rgb(var(--c-accent) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--c-accent) / 0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 46s linear infinite",
        float: "float 7s ease-in-out infinite",
        shine: "shine 900ms ease-out",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(.22,1,.36,1) 1",
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(.22,1,.36,1)",
      },
      maxWidth: {
        site: "1280px",
        article: "72ch",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
