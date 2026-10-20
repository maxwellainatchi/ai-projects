import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ROLES, colorOf, renderIndexHTML, renderPlateHTML, renderSwatchesHTML, themeVars } from '../js/design-system-plates.js';

const systems = JSON.parse(await readFile('data/design-systems.json', 'utf8'));

test('the systems page has its hooks and loads its own script and styles', async () => {
  const html = await readFile('design-systems.html', 'utf8');
  for (const id of ['ds-index', 'ds-plates', 'page-status']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /href="css\/design-systems\.css\?v=[^"]+"/);
  assert.match(html, /src="js\/design-systems\.js\?v=[^"]+"/);
  assert.match(html, /href="design-systems\.html" aria-current="page"/);
});

test('every system has the fields a plate needs, with a value for each theme', () => {
  assert.ok(systems.length >= 1);
  assert.equal(new Set(systems.map((s) => s.slug)).size, systems.length);
  for (const s of systems) {
    for (const key of ['slug', 'name', 'latin', 'english', 'summary']) assert.ok(s[key], `${s.slug} is missing ${key}`);
    assert.ok(ROLES[s.slug], `${s.slug} has no roles in js/design-system-plates.js`);
    const themes = s.themes.map((t) => t.id);
    for (const c of s.colors) for (const t of themes) assert.ok(c.v[t], `${s.slug} ${c.n} has no ${t} value`);
    for (const role of ['bg', 'panel', 'fg', 'muted', 'line', 'accent', ...ROLES[s.slug].strip].map((r) => ROLES[s.slug][r] ?? r)) {
      assert.ok(s.colors.some((c) => c.n === role), `${s.slug} role token ${role} does not exist`);
    }
    for (const g of s.groups) assert.ok(s.families[g.family], `${s.slug} type group ${g.name} uses an unknown family`);
  }
});

test('plates render their sections collapsed and a theme switch only where there are two themes', () => {
  for (const s of systems) {
    const html = renderPlateHTML(s);
    assert.equal((html.match(/<details>/g) ?? []).length, 3, `${s.slug} should have three collapsed sections`);
    assert.doesNotMatch(html, /<details open/);
    assert.equal((html.match(/data-theme=/g) ?? []).length, s.themes.length > 1 ? s.themes.length : 0);
    assert.match(html, new RegExp(`id="${s.slug}"`));
    assert.match(html, /class="te" aria-hidden="true"/);
  }
});

test('theme variables and swatches follow the chosen theme', () => {
  const grimoire = systems.find((s) => s.slug === 'grimoire');
  const night = themeVars(grimoire, 'grimoire');
  const day = themeVars(grimoire, 'vellum');
  assert.equal(night['--p-bg'], colorOf(grimoire, 'surface', 'grimoire'));
  assert.notEqual(night['--p-bg'], day['--p-bg']);
  assert.ok(renderSwatchesHTML(grimoire, 'vellum').includes(colorOf(grimoire, 'crimson', 'vellum')));
  assert.equal((renderIndexHTML(systems).match(/<a href="#/g) ?? []).length, systems.length);
});

test('aliased colors arrive resolved', () => {
  for (const s of systems) for (const c of s.colors) for (const v of Object.values(c.v)) assert.doesNotMatch(v, /^\{/, `${s.slug} ${c.n}`);
});
