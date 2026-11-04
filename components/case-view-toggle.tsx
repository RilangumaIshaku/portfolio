import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The reference's two reading modes, as real routes so each is linkable and
 * survives a refresh: the full case study, or the imagery on its own.
 */
export function CaseViewToggle({
  slug,
  active,
}: {
  slug: string;
  active: "case" | "visuals";
}) {
  const items = [
    { key: "visuals" as const, label: "Visuals only", href: `/work/${slug}/visuals` },
    { key: "case" as const, label: "Case study", href: `/work/${slug}` },
  ];

  return (
    <div className="mt-6 flex items-center justify-center gap-6">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "border-b pb-1 text-ink transition-colors",
              isActive
                ? "border-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
