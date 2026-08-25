import { readFileSync, existsSync } from "fs";
import path from "path";
import { siteConfig } from "@/data/siteConfig";

export interface SiteContent {
  site: {
    name: string;
    brand: string;
    tagline: string;
    description: string;
    email: string;
    whatsapp: string;
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
    whatsappMessage: string;
    ctaTarget: string;
  };
}

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

const defaults: SiteContent = {
  site: {
    name: siteConfig.name,
    brand: siteConfig.brand,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    whatsapp: siteConfig.whatsapp,
    socials: { ...siteConfig.socials },
  },
  seo: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    ogImage: siteConfig.seo.ogImage,
  },
  hero: {
    headline: "Hey, I'm Rilan. I design premium & high-converting experiences.",
    subtitle:
      "Designing and developing fast, modern, responsive websites for businesses and startups that want to stand out and convert.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "View My Work",
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
    whatsappMessage: "Hi! I'm interested in working with you on a project.",
    ctaTarget: "#contact",
  },
};

export function getSiteContent(): SiteContent {
  try {
    if (!existsSync(CONTENT_PATH)) return defaults;
    const raw = JSON.parse(readFileSync(CONTENT_PATH, "utf-8"));
    // Deep merge with defaults so missing fields are filled in
    return {
      site: { ...defaults.site, ...raw.site, socials: { ...defaults.site.socials, ...raw.site?.socials } },
      seo: { ...defaults.seo, ...raw.seo },
      hero: { ...defaults.hero, ...raw.hero },
      images: {
        profile: raw.images?.profile || defaults.images.profile,
        projects: { ...defaults.images.projects, ...raw.images?.projects },
      },
      links: { ...defaults.links, ...raw.links },
    };
  } catch {
    return defaults;
  }
}
