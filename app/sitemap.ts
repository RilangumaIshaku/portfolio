import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { projects } from "@/data/projects";
import { hasVisuals } from "@/lib/project-visuals";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.flatMap((project) => {
      const page = {
        url: `${SITE_URL}/work/${project.id}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.6,
      };

      // Only projects with imagery get a visuals route.
      if (!hasVisuals(project)) return [page];

      return [
        page,
        {
          url: `${SITE_URL}/work/${project.id}/visuals`,
          lastModified,
          changeFrequency: "yearly" as const,
          priority: 0.4,
        },
      ];
    }),
  ];
}
