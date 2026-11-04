import { cn } from "@/lib/utils";

/**
 * Section label with the hairline that runs to the edge of the measure.
 * The reference uses one rule for every section heading rather than nested
 * cards or dividers.
 */
export function SectionLabel({
  children,
  id,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  id?: string;
  as?: "h2" | "h3" | "p";
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-center gap-4", className)}>
      <Tag
        id={id}
        className="shrink-0 text-[0.9375rem] font-normal leading-[1.5333] text-ink"
      >
        {children}
      </Tag>
      <span className="rule" aria-hidden="true" />
    </div>
  );
}
