import { esc, incantation } from './rendering.js';

// Which of a system's color tokens plays each role on its plate.
// `strip` is the six-color band shown in the index above the plates.
export const ROLES = {
  ritual:   { bg: 'bg', panel: 'panel', fg: 'text', muted: 'muted', line: 'line', accent: 'blood', strip: ['bg', 'panel', 'rust', 'clot', 'blood', 'text'] },
  grimoire: { bg: 'surface', panel: 'surface-raised', fg: 'ink', muted: 'ink-muted', line: 'line', accent: 'crimson', strip: ['surface-void', 'surface', 'line-gilt', 'gold', 'crimson', 'ink'] },
  obsidian: { bg: 'bg', panel: 'surface-1', fg: 'text', muted: 'text-muted', line: 'border', accent: 'accent', strip: ['bg', 'surface-1', 'surface-3', 'text-muted', 'accent', 'text'] },
  tactile:  { bg: 'surface', panel: 'surface-sunken', fg: 'ink', muted: 'ink-muted', line: 'edge', accent: 'accent', strip: ['shade', 'surface', 'highlight', 'accent', 'glow-violet-fill', 'ink'] },
  taskflow: { bg: 'surface', panel: 'surface-raised', fg: 'ink', muted: 'ink-muted', line: 'line', accent: 'primary', strip: ['surface', 'surface-wash', 'primary', 'steady', 'coral', 'amber'] },
};

// A live specimen per system, written in that system's own voice.
// Buttons are tabindex="-1": they show what a control looks like and do nothing.
const btn = (cls, label) => `<button class="ds-btn ${cls}" type="button" tabindex="-1">${label}</button>`;
const KITS = {
  ritual: () => `<div class="ds-inc" aria-hidden="true">Codex operum</div>
    <h3 class="ds-hero">Projects for an <em>imagined world.</em></h3>
    <div class="ds-kit">${btn('ds-b1', 'Get started')}${btn('ds-b2', 'Learn more')}</div>
    <div class="ds-card"><h4>Every source at once</h4><p>Search every source at once and see what changed.</p><span>PER MONTH · BILLED YEARLY</span></div>`,
  grimoire: () => `<div class="ds-runes" aria-hidden="true">ᚠᚢᚦᚨᚱᚲ ᚷᚹᚺᚾᛁ</div>
    <h3 class="ds-hero">The Crimson Codex</h3>
    <div class="ds-kit">${btn('ds-b1', 'Cast spell')}${btn('ds-b2', 'Inscribe')}</div>
    <div class="ds-card"><span>SCHOOL OF ABJURATION</span><h4>Components of the rite</h4><p>Prepare three measures of salt before you begin.</p></div>`,
  obsidian: () => `<h3 class="ds-hero">Homelab overview</h3>
    <div class="ds-kit">${btn('ds-b1', 'Deploy')}${btn('ds-b2', 'Save changes')}<span class="ds-mono">10.0.0.12:32400</span></div>
    <div class="ds-card">
      <div class="ds-stat"><small>CPU load</small><b>41%</b><span><i class="ds-dot"></i>Online</span></div>
      <div class="ds-stat"><small>Storage</small><b>412</b><span>of 500 GB</span></div>
      <div class="ds-stat"><small>Uptime</small><b>41d 6h</b><span>Updated 2 min ago</span></div>
    </div>`,
  tactile: () => `<h3 class="ds-hero">Press softly</h3>
    <div class="ds-kit">${btn('ds-b1', 'Save changes')}${btn('ds-b2', 'Cancel')}<span class="ds-switch" aria-hidden="true"></span><span class="ds-pad" aria-hidden="true">A1</span></div>
    <div class="ds-card"><div class="ds-dial"><b>22°</b></div><div><small>Temperature</small><h4>Living room</h4></div></div>`,
  taskflow: () => `<div class="ds-wash"><h3 class="ds-hero">You’ve got this.</h3><p>How’s your capacity today?</p></div>
    <div class="ds-chips"><span style="background:var(--t-primary-soft)">Energetic</span><span style="background:var(--t-steady-soft)">Steady</span><span style="background:var(--t-violet-soft)">Off</span><span style="background:var(--t-coral-soft)">Overwhelmed</span></div>
    <div class="ds-card"><h4>Make something</h4><p>A manageable next step.</p><div class="ds-kit">${btn('ds-b1', 'Open next step')}${btn('ds-b2', 'Later')}</div></div>`,
};

export function colorOf(system, name, theme) {
  const token = system.colors.find((c) => c.n === name);
  return token ? token.v[theme] : 'transparent';
}

export const styleCount = (system) => system.groups.reduce((sum, g) => sum + g.styles.length, 0);

// Every custom property a plate needs for one theme: --t-<token>, --s-<shadow>, --p-<role>.
export function themeVars(system, theme) {
  const vars = {};
  for (const c of system.colors) vars[`--t-${c.n}`] = c.v[theme];
  for (const s of system.shadows) vars[`--s-${s.n}`] = s.v[theme];
  const roles = ROLES[system.slug];
  for (const role of ['bg', 'panel', 'fg', 'muted', 'line', 'accent']) vars[`--p-${role}`] = colorOf(system, roles[role], theme);
  vars['--p-check'] = `color-mix(in srgb, ${colorOf(system, roles.fg, theme)} 14%, transparent)`;
  return vars;
}

export function renderSwatchesHTML(system, theme) {
  return system.colors.map((c) => `<div title="${esc(c.u)}"><i style="--c:${esc(c.v[theme])}"></i><b>${esc(c.n)}</b><small>${esc(c.v[theme])}</small></div>`).join('');
}

function renderTypeHTML(system) {
  const upper = /label|eyebrow|caption|control|meta|badge|field|brand/i;
  return system.groups.map((g) => `<div class="ds-tgroup">${esc(g.name)}</div>` + g.styles.map((s) => {
    const px = parseFloat(s.fontSize);
    const lineHeight = typeof s.lineHeight === 'number' ? s.lineHeight : (parseFloat(s.lineHeight) / px).toFixed(2);
    const style = [
      `font-family:${system.families[g.family] ?? 'inherit'}`,
      `font-size:${Math.min(px, 44)}px`,
      `line-height:${lineHeight}`,
      `font-weight:${s.fontWeight}`,
      `letter-spacing:${s.letterSpacing ?? 'normal'}`,
      `font-style:${s.fontStyle ?? 'normal'}`,
      `text-transform:${upper.test(s.name) && system.slug !== 'taskflow' ? 'uppercase' : 'none'}`,
    ].join(';');
    const hidden = g.family === 'rune' ? ' aria-hidden="true"' : '';
    return `<div class="ds-trow"><div><b>${esc(s.name)}</b><small>${esc(s.fontSize)} / ${esc(String(s.lineHeight))} · ${esc(String(s.fontWeight))}</small></div><div class="ds-smp" style="${esc(style)}"${hidden}>${esc(s.sample ?? `${system.name} ${s.name}`)}</div></div>`;
  }).join('')).join('');
}

function renderScaleHTML(system) {
  const spacing = system.spacing.map((t) => `<div title="${esc(t.usage)}"><span>${esc(t.name)}</span><span>${esc(t.value)}</span><em style="width:${Math.min(parseFloat(t.value) * 2, 100)}%"></em></div>`).join('');
  const radius = system.radius.map((t) => {
    const value = /^9{3,}px$/.test(t.value) ? '999px' : t.value;
    return `<div title="${esc(t.usage)}"><i style="border-radius:${esc(value)}"></i><b>${esc(t.name)}</b><small>${esc(t.value)}</small></div>`;
  }).join('');
  return `<div><p class="ds-cap">Spacing · ${system.spacing.length}</p><div class="ds-sp">${spacing}</div></div><div><p class="ds-cap">Radius · ${system.radius.length}</p><div class="ds-rd">${radius}</div></div>`;
}

export function renderIndexHTML(systems) {
  return systems.map((s) => {
    const theme = s.themes[0].id;
    const strip = ROLES[s.slug].strip.map((n) => `<i style="background:${esc(colorOf(s, n, theme))}"></i>`).join('');
    return `<a href="#${esc(s.slug)}"><span class="ds-strip" aria-hidden="true">${strip}</span><b>${esc(s.name)}</b><small>${s.themes.map((t) => esc(t.name)).join(' · ')}</small></a>`;
  }).join('');
}

export function renderPlateHTML(system) {
  const s = system;
  const seg = s.themes.length > 1
    ? `<div class="ds-seg" role="group" aria-label="${esc(s.name)} theme">${s.themes.map((t) => `<button type="button" data-theme="${esc(t.id)}">${esc(t.name)}</button>`).join('')}</div>`
    : `<div class="ds-seg"><button type="button" disabled aria-pressed="true">${esc(s.themes[0].name)} only</button></div>`;
  return `<section class="ds-plate" id="${esc(s.slug)}" aria-labelledby="ds-h-${esc(s.slug)}">
    <div class="ds-plate-head">
      <div>${incantation(s.latin, s.english)}<h2 id="ds-h-${esc(s.slug)}">${esc(s.name)}</h2><div class="meta">${s.colors.length} colors · ${styleCount(s)} type styles · ${s.themes.length} ${s.themes.length > 1 ? 'themes' : 'theme'}</div></div>
      ${seg}
    </div>
    <div class="ds-board" data-sys="${esc(s.slug)}">
      <div class="ds-spec"><p class="ds-sum">${esc(s.summary)}</p>${KITS[s.slug]?.() ?? ''}</div>
      <details><summary>Colors<span>${s.colors.length} tokens</span></summary><div class="ds-body"><div class="ds-sw"></div></div></details>
      <details><summary>Fonts<span>${Object.keys(s.families).length} families · ${styleCount(s)} styles</span></summary><div class="ds-body">${renderTypeHTML(s)}</div></details>
      <details><summary>Spacing &amp; radius<span>${s.spacing.length} steps · ${s.radius.length} radii</span></summary><div class="ds-body ds-scale">${renderScaleHTML(s)}</div></details>
    </div>
  </section>`;
}
