import { NextRequest, NextResponse } from "next/server";
import { readData, readAllSections, SECTION_KEYS } from "@/lib/data-store";
import { verifyToken } from "@/lib/auth";
import { mergeWithDefaults } from "@/lib/siteContent";
import { DEFAULT_COPY, type SiteCopy } from "@/lib/content-defaults";

interface SiteContent {
  site: {
    name: string;
    brand: string;
    tagline: string;
    description: string;
    email: string;
    telegram: string;
    socials: { github: string; linkedin: string; twitter: string };
  };
  seo: { title: string; description: string; ogImage: string };
  hero: {
    headline: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaPrimaryTarget: string;
    ctaSecondaryTarget: string;
  };
  images: { profile: string; projects: Record<string, string> };
  links: { ctaTarget: string };
  copy: SiteCopy;
}

const defaultContent: SiteContent = {
  site: {
    name: "David Ishaku",
    brand: "David",
    tagline: "Web Developer & Designer",
    description:
      "I design and develop fast, modern, responsive websites for businesses and startups.",
    email: "davidishaku560@gmail.com",
    telegram: "https://t.me/rilanguma",
    socials: {
      github: "https://github.com/RilangumaIshaku",
      linkedin: "https://linkedin.com/in/Rilanguma",
      twitter: "https://twitter.com/rilanguma",
    },
  },
  seo: {
    title: "David Ishaku — Web Developer & Designer",
    description: "Freelance web developer crafting modern, responsive websites.",
    ogImage: "",
  },
  hero: {
    headline: "Hey, I'm David. I design premium & high-converting experiences.",
    subtitle:
      "Designing and developing fast, modern, responsive websites for businesses and startups that want to stand out and convert.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "View My Work",
    ctaPrimaryTarget: "#contact",
    ctaSecondaryTarget: "#work",
  },
  images: { profile: "", projects: {} },
  links: {
    ctaTarget: "#contact",
  },
  copy: DEFAULT_COPY,
};

/**
 * GET /api/admin/bulk
 * Returns all admin data in a single request (10x fewer calls).
 */
export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch everything in parallel
    const [content, availability, allSections] = await Promise.all([
      // Merge with defaults so the panel always sees every field, including
      // copy added after this content was last saved.
      readData<SiteContent>("content", defaultContent).then((stored) =>
        mergeWithDefaults(stored)
      ),
      readData<any>("availability", {
        isAvailable: true,
        status: "Available for new projects",
        color: "green",
        updatedAt: new Date().toISOString(),
      }),
      readAllSections(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        content,
        availability,
        ...allSections,
      },
    });
  } catch (error) {
    console.error("[Admin Bulk] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
