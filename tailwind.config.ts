import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
          hover: "var(--color-accent-hover)",
          muted: "var(--color-accent-muted)",
        },
        "accent-blue": "var(--accent-blue)",
        "accent-lilac": "var(--accent-lilac)",
        "accent-sage": "var(--accent-sage)",
        "accent-coral": "var(--accent-coral)",
        "accent-amber": "var(--accent-amber)",
        "accent-teal": "var(--accent-teal)",
        "accent-blue-muted": "var(--accent-blue-muted)",
        "accent-lilac-muted": "var(--accent-lilac-muted)",
        "accent-sage-muted": "var(--accent-sage-muted)",
        "accent-coral-muted": "var(--accent-coral-muted)",
        "accent-amber-muted": "var(--accent-amber-muted)",
        "accent-teal-muted": "var(--accent-teal-muted)",
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
      },
      fontFamily: {
        sans: [
          "Switzer",
          "SF Pro Display",
          "SF Pro",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        // Display headings — responsive via clamp
        "display-xl": [
          "clamp(2.25rem, 0.375rem + 2.8125vw, 4.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.035em", fontWeight: "600" },
        ],
        "display-lg": [
          "clamp(1.875rem, 0.5rem + 1.375vw, 3rem)",
          { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-md": [
          "clamp(1.25rem, 0.125rem + 1.125vw, 1.625rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "display-sm": [
          "clamp(1rem, 0.5rem + 0.5vw, 1.125rem)",
          { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        // Body & supporting
        body: ["1rem", { lineHeight: "1.55", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        label: [
          "0.6875rem",
          { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "500" },
        ],
        nav: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "500" }],
        button: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "500" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-up-delayed": "slideUp 0.6s ease-out 0.2s forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "fadeSlideRight": "fadeSlideRight 0.5s ease-out forwards",
        "fadeSlideLeft": "fadeSlideLeft 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fadeSlideRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeSlideLeft: {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
