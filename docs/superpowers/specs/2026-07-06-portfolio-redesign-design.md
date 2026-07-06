# Portfolio Redesign Design

## Context

`ziczaczack/AboutMe` is a static 4-page portfolio (Home / About / Projects / Contact)
built on Bootstrap 5, deployed via GitHub Pages from `main`. The owner wants to
restyle it using a visual design originally produced as a Claude Artifact (a
single-page "Jordan Avery" portfolio template — warm palette, serif headings,
sticky blurred nav, scroll-reveal animations), while keeping the existing
multi-page structure and all existing content verbatim.

## Goals

- Carry over the Claude-template visual language (colors, typography, nav,
  card/button styles, scroll-reveal, theme toggle) into the existing 4-page
  static site.
- Preserve current page structure (`index.html`, `about.html`, `projects.html`,
  `contact.html`) and all existing text content unchanged.
- Keep the site framework-free, static, and GitHub Pages-compatible (no build
  step).
- Drop the Bootstrap dependency; replace Bootstrap-driven components
  (navbar, carousel, cards, buttons) with custom CSS equivalents.

## Non-goals

- No content rewrites (bio, project descriptions, skills list stay as-is).
- No single-page consolidation — pages remain separate.
- No self-hosting of images/assets — existing imgur/devicon/Google Drive links
  stay external.
- No accent-color switcher or other template extras beyond dark/light theme
  toggle, unless requested later.

## Approach

Rejected alternatives:
1. **Reuse the raw Claude Artifact export** (self-decoding base64 bundle +
   in-browser Babel/JSX compile) — works but is heavy, slow to first render,
   and unmaintainable as hand-edited HTML.
2. **Copy the template's inline-style markup directly** — matches the source
   most closely but duplicates large style blocks across 4 pages, making
   future style changes expensive.

Chosen approach: **plain static HTML per page + shared `css/styles.css` and
`js/main.js`**, mirroring the existing repo's structure. The Claude template's
visual system (CSS custom properties for color/spacing, font choices, card and
button treatments, scroll-reveal behavior, theme toggle) is extracted into the
shared stylesheet/script rather than repeated inline. This keeps the site a
zero-build static bundle GitHub Pages can serve directly, consistent with how
the repo already works.

## File structure

```
index.html
about.html
projects.html
contact.html
css/styles.css      (replaces current css/styles.css — new design system)
js/main.js          (replaces current js/script.js — theme toggle, reveal
                      animation, back-to-top)
```

## Visual design

- Palette (CSS custom properties): `--bg:#faf8f5`, `--surface:#ffffff`,
  `--ink:#1c1a17`, `--muted:#6b655c`, `--line:#e7e1d8`, `--accent:#c0512f`.
  Dark theme swaps these via a `[data-theme="dark"]` attribute on `<html>`.
- Typography: headings in `Newsreader` (serif), body in `Hanken Grotesk`
  (sans), loaded via Google Fonts `<link>` tags (same CDN approach the site
  already uses for Inter/Outfit).
- Nav: sticky header, `backdrop-filter: blur(...)` translucent background,
  same link set as today (Home/About/Projects/Contact) plus the existing
  theme-toggle button, restyled to match the template's toggle pill.
- Buttons/cards: solid `--ink`-on-`--bg` primary buttons with `--accent`
  hover, bordered cards with `--shadow` on hover — replacing Bootstrap's
  `.btn`/`.card` classes with custom equivalents of the same semantic role.
- Motion: elements marked for entrance get a `data-reveal` attribute; an
  IntersectionObserver in `main.js` adds a `.is-visible` class that CSS
  transitions from a slightly-offset, transparent state to full opacity —
  this replaces the Bootstrap-independent parts of the template's reveal
  effect.

## Content mapping (verbatim text, restyled layout)

- **index.html**: hero-style header (greeting + one-line intro), existing
  3-image imgur carousel re-implemented as a small dependency-free JS
  carousel (replacing Bootstrap's carousel component) sitting in the
  template's image-card slot, CTA button to `projects.html`.
- **about.html**: bio paragraph in a lead/callout block, three skill-group
  cards (Frontend / Backend & Data / Tools) with existing devicon `<img>`
  icons, resume `<iframe>` + download link unchanged.
- **projects.html**: existing single project (Inventory Management System)
  as one card in a grid the template's "Work" section style, sized to hold
  more cards when new projects are added later.
- **contact.html**: centered email CTA + row of existing social icon links
  (LinkedIn, Facebook, Discord, X).

## Testing / verification

No build step, so verification is manual: open each HTML file in a local
static server (or directly via `file://`) and check, per page and in both
themes:
- Nav links go to the right page and highlight the active one.
- Theme toggle persists the chosen palette and updates all pages
  consistently (stored in `localStorage`).
- Carousel advances/loops, skill icons render, resume iframe loads, social
  links point to the correct existing URLs.
- No Bootstrap CSS/JS is still being loaded from any page.

## Deployment

Work happens on a `redesign` branch (already created off `main`). `main`
(the live GitHub Pages branch) is untouched until the owner reviews the
branch and explicitly approves a merge.
