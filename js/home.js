import { loadProjects } from './project-data.js';
import { summarizeYear } from './year-summary.js';

const summary = document.querySelector('#year-summary');
const year = new Date().getFullYear();
document.querySelector('#year-label').textContent = `${year} in projects`;

try {
  summary.textContent = summarizeYear(await loadProjects(), year);
} catch {
  summary.textContent = 'The project summary is unavailable right now. Browse the full collection instead.';
}
