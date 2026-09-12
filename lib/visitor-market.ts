"use client";

import { useEffect, useState } from "react";

/**
 * Visitor market detection — lightweight, resilient, private.
 *
 * The ONLY thing this does is decide whether the visitor is likely in
 * Nigeria, so the pricing section can present the appropriate market's
 * pricing. It never alters design or language, never requests location
 * permission, never exposes or stores the visitor's IP, and defaults to
 * the international Euro presentation whenever detection fails.
 *
 * Resolution order:
 *   1. localStorage cache (definitive results only, expires after 7 days)
 *   2. Timezone — Africa/Lagos is a very reliable Nigeria signal,
 *      resolved instantly with zero network cost
 *   3. /api/market — server reads Vercel/Cloudflare edge geo headers
 *      (IP never reaches client JS)
 *   4. Default: "INTL" (Euro)
 *
 * Caching rules (learned the hard way — see fix history):
 *   - The cache key is versioned. Bump CACHE_VERSION when detection logic
 *     changes so stale entries from older logic are ignored, not trusted.
 *   - Entries expire after 7 days so long-lived visitors re-resolve.
 *   - Only DEFINITIVE answers are cached. An inconclusive detection
 *     (e.g. no geo header on a local/dev environment) is never persisted —
 *     caching a fallback would lock the visitor out of re-resolution.
 */

export type VisitorMarket = "NG" | "INTL";

const CACHE_VERSION = "v2";
const MARKET_STORAGE_KEY = `visitor_market_${CACHE_VERSION}`;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedMarket {
  market: VisitorMarket;
  ts: number;
}

function readCache(): VisitorMarket | null {
  try {
    const raw = window.localStorage.getItem(MARKET_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedMarket>;
    if (
      (parsed.market === "NG" || parsed.market === "INTL") &&
      typeof parsed.ts === "number" &&
      Date.now() - parsed.ts < CACHE_TTL_MS
    ) {
      return parsed.market;
    }
    // Expired or malformed — drop it and re-resolve.
    window.localStorage.removeItem(MARKET_STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

function writeCache(market: VisitorMarket) {
  try {
    const entry: CachedMarket = { market, ts: Date.now() };
    window.localStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(entry));
  } catch {
    /* storage unavailable — detection still works for this visit */
  }
}

/**
 * Returns the visitor's pricing market. Defaults to "INTL" (Euro) until
 * detection completes — and stays "INTL" on any failure.
 */
export function useVisitorMarket(): VisitorMarket {
  const [market, setMarket] = useState<VisitorMarket>("INTL");

  useEffect(() => {
    let cancelled = false;

    // 1. Fresh, definitive cached result?
    const cached = readCache();
    if (cached) {
      setMarket(cached);
      return;
    }

    // 2. Timezone signal — instant, no network. Nigerians overwhelmingly
    // run Africa/Lagos; a false positive is possible only for a Nigerian
    // abroad who is anyway outside the Nigerian market.
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Africa/Lagos") {
        setMarket("NG");
        writeCache("NG");
        return;
      }
    } catch {
      /* timezone unavailable — continue */
    }

    // 3. Server-side IP geolocation via edge headers. Only a DETECTED
    // answer is definitive enough to cache — an undetected fallback stays
    // uncached so the next visit re-resolves.
    fetch("/api/market")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { market?: string; detected?: boolean } | null) => {
        if (cancelled) return;
        if (data?.detected && data.market === "NG") {
          setMarket("NG");
          writeCache("NG");
        } else if (data?.detected) {
          // Confirmed non-NG country — cacheable.
          setMarket("INTL");
          writeCache("INTL");
        } else {
          // Inconclusive (dev environment, header stripped, etc.) —
          // do NOT cache. Default INTL applies for this visit only.
          setMarket("INTL");
        }
      })
      .catch(() => {
        /* inconclusive — default INTL already in place, nothing cached */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return market;
}
