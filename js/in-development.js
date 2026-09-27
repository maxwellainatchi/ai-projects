import { renderInDevelopmentCardHTML } from './rendering.js';

const grid = document.querySelector('#development-grid');
const status = document.querySelector('#page-status');

try {
  const response = await fetch('data/in-development.json');
  if (!response.ok) throw new Error('Unable to load in-development projects.');
  const projects = await response.json();
  if (!Array.isArray(projects)) throw new Error('Invalid project data.');
  grid.innerHTML = projects.map(renderInDevelopmentCardHTML).join('');
  status.hidden = true;
} catch {
  status.textContent = 'Unable to load in-development projects.';
}
