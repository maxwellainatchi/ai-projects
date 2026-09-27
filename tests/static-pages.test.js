import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const pages = ['index.html','projects.html','project.html','about.html','404.html'];

for (const page of pages) {
  test(`${page} has semantic main and relative stylesheet/navigation`, async () => {
    const html = await readFile(page, 'utf8');
    assert.match(html, /<main[\s>]/i);
    assert.match(html, /href="css\/styles\.css\?v=[^"]+"/);
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

test('each project has a crawlable clean URL with its own link preview', async () => {
  const projects = JSON.parse(await readFile('data/projects.json', 'utf8'));
  for (const project of projects) {
    const html = await readFile(`project/${project.slug}/index.html`, 'utf8');
    assert.match(html, /<article[^>]*id="project-detail"/);
    assert.ok(html.includes(`<title>${project.title} — Maxwell Ainatchi</title>`));
    assert.ok(html.includes(`content="${project.summary}"`));
    assert.ok(html.includes(`content="https://ai.ainatchi.me/project/${project.slug}"`));
    assert.ok(html.includes(`content="https://ai.ainatchi.me/${project.cover}"`));
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:description"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.ok(html.includes(project.description[0]));
  }
});

test('styles include accessibility motion/focus rules', async () => {
  const css = await readFile('css/styles.css','utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});

test('portfolio artwork referenced by pages and project data exists', async () => {
  const projects = JSON.parse(await readFile('data/projects.json', 'utf8'));
  for (const asset of ['assets/hero.webp', 'assets/mark.svg', 'assets/frame-sigil.svg', ...projects.flatMap(({ cover, thumbnail, gallery }) => [cover, thumbnail, ...gallery])]) {
    await access(asset);
  }
  for (const project of projects) {
    if (project.links?.live && !/^https?:\/\//.test(project.links.live)) await access(project.links.live);
  }
});

test('polished shell classes have matching styles', async () => {
  const css = await readFile('css/styles.css','utf8');
  for (const selector of ['.shell','.ritual-node','.page-heading','.about-grid','.about-art','.hero-summary','.site-footer']) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
});
