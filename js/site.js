import { toRoman } from './rendering.js';

// Keep the year in the frame and the circle current without editing the markup each January.
const year = new Date().getFullYear();
const roman = toRoman(year);

for (const el of document.querySelectorAll('[data-year-latin]')) {
  el.querySelector('.tl').textContent = `Anno ${roman}`;
  el.querySelector('.te').textContent = `In the year ${year}`;
}
for (const el of document.querySelectorAll('[data-year-roman]')) el.textContent = roman;

// Give every incantation its own rhythm. The CSS staggers repeat for elements in similar
// positions, which makes neighbours glitch and translate in unison; randomising per element
// keeps the lapses scattered (usually one or two translations showing at a time).
// Only timing is set here, so prefers-reduced-motion still stops everything.
const rand = (min, max) => min + Math.random() * (max - min);

function unsettle(inc) {
  if (inc.dataset.unsettled) return;
  inc.dataset.unsettled = '1';
  inc.style.animationDelay = [rand(-9, 0), rand(-8, 0), rand(-11, 0)].map((s) => `${s.toFixed(2)}s`).join(', ');
  const duration = rand(18, 38);
  const delay = rand(-duration, 0);
  for (const part of inc.querySelectorAll(':scope > .tl, :scope > .te')) {
    part.style.animationDuration = `${duration.toFixed(2)}s`;
    part.style.animationDelay = `${delay.toFixed(2)}s`;
  }
}

document.querySelectorAll('.inc').forEach(unsettle);
// Pages render some incantations after loading their data (bench cards, moon phases).
new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node.nodeType !== 1) continue;
      if (node.matches('.inc')) unsettle(node);
      node.querySelectorAll('.inc').forEach(unsettle);
    }
  }
}).observe(document.body, { childList: true, subtree: true });
