import { loadProjects } from './project-data.js';
import { renderToolTotalsHTML } from './rendering.js';

const container = document.querySelector('#tool-totals');
try {
  container.innerHTML = renderToolTotalsHTML(await loadProjects());
} catch {
  container.closest('div')?.setAttribute('hidden', '');
}
