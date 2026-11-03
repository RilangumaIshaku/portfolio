interface FooterSite {
  name: string;
  email: string;
  socials: { github: string; linkedin: string; twitter: string };
}

export function Footer({ site }: { site: FooterSite }) {
  const links = [
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Email", href: `mailto:${site.email}` },
    { label: "GitHub", href: site.socials.github },
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "X", href: site.socials.twitter },
  ].filter((link) => Boolean(link.href));

  return (
    <footer className="mt-20 md:mt-24">
      <div className="shell pb-12">
        <div className="flex flex-col gap-4 border-t border-rule pt-7 text-meta text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => {
              const isExternal = /^https?:\/\//.test(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-ink"
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
