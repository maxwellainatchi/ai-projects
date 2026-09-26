import test from 'node:test';
import assert from 'node:assert/strict';
import { renderProjectCardHTML, renderProjectDetailHTML, filterProjects } from '../js/rendering.js';

const project = {
  slug:'ghostcast', title:'Ghostcast', summary:'Turn source material into conversational audio.',
  description:['One','Two'], year:2026, status:'experiment', category:'Audio', tags:['Audio','Experiment'],
  cover:'assets/projects/ghostcast/cover.svg', gallery:[], links:{live:'',source:''}
};

test('project card includes core fields and relative detail link', () => {
  const html = renderProjectCardHTML(project);
  assert.match(html, /Ghostcast/);
  assert.match(html, /conversational audio/);
  assert.match(html, /cover\.svg/);
  assert.match(html, /Audio/);
  assert.match(html, /project\.html\?slug=ghostcast/);
});

test('blank optional links and empty gallery render no empty chrome', () => {
  const html = renderProjectDetailHTML(project);
  assert.doesNotMatch(html, /Launch project|View source|class="gallery"/);
});

test('detail with links and gallery renders them', () => {
  const html = renderProjectDetailHTML({...project, gallery:['one.jpg'], links:{live:'https://example.com',source:'https://github.com/example'}});
  assert.match(html, /Launch project/);
  assert.match(html, /View source/);
  assert.match(html, /class="gallery"/);
});

test('filterProjects matches category and All', () => {
  const list = [project,{...project,slug:'x',category:'Visual'}];
  assert.equal(filterProjects(list,'Audio').length,1);
  assert.equal(filterProjects(list,'All').length,2);
});
