/**
 * Default copy for the sections that used to be hardcoded in components.
 *
 * Kept in a dependency-free module so the server (content normalisation) and
 * the admin panel (client bundle) share one set of strings instead of four
 * drifting copies. Every value here is what the site shipped with.
 */

export interface SiteCopy {
  /** About section — one entry per paragraph. */
  about: string[];
  /** The invitation paragraph under the Contact heading. */
  contact: string;
  labels: {
    highlights: string;
    projects: string;
    capabilities: string;
    about: string;
    faq: string;
    contact: string;
    work: string;
  };
}

export const DEFAULT_COPY: SiteCopy = {
  about: [
    "I’m David, a product designer and frontend engineer based in Nigeria, working remotely with teams and founders. I move between design and code, which keeps decisions grounded in what the browser can actually do.",
    "Most of the work I take on carries a lot of information and a lot of consequence — legal research, disputed media, trade, money. The interesting part is the reduction: deciding what someone needs to see in order to trust what they are looking at.",
    "Alongside client work I build small experiments that test an idea before it becomes a feature — prototypes, tools, and the occasional game.",
  ],
  contact:
    "If you are working on something that needs this kind of care, I would like to hear about it. A short note about the problem is enough to start.",
  labels: {
    highlights: "Highlights.",
    projects: "Projects.",
    capabilities: "Capabilities.",
    about: "About.",
    faq: "FAQ.",
    contact: "Contact.",
    work: "Work Gallery",
  },
};
