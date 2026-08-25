"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Home, Linkedin, Twitter, Github, Menu, X, ArrowUpRight } from "lucide-react";

interface SiteData {
  name: string;
  brand: string;
  socials: { github: string; linkedin: string; twitter: string };
}

export function Navbar({ site }: { site: SiteData }) {
  const socialLinks = [
    { icon: Linkedin, href: site.socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: site.socials.twitter, label: "Twitter" },
    { icon: Github, href: site.socials.github, label: "GitHub" },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const scrollToSection = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop floating pill */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 hidden md:block",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <nav className="liquid-glass flex items-center gap-0.5 rounded-full px-1.5 py-1.5">
          {/* Home */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            aria-label="Home"
          >
            <Home size={14} />
          </a>

          {/* Separator */}
          <div className="w-px h-3.5 bg-border mx-0.5" />

          {/* Socials */}
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              aria-label={link.label}
            >
              <link.icon size={14} />
            </a>
          ))}

          {/* Separator */}
          <div className="w-px h-3.5 bg-border mx-0.5" />

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#contact");
            }}
            className="btn-dark h-8 px-4 flex items-center gap-1.5 rounded-full bg-[#0a0a0b] text-white text-[11px] font-medium hover:bg-[#1a1a1c] transition-all"
          >
            Let&apos;s Work Together
            <ArrowUpRight size={12} />
          </a>
        </nav>
      </div>

      {/* Mobile floating button */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-50 md:hidden transition-all duration-500",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="btn-dark h-12 w-12 rounded-full bg-[#0a0a0b] text-white flex items-center justify-center shadow-lg shadow-black/[0.15]"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-surface/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden transition-all duration-300",
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Home */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsMobileOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 text-body font-medium text-primary"
        >
          <Home size={20} />
          Home
        </a>

        {/* Socials */}
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-body font-medium text-primary"
          >
            <link.icon size={20} />
            {link.label}
          </a>
        ))}

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#contact");
          }}
          className="btn-dark mt-4 h-12 px-8 flex items-center gap-2 rounded-full bg-[#0a0a0b] text-white text-button font-medium"
        >
          Let&apos;s Work Together
          <ArrowUpRight size={16} />
        </a>
      </div>
    </>
  );
}
