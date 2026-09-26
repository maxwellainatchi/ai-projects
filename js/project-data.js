const PROJECTS_URL = 'data/projects.json';

export async function loadProjects(fetchImpl = fetch) {
  const response = await fetchImpl(PROJECTS_URL);
  if (!response.ok) throw new Error('Unable to load projects.');
  const payload = await response.json();
  if (!Array.isArray(payload)) throw new Error('Project data must be an array.');
  return payload;
}

export function getProjectBySlug(projects, slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getCategories(projects) {
  return [...new Set(projects.map((project) => project.category).filter(Boolean))];
}
