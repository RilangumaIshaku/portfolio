import { projects as bundledProjects, type Project } from "@/data/projects";
import { readData } from "@/lib/data-store";

/**
 * Projects as the admin writes them.
 *
 * `data/projects.json` is the baseline that ships with the build; the data
 * store (GitHub commit → redeploy, or Upstash KV) holds the current version.
 * Every page reads through here so the Projects panel and the pages can no
 * longer disagree — previously the pages imported the JSON directly and only
 * ever saw build-time content.
 */
export async function getProjects(): Promise<Project[]> {
  let stored: Project[] | null = null;

  try {
    stored = await readData<Project[]>("projects", bundledProjects);
  } catch {
    stored = null;
  }

  const list =
    Array.isArray(stored) && stored.length > 0 ? stored : bundledProjects;

  // A malformed entry should not blank out the work index.
  return list.filter((project) => Boolean(project?.id && project?.title));
}

export async function getProjectAsync(
  slug: string
): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((project) => project.id === slug);
}

export async function getAdjacentProjectsAsync(slug: string): Promise<{
  previous: Project | undefined;
  next: Project | undefined;
}> {
  const list = await getProjects();
  const index = list.findIndex((project) => project.id === slug);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: index > 0 ? list[index - 1] : list[list.length - 1],
    next: index < list.length - 1 ? list[index + 1] : list[0],
  };
}

/** Project records with any admin-uploaded screenshot taking precedence. */
export function withUploadedImages(
  projects: Project[],
  uploaded: Record<string, string> = {}
): Project[] {
  return projects.map((project) => ({
    ...project,
    image: uploaded[project.id] || project.image,
  }));
}
