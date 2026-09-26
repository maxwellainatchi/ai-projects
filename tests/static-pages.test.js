import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const pages = ['index.html','projects.html','project.html','about.html','404.html'];

for (const page of pages) {
  test(`${page} has semantic main and relative stylesheet/navigation`, async () => {
    const html = await readFile(page, 'utf8');
    assert.match(html, /<main[\s>]/i);
    assert.match(html, /href="css\/styles\.css"/);
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(hrefs.filter((h) => !h.startsWith('http') && !h.startsWith('mailto:')).every((h) => !h.startsWith('/')));
  });
}

test('project list and detail expose stable hooks', async () => {
  const list = await readFile('projects.html','utf8');
  const detail = await readFile('project.html','utf8');
  assert.match(list, /id="project-grid"/);
  assert.match(list, /id="category-filters"/);
  assert.match(detail, /id="project-detail"/);
  assert.match(detail, /id="page-status"/);
});

test('styles include accessibility motion/focus rules', async () => {
  const css = await readFile('css/styles.css','utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});

test('ghostcast cover asset exists', async () => {
  await access('assets/projects/ghostcast/cover.svg');
});

test('polished shell classes have matching styles', async () => {
  const css = await readFile('css/styles.css','utf8');
  for (const selector of ['.shell','.corner-mark','.page-heading','.about-grid','.about-art','.hero-visual .moon','.hero-visual .portal','.site-footer']) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
});
