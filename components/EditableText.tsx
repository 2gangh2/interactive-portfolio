"use client";

import { useUploads } from "@/components/Uploads";

export function EditableText({ contentKey, fallback }: { contentKey: string; fallback: string }) {
  const { content } = useUploads();
  return <>{content[contentKey] || fallback}</>;
}
