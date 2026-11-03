import projectsData from "./projects.json";

export interface ProjectGalleryItem {
  src: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  year?: string;
  category: string;
  /** Completed · In development · Prototype · Experiment · Concept */
  status?: string;
  /** One-line statement used as the project title in listings. */
  tagline?: string;
  description: string;
  summary?: string;
  role?: string;
  challenge?: string;
  approach?: string;
  result?: string;
  isConcept?: boolean;
  conceptLabel?: string;
  technologies: string[];
  image: string;
  gallery?: ProjectGalleryItem[];
  video?: string;
  url?: string;
  color: string;
}

/**
 * Single source of truth: data/projects.json — the same file the admin panel
 * writes to. Keeping a second hardcoded copy here meant the two drifted apart.
 */
export const projects: Project[] = projectsData as Project[];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.id === slug);
}

export function getAdjacentProjects(slug: string): {
  previous: Project | undefined;
  next: Project | undefined;
} {
  const index = projects.findIndex((project) => project.id === slug);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: index > 0 ? projects[index - 1] : projects[projects.length - 1],
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  };
}

/** "2024–2025" for the work index, or a single year when they match. */
export function workYearRange(list: Project[] = projects): string {
  const years = list
    .map((project) => Number(project.year))
    .filter((year) => Number.isFinite(year));

  if (years.length === 0) return "";
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first}–${last}`;
}
