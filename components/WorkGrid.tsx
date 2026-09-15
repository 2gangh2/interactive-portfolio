"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Artwork } from "@/components/Artwork";
import { useUploads } from "@/components/Uploads";
import { matchesProject, projectContent, splitTags } from "@/data/project-search";

function WorkImage({ project, layoutKey }: { project: (typeof projects)[number]; layoutKey: string }) {
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
  }, [layoutKey]);

  return <div ref={imageRef} className={`work-image${isInView ? " is-in-view" : ""}`}>
    <Artwork uploadKey={project.uploadKey} title={`${project.title} project`} accent={project.accent} />
    <span className="work-next-overlay" aria-hidden="true">
      <span className="work-next-label">VIEW</span><span className="work-next-arrow">↗</span>
    </span>
  </div>;
}

export function WorkGrid() {
  const { content } = useUploads();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [keyword, setKeyword] = useState("");
  const resolvedProjects = projects.map(project => projectContent(project, content));
  const roles = [...new Set(resolvedProjects.flatMap(project => splitTags(project.role)))];
  const keywords = [...new Set(resolvedProjects.flatMap(project => splitTags(project.keywords)))];
  const selectedRole = roles.includes(role) ? role : "";
  const selectedKeyword = keywords.includes(keyword) ? keyword : "";
  const visibleProjects = resolvedProjects.filter(project => matchesProject(project, query, selectedRole, selectedKeyword));
  const isFiltered = Boolean(query.trim() || selectedRole || selectedKeyword);
  const layoutKey = visibleProjects.map(project => project.slug).join(",");
  const reset = () => { setQuery(""); setRole(""); setKeyword(""); };

  return <section id="work" className="work">
    <div className="section-label"><span>( SELECTED WORK )</span><span role="status" aria-live="polite" aria-atomic="true">{String(visibleProjects.length).padStart(2, "0")} {visibleProjects.length === 1 ? "PROJECT" : "PROJECTS"}</span></div>
    <form className="work-filters" role="search" aria-label="Search selected work" onSubmit={event => event.preventDefault()}>
      <div className="work-search-row">
        <label className="work-search"><span>SEARCH WORK</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, keyword or role…" aria-controls="work-results" /></label>
        {isFiltered && <button type="button" className="work-reset" onClick={reset}>RESET ↗</button>}
      </div>
      {[{ label: "ROLE", options: roles, selected: selectedRole, select: setRole }, { label: "KEYWORD", options: keywords, selected: selectedKeyword, select: setKeyword }].map(group =>
        <fieldset className="work-filter-group" key={group.label}>
          <legend>{group.label}</legend>
          <div className="work-filter-options">
            <button type="button" aria-pressed={!group.selected} aria-controls="work-results" onClick={() => group.select("")}>All</button>
            {group.options.map(option => <button type="button" key={option} aria-pressed={group.selected === option} aria-controls="work-results" onClick={() => group.select(group.selected === option ? "" : option)}>{option}</button>)}
          </div>
        </fieldset>
      )}
    </form>
    <div id="work-results" className={`work-grid${isFiltered ? " work-grid-filtered" : ""}`}>
      {visibleProjects.map((project, index) => <motion.article key={project.slug} className={`work-card work-card-${index + 1}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay: index * .08 }}>
        <Link href={`/work/${project.slug}`} className="work-link" aria-label={`View ${project.title} project`}>
          <WorkImage project={project} layoutKey={layoutKey} />
          <div className="work-meta"><span>{project.number} / {project.category}</span><h2>{project.title}</h2><span>{project.year}</span></div>
        </Link>
      </motion.article>)}
      {!visibleProjects.length && <div className="work-empty"><h2>No matching projects.</h2><p>Try another keyword or role.</p><button type="button" className="work-reset" onClick={reset}>SHOW ALL WORK ↗</button></div>}
    </div>
  </section>;
}
