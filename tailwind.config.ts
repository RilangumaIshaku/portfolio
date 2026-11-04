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
          soft: "var(--panel-soft)",
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
        small: ["var(--text-small)", { lineHeight: "1.5333" }],
        meta: ["var(--text-meta)", { lineHeight: "1.45" }],
        micro: ["var(--text-micro)", { lineHeight: "1.4" }],
        title: ["var(--text-title)", { lineHeight: "1.45" }],
      },
      maxWidth: {
        measure: "var(--measure)",
        wide: "var(--measure-wide)",
      },
      spacing: {
        section: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
