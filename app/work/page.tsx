import type { Metadata } from "next";
import { SiteHeader } from "@/components/navbar";
import { ProjectEntry } from "@/components/project-entry";
import { Footer } from "@/components/footer";
import { getSiteContent } from "@/lib/siteContent";
import { projects as projectRecords, workYearRange } from "@/data/projects";

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
      <div className="shell pt-10 md:pt-12">
        <SiteHeader
          site={content.site}
          profileImage={content.images.profile}
          ctaHref="/#contact"
          variant="detail"
        />

        <main>
          <header className="pt-12 text-center md:pt-14">
            <h1 className="display-serif text-[2rem] md:text-[2.25rem]">Work</h1>
            <p className="mt-3 text-meta text-ink-faint">
              {workYearRange(projectRecords)}
            </p>
          </header>

          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-14">
            {projects.map((project) => (
              <ProjectEntry key={project.id} project={project} compact />
            ))}
          </div>
        </main>
      </div>

      <Footer site={content.site} />
    </>
  );
}
