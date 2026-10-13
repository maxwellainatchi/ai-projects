import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renderProjectRowHTML, renderProjectDetailHTML, renderFeaturedHTML, renderBenchCardHTML,
  renderInDevelopmentCardHTML, renderToolTotalsHTML, filterProjects, featuredProject, toRoman, incantation, riteName
} from '../js/rendering.js';

const project = {
  slug: 'ghostcast', title: 'Ghostcast', summary: 'Turn source material into conversational audio.',
  description: ['One paragraph.', 'Two'], year: 2026, status: 'experiment', category: 'Audio', tags: ['Audio', 'Experiment'],
  madeWith: ['Claude', 'ChatGPT'], cover: 'assets/projects/ghostcast/cover.svg', gallery: [], links: { live: '', source: '' }
};

test('Roman numerals', () => {
  assert.equal(toRoman(1), 'I');
  assert.equal(toRoman(4), 'IV');
  assert.equal(toRoman(2026), 'MMXXVI');
  assert.equal(toRoman(0), '');
});

test('an incantation pairs Latin with an English translation hidden from screen readers', () => {
  const html = incantation('In fieri', 'In the making');
  assert.match(html, /class="inc"/);
  assert.match(html, /<span class="tl">In fieri<\/span>/);
  assert.match(html, /<span class="te" aria-hidden="true">In the making<\/span>/);
});

test('index row is one link holding numeral, image, title, summary, tools and plain status', () => {
  const html = renderProjectRowHTML(project, 1);
  assert.equal((html.match(/<a\b/g) || []).length, 1);
  assert.match(html, /href="project\/ghostcast"/);
  assert.match(html, />II</);
  assert.match(html, /cover\.svg/);
  assert.match(html, /Ghostcast/);
  assert.match(html, /conversational audio/);
  assert.match(html, /Claude · ChatGPT/);
  assert.match(html, /<b>Experiment<\/b>/);
});

test('featured project prefers an explicit flag and links to the live project first', () => {
  assert.equal(featuredProject([{ slug: 'a' }, { slug: 'b', featured: true }]).slug, 'b');
  assert.equal(featuredProject([{ slug: 'a' }]).slug, 'a');
  const html = renderFeaturedHTML({ ...project, links: { live: 'https://example.com', liveLabel: 'Open it' } });
  assert.ok(html.indexOf('href="https://example.com"') < html.indexOf('>Read more <'));
  assert.match(html, /Open it/);
});

test('blank optional links, gallery and promises render no empty chrome', () => {
  const html = renderProjectDetailHTML(project);
  assert.doesNotMatch(html, /View source|class="gallery"|class="oaths"|class="neighbours"/);
});

test('detail with links, gallery, promises and neighbours renders them', () => {
  const html = renderProjectDetailHTML(
    { ...project, gallery: ['one.jpg'], promises: ['Nothing is broadcast.'], links: { live: 'https://example.com', liveLabel: 'Launch it', source: 'https://github.com/example' } },
    { index: 1, prev: { slug: 'depot', title: 'Depot', cover: 'd.webp' }, prevIndex: 0, next: { slug: 'sunder', title: 'Sunder', cover: 's.webp' }, nextIndex: 2 }
  );
  assert.match(html, /Launch it/);
  assert.match(html, /View source/);
  assert.match(html, /class="gallery"/);
  assert.match(html, /Nothing is broadcast\./);
  assert.match(html, /Iuramenta/);
  assert.match(html, /href="project\/depot"/);
  assert.match(html, /href="project\/sunder"/);
  assert.match(html, /Ritus secundus/);
});

test('detail keeps the first letter readable behind the decorative drop cap', () => {
  const html = renderProjectDetailHTML(project);
  assert.match(html, /<span class="drop-cap" aria-hidden="true">O<\/span><span class="visually-hidden">O<\/span>ne paragraph\./);
});

test('detail uses the supplied action label and honours contained cover art', () => {
  const html = renderProjectDetailHTML({ ...project, coverMode: 'contain', links: { live: 'assets/projects/cookbook/book.pdf', liveLabel: 'Read the cookbook' } });
  assert.match(html, /Read the cookbook/);
  assert.match(html, /detail-media framed contain/);
});

test('rite names fall back to Roman numerals past the Latin ordinals', () => {
  assert.equal(riteName(0).latin, 'Ritus primus');
  assert.equal(riteName(20).latin, 'Ritus XXI');
});

test('filterProjects matches category and All', () => {
  const list = [project, { ...project, slug: 'x', category: 'Visual' }];
  assert.equal(filterProjects(list, 'Audio').length, 1);
  assert.equal(filterProjects(list, 'All').length, 2);
});

test('bench and workbench entries show art, stage and tags without any link', () => {
  const item = { title: 'Webhaven', summary: 'Explore web communities as connected settlements.', image: 'assets/in-development/webhaven.webp', tags: ['Game', 'Web exploration'], stage: 'building' };
  for (const html of [renderBenchCardHTML(item), renderInDevelopmentCardHTML(item)]) {
    assert.match(html, /Webhaven/);
    assert.match(html, /webhaven\.webp/);
    assert.match(html, /Crescens/);
    assert.match(html, /building/);
    assert.doesNotMatch(html, /<a\b|href=/);
  }
  assert.match(renderInDevelopmentCardHTML(item), /connected settlements/);
  assert.match(renderInDevelopmentCardHTML(item), /Web exploration/);
});

test('tool totals count each project once per tool', () => {
  const html = renderToolTotalsHTML([{ madeWith: ['Claude'] }, { madeWith: ['Claude', 'ChatGPT'] }, {}]);
  assert.ok(html.indexOf('Claude') < html.indexOf('ChatGPT'));
  assert.match(html, /II projects/);
  assert.match(html, /I project</);
});
