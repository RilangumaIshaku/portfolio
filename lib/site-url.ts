/**
 * Single source of truth for the public site URL.
 *
 * Every canonical / og: / twitter: tag, the sitemap and robots.txt resolve
 * through here so they can never drift from the deployed domain again.
 * `NEXT_PUBLIC_SITE_URL` still wins when it is set (preview deploys, custom
 * domains), but the fallback is the real production domain — not a
 * placeholder like "https://yoursite.com".
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-steel-one-28.vercel.app"
).replace(/\/+$/, "");

/** Resolve any path (or absolute URL) against the site origin. */
export function absoluteUrl(pathname = "/"): string {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  return new URL(pathname, `${SITE_URL}/`).toString();
}
