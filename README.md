# Lim Lok — Portfolio

A single-page portfolio site for **Lim Lok**, an IT undergraduate specialising in Cloud Engineering
at Asia Pacific University (APU).

Static HTML, CSS and vanilla JavaScript — no build step, no framework, nothing to install.
Open `index.html` in a browser and it works.

**Live site:** https://ziczaczack.github.io/AboutMe/

---

## Features

| | |
|---|---|
| **Single page** | Home, About, Projects, Resume and Contact live in one scrolling document with anchor navigation. |
| **Responsive** | Four breakpoints from 320px up. The nav collapses to a hamburger drawer below 880px. |
| **Dark mode** | Toggle in the header. The choice is saved to `localStorage` and applied before first paint, so there is no light-then-dark flash on reload. |
| **Accent colours** | Three swatches (terracotta / indigo / forest) recolour the whole page. Also persisted. |
| **Scroll-spy** | The current section is underlined in the nav as you scroll. |
| **Reveal on scroll** | Sections fade in as they enter the viewport, using `IntersectionObserver` with a viewport-check fallback. |
| **Accessible** | Skip link, visible focus rings, `aria-expanded` on the menu button, Escape closes the drawer, and `prefers-reduced-motion` is respected. |
| **Degrades gracefully** | With JavaScript disabled every section is still visible and navigable. |

---

## Project structure

```
.
├── index.html          # The whole page: header, hero, about, projects, resume, contact
├── css/
│   └── styles.css      # Design tokens, light/dark themes, layout, components, breakpoints
├── js/
│   └── main.js         # Theme, drawer, anchor scrolling, scroll-spy, reveal, back-to-top
├── images/
│   └── profile.jpg     # Hero portrait (also used as the social preview image)
├── resume/
│   ├── resume.html         # Source for the resume, styled for A4 printing
│   ├── Lim-Lok-Resume.pdf  # The file the Download button serves
│   └── resume-preview.jpg  # First-page preview shown in the Resume section
├── docs/               # Design notes and planning documents
├── .nojekyll           # Tells GitHub Pages to serve the files as-is
└── README.md
```

There is no `build/` or `dist/` — what is in the repo is what gets served.

---

## Running it locally

Double-clicking `index.html` works for most things. To exercise it exactly as GitHub Pages
serves it, run a local web server from the project root:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

---

## Deploying to GitHub Pages

The site is served straight from the repository — no workflow or build step required.

1. Push your changes to the `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)`
4. Save. The first deploy takes a minute or two, after which the site is live at
   `https://ziczaczack.github.io/AboutMe/`.

Every later push to `main` redeploys automatically.

### Custom domain

Add a file named `CNAME` at the repository root containing only your domain
(e.g. `limlok.dev`), then point a `CNAME` DNS record at `ziczaczack.github.io`.

---

## Editing the content

Everything is plain HTML — no templating to learn.

| To change | Edit |
|---|---|
| Name, headline, intro | The `.hero` section in `index.html` |
| Portrait | Replace `images/profile.jpg` (4:5 portrait, about 960 × 1200) |
| Bio and skill icons | `#about` — icons come from [devicon](https://devicon.dev) via jsDelivr |
| Projects | `#projects` — one `<article class="project-card">` block per project |
| Resume | See "Updating the resume" below |
| Email and socials | `#contact` and the footer |
| Colours, spacing, fonts | The `:root` and `html[data-theme="dark"]` token blocks at the top of `css/styles.css` |

**Adding a project:** duplicate an existing `.project-card` article, then swap the image,
title, description, tech line and repo URL. The grid reflows on its own. The card with
`is-featured` spans the full row; projects without a screenshot use an inline SVG cover whose
colours come from the theme tokens (the `.ill-*` classes in `css/styles.css`).

**Updating the resume:** edit `resume/resume.html`, open it in Chrome and choose
**Print → Save as PDF** (A4, margins *None*, background graphics on), saving over
`resume/Lim-Lok-Resume.pdf`. Then refresh `resume/resume-preview.jpg` with a screenshot of the
first page. This folder is public, so never put a home address or phone number in the resume.

**Changing the nav breakpoint:** it lives in two places that must agree — the
`@media (max-width: 880px)` block in `css/styles.css` and the `BREAKPOINT` constant in
`js/main.js`. Both are commented.

---

## How the tricky parts work

Two bits of `js/main.js` are worth knowing about before you edit them:

**Anchor scrolling is handled manually, not by the browser.** The mobile drawer sits in normal
flow inside the sticky header, so a native `#section` jump is computed while the drawer is still
open — then the drawer collapses and drags the whole page up by its height, leaving you well
past the section you asked for. Instead the header height is measured *before* the drawer
closes and used as the scroll offset: it is simultaneously the sticky bar to clear and the exact
amount the page is about to shift.

**The drawer's height comes from its own content.** `max-height` is set from `scrollHeight`
rather than a hard-coded value, so adding a fifth nav link can never clip it.

---

## External resources

The page is self-contained apart from these third-party assets, all loaded over HTTPS:

- **Google Fonts** — Newsreader (serif) and Hanken Grotesk (sans)
- **devicon via jsDelivr** — technology and social icons
- **SVG Repo** — Discord icon
- **Imgur** — Inventory Management System screenshot

If any of these ever go away the page still renders; you would just lose that image or fall back
to a system font.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). The layout uses CSS Grid, custom
properties, `aspect-ratio` and `color-mix()` — the last is the newest and needs Chrome/Edge 111+,
Firefox 113+ or Safari 16.2+. Older browsers lose some translucency and tinted borders, but the
page stays fully readable and usable.

---

## History

This began as a four-page site (`index` / `about` / `projects` / `contact`) sharing a stylesheet
and nav. It was consolidated into this single scrolling page; the old pages remain in the Git
history if they are ever needed.

---

© 2026 Lim Lok. All rights reserved.
