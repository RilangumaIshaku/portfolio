"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The email address in the introduction. Clicking copies it — the same
 * affordance the reference uses — and the tooltip above it says so before
 * and after the click. Falls back to opening the mail client when the
 * Clipboard API is unavailable (insecure origins, older browsers).
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <span className="copy-email" data-copied={copied}>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address, ${email}`}
        className="link cursor-pointer"
      >
        <span aria-live="polite">{email}</span>
      </button>
      <span className="copy-email__tip" aria-hidden="true">
        {copied ? "Copied to clipboard" : "Click to copy email"}
      </span>
    </span>
  );
}
