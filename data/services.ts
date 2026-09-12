export interface Service {
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    title: "Strategy & UX",
    description:
      "Understanding your business, audience and objectives before anything is designed.",
    icon: "Layers",
  },
  {
    title: "Web Design",
    description:
      "Clear, considered interfaces designed around your brand and business goals.",
    icon: "Layout",
  },
  {
    title: "Web Development",
    description:
      "Fast, responsive and maintainable websites built for the modern web.",
    icon: "Globe",
  },
  {
    title: "CMS & Content",
    description:
      "Flexible content systems that make managing your website straightforward.",
    icon: "Hexagon",
  },
  {
    title: "Performance",
    description:
      "Fast-loading experiences engineered for real-world devices and networks.",
    icon: "Zap",
  },
  {
    title: "Ongoing Support",
    description:
      "Maintenance, improvements and technical support beyond launch.",
    icon: "Package",
  },
];
