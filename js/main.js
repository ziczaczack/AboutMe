/* ==========================================================================
   Lim Lok — portfolio
   Vanilla JS, no dependencies. Everything is progressive: with JS disabled the
   page is still a readable, fully navigable single-page site.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.getElementById('site-header');
  var drawer = document.getElementById('nav-drawer');
  var toggle = document.querySelector('[data-nav-toggle]');
  var toTop = document.querySelector('[data-to-top]');
  var SECTIONS = ['about', 'projects', 'resume', 'contact'];
  var BREAKPOINT = 880;      // keep in sync with the nav media query in styles.css
  var menuOpen = false;

  /* ---------- helpers ---------- */

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      /* Safari private mode and some embedded webviews throw on access. */
    }
    return null;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function scrollBehavior() {
    return prefersReducedMotion() ? 'auto' : 'smooth';
  }

  /* ---------- theme & accent ---------- */

  function setTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    store('theme', theme);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#15130f' : '#faf8f5');
  }

  function setAccent(color) {
    root.style.setProperty('--accent', color);
    store('accent', color);
    markSelectedSwatch(color);
  }

  function markSelectedSwatch(color) {
    var swatches = document.querySelectorAll('[data-accent]');
    for (var i = 0; i < swatches.length; i++) {
      swatches[i].classList.toggle('is-selected', swatches[i].dataset.accent === color);
    }
  }

  function setupTheme() {
    // The inline script in <head> already applied the stored values before paint;
    // here we only wire the controls and mark the active swatch.
    markSelectedSwatch(store('accent') || '#c0512f');

    document.addEventListener('click', function (event) {
      var themeBtn = event.target.closest('[data-theme-toggle]');
      if (themeBtn) {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        return;
      }
      var swatch = event.target.closest('[data-accent]');
      if (swatch) setAccent(swatch.dataset.accent);
    });
  }

  /* ---------- mobile drawer ---------- */

  function syncDrawer() {
    if (!drawer) return;
    // Drive height from the content itself so the panel can never clip a link.
    drawer.style.maxHeight = menuOpen ? drawer.scrollHeight + 'px' : '0px';
  }

  function setMenu(open) {
    menuOpen = open;
    if (toggle) {
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (drawer) drawer.classList.toggle('is-open', open);
    syncDrawer();
  }

  function setupDrawer() {
    if (!toggle) return;

    toggle.addEventListener('click', function () { setMenu(!menuOpen); });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Clicking anywhere outside the header dismisses the menu.
    document.addEventListener('click', function (event) {
      if (menuOpen && header && !header.contains(event.target)) setMenu(false);
    });

    window.addEventListener('resize', function () {
      // The drawer only exists below the breakpoint — close it on the way up.
      if (window.innerWidth > BREAKPOINT && menuOpen) setMenu(false);
      else syncDrawer();
    });
  }

  /* ---------- in-page navigation ----------
     A native anchor jump is computed while the drawer is still expanded, then the
     drawer collapses and drags the whole page up by its height — leaving you well
     past the section you asked for. Scroll manually instead: the drawer sits in
     normal flow, so the header's current height is both the sticky offset to clear
     and the exact amount the page is about to shift. Measure before closing.      */

  function setupAnchors() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      var bar = header ? header.getBoundingClientRect().height : 0;
      var y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - bar - 14;

      if (menuOpen) setMenu(false);
      window.scrollTo({ top: Math.max(0, y), behavior: scrollBehavior() });

      try { history.replaceState(null, '', href); } catch (e) {}
    });
  }

  /* ---------- reveal on scroll ---------- */

  function setupReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return function () {};

    function show(el) {
      if (el.classList.contains('is-visible')) return;
      var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('is-visible');
    }

    if (prefersReducedMotion()) {
      els.forEach(show);
      return function () {};
    }

    // Viewport check is the primary mechanism; IntersectionObserver is an
    // enhancement. Anything still hidden after 1.5s is forced visible.
    function revealInView() {
      var vh = window.innerHeight || root.clientHeight;
      els.forEach(function (el) {
        if (el.classList.contains('is-visible')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > -40) show(el);
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      els.forEach(function (el) { io.observe(el); });
    }

    setTimeout(function () { els.forEach(show); }, 1500);
    return revealInView;
  }

  /* ---------- scroll-spy & back-to-top ---------- */

  function setupScrollWatchers(revealInView) {
    var sections = SECTIONS
      .map(function (id) { return { id: id, el: document.getElementById(id) }; })
      .filter(function (s) { return s.el; });

    function sync() {
      if (toTop) toTop.classList.toggle('is-visible', window.pageYOffset > 320);

      var active = '';
      sections.forEach(function (s) {
        if (s.el.getBoundingClientRect().top <= 140) active = s.id;
      });
      // At the very bottom the last section may never cross the offset.
      if (sections.length && window.innerHeight + window.pageYOffset >= root.scrollHeight - 4) {
        active = sections[sections.length - 1].id;
      }

      ['data-spy', 'data-spy-mobile'].forEach(function (attr) {
        var links = document.querySelectorAll('[' + attr + ']');
        for (var i = 0; i < links.length; i++) {
          links[i].classList.toggle('is-active', links[i].getAttribute(attr) === active);
        }
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        revealInView();
        sync();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      });
    }
  }

  /* ---------- boot ---------- */

  function init() {
    setupTheme();
    setupDrawer();
    setupAnchors();
    setupScrollWatchers(setupReveal());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
