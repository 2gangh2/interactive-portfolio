"use client";

import { useUploads } from "@/components/Uploads";

export function Artwork({ uploadKey, title, accent, className = "" }: { uploadKey: string; title: string; accent: string; className?: string }) {
  const { uploads } = useUploads();
  const source = uploads[uploadKey];
  return source ? <img className={className} src={source} alt={title} /> : <div className={`image-placeholder ${className}`} style={{ backgroundColor: accent }}><span>UPLOAD<br />YOUR IMAGE</span><b>{title}</b></div>;
}
