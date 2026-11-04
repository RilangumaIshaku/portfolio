import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/avatar";

interface HeaderSite {
  name: string;
}

/**
 * The header: a portrait, a single black pill, nothing else.
 * `variant="detail"` adds the back button and centres the portrait, matching
 * the reference's project pages.
 */
export function SiteHeader({
  site,
  profileImage,
  ctaHref = "#contact",
  variant = "home",
}: {
  site: HeaderSite;
  profileImage?: string;
  ctaHref?: string;
  variant?: "home" | "detail";
}) {
  if (variant === "detail") {
    return (
      <header className="grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          aria-label="Back to the homepage"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start rounded-full bg-panel text-ink-muted transition-colors hover:bg-panel-soft hover:text-ink"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>

        <Link href="/" aria-label={`${site.name} — home`} className="justify-self-center">
          <Avatar src={profileImage} name={site.name} />
        </Link>

        <Link href={ctaHref} className="pill justify-self-end">
          <WorkWithMeLabel />
        </Link>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between">
      <Link href="/" aria-label={`${site.name} — home`}>
        <Avatar src={profileImage} name={site.name} />
      </Link>

      <Link href={ctaHref} className="pill">
        <WorkWithMeLabel />
      </Link>
    </header>
  );
}

/**
 * Two stacked labels inside a 20px clipping window: on hover the first rolls
 * up and "Book a call" rolls in beneath it — the same gesture the reference
 * uses on its header pill.
 */
function WorkWithMeLabel() {
  return (
    <span className="pill__labels">
      <span className="pill__label">Work with me</span>
      <span className="pill__label pill__label--alt" aria-hidden="true">
        Book a call
      </span>
    </span>
  );
}
