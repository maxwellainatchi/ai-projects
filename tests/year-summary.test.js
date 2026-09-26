import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeYear } from '../js/year-summary.js';

test('summarizes only projects from the selected year and includes new entries', () => {
  const projects = [
    { title: 'Ghostcast', summary: 'A reactive AI audience.', category: 'Interactive', year: 2026 },
    { title: 'Old project', summary: 'An older experiment.', category: 'Apps', year: 2025 },
    { title: 'New tool', summary: 'A useful little tool.', category: 'Apps', year: 2026 }
  ];
  const summary = summarizeYear(projects, 2026);

  assert.match(summary, /2026/);
  assert.match(summary, /2 projects/);
  assert.match(summary, /Ghostcast.*A reactive AI audience/);
  assert.match(summary, /New tool.*A useful little tool/);
  assert.doesNotMatch(summary, /Old project|older experiment/);
});

test('handles a year with no listed projects', () => {
  assert.match(summarizeYear([], 2027), /No projects listed for 2027 yet/);
});

test('uses a written homepage blurb when provided', () => {
  const summary = summarizeYear([
    { title: 'Dirhaven', summary: 'Explore your filesystem.', homeBlurb: 'Dirhaven makes a filesystem walkable.', year: 2026 }
  ], 2026);
  assert.match(summary, /Dirhaven makes a filesystem walkable/);
  assert.doesNotMatch(summary, /Explore your filesystem/);
});
