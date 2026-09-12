/**
 * Two-market pricing presentation.
 *
 * Nigerian visitors → Naira presentation
 * All other visitors → Euro presentation
 *
 * These are independent market presentations — the amounts are NOT
 * currency conversions of each other. "From" prices are positioning
 * anchors, not fixed quotes.
 */

export interface PricingTier {
  name: string;
  /** "From" label, e.g. "€1,000" or "₦1,500,000" — rendered as "From €1,000" */
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
  /** Custom scope tier: no price anchor shown */
  custom?: boolean;
}

const EURO_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "€1,000",
    description:
      "For focused business websites that need to establish credibility, communicate core offerings, and convert visitors.",
    features: [
      "Bespoke design — no templates",
      "Up to 5 custom-structured pages",
      "Fast, responsive modern build",
      "Core technical SEO & semantic structure",
      "Contact & lead inquiry workflows",
    ],
    highlighted: false,
  },
  {
    name: "Business",
    price: "€2,000",
    description:
      "For businesses that need a comprehensive web presence with dynamic content systems and refined interactions.",
    features: [
      "Full multi-page information architecture",
      "Custom interactive components & motion",
      "Headless CMS for autonomous content editing",
      "Advanced performance optimization",
      "Complete SEO hierarchy & analytics",
      "30 days post-launch support",
    ],
    highlighted: true,
  },
  {
    name: "Custom",
    price: "",
    custom: true,
    description:
      "For web applications, complex workflows, multi-language architectures, or specialized digital products.",
    features: [
      "End-to-end scoping & architecture",
      "Custom application functionality",
      "Third-party API & database integrations",
      "Interactive data visualization & tools",
      "Ongoing maintenance options",
    ],
    highlighted: false,
  },
];

const NAIRA_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "₦1,500,000",
    description:
      "For focused business websites that need to establish credibility, communicate core offerings, and convert visitors.",
    features: [
      "Bespoke design — no templates",
      "Up to 5 custom-structured pages",
      "Fast, responsive modern build",
      "Core technical SEO & semantic structure",
      "Contact & lead inquiry workflows",
    ],
    highlighted: false,
  },
  {
    name: "Business",
    price: "₦3,000,000",
    description:
      "For businesses that need a comprehensive web presence with dynamic content systems and refined interactions.",
    features: [
      "Full multi-page information architecture",
      "Custom interactive components & motion",
      "Headless CMS for autonomous content editing",
      "Advanced performance optimization",
      "Complete SEO hierarchy & analytics",
      "30 days post-launch support",
    ],
    highlighted: true,
  },
  {
    name: "Custom",
    price: "",
    custom: true,
    description:
      "For web applications, complex workflows, multi-language architectures, or specialized digital products.",
    features: [
      "End-to-end scoping & architecture",
      "Custom application functionality",
      "Third-party API & database integrations",
      "Interactive data visualization & tools",
      "Ongoing maintenance options",
    ],
    highlighted: false,
  },
];

export type Market = "NG" | "INTL";

export function getPricingTiers(market: Market): PricingTier[] {
  return market === "NG" ? NAIRA_TIERS : EURO_TIERS;
}

/** Heading anchor used above the grid, per market. */
export function getPricingAnchor(market: Market): string {
  return market === "NG"
    ? "Projects typically start from ₦1,500,000."
    : "Projects typically start from €1,000.";
}
