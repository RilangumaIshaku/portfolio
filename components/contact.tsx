"use client";

import { useState, type FormEvent } from "react";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SiteData {
  email: string;
  whatsapp: string;
}

interface LinksData {
  whatsappMessage: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";

const projectTypes = [
  "Business Website",
  "Landing Page",
  "E-commerce",
  "Web Application",
  "Website Redesign",
  "Other",
];

const budgetRanges = [
  "Under ₦200,000",
  "₦200,000 – ₦500,000",
  "₦500,000 – ₦1,000,000",
  "₦1,000,000+",
  "Not sure yet",
];

export function Contact({ site, links }: { site: SiteData; links: LinksData }) {
  const { ref, isInView } = useInView();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    // TODO: Connect your preferred email provider
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = cn(
    "w-full h-12 rounded-xl border border-border/80 bg-white px-4 text-sm text-primary",
    "placeholder:text-muted-foreground/40",
    "transition-all duration-300",
    "focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/10",
    "hover:border-border"
  );

  const errorInputClasses = "border-red-400/60 focus:ring-red-400/20 focus:border-red-400/40";

  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(links.whatsappMessage)}`;

  return (
    <section id="contact" className="section-spacing bg-muted/30">
      <div className="section-container section-padding">
        <SectionHeading
          label="Get in Touch"
          title="Have a project in mind? Let's build it."
          description="Fill out the form below and I'll get back to you within 24 hours. Or reach me directly on WhatsApp."
        />

        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 md:gap-12 max-w-5xl mx-auto transition-all duration-700",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Form */}
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-16 lg:py-0">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-display-md font-medium mb-2">Message Sent!</h3>
              <p className="text-body-sm text-muted-foreground max-w-sm">
                Thanks for reaching out. I&apos;ll get back to you within 24 hours.
              </p>
              <Button
                variant="ghost"
                className="mt-6"
                onClick={() => {
                  setStatus("idle");
                  setFormData({
                    name: "",
                    email: "",
                    company: "",
                    projectType: "",
                    budget: "",
                    message: "",
                  });
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name + Email side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={cn(inputClasses, errors.name && errorInputClasses)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={cn(inputClasses, errors.email && errorInputClasses)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-muted-foreground mb-2">
                  Business / Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your business name (optional)"
                  className={inputClasses}
                />
              </div>

              {/* Project type + Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectType" className="block text-xs font-medium text-muted-foreground mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={cn(inputClasses, "appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10")}
                  >
                    <option value="">Select a type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="block text-xs font-medium text-muted-foreground mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={cn(inputClasses, "appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-10")}
                  >
                    <option value="">Select a range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-2">
                  Project Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, goals, and timeline..."
                  className={cn(
                    "w-full rounded-xl border border-border/80 bg-white px-4 py-3 text-sm text-primary",
                    "placeholder:text-muted-foreground/40 resize-none",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary/10",
                    "hover:border-border",
                    errors.message && errorInputClasses
                  )}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}                    className="btn-dark w-full h-12 rounded-xl bg-[#0a0a0b] text-white text-button font-medium flex items-center justify-center gap-2 hover:bg-[#1a1a1c] active:scale-[0.98] disabled:opacity-40 transition-all duration-300"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Start a Project
                    <Send size={14} />
                  </>
                )}
              </button>

              {status === "error" && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  Something went wrong. Please try again or contact me directly.
                </p>
              )}
            </form>
          )}

          {/* WhatsApp CTA */}
          <div className="flex flex-col justify-center gap-6 lg:pl-8">
            <div className="rounded-2xl border border-border bg-surface p-7">
              <h3 className="text-display-sm font-medium mb-2">Prefer WhatsApp?</h3>
              <p className="text-body-sm text-muted-foreground mb-5 leading-[var(--leading-body)]">
                If you&apos;d rather chat directly, send me a message on WhatsApp and
                I&apos;ll respond as quickly as possible.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="w-full" size="lg">
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-7">
              <h3 className="text-display-sm font-medium mb-2">Direct Email</h3>
              <p className="text-body-sm text-muted-foreground mb-3 leading-[var(--leading-body)]">
                Or send me an email directly. I typically respond within 24 hours.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="text-body-sm font-medium text-primary hover:text-primary/70 transition-colors"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
