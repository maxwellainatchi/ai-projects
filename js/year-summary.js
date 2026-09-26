export function summarizeYear(projects, year) {
  const current = projects.filter((project) => Number(project.year) === year);
  if (!current.length) return `No projects listed for ${year} yet. Explore the full collection in the meantime.`;

  const categories = [...new Set(current.map((project) => project.category).filter(Boolean))]
    .map((category) => ({ Interactive: 'interactive experiments', Writing: 'writing', Apps: 'apps' })[category] || category.toLowerCase());
  const fields = categories.length ? ` across ${new Intl.ListFormat('en').format(categories)}` : '';
  const opening = `In ${year}, I made ${current.length} ${current.length === 1 ? 'project' : 'projects'}${fields}.`;
  const highlights = current.map((project) => project.homeBlurb || `${project.title}: ${project.summary}`).join(' ');
  return `${opening}\n\n${highlights}`;
}
