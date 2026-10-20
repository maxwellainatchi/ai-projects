# AI Projects Portfolio

A lightweight static portfolio for creative projects, in a ritual design: a dark ground, one red, and Latin incantations set in blackletter that struggle to stay anchored and now and then slip into their English translation. The English copy stays plain.

## Project content

`data/projects.json` is the single source of truth for portfolio projects. To add a project, add one object to that file and place its images under `assets/projects/<slug>/`.

Fields: `slug`, `title`, `summary`, `description`, `year`, `status` (`live`, `preview`, `prototype`, `experiment` or `complete`), `category`, `tags`, `madeWith` (the tools used, such as `["Claude", "ChatGPT"]`), `cover`, optional `thumbnail`, `coverMode`, `homeBlurb`, `promises`, `featured`, `gallery`, and `links` (`live`, optional `liveLabel`, `source`). The thumbnail is used in the index when present; otherwise the cover is used. Set `coverMode` to `contain` for portrait artwork. `promises` lists what the project will and won't do and appears in its own block on the project page. Set `featured: true` to pin a project to the "Latest" slot on the home page; otherwise the first project is shown. Empty optional links are not rendered.

The home page is the index. It shows the latest project, the full list of projects with category filters (numbered in Roman numerals by their order in the JSON), and a strip of work on the bench. `projects.html` forwards to it. The About page totals the `madeWith` credits across all projects.

`data/in-development.json` powers the **Workbench** page (`in-development.html`) and the bench strip on the home page. Each entry has a `title`, `summary`, `tags`, an `image` under `assets/in-development/`, and a `stage`: `sketch`, `building`, `testing` or `released`, shown as a moon phase. These entries deliberately have no project or source links and are not included in the index.

`data/design-systems.json` powers the **Systems** page (`design-systems.html`): one entry per design system with its `slug`, `name`, a Latin/English incantation pair (`latin`, `english`), a `summary`, its `themes`, and its tokens as `colors` (name `n`, usage `u` and a value `v` per theme), `shadows`, font `families` and type `groups`, `spacing` and `radius`. Each system is drawn as a plate in its own colors and fonts by `js/design-system-plates.js`, which also says which tokens play which role on the plate (`ROLES`) and holds the hand-written specimen for each system; a new system needs an entry in both. The colors, fonts and spacing sections start collapsed, and a system with more than one theme gets a switch. Its extra fonts load from Google Fonts on that page only.

Each project gets a static page at `project/<slug>/index.html`, generated from the JSON by `npm run build`, with previous/next links that wrap around the index. Project cards link to `/project/<slug>` (relative to the site root); GitHub Pages may redirect to a trailing slash. The generated HTML contains project-specific title, description, canonical URL, Open Graph, and Twitter preview tags. The canonical domain is read from `CNAME`. The older `project.html?slug=<slug>` links redirect in browsers to the clean URL.

`assets/mark.svg` is the brand mark and favicon, `assets/frame-sigil.svg` supplies the frame corners, and `assets/hero.webp` is the shared background artwork. Fonts (Cormorant Garamond, EB Garamond, IBM Plex Mono and UnifrakturMaguntia) load from Google Fonts. All motion stops when the visitor prefers reduced motion, and the English translations are hidden from screen readers so the Latin is read once.

## Local preview

```bash
npm run build
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

## Tests

```bash
npm test
```

## Deployment

Pushes to `main` rebuild and test the project pages, then deploy the repository root to GitHub Pages through `.github/workflows/pages.yml`. Commit the generated pages when adding or changing projects so branch-based Pages publishing has the same content.
