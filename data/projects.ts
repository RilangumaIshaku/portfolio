export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  challenge?: string;
  approach?: string;
  result?: string;
  isConcept?: boolean;
  conceptLabel?: string;
  technologies: string[];
  image: string;
  url?: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "kasuwa",
    title: "Kasuwa",
    category: "Agricultural Marketplace",
    description:
      "A direct-to-buyer agricultural marketplace connecting producers directly with bulk purchasers and consumers.",
    challenge:
      "Agricultural producers struggled with fragmented distribution channels and opaque pricing, while buyers faced inconsistent quality and high communication friction.",
    approach:
      "Architected a direct-to-buyer digital marketplace with structured inventory listings, transparent vendor communication, and an intuitive mobile-first transaction flow.",
    result:
      "A fast, credible marketplace interface engineered to turn casual visits into reliable trading relationships without intermediary bottlenecks.",
    isConcept: false,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    image: "/uploads/project-kasuwa-image-1787472764271.png",
    color: "#0A5C36",
  },
  {
    id: "liora",
    title: "Liora",
    category: "AI Legal Research",
    description:
      "A multi-jurisdictional AI legal research platform designed to streamline complex legal analysis across different regions.",
    challenge:
      "Legal teams cross-referencing multi-jurisdictional precedents spend excessive time parsing dense documentation and rigid legacy databases.",
    approach:
      "Designed a distraction-free research workspace prioritizing typographic clarity, contextual citations, and structured query workflows.",
    result:
      "A high-density research interface designed to reduce cognitive fatigue and accelerate multi-jurisdiction statutory analysis.",
    isConcept: true,
    conceptLabel: "Concept project — independent design exploration",
    technologies: ["React", "Python", "OpenAI API", "FastAPI"],
    image: "/projects/liora.png",
    color: "#3B0764",
  },
  {
    id: "tradingpal",
    title: "TradingPal",
    category: "Fintech & Analytics",
    description:
      "A modern financial interface with real-time data visualization, portfolio tracking, and a clean analytical dashboard.",
    challenge:
      "Traders are often overwhelmed by cluttered interfaces that obscure high-priority market signals and delay critical execution.",
    approach:
      "Engineered a low-latency interface with strict visual hierarchy, customizable real-time charts, and clean portfolio metrics.",
    result:
      "A streamlined financial dashboard delivering real-time clarity and dependable data visualization across desktop and mobile screens.",
    isConcept: true,
    conceptLabel: "Concept project — independent design exploration",
    technologies: ["Next.js", "TypeScript", "Chart.js", "WebSocket"],
    image: "/projects/tradingpal.png",
    color: "#0C4A6E",
  },
  {
    id: "bloomstudio",
    title: "Bloom Studio",
    category: "Architecture & Design Practice",
    description:
      "A refined digital presence showcasing bespoke design projects with elegant interactions and an editorial layout.",
    challenge:
      "High-end design practices frequently use generic templates that fail to communicate architectural precision and premium positioning.",
    approach:
      "Crafted an editorial digital presence with measured micro-interactions, generous whitespace, and a performant headless architecture.",
    result:
      "A digital experience that establishes immediate prestige and frames bespoke case studies for discerning clients.",
    isConcept: true,
    conceptLabel: "Concept project — independent design exploration",
    technologies: ["Next.js", "Framer Motion", "Sanity CMS", "Vercel"],
    image: "/projects/bloomstudio.png",
    color: "#1C1917",
  },
  {
    id: "medconnect",
    title: "MedConnect",
    category: "Telehealth Platform",
    description:
      "A telehealth platform enabling virtual consultations, appointment booking, and secure patient-provider coordination.",
    challenge:
      "Patients seeking specialist healthcare often face intimidating, complex scheduling steps and confusing virtual consultation flows.",
    approach:
      "Designed an empathetic, high-clarity appointment and consultation journey with clear progress states and accessible typography.",
    result:
      "An accessible healthcare interface that builds patient confidence and simplifies virtual consultation coordination.",
    isConcept: true,
    conceptLabel: "Concept project — independent design exploration",
    technologies: ["React", "Node.js", "MongoDB", "WebRTC"],
    image: "/projects/medconnect.png",
    color: "#0F766E",
  },
];
