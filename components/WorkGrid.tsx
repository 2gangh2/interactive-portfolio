"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Artwork } from "@/components/Artwork";
import { EditableText } from "@/components/EditableText";

export function WorkGrid() {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (navigationTimer.current !== null) clearTimeout(navigationTimer.current);
  }, []);

  function handleNavigate(event: { preventDefault: () => void }, slug: string) {
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    if (navigationTimer.current !== null) return;
    setActiveSlug(slug);
    // Let both mint layers finish (620ms duration + 70ms delay).
    navigationTimer.current = setTimeout(() => {
      navigationTimer.current = null;
      setActiveSlug(null);
      router.push(`/work/${slug}`);
    }, 750);
  }

  return <section id="work" className="work"><div className="section-label"><span>( SELECTED WORK )</span><span>03 PROJECTS</span></div><div className="work-grid">{projects.map((project, index) => <motion.article key={project.slug} className={`work-card work-card-${index + 1}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay: index * .08 }}>
    <Link href={`/work/${project.slug}`} className={`work-link${activeSlug === project.slug ? " is-opening" : ""}`} onNavigate={(event) => handleNavigate(event, project.slug)} aria-label={`View ${project.title} project`}><div className="work-image"><Artwork uploadKey={project.uploadKey} title={`${project.title} project`} accent={project.accent} /><span className="work-next-overlay" aria-hidden="true"><span className="work-next-label">VIEW</span><span className="work-next-arrow">↗</span></span></div><div className="work-meta"><span>{project.number} / <EditableText contentKey={`${project.slug}-category`} fallback={project.category} /></span><h2><EditableText contentKey={`${project.slug}-title`} fallback={project.title} /></h2><span><EditableText contentKey={`${project.slug}-year`} fallback={project.year} /></span></div></Link>
  </motion.article>)}</div></section>;
}
