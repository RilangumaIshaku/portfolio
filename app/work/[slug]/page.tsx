import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/navbar";
import { StatusChip } from "@/components/project-entry";
import { CaseStudyToc } from "@/components/case-study-toc";
import { CaseViewToggle } from "@/components/case-view-toggle";
import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { ctaHref, getSiteContentAsync } from "@/lib/siteContent";
import { projects, type Project } from "@/data/projects";
import {
  getAdjacentProjectsAsync,
  getProjectAsync,
} from "@/lib/projects";
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
    title: `${project.title} — David Ishaku`,
    description: project.description,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      title: `${project.title} — ${project.category}`,
      description: project.description,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectAsync(slug);

  if (!project) notFound();

  const content = await getSiteContentAsync();
  const image = content.images.projects[project.id] || project.image;
  const { previous, next } = await getAdjacentProjectsAsync(project.id);

  // The hero image is often also the first gallery entry; showing it twice reads
  // as a mistake, so the duplicate is dropped here.
  const gallery = (project.gallery ?? []).filter(
    (item) => Boolean(item.src) && item.src !== image
  );

  const visuals = getProjectVisuals(project, content.images.projects);

  const sections = [
    { id: "summary", label: "Summary", body: project.summary },
    { id: "challenge", label: "Challenge", body: project.challenge },
    { id: "approach", label: "Approach", body: project.approach },
    { id: "outcome", label: "Outcome", body: project.result },
  ].filter((section) => Boolean(section.body));

  const toc = [
    { id: "introduction", label: "Introduction" },
    ...sections.map(({ id, label }) => ({ id, label })),
    ...(gallery.length > 0 ? [{ id: "visuals", label: "Visuals" }] : []),
    ...(project.technologies?.length
      ? [{ id: "built-with", label: "Built with" }]
      : []),
  ];

  return (
    <>
      <div className="shell-wide pt-12">
        <SiteHeader
          site={content.site}
          profileImage={content.images.profile}
          ctaHref={ctaHref(content.links.ctaTarget, true)}
          variant="detail"
        />

        <main className="relative mx-auto mt-4 w-full max-w-[700px] pb-4 md:px-0">
          <header id="introduction" className="scroll-mt-24 px-4 text-center md:px-0">
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

            <p className="mx-auto mt-6 text-ink">{project.description}</p>

            {visuals.length > 0 && (
              <CaseViewToggle slug={project.id} active="case" />
            )}
          </header>

          <div className="relative">
            <CaseStudyToc items={toc} />

            {image && (
              <figure className="mt-6 px-4 md:px-0">
                <div className="stage stage-natural" data-media-cursor="eye">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${project.title} — ${project.category}`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </figure>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-meta text-ink-faint md:px-0">
              {project.status && <StatusChip status={project.status} />}
              {project.role && <span>{project.role}</span>}
              {project.category && <span>{project.category}</span>}
            </div>

            <div className="mt-12 space-y-12 px-4 md:px-0">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <SectionRow>{section.label}</SectionRow>
                  <p className="mt-3 text-ink-soft">{section.body}</p>
                </section>
              ))}
            </div>

            {gallery.length > 0 && (
              <section id="visuals" className="mt-12 scroll-mt-24 px-4 md:px-0">
                <SectionRow>Visuals</SectionRow>
                <div className="mt-6 space-y-6">
                  {gallery.map((item) => (
                  <figure key={item.src + (item.caption ?? "")}>
                    <div className="stage stage-natural" data-media-cursor="eye">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.src}
                          alt={item.caption ?? `${project.title} interface`}
                          loading="lazy"
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
              </section>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <section
                id="built-with"
                className="mt-12 scroll-mt-24 px-4 md:px-0"
              >
                <SectionRow>Built with</SectionRow>
                <p className="mt-3 text-ink-soft">
                  {project.technologies.join(" · ")}
                </p>
              </section>
            )}

            <div className="px-4 md:px-0">
              <ProjectPager previous={previous} next={next} />
            </div>
          </div>
        </main>
      </div>

      <BackToTop />
      <Footer site={content.site} />
    </>
  );
}

function SectionRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-3">
      <h2 className="shrink-0 text-[0.9375rem] font-medium leading-[1.5333] text-ink">
        {children}
      </h2>
      <span className="rule" aria-hidden="true" />
    </div>
  );
}

function ProjectPager({
  previous,
  next,
}: {
  previous?: Project;
  next?: Project;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More work"
      className="mx-auto mt-14 grid max-w-[560px] border border-rule sm:grid-cols-2"
    >
      {previous && (
        <Link
          href={`/work/${previous.id}`}
          className="group flex flex-col justify-between gap-8 border-b border-rule p-3 transition-colors hover:bg-panel/60 sm:border-b-0 sm:border-r"
        >
          <ArrowLeft size={16} strokeWidth={1.6} className="text-ink" />
          <span>
            <span className="block text-meta text-ink-faint">Previous</span>
            <span className="mt-1 block text-ink-muted transition-colors group-hover:text-ink">
              {previous.title}
            </span>
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={`/work/${next.id}`}
          className="group flex flex-col justify-between gap-8 p-3 transition-colors hover:bg-panel/60"
        >
          <ArrowRight
            size={16}
            strokeWidth={1.6}
            className="self-end text-ink"
          />
          <span className="text-right">
            <span className="block text-meta text-ink-faint">Next</span>
            <span className="mt-1 block text-ink-muted transition-colors group-hover:text-ink">
              {next.title}
            </span>
          </span>
        </Link>
      )}
    </nav>
  );
}
