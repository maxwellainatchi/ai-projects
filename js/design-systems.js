import { renderIndexHTML, renderPlateHTML, renderSwatchesHTML, themeVars } from './design-system-plates.js';

const status = document.querySelector('#page-status');
const index = document.querySelector('#ds-index');
const plates = document.querySelector('#ds-plates');

function applyTheme(system, theme) {
  const plate = document.getElementById(system.slug);
  const board = plate.querySelector('.ds-board');
  for (const [name, value] of Object.entries(themeVars(system, theme))) board.style.setProperty(name, value);
  board.querySelector('.ds-sw').innerHTML = renderSwatchesHTML(system, theme);
  for (const button of plate.querySelectorAll('.ds-seg button[data-theme]')) {
    button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
  }
}

try {
  const response = await fetch('data/design-systems.json');
  if (!response.ok) throw new Error('Unable to load design systems.');
  const systems = await response.json();
  index.innerHTML = renderIndexHTML(systems);
  plates.innerHTML = systems.map(renderPlateHTML).join('');
  for (const system of systems) {
    applyTheme(system, system.themes[0].id);
    for (const button of document.querySelectorAll(`#${system.slug} .ds-seg button[data-theme]`)) {
      button.addEventListener('click', () => applyTheme(system, button.dataset.theme));
    }
  }
  status.remove();
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
} catch {
  status.textContent = 'The design systems could not be loaded. Try refreshing the page.';
}
