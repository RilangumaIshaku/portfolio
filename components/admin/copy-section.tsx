"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, Field, Input, SaveButton, TextArea } from "./primitives";
import type { SiteCopy } from "@/lib/content-defaults";

/**
 * The copy that used to live inside components: About paragraphs, the Contact
 * invitation, and the section labels. Saved as one blob through the same
 * update-content path as the rest of the site settings.
 */
export function CopySection({
  copy,
  onSave,
  loading,
}: {
  copy: SiteCopy;
  onSave: (section: string, data: Record<string, unknown>) => void;
  loading: boolean;
}) {
  const [draft, setDraft] = useState<SiteCopy>(copy);

  useEffect(() => {
    setDraft(copy);
  }, [copy]);

  const setParagraph = (index: number, value: string) => {
    const about = [...draft.about];
    about[index] = value;
    setDraft({ ...draft, about });
  };

  const addParagraph = () => {
    setDraft({ ...draft, about: [...draft.about, ""] });
  };

  const removeParagraph = (index: number) => {
    setDraft({
      ...draft,
      about: draft.about.filter((_, position) => position !== index),
    });
  };

  const setLabel = (key: keyof SiteCopy["labels"], value: string) => {
    setDraft({ ...draft, labels: { ...draft.labels, [key]: value } });
  };

  const labelFields: Array<{ key: keyof SiteCopy["labels"]; title: string }> = [
    { key: "highlights", title: "Highlights" },
    { key: "projects", title: "Projects" },
    { key: "capabilities", title: "Capabilities" },
    { key: "about", title: "About" },
    { key: "faq", title: "FAQ" },
    { key: "contact", title: "Contact" },
    { key: "work", title: "Work index" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Copy
        </h1>
        <p className="text-sm text-white/30 mt-1">
          About, the contact invitation and the section headings.
        </p>
      </div>

      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium">
          About
        </p>
        {draft.about.map((paragraph, index) => (
          <div key={index} className="space-y-2">
            <Field label={`Paragraph ${index + 1}`}>
              <TextArea
                value={paragraph}
                onChange={(value) => setParagraph(index, value)}
                rows={4}
              />
            </Field>
            <button
              onClick={() => removeParagraph(index)}
              className="inline-flex items-center gap-1.5 text-[11px] text-white/25 hover:text-red-400/70 transition-colors"
            >
              <Trash2 size={11} /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={addParagraph}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <Plus size={12} /> Add paragraph
        </button>
      </Card>

      <Card>
        <Field
          label="Contact invitation"
          hint="The paragraph under the Contact heading, above your email"
        >
          <TextArea
            value={draft.contact}
            onChange={(value) => setDraft({ ...draft, contact: value })}
            rows={3}
          />
        </Field>
      </Card>

      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium">
          Section labels
        </p>
        <div className="grid grid-cols-2 gap-3">
          {labelFields.map(({ key, title }) => (
            <Field key={key} label={title}>
              <Input
                value={draft.labels[key]}
                onChange={(value) => setLabel(key, value)}
              />
            </Field>
          ))}
        </div>
      </Card>

      <SaveButton
        onClick={() =>
          onSave("copy", {
            about: draft.about,
            contact: draft.contact,
            labels: draft.labels,
          })
        }
        loading={loading}
      />
    </div>
  );
}
