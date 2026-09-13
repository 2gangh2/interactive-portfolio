"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { useUploads } from "@/components/Uploads";

type Field = { key: string; label: string; fallback: string; rows?: number };

export function UploadPanel() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { uploads, content, setUpload, clearUpload, setContent } = useUploads();
  const handleFile = async (key: string, file?: File) => {
    if (!file) return;
    try { setMessage("이미지를 최적화하고 저장하는 중…"); await setUpload(key, file); setMessage("저장되었습니다."); }
    catch { setMessage("저장하지 못했습니다. JPG, PNG 또는 WebP 파일을 사용해 주세요."); }
  };
  const exportSettings = () => {
    const payload = JSON.stringify({ content, uploads }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = "portfolio-settings.json"; link.click();
    URL.revokeObjectURL(url); setMessage("현재 편집 내용을 portfolio-settings.json 파일로 저장했습니다.");
  };
  const homeFields: Field[] = [
    { key: "home-name-first", label: "FIRST NAME", fallback: "GANG" }, { key: "home-name-last", label: "LAST NAME", fallback: "HUI" },
    { key: "home-intro", label: "HERO INTRO", fallback: "Visual designer exploring identities, image-making and playful systems.", rows: 3 },
    { key: "home-about", label: "ABOUT HEADLINE", fallback: "I make visual experiences that invite a second look.", rows: 3 },
    { key: "home-description", label: "ABOUT DESCRIPTION", fallback: "My work moves between identity, typography and image-making. I like systems with a pulse — precise enough to hold together, open enough to surprise.", rows: 4 },
    { key: "home-footer", label: "FOOTER MESSAGE", fallback: "LET'S MAKE SOMETHING WITH A LITTLE TENSION.", rows: 3 }, { key: "home-email", label: "CONTACT EMAIL", fallback: "HELLO@EXAMPLE.COM" },
  ];
  const TextFields = ({ fields }: { fields: Field[] }) => <>{fields.map((field) => <label className="text-slot" key={field.key}><span>{field.label}</span><textarea value={content[field.key] ?? field.fallback} rows={field.rows || 2} onChange={(event) => setContent(field.key, event.target.value)} /></label>)}</>;
  return <aside className="upload-tool">
    <button className="upload-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "CLOSE EDITOR ×" : "EDIT SITE +"}</button>
    {open && <div className="upload-panel"><div className="upload-heading"><span>SITE EDITOR</span><p>문구·작품 정보·이미지·YouTube 영상을 즉시 편집합니다.<br />공개 전에는 현재 설정을 파일로 내보내 보관하세요.</p><button className="export-settings" type="button" onClick={exportSettings}>EXPORT CURRENT SETTINGS ↓</button></div>
      <div className="upload-project text-editor"><strong>HOME TEXT</strong><TextFields fields={homeFields} /></div>
      {projects.map((project) => {
        const fields: Field[] = [
          { key: `${project.slug}-title`, label: "PROJECT TITLE", fallback: project.title }, { key: `${project.slug}-category`, label: "CATEGORY", fallback: project.category }, { key: `${project.slug}-year`, label: "YEAR", fallback: project.year },
          { key: `${project.slug}-intro`, label: "SHORT INTRO", fallback: project.intro, rows: 3 }, { key: `${project.slug}-detail`, label: "PROJECT DESCRIPTION", fallback: project.detail, rows: 5 },
          { key: `${project.slug}-role`, label: "ROLE (줄바꿈 가능)", fallback: project.role, rows: 4 }, { key: `${project.slug}-keywords`, label: "KEYWORDS (줄바꿈 가능)", fallback: project.keywords, rows: 4 },
          { key: `${project.slug}-video`, label: "YOUTUBE LINK", fallback: "", rows: 2 },
        ];
        return <div className="upload-project text-editor" key={project.slug}><strong>{project.number} — {project.title}</strong><TextFields fields={fields} />{project.images.map((key, index) => <label className="upload-slot" key={key}><span>{index === 0 ? "COVER IMAGE" : `DETAIL IMAGE 0${index}`}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(key, event.target.files?.[0])} /><em>{uploads[key] ? "REPLACE" : "UPLOAD"}</em>{uploads[key] && <button type="button" onClick={(event) => { event.preventDefault(); clearUpload(key); }}>REMOVE</button>}</label>)}</div>;
      })}<p className="upload-message" aria-live="polite">{message}</p>
    </div>}
  </aside>;
}
