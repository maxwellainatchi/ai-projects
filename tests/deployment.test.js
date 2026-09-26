import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

test('Pages workflow deploys repository root', async () => {
  const yml = await readFile('.github/workflows/pages.yml','utf8');
  for (const action of ['actions/configure-pages','actions/upload-pages-artifact','actions/deploy-pages']) assert.match(yml,new RegExp(action));
  assert.match(yml,/path:\s*\./);
});
test('.nojekyll exists', async () => { await access('.nojekyll'); });
test('README identifies projects.json as project content source', async () => {
  const readme = await readFile('README.md','utf8');
  assert.match(readme,/data\/projects\.json/);
  assert.match(readme,/single source of truth|only file/i);
});
