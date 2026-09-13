import { readFileSync, existsSync } from "fs";
import path from "path";
import { siteConfig } from "@/data/siteConfig";
import { readData } from "@/lib/data-store";

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
    headline: "Digital experiences built for ambitious businesses.",
    subtitle:
      "I design and develop premium websites that turn attention into trust, credibility and business.",
    ctaPrimary: "Start a project",
    ctaSecondary: "View selected work",
    ctaPrimaryTarget: "#contact",
    ctaSecondaryTarget: "#work",
  },
  images: {
    profile: "",
    projects: {
      kasuwa: "",
      liora: "",
      tradingpal: "",
      bloomstudio: "",
      medconnect: "",
    },
  },
  links: {
    ctaTarget: "#contact",
  },
};

/**
 * Ensure an external URL is absolute. The admin panel may save values like
 * "t.me/rilanguma" (no scheme) — without normalization React treats that as
 * a relative path and the link resolves to your own domain, e.g.
 * https://yoursite.com/t.me/rilanguma.
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
 * Deep-merge raw content with defaults so missing fields are always filled in.
 */
function mergeWithDefaults(raw: Partial<SiteContent>): SiteContent {
  const merged = {
    site: { ...defaults.site, ...raw.site, socials: { ...defaults.site.socials, ...raw.site?.socials } },
    seo: { ...defaults.seo, ...raw.seo },
    hero: { ...defaults.hero, ...raw.hero },
    images: {
      profile: raw.images?.profile || defaults.images.profile,
      projects: { ...defaults.images.projects, ...raw.images?.projects },
    },
    links: { ...defaults.links, ...raw.links },
  } as SiteContent;
  // Normalize external URLs so scheme-less admin entries can't break links.
  merged.site.telegram = ensureAbsoluteUrl(merged.site.telegram);
  for (const key of Object.keys(merged.site.socials) as Array<keyof SiteContent["site"]["socials"]>) {
    merged.site.socials[key] = ensureAbsoluteUrl(merged.site.socials[key]);
  }
  return merged;
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
