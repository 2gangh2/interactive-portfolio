import type { Project } from "./projects";

export function projectContent(project: Project, content: Record<string, string>): Project {
  const result = { ...project };
  for (const field of ["title", "category", "year", "intro", "detail", "role", "keywords"] as const) {
    result[field] = content[`${project.slug}-${field}`] || project[field];
  }
  return result;
}

export const splitTags = (value: string) => value.split(/[\n,]+/).map(tag => tag.trim()).filter(Boolean);
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase().trim();

export function matchesProject(project: Project, query: string, role: string, keyword: string) {
  const text = normalize([project.title, project.category, project.year, project.intro, project.detail, project.role, project.keywords].join(" "));
  return (!role || splitTags(project.role).includes(role)) &&
    (!keyword || splitTags(project.keywords).includes(keyword)) &&
    normalize(query).split(/\s+/).filter(Boolean).every(term => text.includes(term));
}
