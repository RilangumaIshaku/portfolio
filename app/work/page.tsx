import type { Metadata } from "next";
import { SiteHeader } from "@/components/navbar";
import { WorkGallery } from "@/components/work-gallery";
import { Footer } from "@/components/footer";
import { ctaHref, getSiteContentAsync } from "@/lib/siteContent";
import { workYearRange } from "@/data/projects";
import { getProjects, withUploadedImages } from "@/lib/projects";
import { hasVisuals } from "@/lib/project-visuals";

export const metadata: Metadata = {
  title: "Work — David Ishaku",
  description:
    "Selected work across legal technology, media forensics, agricultural trade, fintech and interactive systems.",
  alternates: { canonical: "/work" },
};

// Admin edits land through the data store, so re-render the index regularly.
export const revalidate = 60;

export default async function WorkIndexPage() {
  const [content, storedProjects] = await Promise.all([
    getSiteContentAsync(),
    getProjects(),
  ]);

  const projects = withUploadedImages(storedProjects, content.images.projects);

  const visuals = projects
    .filter((project) => hasVisuals(project))
    .map((project) => project.id);

  return (
    <>
      <div className="shell-wide pt-12">
        <SiteHeader
          site={content.site}
          profileImage={content.images.profile}
          ctaHref={ctaHref(content.links.ctaTarget, true)}
          variant="detail"
        />

        <main className="mx-auto w-full max-w-[1100px] pb-4">
          <header className="px-4 text-center">
            <h1 className="display-serif text-[1.5rem] leading-[1.5]">
              Work Gallery
            </h1>
            <p className="mt-3 text-meta text-ink-faint">
              {workYearRange(projects)}
            </p>
          </header>

          <WorkGallery projects={projects} visuals={visuals} />
        </main>
      </div>

      <Footer site={content.site} />
    </>
  );
}
