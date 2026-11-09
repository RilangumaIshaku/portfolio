import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { ProjectEntry } from "@/components/project-entry";
import type { Project } from "@/data/projects";
import { hasVisuals } from "@/lib/project-visuals";

/**
 * Work is presented twice, exactly as in the reference: one highlighted project
 * at full width, then the rest as a quiet vertical sequence.
 */
export function Work({
  projects,
  labels,
}: {
  projects: Project[];
  labels: { highlights: string; projects: string };
}) {
  if (projects.length === 0) return null;

  const [highlight, ...rest] = projects;

  return (
    <>
      <section id="work" className="mt-11 scroll-mt-16">
        <SectionLabel>{labels.highlights}</SectionLabel>
        <div className="mt-6">
          <ProjectEntry
            project={highlight}
            priority
            highlight
            visuals={hasVisuals(highlight)}
          />
        </div>
      </section>

      {rest.length > 0 && (
        <section id="projects" className="mt-14 scroll-mt-16">
          <SectionLabel>{labels.projects}</SectionLabel>
          <div className="mt-6 space-y-10">
            {rest.map((project) => (
              <ProjectEntry
                key={project.id}
                project={project}
                visuals={hasVisuals(project)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <Link
          href="/work"
          className="text-meta text-ink-faint transition-colors hover:text-ink"
        >
          All work →
        </Link>
      </div>
    </>
  );
}
