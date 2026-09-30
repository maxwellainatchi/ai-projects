import { loadProjects, getCategories } from './project-data.js';
import { filterProjects, renderProjectGrid } from './rendering.js?v=20260930';
const grid = document.querySelector('#project-grid');
const filters = document.querySelector('#category-filters');
const status = document.querySelector('#page-status');
try {
  const projects = await loadProjects();
  const categories = ['All', ...getCategories(projects)];
  categories.forEach((category, index) => {
    const button = document.createElement('button'); button.className = 'filter'; button.type='button'; button.textContent = category; button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => { filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed','false')); button.setAttribute('aria-pressed','true'); renderProjectGrid(filterProjects(projects, category), grid); });
    filters.append(button);
  });
  renderProjectGrid(projects, grid); status.hidden = true;
} catch (error) { status.textContent = 'Unable to load projects.'; }
