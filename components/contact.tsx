"use client";

import { useState, type FormEvent } from "react";
import { SectionLabel } from "@/components/section-label";

type Status = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const EMPTY: FormData = { name: "", email: "", company: "", message: "" };

const inputClasses =
  "w-full border-0 border-b border-rule bg-transparent pb-2.5 pt-2 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors";

/**
 * Contact: a short invitation, the email address, and a form with three
 * fields. Submissions still go through the existing /api/contact route, so
 * rate limiting, storage and email delivery are unchanged.
 */
export function Contact({ email }: { email: string }) {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="mt-20 scroll-mt-16 md:mt-24">
      <SectionLabel>Contact.</SectionLabel>

      <div className="mt-7 max-w-[62ch]">
        <p className="text-ink-muted">
          If you are working on something that needs this kind of care, I would
          like to hear about it. A short note about the problem is enough to
          start.
        </p>
        <p className="mt-4">
          <a href={`mailto:${email}`} className="link">
            {email}
          </a>
        </p>
      </div>

      {status === "success" ? (
        <p className="mt-10 max-w-[62ch] text-ink" role="status">
          Thank you — your note has arrived. I&rsquo;ll reply within a couple of
          days.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 max-w-[62ch]">
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="block">
              <span className="meta block text-ink-faint">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={`${inputClasses} mt-1`}
                placeholder="Your name"
              />
            </label>

            <label className="block">
              <span className="meta block text-ink-faint">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={`${inputClasses} mt-1`}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="mt-7 block">
            <span className="meta block text-ink-faint">
              Company <span className="normal-case tracking-normal">(optional)</span>
            </span>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              autoComplete="organization"
              className={`${inputClasses} mt-1`}
              placeholder="Where you work"
            />
          </label>

          <label className="mt-7 block">
            <span className="meta block text-ink-faint">Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={3}
              className={`${inputClasses} mt-1 resize-none`}
              placeholder="What are you building?"
            />
          </label>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "loading"}
              className="pill disabled:cursor-wait disabled:opacity-60"
            >
              {status === "loading" ? "Sending" : "Send message"}
            </button>

            {status === "error" && (
              <p className="text-meta text-ink-muted" role="alert">
                That didn&rsquo;t send. Try again, or email me directly.
              </p>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
