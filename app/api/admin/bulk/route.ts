import { NextRequest, NextResponse } from "next/server";
import { readData, readAllSections, SECTION_KEYS } from "@/lib/data-store";
import { verifyToken } from "@/lib/auth";

interface SiteContent {
  site: {
    name: string;
    brand: string;
    tagline: string;
    description: string;
    email: string;
    whatsapp: string;
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
  links: { whatsappMessage: string; ctaTarget: string };
}

const defaultContent: SiteContent = {
  site: {
    name: "Rilan",
    brand: "Rilan",
    tagline: "Freelance Web Developer",
    description:
      "I design and develop fast, modern, responsive websites for businesses and startups.",
    email: "davidishaku560@gmail.com",
    whatsapp: "+2347051565727",
    socials: {
      github: "https://github.com/RilangumaIshaku",
      linkedin: "https://linkedin.com/in/Rilanguma",
      twitter: "https://twitter.com/rilanguma",
    },
  },
  seo: {
    title: "Rilan — Freelance Web Developer",
    description: "Freelance web developer crafting modern, responsive websites.",
    ogImage: "/images/og-image.png",
  },
  hero: {
    headline: "Hey, I'm Rilan. I design premium & high-converting experiences.",
    subtitle:
      "Designing and developing fast, modern, responsive websites for businesses and startups that want to stand out and convert.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "View My Work",
    ctaPrimaryTarget: "#contact",
    ctaSecondaryTarget: "#work",
  },
  images: { profile: "", projects: {} },
  links: {
    whatsappMessage: "Hi! I'm interested in working with you on a project.",
    ctaTarget: "#contact",
  },
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
      readData<SiteContent>("content", defaultContent),
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
