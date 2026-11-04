"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Columns2, GalleryHorizontal } from "lucide-react";
import { ProjectEntry } from "@/components/project-entry";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

type Density = 1 | 2 | 3;
type Sort = "latest" | "random";

/**
 * The gallery controls from the reference, over real data: filter by category,
 * order by date or shuffle, and change how many columns the grid runs at.
 */
export function WorkGallery({
  projects,
  visuals,
}: {
  projects: Project[];
  /** Project ids that have imagery, so the visuals link only appears when real. */
  visuals: string[];
}) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("latest");
  const [density, setDensity] = useState<Density>(2);
  const [seed, setSeed] = useState(0);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const visible = useMemo(() => {
    const filtered =
      category === "All"
        ? [...projects]
        : projects.filter((project) => project.category === category);

    if (sort === "latest") {
      return filtered.sort(
        (a, b) => Number(b.year ?? 0) - Number(a.year ?? 0)
      );
    }

    // Deterministic shuffle: same seed → same order, so React can re-render
    // without the grid reshuffling on unrelated state changes.
    return filtered
      .map((project, index) => ({ project, key: Math.sin(seed + index * 97.13) }))
      .sort((a, b) => a.key - b.key)
      .map((entry) => entry.project);
  }, [projects, category, sort, seed]);

  const columns = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
  }[density];

  return (
    <div className="mt-10 px-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "border-b pb-1 text-meta transition-colors",
                category === item
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3" role="group" aria-label="Order">
            <button
              type="button"
              onClick={() => setSort("latest")}
              aria-pressed={sort === "latest"}
              className={cn(
                "border-b pb-1 text-meta transition-colors",
                sort === "latest"
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => {
                setSort("random");
                setSeed((value) => value + 1);
              }}
              aria-pressed={sort === "random"}
              className={cn(
                "border-b pb-1 text-meta transition-colors",
                sort === "random"
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              Random
            </button>
          </div>

          <div className="flex items-center gap-1" role="group" aria-label="Grid density">
            {(
              [
                { value: 1 as Density, Icon: GalleryHorizontal, label: "One column" },
                { value: 2 as Density, Icon: Columns2, label: "Two columns" },
                { value: 3 as Density, Icon: LayoutGrid, label: "Three columns" },
              ] as const
            ).map(({ value, Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDensity(value)}
                aria-pressed={density === value}
                aria-label={label}
                title={label}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                  density === value
                    ? "bg-panel text-ink"
                    : "text-ink-faint hover:text-ink"
                )}
              >
                <Icon size={16} strokeWidth={1.6} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("mt-8 grid gap-x-6 gap-y-10", columns)}>
        {visible.map((project) => (
          <ProjectEntry
            key={project.id}
            project={project}
            compact
            visuals={visuals.includes(project.id)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-meta text-ink-muted">
          Nothing in this category yet.
        </p>
      )}
    </div>
  );
}
