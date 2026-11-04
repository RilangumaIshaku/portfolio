import type { Metadata } from "next";
import { SiteHeader } from "@/components/navbar";
import { ProjectEntry } from "@/components/project-entry";
import { Footer } from "@/components/footer";
import { getSiteContent } from "@/lib/siteContent";
import { projects as projectRecords, workYearRange } from "@/data/projects";
import { hasVisuals } from "@/lib/project-visuals";

export const metadata: Metadata = {
  title: "Work — David Ishaku",
  description:
    "Selected work across legal technology, media forensics, agricultural trade, fintech and interactive systems.",
  alternates: { canonical: "/work" },
};

export default function WorkIndexPage() {
  const content = getSiteContent();

  const projects = projectRecords.map((project) => ({
    ...project,
    image: content.images.projects[project.id] || project.image,
  }));

  return (
    <>
      <div className="shell-wide pt-12">
        <SiteHeader
          site={content.site}
          profileImage={content.images.profile}
          ctaHref="/#contact"
          variant="detail"
        />

        <main className="mx-auto w-full max-w-[1100px] pb-4">
          <header className="px-4 text-center">
            <h1 className="display-serif text-[1.5rem] leading-[1.5]">Work</h1>
            <p className="mt-3 text-meta text-ink-faint">
              {workYearRange(projectRecords)}
            </p>
          </header>

          <div className="mt-10 grid gap-x-6 gap-y-10 px-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectEntry
                key={project.id}
                project={project}
                compact
                visuals={hasVisuals(project)}
              />
            ))}
          </div>
        </main>
      </div>

      <Footer site={content.site} />
    </>
  );
}
