import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/market — resolves the visitor's pricing market.
 *
 * Returns { market, detected }:
 *   - market: "NG" | "INTL"
 *   - detected: true only when an edge geo header actually identified the
 *     country. When false, "INTL" is a fallback, NOT a confirmed answer —
 *     the client must not cache it.
 *
 * Vercel's edge network geo-locates the request IP for free and exposes it
 * via the x-vercel-ip-country header on the *server*, where the raw IP
 * never reaches client JS.
 */
export async function GET(request: NextRequest) {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    "";

  const trimmed = country.trim().toUpperCase();
  const detected = trimmed.length > 0;

  return NextResponse.json(
    {
      market: detected && trimmed === "NG" ? "NG" : "INTL",
      detected,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
