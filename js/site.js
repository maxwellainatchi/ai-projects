import { toRoman } from './rendering.js';

// Keep the year in the frame and the circle current without editing the markup each January.
const year = new Date().getFullYear();
const roman = toRoman(year);

for (const el of document.querySelectorAll('[data-year-latin]')) {
  el.querySelector('.tl').textContent = `Anno ${roman}`;
  el.querySelector('.te').textContent = `In the year ${year}`;
}
for (const el of document.querySelectorAll('[data-year-roman]')) el.textContent = roman;
