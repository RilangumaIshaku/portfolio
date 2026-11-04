import type { SiteContent } from "@/lib/siteContent";
import { CopyEmail } from "@/components/copy-email";

/**
 * The introduction: name, one positioning line, two short paragraphs, and the
 * places to find me. Deliberately small — no display type, no illustration.
 *
 * Type and rhythm follow the reference exactly: 15px/23px body, a 17px/25px
 * statement line at normal weight, 24px between blocks.
 */
export function Introduction({ content }: { content: SiteContent }) {
  const { site, hero } = content;

  const profiles = [
    { label: "X", href: site.socials.twitter },
    { label: "GitHub", href: site.socials.github },
    { label: "LinkedIn", href: site.socials.linkedin },
  ].filter((profile) => Boolean(profile.href));

  return (
    <section className="pt-6" aria-labelledby="intro-heading">
      <p className="text-ink-muted">{site.name}</p>

      <h1
        id="intro-heading"
        className="mt-6 text-[1.0625rem] font-normal leading-[1.4706] tracking-[-0.01em] text-ink"
      >
        {hero.headline}
      </h1>

      <div className="mt-6 space-y-6 text-ink-muted">
        <p>{hero.subtitle}</p>
        {hero.approach && <p>{hero.approach}</p>}

        <p>
          {profiles.length > 0 ? "You can find me on" : "You can email me at"}{" "}
          {profiles.map((profile, index) => {
            const isLast = index === profiles.length - 1;
            const separator =
              index === 0
                ? ""
                : isLast
                  ? profiles.length === 2
                    ? " or "
                    : ", or "
                  : ", ";
            return (
              <span key={profile.label}>
                {separator}
                <span className="whitespace-nowrap">
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    {profile.label}
                  </a>
                  {isLast ? "," : ""}
                </span>
              </span>
            );
          })}
          {profiles.length > 0 && " or email me at "}
          <span className="whitespace-nowrap">
            <CopyEmail email={site.email} />
            {site.telegram && (
              <>
                {", or on "}
                <a
                  href={site.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Telegram
                </a>
              </>
            )}
            .
          </span>
        </p>
      </div>
    </section>
  );
}
