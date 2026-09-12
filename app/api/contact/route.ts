import { NextRequest, NextResponse } from "next/server";
import { writeData, readData } from "@/lib/data-store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { Resend } from "resend";

/**
 * Escape user-provided strings before interpolating into the HTML email
 * template. Without this, a submitter could inject arbitrary HTML (e.g.
 * hidden links or forged content) into the inquiry email.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Keep payloads bounded so a single request can't bloat storage. */
function sanitize(value: unknown, maxLen: number): string {
  const str = typeof value === "string" ? value : "";
  return str.trim().slice(0, maxLen);
}

// Retention: keep the most recent N submissions so the store can't grow forever.
const MAX_SUBMISSIONS = 200;

// Rate limit: 5 submissions per IP per 10 minutes.
const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;

interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
  submittedAt: string;
}

function buildEmailHtml(submission: ContactSubmission): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background:#0a0a0b;padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:-0.02em;">
        New Project Inquiry
      </h1>
      <p style="margin:8px 0 0;color:#78716c;font-size:13px;">
        From your portfolio contact form
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Name</p>
        <p style="margin:0;color:#0a0a0b;font-size:15px;font-weight:500;">${escapeHtml(submission.name)}</p>
      </div>

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Email</p>
        <p style="margin:0;color:#0a0a0b;font-size:15px;">
          <a href="mailto:${escapeHtml(submission.email)}" style="color:#7187C4;text-decoration:none;">${escapeHtml(submission.email)}</a>
        </p>
      </div>

      ${submission.company ? `
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Company</p>
        <p style="margin:0;color:#0a0a0b;font-size:15px;">${escapeHtml(submission.company)}</p>
      </div>
      ` : ""}

      ${submission.projectType ? `
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Project Type</p>
        <p style="margin:0;color:#0a0a0b;font-size:15px;">${escapeHtml(submission.projectType)}</p>
      </div>
      ` : ""}

      ${submission.budget ? `
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Budget</p>
        <p style="margin:0;color:#0a0a0b;font-size:15px;">${escapeHtml(submission.budget)}</p>
      </div>
      ` : ""}

      <div style="margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#78716c;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Message</p>
        <div style="margin:0;color:#0a0a0b;font-size:15px;line-height:1.6;background:#f5f5f4;padding:16px;border-radius:8px;">
          ${escapeHtml(submission.message).replace(/\n/g, "<br>")}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;border-top:1px solid #e7e5e4;">
      <p style="margin:0;color:#78716c;font-size:12px;">
        Submitted ${new Date(submission.submittedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit before doing any work
    const ip = getClientIp(request);
    const rl = rateLimit(`contact:${ip}`, CONTACT_LIMIT, CONTACT_WINDOW_MS);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const submission: ContactSubmission = {
      name: sanitize(name, 120),
      email: sanitize(email, 254),
      company: sanitize(body.company, 160),
      projectType: sanitize(body.projectType, 80),
      budget: sanitize(body.budget, 80),
      message: sanitize(message, 5000),
      submittedAt: new Date().toISOString(),
    };

    // Store submission in data store — capped at MAX_SUBMISSIONS entries
    const submissions = await readData<ContactSubmission[]>(
      "contact_submissions",
      []
    );
    submissions.push(submission);
    await writeData("contact_submissions", submissions.slice(-MAX_SUBMISSIONS));

    // Send email via Resend (if configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "davidishaku560@gmail.com";

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
          to: contactEmail,
          replyTo: email,
          subject: `New project inquiry from ${submission.name}`,
          html: buildEmailHtml(submission),
        });
        console.log(`[Contact] Email sent to ${contactEmail} from ${name} <${email}>`);
      } catch (emailErr) {
        // Log but don't fail — submission is already stored
        console.error("[Contact] Email send failed (submission still saved):", emailErr);
      }
    } else {
      console.log(`[Contact] RESEND_API_KEY not set — submission saved but email not sent. Log: ${name} <${email}>`);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received. I'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
