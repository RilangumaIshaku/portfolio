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
} from "./primitives";

export function PricingSection({
  data,
  onSave,
  loading,
}: {
  data: any[];
  onSave: (d: any[]) => void;
  loading: boolean;
}) {
  const [list, setList] = useState(data);
  const [expanded, setExpanded] = useState<number | null>(null);
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
        name: "New Tier",
        price: "₦0",
        priceAmount: 0,
        description: "Description.",
        features: [],
        highlighted: false,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Pricing
        </h1>
        <p className="text-sm text-white/30 mt-1">
          Your pricing tiers. Each card on the landing page.
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
            <span
              className={`text-[11px] font-mono ${item.highlighted ? "text-emerald-400/70" : "text-white/20"}`}
            >
              #{i + 1}
            </span>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="flex-1 text-left text-sm text-white/60 hover:text-white/80 truncate"
            >
              {item.name}{" "}
              <span className="text-white/20">— {item.price}</span>
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
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tier Name">
                  <Input
                    value={item.name}
                    onChange={(v) => update(i, { ...item, name: v })}
                  />
                </Field>
                <Field label="Price Display" hint="₦150,000 or Let's talk">
                  <Input
                    value={item.price}
                    onChange={(v) => update(i, { ...item, price: v })}
                  />
                </Field>
              </div>
              <Field label="Price Amount" hint="Numeric NGN (0 = custom)">
                <Input
                  type="number"
                  value={String(item.priceAmount || 0)}
                  onChange={(v) =>
                    update(i, {
                      ...item,
                      priceAmount: parseInt(v) || 0,
                    })
                  }
                />
              </Field>
              <Field label="Description">
                <TextArea
                  value={item.description}
                  onChange={(v) =>
                    update(i, { ...item, description: v })
                  }
                  rows={2}
                />
              </Field>
              <Field label="Features" hint="One per line">
                <TextArea
                  value={(item.features || []).join("\n")}
                  onChange={(v) =>
                    update(i, {
                      ...item,
                      features: v.split("\n").filter(Boolean),
                    })
                  }
                  rows={4}
                />
              </Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.highlighted || false}
                  onChange={(e) =>
                    update(i, {
                      ...item,
                      highlighted: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/[0.04]"
                />
                <span className="text-sm text-white/50">
                  Highlighted (Most Popular)
                </span>
              </label>
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
