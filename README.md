# AI Projects Portfolio

A lightweight static portfolio for creative projects, using the restrained cyberpunk/occult visual direction developed for the site.

## Project content

`data/projects.json` is the single source of truth for portfolio projects. To add a project, add one object to that file and place its images under `assets/projects/<slug>/`.

Fields: `slug`, `title`, `summary`, `description`, `year`, `status`, `category`, `tags`, `cover`, optional `thumbnail` and `coverMode`, `gallery`, and `links` (`live`, optional `liveLabel`, `source`). The thumbnail is used on project cards when present; otherwise the cover is used. Set `coverMode` to `contain` for portrait artwork. Empty optional links are not rendered.

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
