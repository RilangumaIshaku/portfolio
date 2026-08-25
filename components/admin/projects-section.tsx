"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Field,
  Input,
  TextArea,
  Card,
  SaveButton,
  ImageUploadInline,
  uploadFile,
} from "./primitives";
import { PROJECT_IDS } from "./types";

export function ProjectsSection({
  data,
  onSave,
  loading,
  token,
}: {
  data: any[];
  onSave: (d: any[]) => void;
  loading: boolean;
  token: string;
}) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [imgLoading, setImgLoading] = useState<number | null>(null);
  useEffect(() => {
    setList(data);
  }, [data]);
  const update = (i: number, v: any) => {
    const n = [...list];
    n[i] = v;
    setList(n);
  };
  const add = () => {
    const n = [
      ...list,
      {
        id: `p-${Date.now()}`,
        title: "New Project",
        category: "Category",
        description: "Description.",
        technologies: [],
        image: "",
        url: "",
        color: "#000000",
      },
    ];
    setList(n);
    setExpanded(n.length - 1);
  };
  const remove = (i: number) => {
    setList(list.filter((_, j) => j !== i));
    if (expanded === i) setExpanded(null);
  };
  const move = (i: number, d: number) => {
    const t = i + d;
    if (t < 0 || t >= list.length) return;
    const n = [...list];
    [n[i], n[t]] = [n[t], n[i]];
    setList(n);
    setExpanded(t);
  };
  const uploadImg = async (i: number, file: File) => {
    setImgLoading(i);
    const url = await uploadFile(file, `project-${list[i].id}-image`, token);
    if (url) update(i, { ...list[i], image: url });
    setImgLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Projects
        </h1>
        <p className="text-sm text-white/30 mt-1">
          Your portfolio. Each project card on the landing page.
        </p>
      </div>
      {list.map((item: any, i: number) => (
        <Card key={i} className="!p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-0.5">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"
              >
                <ChevronUp size={12} />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                className="text-white/20 hover:text-white/50 disabled:opacity-20 p-1"
              >
                <ChevronDown size={12} />
              </button>
            </div>
            <span className="text-[11px] text-white/20 font-mono">
              #{i + 1}
            </span>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate"
            >
              {item.title}{" "}
              <span className="text-white/20">— {item.category}</span>
            </button>
            <button
              onClick={() => remove(i)}
              className="text-white/20 hover:text-red-400/70 p-1"
            >
              <Trash2 size={12} />
            </button>
          </div>
          {expanded === i && (
            <div className="p-4 space-y-3">
              <ImageUploadInline
                label="Project Screenshot"
                currentImage={item.image || ""}
                onUpload={(f) => uploadImg(i, f)}
                loading={imgLoading === i}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title">
                  <Input
                    value={item.title}
                    onChange={(v) => update(i, { ...item, title: v })}
                  />
                </Field>
                <Field label="Category">
                  <Input
                    value={item.category}
                    onChange={(v) => update(i, { ...item, category: v })}
                  />
                </Field>
              </div>
              <Field label="Description">
                <TextArea
                  value={item.description}
                  onChange={(v) =>
                    update(i, { ...item, description: v })
                  }
                  rows={2}
                />
              </Field>
              <Field label="Technologies" hint="Comma-separated">
                <Input
                  value={(item.technologies || []).join(", ")}
                  onChange={(v) =>
                    update(i, {
                      ...item,
                      technologies: v
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Next.js, React, TypeScript"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="URL" hint="Leave empty to hide">
                  <Input
                    value={item.url || ""}
                    onChange={(v) => update(i, { ...item, url: v })}
                  />
                </Field>
                <Field label="Accent Color">
                  <Input
                    value={item.color || "#000000"}
                    onChange={(v) => update(i, { ...item, color: v })}
                  />
                </Field>
              </div>
            </div>
          )}
        </Card>
      ))}
      <div className="flex gap-3">
        <button
          onClick={add}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <Plus size={14} /> Add
        </button>
        <SaveButton onClick={() => onSave(list)} loading={loading} />
      </div>
    </div>
  );
}
