import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readData, writeData, SECTION_KEYS, USE_KV } from "@/lib/data-store";

// ── File paths for uploads (local dev only) ────────────────
import path from "path";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ── Interfaces ─────────────────────────────────────────────
interface AvailabilityData {
  isAvailable: boolean;
  status: string;
  color: "green" | "yellow" | "red";
  updatedAt: string;
}

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
    name: "YOUR_NAME_HERE",
    brand: "YOUR_NAME_HERE",
    tagline: "Freelance Web Developer",
    description:
      "I design and develop fast, modern, responsive websites for businesses and startups.",
    email: "YOUR_EMAIL_HERE",
    whatsapp: "YOUR_WHATSAPP_NUMBER_HERE",
    socials: {
      github: "https://github.com/YOUR_GITHUB_USERNAME",
      linkedin: "https://linkedin.com/in/YOUR_LINKEDIN_USERNAME",
      twitter: "https://twitter.com/YOUR_TWITTER_USERNAME",
    },
  },
  seo: {
    title: "YOUR_NAME_HERE — Freelance Web Developer",
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

// ── Token helpers ──────────────────────────────────────────
function createToken(password: string): string {
  return Buffer.from(`${password}:${Date.now()}`).toString("base64url");
}

function verifyTokenFromRequest(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const password = decoded.split(":")[0];
    const adminPassword = process.env.ADMIN_PASSWORD || "Rilanguma18";
    return password === adminPassword;
  } catch {
    return false;
  }
}

function verifyToken(request: NextRequest): boolean {
  return verifyTokenFromRequest(request);
}

// ── Helper: invalidate homepage ISR cache ──────────────────
function bustCache() {
  revalidatePath("/");
}

// ── POST /api/admin ────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // ── Multipart upload ──
    if (contentType.includes("multipart/form-data")) {
      if (!verifyToken(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const key = (formData.get("key") as string) || "upload";

      if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
      }

      const ext = file.name.split(".").pop() || "jpg";
      const safeName = key.replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `${safeName}-${Date.now()}.${ext}`;
      const url = `/uploads/${fileName}`;

      // Try to save file to disk (works locally, fails silently on Vercel)
      try {
        ensureDir(UPLOAD_DIR);
        const bytes = await file.arrayBuffer();
        const filePath = path.join(UPLOAD_DIR, fileName);
        writeFileSync(filePath, Buffer.from(bytes));
      } catch {
        // On Vercel, filesystem is read-only. The URL is still stored in data.
      }

      // Update content in KV regardless of file save
      if (key === "profile" || key.startsWith("project-")) {
        const content = await readData<SiteContent>("content", defaultContent);
        if (key === "profile") {
          content.images.profile = url;
        } else if (key.startsWith("project-")) {
          const projectId = key.replace("project-", "");
          content.images.projects[projectId] = url;
        }
        const result = await writeData("content", content);
        if (!result.ok) {
          return NextResponse.json(
            { error: `Save failed: ${result.reason}. Data will not persist. Please configure Vercel KV (Redis).` },
            { status: 500 }
          );
        }
        bustCache();
      }

      return NextResponse.json({ success: true, url });
    }

    // ── JSON actions ──
    const body = await request.json();
    const { action } = body;

    // ── Login ──
    if (action === "login") {
      const { password } = body;
      if (!password) {
        return NextResponse.json({ error: "Password required" }, { status: 400 });
      }
      const adminPassword = process.env.ADMIN_PASSWORD || "Rilanguma18";
      if (password !== adminPassword) {
        return NextResponse.json({ error: "Wrong password" }, { status: 401 });
      }
      const token = createToken(password);
      return NextResponse.json({ success: true, token });
    }

    // All actions after login require auth
    if (!verifyToken(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Get availability ──
    if (action === "get") {
      const data = await readData<AvailabilityData>("availability", {
        isAvailable: true,
        status: "Available for new projects",
        color: "green",
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, data });
    }

    // ── Update availability ──
    if (action === "update") {
      const { isAvailable, status, color } = body;
      if (typeof isAvailable !== "boolean" || !status || !color) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      if (!["green", "yellow", "red"].includes(color)) {
        return NextResponse.json({ error: "Invalid color" }, { status: 400 });
      }
      const updated: AvailabilityData = {
        isAvailable,
        status,
        color,
        updatedAt: new Date().toISOString(),
      };
      const result = await writeData("availability", updated);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data: updated });
    }

    // ── Get site content ──
    if (action === "get-content") {
      const content = await readData<SiteContent>("content", defaultContent);
      return NextResponse.json({ success: true, data: content });
    }

    // ── Update site content (partial) ──
    if (action === "update-content") {
      const { section, data } = body;
      if (!section || !data) {
        return NextResponse.json({ error: "Missing section or data" }, { status: 400 });
      }

      const content = await readData<SiteContent>("content", defaultContent);

      if (section === "site") {
        content.site = { ...content.site, ...data, socials: { ...content.site.socials, ...data.socials } };
      } else if (section === "seo") {
        content.seo = { ...content.seo, ...data };
      } else if (section === "hero") {
        content.hero = { ...content.hero, ...data };
      } else if (section === "links") {
        content.links = { ...content.links, ...data };
      } else if (section === "images") {
        content.images = { ...content.images, ...data, projects: { ...content.images.projects, ...data.projects } };
      } else {
        return NextResponse.json({ error: "Unknown section" }, { status: 400 });
      }

      const result = await writeData("content", content);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data: content });
    }

    // ══════════════════════════════════════════════════════════
    //  SECTION DATA (services, faq, projects, testimonials, etc.)
    // ══════════════════════════════════════════════════════════

    // ── Get section data ──
    if (action === "get-section") {
      const { section } = body;
      if (!section || !SECTION_KEYS.includes(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      const data = await readData<unknown[]>(section, []);
      return NextResponse.json({ success: true, data });
    }

    // ── Replace entire section data ──
    if (action === "update-section") {
      const { section, data } = body;
      if (!section || !SECTION_KEYS.includes(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      if (!Array.isArray(data)) {
        return NextResponse.json({ error: "Data must be an array" }, { status: 400 });
      }
      const result = await writeData(section, data);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data });
    }

    // ── Add item to section ──
    if (action === "add-item") {
      const { section, item } = body;
      if (!section || !SECTION_KEYS.includes(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      if (!item || typeof item !== "object") {
        return NextResponse.json({ error: "Item must be an object" }, { status: 400 });
      }
      const items = await readData<unknown[]>(section, []);
      items.push(item);
      const result = await writeData(section, items);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data: items });
    }

    // ── Update single item in section ──
    if (action === "update-item") {
      const { section, index, item } = body;
      if (!section || !SECTION_KEYS.includes(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      if (typeof index !== "number" || !item || typeof item !== "object") {
        return NextResponse.json({ error: "Invalid index or item" }, { status: 400 });
      }
      const items = await readData<unknown[]>(section, []);
      if (index < 0 || index >= items.length) {
        return NextResponse.json({ error: "Index out of range" }, { status: 400 });
      }
      items[index] = item;
      const result = await writeData(section, items);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data: items });
    }

    // ── Delete item from section ──
    if (action === "delete-item") {
      const { section, index } = body;
      if (!section || !SECTION_KEYS.includes(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      if (typeof index !== "number") {
        return NextResponse.json({ error: "Invalid index" }, { status: 400 });
      }
      const items = await readData<unknown[]>(section, []);
      if (index < 0 || index >= items.length) {
        return NextResponse.json({ error: "Index out of range" }, { status: 400 });
      }
      items.splice(index, 1);
      const result = await writeData(section, items);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data: items });
    }

    // ── Reorder items in section ──
    if (action === "reorder-section") {
      const { section, fromIndex, toIndex } = body;
      if (!section || !SECTION_KEYS.includes(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      if (typeof fromIndex !== "number" || typeof toIndex !== "number") {
        return NextResponse.json({ error: "Invalid indices" }, { status: 400 });
      }
      const items = await readData<unknown[]>(section, []);
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
        return NextResponse.json({ error: "Index out of range" }, { status: 400 });
      }
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const result = await writeData(section, items);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      bustCache();
      return NextResponse.json({ success: true, data: items });
    }

    // ── Download jobs as CSV ──
    if (action === "download-jobs") {
      const { date } = body;
      const jobs = await readData<any[]>("jobs", []);

      let filtered = jobs;
      if (date) {
        filtered = jobs.filter((j: any) => j.found_at && j.found_at.startsWith(date));
      }

      const header = "ID,Source,Title,Company,URL,Score,High Priority,Salary,Location,Tags,Keywords Matched,Found At";
      const rows = filtered.map((j: any) => {
        const escape = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
        return [
          escape(j.id),
          escape(j.source),
          escape(j.title),
          escape(j.company),
          escape(j.url),
          j.score || 0,
          j.high_priority ? "Yes" : "No",
          escape(j.salary || ""),
          escape(j.location || ""),
          escape((j.tags || []).join(", ")),
          escape((j.keywords_matched || []).join(", ")),
          escape(j.found_at || ""),
        ].join(",");
      });

      const csv = [header, ...rows].join("\n");
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="jobs${date ? "-" + date : "-all"}.csv"`,
        },
      });
    }

    // ── Clear old jobs ──
    if (action === "clear-jobs") {
      const { olderThanDays } = body;
      const jobs = await readData<any[]>("jobs", []);

      if (typeof olderThanDays === "number") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - olderThanDays);
        const cutoffStr = cutoff.toISOString();
        const remaining = jobs.filter((j: any) => j.found_at && j.found_at > cutoffStr);
        const result = await writeData("jobs", remaining);
        if (!result.ok) {
          return NextResponse.json(
            { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
            { status: 500 }
          );
        }
        return NextResponse.json({ success: true, data: remaining, removed: jobs.length - remaining.length });
      }

      const result = await writeData("jobs", []);
      if (!result.ok) {
        return NextResponse.json(
          { error: `Save failed: ${result.reason}. Please configure Vercel KV (Redis).` },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, data: [], removed: jobs.length });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
