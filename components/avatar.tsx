import { cn } from "@/lib/utils";

/**
 * The small circular portrait that anchors the top of every page. The site is
 * designed to work without a photograph, so a quiet monogram stands in until
 * one is uploaded through the admin panel.
 */
export function Avatar({
  src,
  name,
  className,
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      className={cn(
        "block h-11 w-11 shrink-0 overflow-hidden rounded-full bg-panel ring-1 ring-inset ring-black/[0.04]",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={88}
          height={88}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-serif text-[16px] leading-none text-ink-muted"
        >
          {initials || "·"}
        </span>
      )}
    </span>
  );
}
