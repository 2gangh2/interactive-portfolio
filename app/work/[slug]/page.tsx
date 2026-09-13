import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/data/projects";
import { Reveal } from "@/components/Reveal";
import { Artwork } from "@/components/Artwork";
import { EditableText } from "@/components/EditableText";
import { VideoEmbed } from "@/components/VideoEmbed";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <div className="project-page" style={{ "--accent": project.accent } as React.CSSProperties}>
    <header className="project-nav"><Link href="/">← INDEX</Link><span>{project.number} / 03</span></header>
    <section className="project-hero"><Reveal><p><EditableText contentKey={`${project.slug}-category`} fallback={project.category} /> · <EditableText contentKey={`${project.slug}-year`} fallback={project.year} /></p><h1><EditableText contentKey={`${project.slug}-title`} fallback={project.title} /></h1></Reveal><div className="project-lead-image"><Artwork uploadKey={project.uploadKey} title={project.title} accent={project.accent} /></div><div className="project-intro"><span>01</span><p><EditableText contentKey={`${project.slug}-intro`} fallback={project.intro} /></p></div></section>
    <section className="project-story"><Reveal><p className="story-label">PROJECT CONTEXT</p></Reveal><Reveal delay={.08}><p className="story-copy"><EditableText contentKey={`${project.slug}-detail`} fallback={project.detail} /></p></Reveal></section>
    <section className="project-images">{project.images.slice(1).map((uploadKey, index) => <Reveal key={uploadKey} className={`project-image image-${index + 1}`}><Artwork uploadKey={uploadKey} title={`${project.title} detail ${index + 1}`} accent={project.accent} /></Reveal>)}</section>
    <VideoEmbed projectSlug={project.slug} />
    <section className="project-details"><Reveal><span>ROLE</span><p className="editable-lines"><EditableText contentKey={`${project.slug}-role`} fallback={project.role} /></p></Reveal><Reveal delay={.08}><span>KEYWORDS</span><p className="editable-lines"><EditableText contentKey={`${project.slug}-keywords`} fallback={project.keywords} /></p></Reveal></section>
    <Link href="/#work" className="next-project">BACK TO SELECTED WORK <i>↗</i></Link>
  </div>;
}
