export function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]);
}

export function toRoman(value) {
  let n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n <= 0) return '';
  const table = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
  return out;
}

/** A Latin incantation that occasionally slips into its English translation. */
export function incantation(latin, english, attrs = '') {
  return `<span class="inc"${attrs}><span class="tl">${esc(latin)}</span><span class="te" aria-hidden="true">${esc(english)}</span></span>`;
}

const STATUS_GLYPHS = { live: 'live', preview: 'prev', prototype: 'proto', experiment: 'exp', complete: 'done' };

export function statusLabel(status = '') {
  const s = String(status);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function renderStatusHTML(status, note = '') {
  const glyph = STATUS_GLYPHS[status] || 'exp';
  return `<span class="status-mark"><span class="gl ${glyph}" aria-hidden="true"></span><b>${esc(statusLabel(status))}</b>${note ? `<span class="status-note">${esc(note)}</span>` : ''}</span>`;
}

export const STAGES = {
  sketch: { latin: 'Nova', english: 'New', label: 'sketch', phase: 1 },
  building: { latin: 'Crescens', english: 'Waxing', label: 'building', phase: 2 },
  testing: { latin: 'Gibbosa', english: 'Gibbous', label: 'testing', phase: 3 },
  released: { latin: 'Plena', english: 'Full', label: 'released', phase: 4 }
};

export function moonSVG(stage, size = 24) {
  const lit = {
    sketch: '',
    building: '<path class="moon-lit" d="M12 2a10 10 0 0 1 0 20a5 10 0 0 0 0-20Z"/>',
    testing: '<path class="moon-lit" d="M12 2a10 10 0 0 1 0 20a5 10 0 0 1 0-20Z"/>',
    released: '<circle class="moon-lit" cx="12" cy="12" r="10"/>'
  }[stage] ?? '';
  return `<svg class="moon moon-${esc(stage)}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><circle class="moon-ring" cx="12" cy="12" r="10"/>${lit}</svg>`;
}

export function renderPhaseHTML(stage, size = 24) {
  const info = STAGES[stage];
  if (!info) return '';
  return `<span class="phase">${moonSVG(stage, size)}${incantation(info.latin, info.english)}<span class="meta">${esc(info.label)}</span></span>`;
}

export function filterProjects(projects, category) {
  return !category || category === 'All' ? projects : projects.filter((p) => p.category === category);
}

export function featuredProject(projects) {
  return projects.find((p) => p.featured) ?? projects[0] ?? null;
}

function madeWithText(project) {
  return (project.madeWith || []).join(' · ');
}

function veil(src, alt = '', extra = '') {
  return `<span class="veil"${extra}><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></span>`;
}

function liveLink(project, cls = 'button blood') {
  if (!project.links?.live) return '';
  return `<a class="${cls}" href="${esc(project.links.live)}">${esc(project.links.liveLabel || 'Open the project')} <span aria-hidden="true">↗</span></a>`;
}

/** One row of the index list. The whole row is a single link to the project page. */
export function renderProjectRowHTML(project, index) {
  const contain = project.coverMode === 'contain' ? ' contain' : '';
  return `<a class="work-row" href="project/${encodeURIComponent(project.slug)}" aria-label="${esc(project.title)}: ${esc(project.summary)}">`
    + `<span class="work-num" aria-hidden="true">${toRoman(index + 1)}</span>`
    + `<span class="work-thumb${contain}">${veil(project.thumbnail || project.cover)}</span>`
    + `<span class="work-copy"><span class="work-title">${esc(project.title)}</span><span class="work-summary">${esc(project.summary)}</span></span>`
    + `<span class="work-meta meta">${esc(project.category)}${madeWithText(project) ? `<br>${esc(madeWithText(project))}` : ''}</span>`
    + renderStatusHTML(project.status)
    + `<span class="work-arrow" aria-hidden="true">→</span></a>`;
}

export function renderFeaturedHTML(project) {
  if (!project) return '';
  const contain = project.coverMode === 'contain' ? ' contain' : '';
  const blurb = project.homeBlurb || project.summary;
  return `<a class="featured-art framed${contain}" href="project/${encodeURIComponent(project.slug)}" aria-label="Read more about ${esc(project.title)}"><img src="${esc(project.cover)}" alt="${esc(project.title)} cover artwork"></a>`
    + `<div class="featured-copy"><h2 class="label">Latest</h2>${renderStatusHTML(project.status)}`
    + `<h3 class="featured-title">${esc(project.title)}</h3><p class="featured-blurb">${esc(blurb)}</p>`
    + `<span class="meta">${esc(project.category)}${madeWithText(project) ? ` · Made with ${esc(madeWithText(project))}` : ''} · ${esc(project.year)}</span>`
    + `<div class="actions">${liveLink(project)}<a class="button" href="project/${encodeURIComponent(project.slug)}">Read more <span aria-hidden="true">→</span></a></div></div>`;
}

/** Small bench card on the home page. Deliberately has no link. */
export function renderBenchCardHTML(item) {
  return `<div class="bench-card">${veil(item.image, `${item.title} concept artwork`)}<span class="bench-title">${esc(item.title)}</span>${renderPhaseHTML(item.stage, 16)}</div>`;
}

/** Full workbench entry. Deliberately has no link. */
export function renderInDevelopmentCardHTML(item) {
  const tags = (item.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  return `<article class="opus">${veil(item.image, `${item.title} concept artwork`)}<div class="opus-copy">${renderPhaseHTML(item.stage, 28)}`
    + `<h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><div class="tag-row">${tags}</div></div></article>`;
}

const LATIN_ORDINALS = ['primus', 'secundus', 'tertius', 'quartus', 'quintus', 'sextus', 'septimus', 'octavus', 'nonus', 'decimus', 'undecimus', 'duodecimus'];
const ENGLISH_ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];

export function riteName(index) {
  return LATIN_ORDINALS[index]
    ? { latin: `Ritus ${LATIN_ORDINALS[index]}`, english: `The ${ENGLISH_ORDINALS[index]} rite` }
    : { latin: `Ritus ${toRoman(index + 1)}`, english: `Rite ${toRoman(index + 1)}` };
}

function neighbourHTML(project, index, direction) {
  if (!project) return '';
  const label = direction === 'prev' ? `← Previous · ${toRoman(index + 1)}` : `Next · ${toRoman(index + 1)} →`;
  return `<a class="neighbour ${direction}" href="project/${encodeURIComponent(project.slug)}">${veil(project.thumbnail || project.cover)}<span><span class="label">${esc(label)}</span><span class="neighbour-title">${esc(project.title)}</span></span></a>`;
}

/**
 * Project page body. `context` is { index, prev, prevIndex, next, nextIndex } and is optional,
 * so the page still renders on its own.
 */
export function renderProjectDetailHTML(project, context = {}) {
  const index = context.index ?? 0;
  const numeral = toRoman(index + 1);
  const rite = riteName(index);
  const tags = (project.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const paragraphs = (project.description || []).map((p, i) => {
    if (i === 0 && p.length > 1) return `<p><span class="drop-cap" aria-hidden="true">${esc(p[0])}</span><span class="visually-hidden">${esc(p[0])}</span>${esc(p.slice(1))}</p>`;
    return `<p>${esc(p)}</p>`;
  }).join('');
  const source = project.links?.source ? `<a class="button" href="${esc(project.links.source)}">View source <span aria-hidden="true">↗</span></a>` : '';
  const gallery = (project.gallery || []).length
    ? `<div class="gallery">${project.gallery.map((src, i) => `<img src="${esc(src)}" alt="${esc(project.title)} artwork view ${i + 1}" loading="lazy">`).join('')}</div>` : '';
  const promises = (project.promises || []).length
    ? `<div class="oaths">${incantation('Iuramenta', 'Oaths')}<span class="label">What it will and won’t do</span>${project.promises.map((p) => `<p class="oath"><span aria-hidden="true">†</span>${esc(p)}</p>`).join('')}</div>` : '';
  const madeWith = madeWithText(project);
  const sealText = [project.title, project.status, project.category, madeWith, toRoman(project.year)]
    .filter(Boolean).map((s) => String(s).toUpperCase()).join(' ✦ ') + ' ✦';
  // Fit the seal's ring text to its circle: IBM Plex Mono advances 0.6em per glyph plus letter-spacing.
  const ringLength = 2 * Math.PI * 104 - 12;
  const sealScale = Math.min(1, ringLength / (sealText.length * (11 * 0.6 + 3.2)));
  const sealStyle = sealScale < 1 ? ` style="font-size:${(11 * sealScale).toFixed(2)}px;letter-spacing:${(3.2 * sealScale).toFixed(2)}px"` : '';
  const contain = project.coverMode === 'contain' ? ' contain' : '';
  const neighbours = (context.prev || context.next)
    ? `<nav class="neighbours" aria-label="More projects">${neighbourHTML(context.prev, context.prevIndex, 'prev')}${neighbourHTML(context.next, context.nextIndex, 'next')}</nav>` : '';

  const crumbs = `<div class="breadcrumb"><nav aria-label="Breadcrumb" class="meta"><a href="index.html#index">Index</a><span class="crumb-sep" aria-hidden="true">✦</span>${numeral}<span class="crumb-sep" aria-hidden="true">✦</span><span aria-current="page">${esc(project.title)}</span></nav>`
    + `<span class="meta crumb-steps">${context.prev ? `<a href="project/${encodeURIComponent(context.prev.slug)}">← ${toRoman(context.prevIndex + 1)} · ${esc(context.prev.title)}</a>` : ''}${context.next ? ` <a href="project/${encodeURIComponent(context.next.slug)}">${toRoman(context.nextIndex + 1)} · ${esc(context.next.title)} →</a>` : ''}</span></div>`;

  return `<div class="detail">${crumbs}`
    + `<header class="detail-head">${incantation(rite.latin, rite.english)}<h1>${esc(project.title)}</h1><p class="detail-summary">${esc(project.summary)}</p>`
    + `${renderStatusHTML(project.status)}<div class="actions">${liveLink(project, 'button blood large')}${source}</div></header>`
    + `<figure class="detail-media framed${contain}"><img src="${esc(project.cover)}" alt="${esc(project.title)} cover artwork">${gallery}</figure>`
    + `<div class="detail-body"><div class="detail-side">`
    + `<svg class="seal" viewBox="0 0 260 260" role="img" aria-label="${esc(project.title)}’s seal: project ${numeral}"><defs><path id="seal-ring" d="M130,130 m-104,0 a104,104 0 1,1 208,0 a104,104 0 1,1 -208,0"/></defs><circle class="seal-ring" cx="130" cy="130" r="124"/><circle class="seal-ring dim" cx="130" cy="130" r="116"/><g class="spin"><text class="seal-text"${sealStyle}><textPath href="#seal-ring">${esc(sealText)}</textPath></text></g><circle class="seal-ring" cx="130" cy="130" r="88"/><path class="seal-ring dim" d="M130,48 L178,196 L52,104 L208,104 L82,196 Z"/><text class="seal-num" x="130" y="152">${numeral}</text></svg>`
    + `<dl class="spec"><dt>Status</dt><dd>${esc(statusLabel(project.status))}</dd><dt>Year</dt><dd>${esc(project.year)}</dd><dt>Category</dt><dd>${esc(project.category)}</dd>${madeWith ? `<dt>Made with</dt><dd>${esc(madeWith)}</dd>` : ''}</dl>`
    + `<div class="tag-row">${tags}</div></div>`
    + `<div class="detail-main">${promises}<div class="detail-copy">${paragraphs}</div></div></div>`
    + neighbours
    + `</div>`;
}

export function toolTotals(projects) {
  const counts = new Map();
  for (const p of projects) for (const tool of p.madeWith || []) counts.set(tool, (counts.get(tool) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function renderToolTotalsHTML(projects) {
  const totals = toolTotals(projects);
  const max = totals[0]?.[1] || 1;
  return totals.map(([tool, n]) => `<div class="tool-row"><span class="tool-name">${esc(tool)}</span><span class="tool-bar" style="width:${Math.round((n / max) * 100)}%"></span><span class="meta">${toRoman(n)} ${n === 1 ? 'project' : 'projects'}</span></div>`).join('');
}
