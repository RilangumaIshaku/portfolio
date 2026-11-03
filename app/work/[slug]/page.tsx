import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/navbar";
import { StatusChip } from "@/components/project-entry";
import { Footer } from "@/components/footer";
import { getSiteContent } from "@/lib/siteContent";
import {
  getAdjacentProjects,
  getProject,
  projects,
  type Project,
} from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

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
  const project = getProject(slug);

  if (!project) notFound();

  const content = getSiteContent();
  const image = content.images.projects[project.id] || project.image;
  const { previous, next } = getAdjacentProjects(project.id);
  // The hero image is often also the first gallery entry; showing it twice reads
  // as a mistake, so the duplicate is dropped here.
  const gallery = (project.gallery ?? []).filter(
    (item) => Boolean(item.src) && item.src !== image
  );

  return (
    <>
      <div className="shell pt-10 md:pt-12">
        <SiteHeader
          site={content.site}
          profileImage={content.images.profile}
          ctaHref="/#contact"
          variant="detail"
        />

        <main className="pb-4">
          <header className="pt-10 text-center md:pt-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <h1 className="display-serif text-[2rem] md:text-[2.375rem]">
                {project.title}
              </h1>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-panel px-3 py-1.5 text-meta text-ink-muted transition-colors hover:bg-[#ecece8] hover:text-ink"
                >
                  Visit
                  <ArrowUpRight size={12} strokeWidth={1.75} />
                </a>
              )}
            </div>

            <p className="mt-3 text-meta text-ink-faint">
              {project.year} · {project.category}
            </p>

            <p className="mx-auto mt-8 max-w-[38rem] text-ink-muted">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-meta text-ink-faint">
              {project.status && <StatusChip status={project.status} />}
              {project.role && <span>{project.role}</span>}
            </div>
          </header>

          {image && (
            <figure className="mt-12">
              <div className="frame aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${project.title} — ${project.category}`}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </figure>
          )}

          {project.summary && (
            <section
              aria-labelledby="summary-heading"
              className="mt-12 bg-panel-warm"
            >
              <div className="border-b border-black/[0.05] px-6 py-3">
                <h2
                  id="summary-heading"
                  className="meta flex items-center gap-2 text-[#9a8a70]"
                >
                  <span aria-hidden="true">◎</span> Summary
                </h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-ink-soft">{project.summary}</p>
              </div>
            </section>
          )}

          {(project.challenge || project.approach || project.result) && (
            <dl className="mt-14">
              {[
                { label: "Challenge", value: project.challenge },
                { label: "Approach", value: project.approach },
                { label: "Outcome", value: project.result },
              ]
                .filter((row) => Boolean(row.value))
                .map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 border-b border-rule py-6 md:grid-cols-[minmax(0,11rem)_1fr] md:gap-10"
                  >
                    <dt className="meta pt-1">{row.label}</dt>
                    <dd className="text-ink-muted">{row.value}</dd>
                  </div>
                ))}
            </dl>
          )}

          {gallery.length > 0 && (
            <section id="visuals" className="mt-14 scroll-mt-16">
              <div className="grid gap-6 sm:grid-cols-2">
                {gallery.map((item) => (
                  <figure key={item.src + (item.caption ?? "")}>
                    <div className="frame aspect-[16/10]">
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
            <p className="mt-12 text-meta text-ink-faint">
              {project.technologies.join(" · ")}
            </p>
          )}

          <ProjectPager previous={previous} next={next} />
        </main>
      </div>

      <Footer site={content.site} />
    </>
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
      className="mt-16 grid border-t border-rule sm:grid-cols-2"
    >
      {previous && (
        <Link
          href={`/work/${previous.id}`}
          className="group border-b border-rule py-7 sm:border-b-0 sm:border-r sm:pr-8"
        >
          <span className="meta block">Previous</span>
          <span className="mt-2 block text-title text-ink-muted transition-colors group-hover:text-ink">
            {previous.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={`/work/${next.id}`}
          className="group py-7 sm:pl-8 sm:text-right"
        >
          <span className="meta block">Next</span>
          <span className="mt-2 block text-title text-ink-muted transition-colors group-hover:text-ink">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
