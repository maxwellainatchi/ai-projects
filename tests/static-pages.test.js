import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { STAGES } from '../js/rendering.js';

const pages = ['index.html', 'projects.html', 'in-development.html', 'design-systems.html', 'project.html', 'about.html', '404.html'];

for (const page of pages) {
  test(`${page} has semantic main, the ritual frame and relative stylesheet/navigation`, async () => {
    const html = await readFile(page, 'utf8');
    assert.match(html, /<main[\s>]/i);
    assert.match(html, /href="in-development\.html"/);
    assert.match(html, /href="design-systems\.html"/);
    assert.match(html, /href="css\/styles\.css\?v=[^"]+"/);
    assert.match(html, /class="inc band t"/);
    assert.match(html, /class="te" aria-hidden="true"/);
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(hrefs.filter((h) => !h.startsWith('http') && !h.startsWith('mailto:') && !h.startsWith('#')).every((h) => !h.startsWith('/')));
  });
}

test('index and project template expose stable hooks', async () => {
  const index = await readFile('index.html', 'utf8');
  const detail = await readFile('project.html', 'utf8');
  for (const id of ['featured', 'project-list', 'category-filters', 'bench-list', 'page-status']) assert.match(index, new RegExp(`id="${id}"`));
  assert.match(detail, /id="project-detail"/);
  assert.match(detail, /id="page-status"/);
});

test('the old projects page forwards to the index', async () => {
  const html = await readFile('projects.html', 'utf8');
  assert.match(html, /http-equiv="refresh" content="0; url=index\.html#index"/);
  assert.match(html, /href="index\.html#index"/);
});

test('workbench lists four unlinked projects with descriptions, tags, artwork and a known stage', async () => {
  const html = await readFile('in-development.html', 'utf8');
  assert.match(html, /id="development-grid"/);
  const entries = JSON.parse(await readFile('data/in-development.json', 'utf8'));
  assert.deepEqual(entries.map(({ title }) => title), ['Task Management', 'Travel Planner', 'Webhaven', 'Fantasy Baseball']);
  for (const entry of entries) {
    assert.ok(entry.summary.length > 40);
    assert.ok(entry.tags.length >= 2);
    assert.ok(!entry.links && !entry.url);
    assert.ok(Object.hasOwn(STAGES, entry.stage), `unknown stage for ${entry.title}`);
    await access(entry.image);
  }
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
    assert.ok(html.includes(project.description[0].slice(1)));
    if (projects.length > 1) assert.match(html, /class="neighbours"/);
  }
});

test('styles respect reduced motion and keep focus visible', async () => {
  const css = await readFile('css/styles.css', 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /animation: none !important/);
  assert.match(css, /:focus-visible/);
});

test('portfolio artwork referenced by pages and project data exists', async () => {
  const projects = JSON.parse(await readFile('data/projects.json', 'utf8'));
  for (const asset of ['assets/hero.webp', 'assets/mark.svg', 'assets/frame-sigil.svg', ...projects.flatMap(({ cover, thumbnail, gallery }) => [cover, thumbnail, ...gallery].filter(Boolean))]) {
    await access(asset);
  }
  for (const project of projects) {
    if (project.links?.live && !/^https?:\/\//.test(project.links.live)) await access(project.links.live);
  }
});

test('page classes have matching styles', async () => {
  const css = await readFile('css/styles.css', 'utf8');
  for (const selector of ['.site-frame', '.band', '.corner', '.shell', '.hero', '.circle', '.featured', '.work-row', '.bench', '.detail', '.oaths', '.seal', '.opus', '.phases', '.about-hero', '.arch', '.rite', '.tool-row', '.site-footer', '.veil', '.status-mark']) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
});
