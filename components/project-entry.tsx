import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

/**
 * A single project presentation: one large image, then the metadata block
 * directly beneath it. No floating cards, no shadows — the image and the
 * typography do the work.
 */
export function ProjectEntry({
  project,
  compact = false,
  priority = false,
}: {
  project: Project;
  compact?: boolean;
  priority?: boolean;
}) {
  const href = `/work/${project.id}`;

  return (
    <article className="group">
      <Link
        href={href}
        aria-label={`${project.title} — ${project.tagline ?? project.category}`}
        className="frame frame-hover block aspect-[16/10]"
      >
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <ProjectPlaceholder project={project} />
        )}
      </Link>

      <div className={cn("mt-5", compact && "mt-3.5")}>
        <p className="meta flex items-baseline gap-1.5">
          <span className="text-ink-muted">{project.title}</span>
          <span aria-hidden="true" className="text-ink-faint">
            .
          </span>
          <span>{project.year}</span>
        </p>

        <h3 className="mt-2.5 text-title font-normal leading-snug tracking-[-0.01em] text-ink">
          <Link href={href} className="hover:text-ink-soft">
            {project.tagline ?? project.description}
          </Link>
        </h3>

        {!compact && (
          <p className="mt-1.5 max-w-[46ch] text-ink-muted md:max-w-none">
            {project.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-meta">
          <Link
            href={href}
            className="text-ink-faint transition-colors hover:text-ink"
          >
            Case study
          </Link>

          {project.status && <StatusChip status={project.status} />}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink-faint transition-colors hover:text-ink"
            >
              Visit
              <ArrowUpRight size={12} strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function StatusChip({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-panel px-2.5 py-[3px] text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-ink-muted">
      <span
        aria-hidden="true"
        className="h-1 w-1 rounded-full bg-current opacity-45"
      />
      {status}
    </span>
  );
}

/**
 * Honest placeholder: it states that imagery is still to come instead of
 * inventing a fake product screenshot. Replacing it is a matter of setting
 * `image` on the project record.
 */
function ProjectPlaceholder({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <span className="meta">{project.title}</span>
        <span className="meta">{project.year}</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <p className="max-w-[28ch] text-center text-meta text-ink-faint">
          {project.category} — preview coming soon
        </p>
      </div>
      <span className="meta opacity-70">{project.status}</span>
    </div>
  );
}
