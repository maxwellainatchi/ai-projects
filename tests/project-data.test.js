import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadProjects, getProjectBySlug, getCategories } from '../js/project-data.js';

const data = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url), 'utf8'));

test('seed data contains Ghostcast with useful copy', () => {
  const ghostcast = data.find((project) => project.slug === 'ghostcast');
  assert.ok(ghostcast);
  assert.ok(ghostcast.title.length > 0);
  assert.ok(ghostcast.summary.length > 0);
});

test('slug lookup returns Ghostcast and null for unknown projects', () => {
  assert.equal(getProjectBySlug(data, 'ghostcast')?.title, 'Ghostcast');
  assert.equal(getProjectBySlug(data, 'missing'), null);
});

test('categories are unique and deterministic', () => {
  assert.deepEqual(getCategories([
    { category: 'Audio' },
    { category: 'Visual' },
    { category: 'Audio' }
  ]), ['Audio', 'Visual']);
});

test('loadProjects rejects malformed non-array payloads', async () => {
  const fetchImpl = async () => ({ ok: true, json: async () => ({ nope: true }) });
  await assert.rejects(() => loadProjects(fetchImpl), /array/i);
});
