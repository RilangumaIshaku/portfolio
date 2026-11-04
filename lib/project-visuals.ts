import type { Project, ProjectGalleryItem } from "@/data/projects";

/**
 * Every image a project actually has: the hero (with any admin override) first,
 * then the gallery, with duplicates removed. Used by the visuals route, the
 * "Visuals only" toggle and the per-project gallery links, so all three agree
 * on what counts as an image.
 */
export function getProjectVisuals(
  project: Project,
  uploadedImages: Record<string, string> = {}
): ProjectGalleryItem[] {
  const hero = uploadedImages[project.id] || project.image;
  const items: ProjectGalleryItem[] = [];

  if (hero) items.push({ src: hero });

  for (const item of project.gallery ?? []) {
    if (!item?.src) continue;
    if (items.some((existing) => existing.src === item.src)) continue;
    items.push(item);
  }

  return items;
}

export function hasVisuals(
  project: Project,
  uploadedImages: Record<string, string> = {}
): boolean {
  return getProjectVisuals(project, uploadedImages).length > 0;
}
