import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

/**
 * A single project presentation: the image at its own aspect ratio on a flat
 * grey stage, then the metadata block directly beneath it. No floating cards,
 * no shadows — the image and the typography do the work.
 */
export function ProjectEntry({
  project,
  compact = false,
  priority = false,
  highlight = false,
  visuals = false,
}: {
  project: Project;
  compact?: boolean;
  priority?: boolean;
  /** The homepage's single featured project gets the gallery affordance. */
  highlight?: boolean;
  /** Whether the project has any imagery to show on its visuals route. */
  visuals?: boolean;
}) {
  const href = `/work/${project.id}`;
  const visualsHref = `${href}/visuals`;

  return (
    <article className="group">
      <Link
        href={href}
        aria-label={`${project.title} — ${project.tagline ?? project.category}`}
        data-media-cursor={project.image ? "eye" : undefined}
        className={cn(
          "stage stage-hover block",
          project.image ? "stage-natural" : "aspect-[16/9]"
        )}
      >
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <ProjectPlaceholder project={project} />
        )}
      </Link>

      {highlight && visuals && (
        <div className="mt-4 flex justify-center">
          <Link href={visualsHref} className="pill pill--quiet">
            See gallery
          </Link>
        </div>
      )}

      <div className={cn("mt-4", compact && "mt-4")}>
        <p className="text-[0.75rem] uppercase leading-[1rem] tracking-[0.04em] text-ink-faint">
          {project.title}
          {project.year ? `. ${project.year}` : "."}
        </p>

        <h3 className="mt-2 text-ink">
          <Link href={href} className="transition-colors hover:text-ink-muted">
            {project.tagline ?? project.description}
          </Link>
        </h3>

        {!compact && <p className="mt-2 text-ink-muted">{project.description}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-ink transition-opacity hover:opacity-60"
          >
            Case study
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </Link>

          {visuals && (
            <Link
              href={visualsHref}
              className="inline-flex items-center gap-1 text-ink transition-opacity hover:opacity-60"
            >
              Visuals
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </Link>
          )}

          {project.status && <StatusChip status={project.status} />}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink transition-opacity hover:opacity-60"
            >
              Visit
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function StatusChip({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.75rem] leading-none text-ink-faint">
      <span
        aria-hidden="true"
        className="h-1 w-1 rounded-full bg-current opacity-70"
      />
      {status}
    </span>
  );
}

/**
 * Honest placeholder: it states that imagery is still to come instead of
 * inventing a fake product screenshot. Replacing it is a matter of setting
 * `image` on the project record, or uploading one in the admin panel.
 */
function ProjectPlaceholder({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-5 sm:p-6">
      <p className="max-w-[30ch] text-center text-[0.8125rem] leading-[1.5] text-ink-faint">
        {project.category} — preview coming soon
      </p>
    </div>
  );
}
