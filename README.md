# AI Projects Portfolio

A lightweight static portfolio for creative projects, using the restrained cyberpunk/occult visual direction developed for the site.

## Project content

`data/projects.json` is the single source of truth for portfolio projects. To add a project, add one object to that file and place its images under `assets/projects/<slug>/`.

Fields: `slug`, `title`, `summary`, `description`, `year`, `status`, `category`, `tags`, `cover`, optional `thumbnail`, `coverMode`, and `homeBlurb`, `gallery`, and `links` (`live`, optional `liveLabel`, `source`). The thumbnail is used on project cards when present; otherwise the cover is used. Set `coverMode` to `contain` for portrait artwork. Empty optional links are not rendered.

The homepage reads this JSON and composes a current-year overview. `homeBlurb` holds a short written line for the overview; if omitted, the project title and `summary` are used. A new project with the current `year` appears automatically. The homepage artwork in `assets/hero.webp` is a faint background on all portfolio pages.

`assets/mark.svg` is the brand mark and favicon, while `assets/frame-sigil.svg` supplies the corner geometry. The architectural artwork lives in optimized WebP files under `assets/`.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

## Tests

```bash
npm test
```

## Deployment

Pushes to `main` deploy the repository root to GitHub Pages through `.github/workflows/pages.yml`.
