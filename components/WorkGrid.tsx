"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Artwork } from "@/components/Artwork";
import { EditableText } from "@/components/EditableText";

function WorkImage({ project }: { project: (typeof projects)[number] }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const touchDevice = window.matchMedia("(hover: none) and (pointer: coarse)");
    let frame: number | null = null;

    const update = () => {
      frame = null;
      if (!touchDevice.matches || !imageRef.current) {
        setIsInView(false);
        return;
      }
      const bounds = imageRef.current.getBoundingClientRect();
      const imageCenter = bounds.top + bounds.height / 2;
      const viewportHeight = window.innerHeight;
      // Reveal when the photo's center reaches the middle 30% of the screen.
      setIsInView(imageCenter >= viewportHeight * 0.35 && imageCenter <= viewportHeight * 0.65);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    touchDevice.addEventListener("change", scheduleUpdate);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      touchDevice.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return <div ref={imageRef} className={`work-image${isInView ? " is-in-view" : ""}`}>
    <Artwork uploadKey={project.uploadKey} title={`${project.title} project`} accent={project.accent} />
    <span className="work-next-overlay" aria-hidden="true">
      <span className="work-next-label">VIEW</span><span className="work-next-arrow">↗</span>
    </span>
  </div>;
}

export function WorkGrid() {
  return <section id="work" className="work"><div className="section-label"><span>( SELECTED WORK )</span><span>03 PROJECTS</span></div><div className="work-grid">{projects.map((project, index) => <motion.article key={project.slug} className={`work-card work-card-${index + 1}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay: index * .08 }}>
    <Link href={`/work/${project.slug}`} className="work-link" aria-label={`View ${project.title} project`}><WorkImage project={project} /><div className="work-meta"><span>{project.number} / <EditableText contentKey={`${project.slug}-category`} fallback={project.category} /></span><h2><EditableText contentKey={`${project.slug}-title`} fallback={project.title} /></h2><span><EditableText contentKey={`${project.slug}-year`} fallback={project.year} /></span></div></Link>
  </motion.article>)}</div></section>;
}
