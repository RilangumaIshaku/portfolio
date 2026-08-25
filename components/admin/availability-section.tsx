"use client";

import { useState } from "react";
import { Field, Input, Card, SaveButton } from "./primitives";
import type { AvailabilityData } from "./types";
import { COLOR_OPTIONS, PRESET_MESSAGES } from "./types";

export function AvailabilitySection({
  availability,
  setAvailability,
  onSave,
  loading,
}: {
  availability: AvailabilityData;
  setAvailability: (v: AvailabilityData) => void;
  onSave: () => Promise<void>;
  loading: boolean;
}) {
  const dotColor =
    availability.color === "green"
      ? "#22c55e"
      : availability.color === "yellow"
        ? "#eab308"
        : "#ef4444";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Availability
        </h1>
        <p className="text-sm text-white/30 mt-1">
          Control the availability badge on your homepage.
        </p>
      </div>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Live Preview
        </p>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: dotColor }}
          />
          <span className="text-sm text-white/70">
            {availability.status}
          </span>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 font-medium">
              Show badge
            </p>
            <p className="text-xs text-white/25 mt-1">
              {availability.isAvailable ? "Visible" : "Hidden"}
            </p>
          </div>
          <button
            onClick={() =>
              setAvailability({
                ...availability,
                isAvailable: !availability.isAvailable,
              })
            }
            className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 shrink-0 ml-4 ${
              availability.isAvailable
                ? "bg-[#34c759]"
                : "bg-white/[0.12]"
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform duration-200 ${
                availability.isAvailable
                  ? "translate-x-[20px]"
                  : ""
              }`}
            />
          </button>
        </div>
      </Card>
      <Card>
        <Field label="Status Message">
          <Input
            value={availability.status}
            onChange={(v) =>
              setAvailability({ ...availability, status: v })
            }
          />
        </Field>
        <div className="flex flex-wrap gap-2 mt-2">
          {PRESET_MESSAGES.map((msg) => (
            <button
              key={msg}
              onClick={() =>
                setAvailability({ ...availability, status: msg })
              }
              className={`h-8 px-3 rounded-full text-[11px] font-medium transition-all ${
                availability.status === msg
                  ? "bg-white/[0.12] text-white/80 border border-white/[0.12]"
                  : "bg-white/[0.03] text-white/30 border border-transparent hover:bg-white/[0.06]"
              }`}
            >
              {msg}
            </button>
          ))}
        </div>
      </Card>
      <div>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Dot Color
        </p>
        <div className="grid grid-cols-3 gap-3">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setAvailability({ ...availability, color: opt.value })
              }
              className={`flex flex-col items-center gap-3 py-5 rounded-2xl border transition-all ${
                availability.color === opt.value
                  ? "border-white/[0.15] bg-white/[0.06]"
                  : "border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1]"
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: opt.dot }}
              />
              <span className="text-xs text-white/50 font-medium">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <SaveButton onClick={onSave} loading={loading} />
    </div>
  );
}
