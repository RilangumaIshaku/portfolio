/**
 * Image upload helper.
 *
 * Priority:
 *   1. Vercel Blob (if BLOB_READ_WRITE_TOKEN is set)
 *   2. imgbb API (if IMGBB_API_KEY is set — free at https://api.imgbb.com/)
 *   3. Local filesystem (dev only, fails on Vercel)
 */

import path from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export interface UploadResult {
  url: string;
  provider: string;
}

/**
 * Upload an image file. Returns the public URL.
 */
export async function uploadImage(
  file: File,
  fileName: string
): Promise<UploadResult> {
  // 1. Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { url: blob.url, provider: "vercel-blob" };
  }

  // 2. imgbb (free image hosting)
  const imgbbKey = process.env.IMGBB_API_KEY;
  if (imgbbKey) {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const formData = new FormData();
    formData.append("key", imgbbKey);
    formData.append("image", base64);
    formData.append("name", fileName.replace(/\.[^.]+$/, ""));

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        `imgbb upload failed: ${err.error?.message || res.statusText}`
      );
    }

    const data = await res.json();
    return { url: data.data.url, provider: "imgbb" };
  }

  // 3. Local filesystem (dev only)
  const bytes = await file.arrayBuffer();
  ensureDir(UPLOAD_DIR);
  const filePath = path.join(UPLOAD_DIR, fileName);
  writeFileSync(filePath, Buffer.from(bytes));
  return { url: `/uploads/${fileName}`, provider: "filesystem" };
}
