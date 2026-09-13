"use client";

import { createContext, useContext, useEffect, useState } from "react";
import publishedSettings from "@/portfolio-settings.json";

type UploadContextValue = { uploads: Record<string, string>; content: Record<string, string>; setUpload: (key: string, file: File) => Promise<void>; clearUpload: (key: string) => void; setContent: (key: string, value: string) => void; };
const UploadContext = createContext<UploadContextValue | null>(null);
const STORAGE_KEY = "ganghui-portfolio-images";
const CONTENT_STORAGE_KEY = "ganghui-portfolio-content";

async function optimizeImage(file: File) {
  const source = URL.createObjectURL(file);
  const image = new Image();
  image.src = source;
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("이미지를 읽을 수 없습니다.")); });
  const longest = 1600;
  const scale = Math.min(1, longest / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(source);
  return canvas.toDataURL("image/jpeg", .86);
}

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<Record<string, string>>(publishedSettings.uploads || {});
  const [content, setContentState] = useState<Record<string, string>>(publishedSettings.content || {});
  useEffect(() => { try { setUploads(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")); } catch { localStorage.removeItem(STORAGE_KEY); } }, []);
  useEffect(() => { try { setContentState(JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || "{}")); } catch { localStorage.removeItem(CONTENT_STORAGE_KEY); } }, []);
  const save = (next: Record<string, string>) => { setUploads(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const setUpload = async (key: string, file: File) => save({ ...uploads, [key]: await optimizeImage(file) });
  const clearUpload = (key: string) => { const next = { ...uploads }; delete next[key]; save(next); };
  const setContent = (key: string, value: string) => { const next = { ...content, [key]: value }; setContentState(next); localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(next)); };
  return <UploadContext.Provider value={{ uploads, content, setUpload, clearUpload, setContent }}>{children}</UploadContext.Provider>;
}

export function useUploads() { const context = useContext(UploadContext); if (!context) throw new Error("UploadProvider is required"); return context; }
