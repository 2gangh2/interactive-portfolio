"use client";

import { useUploads } from "@/components/Uploads";

function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
  } catch { return null; }
  return null;
}

export function VideoEmbed({ projectSlug }: { projectSlug: string }) {
  const { content } = useUploads();
  const id = getYouTubeId(content[`${projectSlug}-video`] || "");
  if (!id) return null;
  return <section className="project-video"><p className="story-label">MOTION / VIDEO</p><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={`${projectSlug} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></section>;
}
