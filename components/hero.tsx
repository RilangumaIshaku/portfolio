import type { SiteContent } from "@/lib/siteContent";

/**
 * The introduction: name, one positioning line, two short paragraphs, and the
 * places to find me. Deliberately small — no display type, no illustration.
 */
export function Introduction({ content }: { content: SiteContent }) {
  const { site, hero } = content;

  const profiles = [
    { label: "X", href: site.socials.twitter },
    { label: "GitHub", href: site.socials.github },
    { label: "LinkedIn", href: site.socials.linkedin },
  ].filter((profile) => Boolean(profile.href));

  return (
    <section className="pt-12 md:pt-14" aria-labelledby="intro-heading">
      <p className="text-ink-soft">{site.name}</p>

      <h1
        id="intro-heading"
        className="mt-8 text-[1.0625rem] font-semibold leading-[1.5] tracking-[-0.008em] text-ink md:text-[1.1875rem]"
      >
        {hero.headline}
      </h1>

      <div className="mt-6 space-y-6 text-ink-muted">
        <p>{hero.subtitle}</p>
        {hero.approach && <p>{hero.approach}</p>}

        <p>
          You can find me on{" "}
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
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {profile.label}
                </a>
              </span>
            );
          })}
          {profiles.length > 0 ? ", or email me at " : "You can email me at "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
        </p>
      </div>
    </section>
  );
}
