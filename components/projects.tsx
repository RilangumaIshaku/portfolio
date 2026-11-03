import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { ProjectEntry } from "@/components/project-entry";
import type { Project } from "@/data/projects";

/**
 * Work is presented twice, exactly as in the reference: one highlighted project
 * at full width, then the rest as a quiet vertical sequence.
 */
export function Work({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const [highlight, ...rest] = projects;

  return (
    <>
      <section id="work" className="mt-20 scroll-mt-16 md:mt-24">
        <SectionLabel>Highlights.</SectionLabel>
        <div className="mt-7">
          <ProjectEntry project={highlight} priority />
        </div>
      </section>

      {rest.length > 0 && (
        <section id="projects" className="mt-16 scroll-mt-16 md:mt-20">
          <SectionLabel>Projects.</SectionLabel>
          <div className="mt-7 space-y-14 md:space-y-20">
            {rest.map((project) => (
              <ProjectEntry key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
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
