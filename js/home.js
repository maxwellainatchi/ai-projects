import { loadProjects, getCategories } from './project-data.js';
import { filterProjects, featuredProject, renderFeaturedHTML, renderProjectRowHTML, renderBenchCardHTML, toRoman } from './rendering.js';

const featured = document.querySelector('#featured');
const list = document.querySelector('#project-list');
const filters = document.querySelector('#category-filters');
const status = document.querySelector('#page-status');
const bench = document.querySelector('#bench-list');

function renderList(projects, category) {
  // Numerals follow each project's place in the full index, so they stay stable while filtering.
  list.innerHTML = filterProjects(projects, category).map((p) => renderProjectRowHTML(p, projects.indexOf(p))).join('');
}

try {
  const projects = await loadProjects();
  featured.innerHTML = renderFeaturedHTML(featuredProject(projects));
  const categories = ['All', ...getCategories(projects)];
  for (const [i, category] of categories.entries()) {
    const count = category === 'All' ? projects.length : filterProjects(projects, category).length;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter';
    button.textContent = `${category} · ${toRoman(count)}`;
    button.setAttribute('aria-pressed', String(i === 0));
    button.addEventListener('click', () => {
      for (const b of filters.querySelectorAll('button')) b.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-pressed', 'true');
      renderList(projects, category);
    });
    filters.append(button);
  }
  renderList(projects, 'All');
  status.hidden = true;
} catch {
  status.textContent = 'Unable to load projects.';
}

try {
  const response = await fetch('data/in-development.json');
  if (!response.ok) throw new Error('Unable to load the bench.');
  const items = await response.json();
  bench.innerHTML = items.map(renderBenchCardHTML).join('');
} catch {
  bench.closest('section')?.setAttribute('hidden', '');
}
