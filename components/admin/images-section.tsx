"use client";

import { useState, useEffect } from "react";
import { Card, ImageUploadInline, uploadFile } from "./primitives";
import { PROJECT_IDS } from "./types";
import type { SiteContent } from "./types";

export function ImagesSection({
  content,
  flash,
  token,
}: {
  content: SiteContent;
  flash: (t: "success" | "error", m: string) => void;
  token: string;
}) {
  const [profileImg, setProfileImg] = useState(content.images.profile);
  const [projImages, setProjImages] = useState(content.images.projects);
  const [uploading, setUploading] = useState<string | null>(null);
  useEffect(() => {
    setProfileImg(content.images.profile);
    setProjImages(content.images.projects);
  }, [content]);

  const handleUpload = async (file: File, key: string) => {
    setUploading(key);
    const url = await uploadFile(file, key, token);
    if (url) {
      if (key === "profile") setProfileImg(url);
      else if (key.startsWith("project-")) {
        const id = key.replace("project-", "");
        setProjImages((p) => ({ ...p, [id]: url! }));
      }
      flash("success", "Image uploaded");
    } else flash("error", "Upload failed");
    setUploading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white/90 tracking-tight">
          Images
        </h1>
        <p className="text-sm text-white/30 mt-1">
          Upload or replace images used across your site.
        </p>
      </div>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Profile Photo
        </p>
        <ImageUploadInline
          label="Profile"
          currentImage={profileImg}
          onUpload={(f) => handleUpload(f, "profile")}
          loading={uploading === "profile"}
        />
      </Card>
      <Card>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.1em] font-medium mb-3">
          Project Screenshots
        </p>
        <div className="space-y-3">
          {PROJECT_IDS.map((id) => (
            <ImageUploadInline
              key={id}
              label={id.charAt(0).toUpperCase() + id.slice(1)}
              currentImage={projImages[id] || ""}
              onUpload={(f) => handleUpload(f, `project-${id}`)}
              loading={uploading === `project-${id}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
