# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing 4-page static portfolio (`index.html`, `about.html`, `projects.html`, `contact.html`) with the Claude-template visual language (warm palette, serif headings, sticky blurred nav, scroll-reveal, theme toggle) while keeping the page structure and all visible text content unchanged, per `docs/superpowers/specs/2026-07-06-portfolio-redesign-design.md`.

**Architecture:** Zero-build static site. One shared `css/styles.css` (design tokens + components) and one shared `js/main.js` (theme toggle, back-to-top, scroll-reveal, carousel) are consumed by all four HTML pages. Bootstrap and the old `js/script.js` are removed.

**Tech Stack:** Plain HTML5, CSS (custom properties), vanilla JavaScript (`IntersectionObserver`, `localStorage`). No build tools, no frameworks.

## Global Constraints

- No build step: no npm/node dependency may be introduced.
- No Bootstrap CSS or JS `<link>`/`<script>` may remain in any page once its task is done.
- All existing external asset URLs (imgur image URLs, devicon CDN icon URLs, Google Drive resume links, social profile URLs) must be preserved exactly as they are today.
- All visible text content (name, bio copy, skill labels, project description, contact copy) must be preserved verbatim from the current pages — no rewording.
- All work happens on the `redesign` branch (already created off `main` in this repo). Do not merge or push to `main`.
- Fonts: `Newsreader` (headings) and `Hanken Grotesk` (body) loaded via Google Fonts `<link>` tags, replacing the current `Inter`/`Outfit` `<link>`.

---

### Task 1: Design system stylesheet

**Files:**
- Modify: `css/styles.css` (full replacement of current content)

**Interfaces:**
- Produces (CSS custom properties, available to all pages): `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--shadow` — defined on `:root`, overridden on `html[data-theme="dark"]`.
- Produces (component classes later tasks rely on): `.site-header`, `.nav`, `.nav-brand`, `.nav-right`, `.nav-links`, `.theme-toggle` (with child `.icon-sun` / `.icon-moon`), `.btn` / `.btn-primary` / `.btn-secondary`, `.section`, `.section-title`, `.lead`, `.hero`, `.hero-eyebrow`, `.hero-actions`, `.carousel` (with children `.carousel-slide`, `.carousel-btn.carousel-prev`, `.carousel-btn.carousel-next`, `.carousel-dots`, `.carousel-dot`), `.card`, `.skills-grid`, `.skill-icons`, `.resume-frame`, `.projects-grid`, `.project-card`, `.contact-section`, `.social-links`, `.site-footer`, `[data-reveal]` / `.is-visible`, `#back-to-top` / `.show`.

- [ ] **Step 1: Replace `css/styles.css` with the new design system**

```css
:root {
  --bg: #faf8f5;
  --surface: #ffffff;
  --ink: #1c1a17;
  --muted: #6b655c;
  --line: #e7e1d8;
  --accent: #c0512f;
  --shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

html[data-theme="dark"] {
  --bg: #1c1a17;
  --surface: #262320;
  --ink: #f5f1ea;
  --muted: #a89e8f;
  --line: #3a352e;
  --accent: #e07a52;
  --shadow: 0 1px 3px rgba(0, 0, 0, .4);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Hanken Grotesk', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background .3s ease, color .3s ease;
}

h1, h2, h3 {
  font-family: 'Newsreader', serif;
  font-weight: 500;
  margin: 0;
}

a {
  color: inherit;
}

::selection {
  background: var(--accent);
  color: #fff;
}

/* Header / nav */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: saturate(1.4) blur(12px);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  border-bottom: 1px solid var(--line);
}

.nav {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 32px;
}

.nav-brand {
  font-family: 'Newsreader', serif;
  font-size: 22px;
  color: var(--ink);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-brand::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .3px;
  transition: color .2s ease;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--ink);
}

.theme-toggle {
  width: 34px;
  height: 22px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  color: var(--muted);
}

.theme-toggle svg {
  width: 14px;
  height: 14px;
}

.theme-toggle .icon-moon {
  display: none;
}

html[data-theme="dark"] .theme-toggle .icon-sun {
  display: none;
}

html[data-theme="dark"] .theme-toggle .icon-moon {
  display: block;
}

/* Buttons */
.btn {
  display: inline-block;
  text-decoration: none;
  padding: 14px 26px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--ink);
  color: var(--bg);
}

.btn-primary:hover {
  background: var(--accent);
  color: #fff;
}

.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
}

.btn-secondary:hover {
  color: var(--accent);
  border-color: var(--accent);
}

/* Sections */
.section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 72px 32px;
}

.section-title {
  font-size: clamp(32px, 4vw, 44px);
  margin-bottom: 32px;
}

.lead {
  font-size: 19px;
  line-height: 1.65;
  color: var(--muted);
}

/* Hero (index.html) */
.hero {
  max-width: 1120px;
  margin: 0 auto;
  padding: 96px 32px 72px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;
  align-items: center;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--muted);
  margin-bottom: 28px;
}

.hero-eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--accent);
  display: inline-block;
}

.hero h1 {
  font-weight: 400;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.05;
  letter-spacing: -.5px;
  margin: 0 0 28px;
}

.hero h1 em {
  font-style: italic;
  color: var(--accent);
}

.hero p {
  font-size: 19px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 46ch;
  margin: 0 0 36px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

/* Carousel */
.carousel {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 24px 60px rgba(0, 0, 0, .10);
  background: var(--surface);
}

.carousel-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity .5s ease;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.carousel-prev {
  left: 12px;
}

.carousel-next {
  right: 12px;
}

.carousel-dots {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, .6);
  cursor: pointer;
  padding: 0;
}

.carousel-dot.active {
  background: #fff;
}

/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);
  transition: transform .2s ease, box-shadow .2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, .08);
}

.card h3 {
  font-size: 18px;
  margin-bottom: 14px;
}

/* Skills (about.html) */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin: 32px 0;
}

.skill-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.skill-icons img {
  height: 36px;
  width: auto;
  filter: grayscale(100%);
  opacity: .7;
  transition: filter .2s ease, opacity .2s ease, transform .2s ease;
}

.skill-icons img:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.1);
}

.resume-frame {
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow);
  height: 600px;
  margin: 24px 0;
}

.resume-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.project-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
  display: block;
}

.project-card p {
  color: var(--muted);
  line-height: 1.6;
}

/* Contact */
.contact-section {
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}

.social-links img {
  height: 32px;
  width: auto;
  filter: grayscale(100%);
  opacity: .7;
  transition: filter .2s ease, opacity .2s ease, transform .2s ease;
}

.social-links img:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.1);
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--line);
  padding: 32px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

.site-footer a {
  color: var(--muted);
  text-decoration: none;
}

.site-footer a:hover {
  color: var(--accent);
}

/* Scroll reveal */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .6s ease, transform .6s ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* Back to top */
#back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--bg);
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity .2s ease, visibility .2s ease, background .2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .2);
}

#back-to-top.show {
  opacity: 1;
  visibility: visible;
}

#back-to-top:hover {
  background: var(--accent);
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 48px;
  }

  .nav-links {
    display: none;
  }
}
```

- [ ] **Step 2: Verify the file is syntactically valid CSS**

Run: `node -e "require('fs').readFileSync('css/styles.css','utf8')" && echo OK`
Expected: `OK` (this just confirms the file is readable; full visual verification happens once Task 3 wires it into a page).

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "Replace stylesheet with warm-palette design system"
```

---

### Task 2: Shared behavior script

**Files:**
- Create: `js/main.js`

**Interfaces:**
- Consumes: DOM elements with id `theme-toggle`, id `back-to-top`, attribute `[data-reveal]`, and elements with class `.carousel` containing `.carousel-slide`, `.carousel-dot`, `.carousel-prev`, `.carousel-next` (all produced by Task 1's CSS contract and wired into markup in Tasks 3-6).
- Produces: reads/writes `localStorage.getItem('theme')` / `localStorage.setItem('theme', ...)` with values `'light'` or `'dark'`; toggles `data-theme="dark"` attribute on `document.documentElement`.

- [ ] **Step 1: Create `js/main.js`**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupBackToTop();
  setupReveal();
  setupCarousels();
});

function setupTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  if (localStorage.getItem('theme') === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

function setupBackToTop() {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  window.addEventListener('scroll', () => {
    button.classList.toggle('show', window.scrollY > 100);
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => observer.observe(el));
}

function setupCarousels() {
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    if (!slides.length) return;

    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));

    function show(newIndex) {
      slides[index].classList.remove('active');
      if (dots[index]) dots[index].classList.remove('active');
      index = (newIndex + slides.length) % slides.length;
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => show(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(index + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

    setInterval(() => show(index + 1), 6000);
  });
}
```

- [ ] **Step 2: Verify the file parses as valid JavaScript**

Run: `node --check js/main.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add shared theme/reveal/carousel behavior script"
```

---

### Task 3: Rebuild `index.html`

**Files:**
- Modify: `index.html` (full replacement of current content)

**Interfaces:**
- Consumes: `.site-header`/`.nav`/`.nav-links`/`.theme-toggle` and `.hero`/`.carousel`/`.btn` classes from Task 1; `js/main.js` from Task 2 (script tag at end of `<body>`).

- [ ] **Step 1: Replace `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lim Lok - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header class="site-header">
        <nav class="nav">
            <a href="index.html" class="nav-brand">Lim Lok</a>
            <div class="nav-right">
                <ul class="nav-links">
                    <li><a href="index.html" class="active">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="projects.html">Projects</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m-5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-10 5.196a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.854-10.46a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/></svg>
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/></svg>
                </button>
            </div>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div data-reveal>
                <div class="hero-eyebrow">Welcome</div>
                <h1>Hi! I'm <em>Lim Lok</em></h1>
                <p>Welcome to my portfolio website. Here, I showcase my journey and everything I've learned during my Information Technology diploma at INTI College Subang.</p>
                <div class="hero-actions">
                    <a href="projects.html" class="btn btn-primary">Explore My Projects</a>
                </div>
            </div>
            <div data-reveal data-reveal-delay="120">
                <div class="carousel" id="profile-carousel">
                    <img src="https://i.imgur.com/SQGsjd0.jpeg" class="carousel-slide active" alt="Profile Picture 1">
                    <img src="https://i.imgur.com/09sN4PH.jpeg" class="carousel-slide" alt="Profile Picture 2">
                    <img src="https://i.imgur.com/Ea6IGcU.jpeg" class="carousel-slide" alt="Profile Picture 3">
                    <button class="carousel-btn carousel-prev" aria-label="Previous slide">&#8249;</button>
                    <button class="carousel-btn carousel-next" aria-label="Next slide">&#8250;</button>
                    <div class="carousel-dots">
                        <button class="carousel-dot active" aria-label="Slide 1"></button>
                        <button class="carousel-dot" aria-label="Slide 2"></button>
                        <button class="carousel-dot" aria-label="Slide 3"></button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <p>&copy; 2025 Lim Lok. All rights reserved.</p>
        <p><a href="https://www.linkedin.com/in/lim-lok-90b892341/" target="_blank">LinkedIn</a> &middot; <a href="https://github.com/ziczaczack" target="_blank">GitHub</a></p>
    </footer>

    <button id="back-to-top" aria-label="Back to top">&uarr;</button>

    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Manually verify in a browser**

Run: `cmd.exe /c start "" "index.html"`
Expected, checking in the opened browser tab:
- Page loads with warm cream background, serif heading "Hi! I'm *Lim Lok*".
- "Home" nav link is visually active; About/Projects/Contact links navigate correctly.
- Carousel shows the first profile photo, and the `‹`/`›` buttons and dots cycle through all 3 images.
- Clicking the theme toggle switches to a dark background and the sun/moon icon swaps; reloading the page keeps the chosen theme (persisted via `localStorage`).
- Scrolling down and back up shows the round back-to-top button appear/disappear and it scrolls to top on click.
- No Bootstrap `<link>`/`<script>` tags remain in the page source.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rebuild index.html with new design system"
```

---

### Task 4: Rebuild `about.html`

**Files:**
- Modify: `about.html` (full replacement of current content)

**Interfaces:**
- Consumes: `.section`/`.section-title`/`.lead`/`.skills-grid`/`.card`/`.skill-icons`/`.resume-frame` classes from Task 1; same header/footer/script pattern as Task 3.

- [ ] **Step 1: Replace `about.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lim Lok - About</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header class="site-header">
        <nav class="nav">
            <a href="index.html" class="nav-brand">Lim Lok</a>
            <div class="nav-right">
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html" class="active">About</a></li>
                    <li><a href="projects.html">Projects</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m-5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-10 5.196a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.854-10.46a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/></svg>
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/></svg>
                </button>
            </div>
        </nav>
    </header>

    <main>
        <section class="section" data-reveal>
            <h2 class="section-title">About Me</h2>
            <p class="lead">
                Hello! I'm <strong>Lim Lok</strong>, a dedicated and passionate IT student currently pursuing my
                diploma in Information Technology at INTI International University & Colleges. With a strong
                foundation in both frontend and backend development, I have honed my skills in various
                programming languages and tools throughout my academic journey.
            </p>
            <p class="lead" style="font-size:16px; margin-top:24px;">From semester 1 until semester 6, I have mastered several core development tools and technologies:</p>

            <div class="skills-grid">
                <div class="card">
                    <h3>Frontend Development</h3>
                    <div class="skill-icons">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS3">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap">
                    </div>
                </div>
                <div class="card">
                    <h3>Backend & Data</h3>
                    <div class="skill-icons">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" alt="C++">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" alt="Java">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" alt="SQLite">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" alt="PHP">
                    </div>
                </div>
                <div class="card">
                    <h3>Tools & Others</h3>
                    <div class="skill-icons">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" alt="VSCode">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pycharm/pycharm-original.svg" alt="PyCharm">
                    </div>
                </div>
            </div>

            <h3 style="margin-top:48px; margin-bottom:16px; font-size:24px;">My Resume</h3>
            <div class="resume-frame">
                <iframe src="https://drive.google.com/file/d/17y081T_vAtCY2FAp3vlfKwpQWgcncSkN/preview" title="My Resume PDF Viewer"></iframe>
            </div>
            <a href="https://drive.google.com/file/d/17y081T_vAtCY2FAp3vlfKwpQWgcncSkN/view?usp=sharing" class="btn btn-primary" download="Your_Name_Resume.pdf">Download Resume</a>
        </section>
    </main>

    <footer class="site-footer">
        <p>&copy; 2025 Lim Lok. All rights reserved.</p>
        <p><a href="https://www.linkedin.com/in/lim-lok-90b892341/" target="_blank">LinkedIn</a> &middot; <a href="https://github.com/ziczaczack" target="_blank">GitHub</a></p>
    </footer>

    <button id="back-to-top" aria-label="Back to top">&uarr;</button>

    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Manually verify in a browser**

Run: `cmd.exe /c start "" "about.html"`
Expected:
- "About" nav link is active; bio paragraph text matches the original wording exactly.
- Three skill cards render with their devicon icons (grayscale, colorize on hover).
- Resume iframe loads the Google Drive preview; "Download Resume" button points to the same Drive URL as before.
- Theme toggle and back-to-top behave the same as verified on `index.html`.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "Rebuild about.html with new design system"
```

---

### Task 5: Rebuild `projects.html`

**Files:**
- Modify: `projects.html` (full replacement of current content)

**Interfaces:**
- Consumes: `.section`/`.section-title`/`.projects-grid`/`.project-card`/`.card`/`.btn` classes from Task 1.

- [ ] **Step 1: Replace `projects.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lim Lok - Projects</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header class="site-header">
        <nav class="nav">
            <a href="index.html" class="nav-brand">Lim Lok</a>
            <div class="nav-right">
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="projects.html" class="active">Projects</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m-5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-10 5.196a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.854-10.46a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/></svg>
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/></svg>
                </button>
            </div>
        </nav>
    </header>

    <main>
        <section class="section" data-reveal>
            <h2 class="section-title">My Projects</h2>
            <div class="projects-grid">
                <div class="card project-card">
                    <img src="https://i.imgur.com/VbYl8SF.png" alt="Project 1 Screenshot">
                    <h3>Inventory Management System</h3>
                    <p>A basic inventory management built with Flask and SQLite to track stock.</p>
                    <p>Technologies: Python, HTML, CSS, JavaScript, SQLite</p>
                    <a href="https://github.com/ziczaczack/capstone" target="_blank" class="btn btn-primary">Code Repo</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <p>&copy; 2025 Lim Lok. All rights reserved.</p>
        <p><a href="https://www.linkedin.com/in/lim-lok-90b892341/" target="_blank">LinkedIn</a> &middot; <a href="https://github.com/ziczaczack" target="_blank">GitHub</a></p>
    </footer>

    <button id="back-to-top" aria-label="Back to top">&uarr;</button>

    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Manually verify in a browser**

Run: `cmd.exe /c start "" "projects.html"`
Expected:
- "Projects" nav link is active; project card shows screenshot, title, description, tech list, and a working "Code Repo" link to `https://github.com/ziczaczack/capstone`.
- Card grid lays out cleanly (a single card centered/left-aligned is fine — the grid should not look broken with only one item).

- [ ] **Step 3: Commit**

```bash
git add projects.html
git commit -m "Rebuild projects.html with new design system"
```

---

### Task 6: Rebuild `contact.html`

**Files:**
- Modify: `contact.html` (full replacement of current content)

**Interfaces:**
- Consumes: `.section`/`.contact-section`/`.social-links`/`.btn` classes from Task 1.

- [ ] **Step 1: Replace `contact.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lim Lok - Contact</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header class="site-header">
        <nav class="nav">
            <a href="index.html" class="nav-brand">Lim Lok</a>
            <div class="nav-right">
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="projects.html">Projects</a></li>
                    <li><a href="contact.html" class="active">Contact</a></li>
                </ul>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                    <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m-5-6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-10 5.196a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.854-10.46a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m10 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/></svg>
                    <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/></svg>
                </button>
            </div>
        </nav>
    </header>

    <main>
        <section class="section contact-section" data-reveal>
            <h2 class="section-title">Get In Touch</h2>
            <p class="lead">
                I'm always open to discussing new projects or opportunities.<br>
                The best way to reach me is by sending me an email.
            </p>
            <a href="mailto:j24041446@student.newinti.edu.my?subject=Contact from your Portfolio" class="btn btn-primary">Send Me an Email</a>

            <h3 style="margin-top:56px; margin-bottom:8px; font-size:22px;">Or connect with me on:</h3>
            <div class="social-links">
                <a href="https://www.linkedin.com/in/lim-lok-90b892341/">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" alt="LinkedIn">
                </a>
                <a href="https://www.facebook.com/master.lim27/">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg" alt="Facebook">
                </a>
                <a href="https://discordapp.com/users/857582786218164244">
                    <img src="https://www.svgrepo.com/show/331368/discord-v2.svg" alt="Discord">
                </a>
                <a href="https://x.com/sillyjayyyyy">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/twitter/twitter-original.svg" alt="X">
                </a>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <p>&copy; 2025 Lim Lok. All rights reserved.</p>
        <p><a href="https://www.linkedin.com/in/lim-lok-90b892341/" target="_blank">LinkedIn</a> &middot; <a href="https://github.com/ziczaczack" target="_blank">GitHub</a></p>
    </footer>

    <button id="back-to-top" aria-label="Back to top">&uarr;</button>

    <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Manually verify in a browser**

Run: `cmd.exe /c start "" "contact.html"`
Expected:
- "Contact" nav link is active; "Send Me an Email" opens a mail client addressed to `j24041446@student.newinti.edu.my` with the original subject line.
- All four social icons render and link to the same URLs as the original page (LinkedIn, Facebook, Discord, X).

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "Rebuild contact.html with new design system"
```

---

### Task 7: Remove legacy script, full cross-page QA, push branch

**Files:**
- Delete: `js/script.js`

**Interfaces:**
- Consumes: nothing new — this task only verifies the contracts produced by Tasks 1-6 hold across the whole site.

- [ ] **Step 1: Delete the old script**

```bash
git rm js/script.js
```

- [ ] **Step 2: Confirm no page references the deleted file or Bootstrap**

Run: `grep -n "script.js\|bootstrap" index.html about.html projects.html contact.html`
Expected: no output (empty result). If anything prints, fix that page before continuing.

- [ ] **Step 3: Full manual QA pass**

Run: `cmd.exe /c start "" "index.html"`, then click through to every other page using the nav.
Expected, across all four pages:
- Nav highlights the correct active page on each one.
- Theme toggle set on one page persists when navigating to another (shared `localStorage` key).
- No layout breakage at narrow widths (resize the browser window below ~860px — nav links should hide per the stylesheet's mobile rule; content should not overflow horizontally).
- Browser console (F12) shows no JavaScript errors on any of the four pages.

- [ ] **Step 4: Commit the deletion**

```bash
git commit -m "Remove legacy js/script.js superseded by main.js"
```

- [ ] **Step 5: Push the branch for review**

Run: `git push -u origin redesign`
Expected: branch `redesign` appears on `https://github.com/ziczaczack/AboutMe`. Do not open a PR or merge to `main` — that happens only after the repo owner reviews the branch and explicitly approves.
