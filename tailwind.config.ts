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
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          muted: "var(--ink-muted)",
          faint: "var(--ink-faint)",
        },
        paper: "var(--paper)",
        panel: {
          DEFAULT: "var(--panel)",
          warm: "var(--panel-warm)",
        },
        rule: "var(--rule)",
        pill: "var(--pill)",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        serif: ["var(--font-display)"],
        mono: ["var(--font-code)"],
      },
      fontSize: {
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)" }],
        small: ["var(--text-small)", { lineHeight: "1.6" }],
        meta: ["var(--text-meta)", { lineHeight: "1.5" }],
        micro: ["var(--text-micro)", { lineHeight: "1.5" }],
        title: ["var(--text-title)", { lineHeight: "1.4" }],
      },
      maxWidth: {
        measure: "var(--measure)",
      },
      spacing: {
        section: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
