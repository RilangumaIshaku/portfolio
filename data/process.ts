export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "1",
    title: "Discovery & Direction",
    description:
      "We start by understanding your business, goals, audience and what the website needs to achieve.",
  },
  {
    number: "2",
    title: "Strategy & Structure",
    description:
      "I define the website structure, priorities and user journey before the main build begins.",
  },
  {
    number: "3",
    title: "Wireframing & User Flow",
    description:
      "I map the layout and user experience so every section has a clear purpose.",
  },
  {
    number: "4",
    title: "Visual Design & Interaction",
    description:
      "I turn the structure into a polished visual experience with thoughtful details and interactions.",
  },
  {
    number: "5",
    title: "Development & Refinement",
    description:
      "I build the website, make it responsive and refine the details across devices.",
  },
  {
    number: "6",
    title: "Testing & Launch",
    description:
      "Everything is tested, optimized and deployed so the final product is ready for real users.",
  },
];
