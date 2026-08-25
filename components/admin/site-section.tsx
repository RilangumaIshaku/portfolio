"use client";

import { useState, useEffect } from "react";
import { Field, Input, TextArea, Card, SaveButton } from "./primitives";
import type { SiteContent } from "./types";

export function SiteSection({
  content,
  onSave,
  loading,
}: {
  content: SiteContent;
  onSave: (s: string, d: Record<string, unknown>) => Promise<void>;
  loading: boolean;
}) {
  const [data, setData] = useState(content.site);
  useEffect(() => {
    setData(content.site);
  }, [content.site]);
  const u = (f: string, v: string) =>
    setData((p) => ({ ...p, [f]: v }));
  const us = (f: string, v: string) =>
    setData((p) => ({
      ...p,
      socials: { ...p.socials, [f]: v },
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Site Information
        </h1>
        <p className="text-sm text-white/30 mt-1">
          Your name, contact details, and social links.
        </p>
      </div>
      <Card>
        <Field label="Full Name" hint="Displayed in footer and SEO">
          <Input
            value={data.name}
            onChange={(v) => {
              u("name", v);
              u("brand", v);
            }}
          />
        </Field>
        <Field label="Tagline">
          <Input
            value={data.tagline}
            onChange={(v) => u("tagline", v)}
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={data.description}
            onChange={(v) => u("description", v)}
            rows={2}
          />
        </Field>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Contact
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <Input
              value={data.email}
              onChange={(v) => u("email", v)}
              type="email"
            />
          </Field>
          <Field label="WhatsApp" hint="With country code, no + or spaces">
            <Input
              value={data.whatsapp}
              onChange={(v) => u("whatsapp", v)}
            />
          </Field>
        </div>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Social Links
        </p>
        <div className="space-y-3">
          <Field label="GitHub">
            <Input
              value={data.socials.github}
              onChange={(v) => us("github", v)}
            />
          </Field>
          <Field label="LinkedIn">
            <Input
              value={data.socials.linkedin}
              onChange={(v) => us("linkedin", v)}
            />
          </Field>
          <Field label="Twitter / X">
            <Input
              value={data.socials.twitter}
              onChange={(v) => us("twitter", v)}
            />
          </Field>
        </div>
      </Card>
      <SaveButton
        onClick={() => onSave("site", data)}
        loading={loading}
      />
    </div>
  );
}
