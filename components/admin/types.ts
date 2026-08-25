export interface SiteContent {
  site: {
    name: string;
    brand: string;
    tagline: string;
    description: string;
    email: string;
    whatsapp: string;
    socials: { github: string; linkedin: string; twitter: string };
  };
  seo: { title: string; description: string; ogImage: string };
  hero: {
    headline: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaPrimaryTarget: string;
    ctaSecondaryTarget: string;
  };
  images: { profile: string; projects: Record<string, string> };
  links: { whatsappMessage: string; ctaTarget: string };
}

export interface AvailabilityData {
  isAvailable: boolean;
  status: string;
  color: "green" | "yellow" | "red";
  updatedAt: string;
}

export const PROJECT_IDS = [
  "kasuwa",
  "liora",
  "tradingpal",
  "bloomstudio",
  "medconnect",
];

export const ICON_OPTIONS = [
  "Globe",
  "Layout",
  "Layers",
  "Zap",
  "Hexagon",
  "Package",
  "Smartphone",
  "Target",
  "MessageCircle",
  "Sparkles",
];

export const COLOR_OPTIONS = [
  { value: "green" as const, label: "Green", dot: "#22c55e" },
  { value: "yellow" as const, label: "Yellow", dot: "#eab308" },
  { value: "red" as const, label: "Red", dot: "#ef4444" },
];

export const PRESET_MESSAGES = [
  "Available for new projects",
  "Accepting 2 jobs for this month",
  "Limited availability — reach out fast",
  "Fully booked until next month",
  "Open for quick projects only",
  "Not available for new projects",
];
