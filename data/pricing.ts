export interface PricingTier {
  name: string;
  price: string;
  priceAmount: number; // Amount in NGN (0 = "Let's talk")
  description: string;
  features: string[];
  highlighted: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "₦150,000",
    priceAmount: 150000,
    description: "For simple business websites that make a strong first impression.",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Contact form",
      "Basic SEO setup",
      "Mobile-optimized",
      "1 revision round",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₦400,000",
    priceAmount: 400000,
    description: "For businesses requiring a more complete, polished web presence.",
    features: [
      "Up to 10 pages",
      "Custom design",
      "Advanced SEO",
      "Performance optimization",
      "CMS integration",
      "Analytics setup",
      "2 revision rounds",
      "30-day support",
    ],
    highlighted: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    priceAmount: 0,
    description: "For advanced websites, web applications, and unique requirements.",
    features: [
      "Unlimited pages",
      "Custom functionality",
      "Web application features",
      "API integrations",
      "AI-powered features",
      "Priority support",
      "Ongoing maintenance",
      "Dedicated project management",
    ],
    highlighted: false,
  },
];
