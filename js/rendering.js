function esc(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
export function filterProjects(projects, category) { return !category || category === 'All' ? projects : projects.filter(p => p.category === category); }
export function renderProjectCardHTML(project) {
  const tags = (project.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
  const imageClass = project.coverMode === 'contain' ? ' contain-art' : '';
  return `<article class="project-card"><div class="project-card-media${imageClass}"><img src="${esc(project.thumbnail || project.cover)}" alt="" loading="lazy"></div><div class="project-card-body"><div><h2>${esc(project.title)}</h2><p>${esc(project.summary)}</p><div class="tag-row">${tags}</div></div><a class="card-link" href="project/${encodeURIComponent(project.slug)}" aria-label="View ${esc(project.title)}">→</a></div></article>`;
}
export function renderProjectDetailHTML(project) {
  const paragraphs = (project.description || []).map(p => `<p>${esc(p)}</p>`).join('');
  const tags = (project.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
  const links = [project.links?.live ? `<a class="button" href="${esc(project.links.live)}">${esc(project.links.liveLabel || 'Launch project')} →</a>` : '', project.links?.source ? `<a class="button" href="${esc(project.links.source)}">View source →</a>` : ''].filter(Boolean).join('');
  const gallery = (project.gallery || []).length ? `<div class="gallery">${project.gallery.map((src, index) => `<img src="${esc(src)}" alt="${esc(project.title)} artwork view ${index + 1}" loading="lazy">`).join('')}</div>` : '';
  const imageClass = project.coverMode === 'contain' ? ' contain-art' : '';
  return `<div class="detail"><div class="detail-media"><div class="detail-image${imageClass}"><img src="${esc(project.cover)}" alt="${esc(project.title)} cover artwork"></div>${gallery}</div><div class="detail-content"><div class="eyebrow">${esc(project.category)} · ${esc(project.status)}</div><h1>${esc(project.title)}</h1><p class="summary">${esc(project.summary)}</p><div class="detail-copy">${paragraphs}</div><div class="tag-row">${tags}</div><dl class="meta"><dt>Year</dt><dd>${esc(project.year)}</dd><dt>Category</dt><dd>${esc(project.category)}</dd></dl><div class="actions">${links}</div></div></div>`;
}
export function renderProjectGrid(projects, container) { container.innerHTML = projects.map(renderProjectCardHTML).join(''); }
export function renderProjectDetail(project, container) { container.innerHTML = renderProjectDetailHTML(project); }
