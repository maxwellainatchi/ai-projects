import { loadProjects, getProjectBySlug } from './project-data.js';
const container = document.querySelector('#project-detail');
const status = document.querySelector('#page-status');
try {
  const projects = await loadProjects();
  const slug = new URLSearchParams(window.location.search).get('slug');
  const project = getProjectBySlug(projects, slug);
  if (!project) { status.textContent = 'Project not found.'; container.innerHTML = '<div class="not-found"><h1>Project not found.</h1><p>The requested project is not in this collection.</p><a class="button" href="projects.html">Back to projects →</a></div>'; }
  else { window.location.replace(`project/${encodeURIComponent(project.slug)}`); }
} catch { status.textContent = 'Unable to load projects.'; }
