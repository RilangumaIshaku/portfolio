import { readFileSync, existsSync } from "fs";
import path from "path";
import { siteConfig } from "@/data/siteConfig";
import { readData } from "@/lib/data-store";
import { DEFAULT_COPY, type SiteCopy } from "@/lib/content-defaults";

export interface SiteContent {
  site: {
    name: string;
    brand: string;
    tagline: string;
    description: string;
    email: string;
    telegram: string;
    socials: {
      github: string;
      linkedin: string;
      twitter: string;
    };
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    /** Second intro paragraph — how the work is approached. Optional so older
     *  saved content keeps working; falls back to `defaults.hero.approach`. */
    approach?: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaPrimaryTarget: string;
    ctaSecondaryTarget: string;
  };
  images: {
    profile: string;
    projects: Record<string, string>;
  };
  links: {
    ctaTarget: string;
  };
  /** Copy for the sections that are not per-project. */
  copy: SiteCopy;
}

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

export const defaults: SiteContent = {
  site: {
    name: siteConfig.name,
    brand: siteConfig.brand,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    telegram: siteConfig.telegram,
    socials: { ...siteConfig.socials },
  },
  seo: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    ogImage: siteConfig.seo.ogImage,
  },
  hero: {
    headline: "I design and build digital experiences shaped by curiosity.",
    subtitle:
      "I work across product design, frontend development, and emerging technology, turning complex ideas into clear, useful digital experiences.",
    approach:
      "I'm interested in the systems behind the interface — how products work, how people use them, and how thoughtful design can make complicated things feel simple.",
    ctaPrimary: "Work with me",
    ctaSecondary: "View work",
    ctaPrimaryTarget: "#contact",
    ctaSecondaryTarget: "#work",
  },
  images: {
    profile: "",
    projects: {
      liora: "",
      sotion: "",
      kasuwa: "",
      tradingpal: "",
      rise: "",
      root: "",
    },
  },
  links: {
    ctaTarget: "#contact",
  },
  copy: DEFAULT_COPY,
};

/**
 * Ensure an external URL is absolute. The admin panel may save values like
 * "t.me/rilanguma" (no scheme) — without normalization React treats that as
 * a relative path and the link resolves to your own domain, e.g.
 * https://<this-site>/t.me/rilanguma.
 */
function ensureAbsoluteUrl(value: string): string {
  const trimmed = (value || "").trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("mailto:") || trimmed.startsWith("#")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * The one name/brand this site uses. Content saved before the rename still
 * says "Rilan" in a few places; it is rewritten on read so the live site can
 * never drift back to the old name, without discarding admin edits that
 * already use the new one.
 */
export const IDENTITY = {
  name: "David Ishaku",
  brand: "David",
} as const;

// Word-bounded on purpose: handles like "rilanguma" and "RilangumaIshaku"
// must survive untouched. Fresh literals per call so no regex state leaks.
function hasLegacyBrand(value: string): boolean {
  return /\bRilan\b/.test(value || "");
}

function rewriteLegacyBrand(value: string, replacement: string): string {
  return (value || "").replace(/\bRilan\b/g, replacement);
}

function rewriteBranch(value: unknown): unknown {
  if (typeof value === "string") return rewriteLegacyBrand(value, IDENTITY.brand);
  if (Array.isArray(value)) return value.map(rewriteBranch);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [
        key,
        rewriteBranch(child),
      ])
    );
  }
  return value;
}

function normalizeIdentity(content: SiteContent): SiteContent {
  const next = content;

  // Identity fields get the full name, everything else the short wordmark.
  if (hasLegacyBrand(next.site.name)) next.site.name = IDENTITY.name;
  if (hasLegacyBrand(next.site.brand)) next.site.brand = IDENTITY.brand;
  if (hasLegacyBrand(next.seo.title)) {
    next.seo.title = rewriteLegacyBrand(next.seo.title, IDENTITY.name);
  }
  next.site.description = rewriteLegacyBrand(next.site.description, IDENTITY.brand);
  next.hero.headline = rewriteLegacyBrand(next.hero.headline, IDENTITY.brand);
  next.hero.subtitle = rewriteLegacyBrand(next.hero.subtitle, IDENTITY.brand);
  next.seo.description = rewriteLegacyBrand(next.seo.description, IDENTITY.brand);

  // A bare filename like "alien.svg" is not a real asset path and produced a
  // 404 og:image. Only keep og images that actually point somewhere; an empty
  // value lets the generated /opengraph-image card take over.
  const ogImage = (next.seo.ogImage || "").trim();
  next.seo.ogImage = /^(https?:\/\/|\/)/i.test(ogImage) ? ogImage : "";

  return rewriteBranch(next) as SiteContent;
}

/**
 * Deep-merge raw content with defaults so missing fields are always filled in.
 */
export function mergeWithDefaults(raw: Partial<SiteContent>): SiteContent {
  const merged = {
    site: { ...defaults.site, ...raw.site, socials: { ...defaults.site.socials, ...raw.site?.socials } },
    seo: { ...defaults.seo, ...raw.seo },
    hero: { ...defaults.hero, ...raw.hero },
    images: {
      profile: raw.images?.profile || defaults.images.profile,
      projects: { ...defaults.images.projects, ...raw.images?.projects },
    },
    links: { ...defaults.links, ...raw.links },
    copy: {
      about:
        Array.isArray(raw.copy?.about) &&
        raw.copy.about.some((paragraph) => paragraph?.trim())
          ? raw.copy.about.filter((paragraph) => paragraph?.trim())
          : defaults.copy.about,
      contact: raw.copy?.contact?.trim()
        ? raw.copy.contact
        : defaults.copy.contact,
      labels: { ...defaults.copy.labels, ...(raw.copy?.labels ?? {}) },
    },
  } as SiteContent;
  // Normalize external URLs so scheme-less admin entries can't break links.
  merged.site.telegram = ensureAbsoluteUrl(merged.site.telegram);
  for (const key of Object.keys(merged.site.socials) as Array<keyof SiteContent["site"]["socials"]>) {
    merged.site.socials[key] = ensureAbsoluteUrl(merged.site.socials[key]);
  }
  return normalizeIdentity(merged);
}

/**
 * Sync version — reads from filesystem at build time.
 * Used by layout.tsx for generateMetadata and as a fallback.
 */
export function getSiteContent(): SiteContent {
  try {
    if (!existsSync(CONTENT_PATH)) return defaults;
    const raw = JSON.parse(readFileSync(CONTENT_PATH, "utf-8"));
    return mergeWithDefaults(raw);
  } catch {
    return defaults;
  }
}

/**
 * Async version — reads from data-store (Redis on Vercel, fs locally).
 * Used by page.tsx at request time so admin edits are reflected.
 */
export async function getSiteContentAsync(): Promise<SiteContent> {
  const raw = await readData<Partial<SiteContent>>("content", defaults);
  return mergeWithDefaults(raw);
}

/**
 * Resolve the admin's "Links & SEO" CTA target into an href that works on any
 * route. A bare "#contact" only resolves on the homepage, so detail pages pass
 * `fromRoot` and get "/#contact" instead — previously the field was saved but
 * never used at all.
 */
export function ctaHref(target?: string, fromRoot = false): string {
  const value = (target || "#contact").trim();
  if (!value) return "#contact";
  if (!value.startsWith("#")) return value;
  return fromRoot ? `/${value}` : value;
}
