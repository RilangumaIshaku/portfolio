"use client";

import { useState, useEffect } from "react";
import { Field, TextArea, Card, SaveButton } from "./primitives";
import type { SiteContent } from "./types";

export function LinksSection({
  content,
  onSave,
  loading,
}: {
  content: SiteContent;
  onSave: (s: string, d: Record<string, unknown>) => Promise<void>;
  loading: boolean;
}) {
  const [links, setLinks] = useState(content.links);
  const [seo, setSeo] = useState(content.seo);
  useEffect(() => {
    setLinks(content.links);
    setSeo(content.seo);
  }, [content]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Links & SEO
        </h1>
        <p className="text-sm text-white/30 mt-1">
          WhatsApp message, page title, meta description, and OG image.
        </p>
      </div>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          WhatsApp
        </p>
        <Field
          label="Default Message"
          hint="Pre-filled when someone clicks WhatsApp"
        >
          <TextArea
            value={links.whatsappMessage}
            onChange={(v) =>
              setLinks((p) => ({ ...p, whatsappMessage: v }))
            }
            rows={2}
          />
        </Field>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          SEO Metadata
        </p>
        <Field label="Page Title">
          <input
            type="text"
            value={seo.title}
            onChange={(e) =>
              setSeo((p) => ({ ...p, title: e.target.value }))
            }
            className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
          />
        </Field>
        <Field label="Meta Description">
          <TextArea
            value={seo.description}
            onChange={(v) =>
              setSeo((p) => ({ ...p, description: v }))
            }
            rows={2}
          />
        </Field>
        <Field label="OG Image Path" hint="Place file in public/ folder">
          <input
            type="text"
            value={seo.ogImage}
            onChange={(e) =>
              setSeo((p) => ({ ...p, ogImage: e.target.value }))
            }
            className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
          />
        </Field>
      </Card>
      <div className="flex gap-3">
        <SaveButton
          onClick={() => onSave("links", links)}
          loading={loading}
          label="Save Links"
        />
        <SaveButton
          onClick={() => onSave("seo", seo)}
          loading={loading}
          label="Save SEO"
        />
      </div>
    </div>
  );
}
