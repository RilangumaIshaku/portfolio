export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  url?: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "kasuwa",
    title: "Kasuwa",
    category: "E-commerce Platform",
    description:
      "A modern Nigerian agricultural marketplace connecting farmers directly with buyers. Built for scale with a clean, intuitive interface.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    image: "/projects/kasuwa.png",
    color: "#0A5C36",
  },
  {
    id: "liora",
    title: "Liora",
    category: "AI Platform",
    description:
      "A multi-jurisdictional AI legal research platform designed to streamline complex legal analysis across different regions.",
    technologies: ["React", "Python", "OpenAI API", "FastAPI"],
    image: "/projects/liora.png",
    color: "#3B0764",
  },
  {
    id: "tradingpal",
    title: "TradingPal",
    category: "Fintech",
    description:
      "A modern trading platform interface with real-time data visualization, portfolio tracking, and a clean financial dashboard.",
    technologies: ["Next.js", "TypeScript", "Chart.js", "WebSocket"],
    image: "/projects/tradingpal.png",
    color: "#0C4A6E",
  },
  {
    id: "bloomstudio",
    title: "Bloom Studio",
    category: "Agency Website",
    description:
      "A premium digital agency website showcasing creative work with elegant animations and a refined editorial layout.",
    technologies: ["Next.js", "Framer Motion", "Sanity CMS", "Vercel"],
    image: "/projects/bloomstudio.png",
    color: "#1C1917",
  },
  {
    id: "medconnect",
    title: "MedConnect",
    category: "Healthcare",
    description:
      "A telehealth platform enabling virtual consultations, appointment booking, and secure patient-provider communication.",
    technologies: ["React", "Node.js", "MongoDB", "WebRTC"],
    image: "/projects/medconnect.png",
    color: "#0F766E",
  },
];
