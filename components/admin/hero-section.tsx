"use client";

import { useState, useEffect } from "react";
import { Field, Input, TextArea, Card, SaveButton } from "./primitives";
import type { SiteContent } from "./types";

export function HeroSection({
  content,
  onSave,
  loading,
}: {
  content: SiteContent;
  onSave: (s: string, d: Record<string, unknown>) => Promise<void>;
  loading: boolean;
}) {
  const [data, setData] = useState(content.hero);
  useEffect(() => {
    setData(content.hero);
  }, [content.hero]);
  const u = (f: string, v: string) => setData((p) => ({ ...p, [f]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Hero Section
        </h1>
        <p className="text-sm text-white/30 mt-1">
          The first thing visitors see on your homepage.
        </p>
      </div>
      <Card>
        <Field label="Headline" hint="The big bold text in the hero">
          <TextArea
            value={data.headline}
            onChange={(v) => u("headline", v)}
            rows={2}
          />
        </Field>
        <Field label="Subtitle" hint="Supporting text below the headline">
          <TextArea
            value={data.subtitle}
            onChange={(v) => u("subtitle", v)}
            rows={3}
          />
        </Field>
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Call-to-Action Buttons
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary Button Text">
            <Input
              value={data.ctaPrimary}
              onChange={(v) => u("ctaPrimary", v)}
            />
          </Field>
          <Field label="Primary Links To" hint="Section ID or URL">
            <Input
              value={data.ctaPrimaryTarget}
              onChange={(v) => u("ctaPrimaryTarget", v)}
            />
          </Field>
          <Field label="Secondary Button Text">
            <Input
              value={data.ctaSecondary}
              onChange={(v) => u("ctaSecondary", v)}
            />
          </Field>
          <Field label="Secondary Links To">
            <Input
              value={data.ctaSecondaryTarget}
              onChange={(v) => u("ctaSecondaryTarget", v)}
            />
          </Field>
        </div>
      </Card>
      <SaveButton
        onClick={() => onSave("hero", data)}
        loading={loading}
      />
    </div>
  );
}
