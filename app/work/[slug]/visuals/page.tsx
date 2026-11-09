import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/navbar";
import { CaseViewToggle } from "@/components/case-view-toggle";
import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { ctaHref, getSiteContentAsync } from "@/lib/siteContent";
import { projects } from "@/data/projects";
import { getProjectAsync } from "@/lib/projects";
import { getProjectVisuals } from "@/lib/project-visuals";

export const revalidate = 60;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectAsync(slug);

  if (!project) return { title: "Project not found — David Ishaku" };

  return {
    title: `${project.title} — Visuals — David Ishaku`,
    description: `${project.title}: ${project.tagline ?? project.description}`,
    alternates: { canonical: `/work/${project.id}/visuals` },
  };
}

/**
 * The imagery on its own, with the same header, title and toggle as the case
 * study so the two modes feel like one page rather than two.
 */
export default async function ProjectVisualsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectAsync(slug);

  if (!project) notFound();

  const content = await getSiteContentAsync();
  const visuals = getProjectVisuals(project, content.images.projects);

  if (visuals.length === 0) notFound();

  return (
    <>
      <div className="shell-wide pt-12">
        <SiteHeader
          site={content.site}
          profileImage={content.images.profile}
          ctaHref={ctaHref(content.links.ctaTarget, true)}
          variant="detail"
        />

        <main className="mx-auto mt-4 w-full max-w-[700px] pb-4">
          <header className="px-4 text-center md:px-0">
            <div className="flex flex-wrap items-center justify-center gap-[0.625rem]">
              <h1 className="display-serif text-[1.5rem] leading-[1.5]">
                {project.title}
              </h1>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-panel px-1.5 py-1 text-[0.75rem] leading-none text-ink transition-colors hover:bg-panel-soft"
                >
                  Visit
                  <ArrowUpRight size={11} strokeWidth={1.8} />
                </a>
              )}
            </div>

            <p className="mt-4 text-meta text-ink-faint">{project.year}</p>

            <CaseViewToggle slug={project.id} active="visuals" />
          </header>

          <div className="mt-8 space-y-6 px-4 md:px-0">
            {visuals.map((item, index) => (
              <figure key={item.src + index}>
                <div className="stage stage-natural" data-media-cursor="eye">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.caption ?? `${project.title} — ${project.category}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-2.5 text-center text-meta text-ink-faint">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </main>
      </div>

      <BackToTop />
      <Footer site={content.site} />
    </>
  );
}
