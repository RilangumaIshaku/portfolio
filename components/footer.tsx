"use client";

import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";

interface SiteData {
  name: string;
  brand: string;
  description: string;
  email: string;
  socials: { github: string; linkedin: string; twitter: string };
}

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Footer({ site }: { site: SiteData }) {
  const socialLinks = [
    { icon: Github, href: site.socials.github, label: "GitHub" },
    { icon: Linkedin, href: site.socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: site.socials.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${site.email}`, label: "Email" },
  ];
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-surface">
      <div className="section-container section-padding py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Left */}
          <div className="max-w-sm">
            <a
              href="#"
              onClick={scrollToTop}
              className="text-display-sm font-semibold tracking-tight"
            >
              {site.brand}
            </a>
            <p className="mt-3 text-body-sm leading-[var(--leading-body)] text-muted-foreground">
              {site.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-label font-medium uppercase tracking-[var(--tracking-label)] text-muted-foreground/60">
              Navigation
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-body-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h4 className="text-label font-medium uppercase tracking-[var(--tracking-label)] text-muted-foreground/60">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 text-muted-foreground transition-all duration-300 hover:border-accent-blue/25 hover:text-accent-blue"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">            <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <a
            href="#"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-accent transition-colors"
          >
            Back to top
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
