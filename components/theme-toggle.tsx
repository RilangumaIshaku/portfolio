"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "portfolio:theme";

/**
 * Light is the default; dark is opt-in and remembered. The initial attribute is
 * applied by the inline script in layout.tsx before first paint, so there is no
 * flash of the wrong palette — this component only reflects and flips it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light appearance" : "Switch to dark appearance"}
      title={isDark ? "Light appearance" : "Dark appearance"}
    >
      {isDark ? (
        <Sun size={15} strokeWidth={1.6} />
      ) : (
        <Moon size={15} strokeWidth={1.6} />
      )}
    </button>
  );
}
