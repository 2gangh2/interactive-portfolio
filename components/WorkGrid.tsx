"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Artwork } from "@/components/Artwork";
import { EditableText } from "@/components/EditableText";

export function WorkGrid() {
  return <section id="work" className="work"><div className="section-label"><span>( SELECTED WORK )</span><span>03 PROJECTS</span></div><div className="work-grid">{projects.map((project, index) => <motion.article key={project.slug} className={`work-card work-card-${index + 1}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay: index * .08 }}>
    <Link href={`/work/${project.slug}`} className="work-link" aria-label={`View ${project.title} project`}><div className="work-image"><Artwork uploadKey={project.uploadKey} title={`${project.title} project`} accent={project.accent} /><span className="work-next-overlay" aria-hidden="true"><span className="work-next-label">VIEW</span><span className="work-next-arrow">↗</span></span></div><div className="work-meta"><span>{project.number} / <EditableText contentKey={`${project.slug}-category`} fallback={project.category} /></span><h2><EditableText contentKey={`${project.slug}-title`} fallback={project.title} /></h2><span><EditableText contentKey={`${project.slug}-year`} fallback={project.year} /></span></div></Link>
  </motion.article>)}</div></section>;
}
