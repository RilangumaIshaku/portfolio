"use client";

import { useRef, type ReactNode } from "react";
import {
  Save,
  Upload,
  Loader2,
  ImageIcon,
} from "lucide-react";

// ── Upload helper ───────────────────────────────────────────
export async function uploadFile(
  file: File,
  key: string,
  token: string
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  try {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "x-admin-token": token },
      body: formData,
    });
    const json = await res.json();
    if (json.url) return json.url;
  } catch {}
  return null;
}

// ── Field ───────────────────────────────────────────────────
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-white/50 mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-white/20 mt-1">{hint}</p>
      )}
    </div>
  );
}

// ── Input ───────────────────────────────────────────────────
export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
    />
  );
}

// ── TextArea ────────────────────────────────────────────────
export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all resize-none"
    />
  );
}

// ── Card ────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4 ${className}`}
    >
      {children}
    </div>
  );
}

// ── SaveButton ──────────────────────────────────────────────
export function SaveButton({
  onClick,
  loading,
  label = "Save Changes",
}: {
  onClick: () => void;
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2.5 h-11 px-6 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] disabled:opacity-25 transition-all duration-200"
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Save size={15} />
      )}
      {loading ? "Saving..." : label}
    </button>
  );
}

// ── ImageUploadInline ───────────────────────────────────────
export function ImageUploadInline({
  label,
  currentImage,
  onUpload,
  loading,
}: {
  label: string;
  currentImage: string;
  onUpload: (file: File) => Promise<void>;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="w-14 h-14 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
        {currentImage ? (
          <img
            src={currentImage}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={16} className="text-white/15" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 font-medium">{label}</p>
        <p className="text-[11px] text-white/20 mt-0.5 truncate">
          {currentImage || "No image"}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/50 hover:text-white/70 hover:bg-white/[0.10] transition-all disabled:opacity-30 shrink-0"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Upload size={12} />
        )}
        Upload
      </button>
    </div>
  );
}
