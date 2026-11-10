/* ==========================================================================
   VELUMA STUDIO — site behaviour
   Vanilla JS, no dependencies. Every module exits quietly if its markup
   is not present on the current page.

   01. Mobile navigation
   02. Sticky header
   03. Scroll reveal
   04. Animated counters
   05. Accordion
   06. Testimonial slider
   07. Project filters
   08. Contact form validation
   09. Back to top
   10. Footer year
   11. Site search
   12. Newsletter subscribe
   13. Light / dark theme
   ========================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /* ---------- 01. Mobile navigation -------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('primary-menu');
    var backdrop = document.querySelector('.nav-backdrop');
    if (!toggle || !menu) return;

    var desktop = window.matchMedia('(min-width: 992px)');

    /* Labels are authored on the toggle as data-label-* so i18n.js translates
       them like any other string. Hardcoding them here flipped the button's
       accessible name to English the moment a German visitor opened the menu. */
    function label(name, fallback) {
      return toggle.getAttribute('data-label-' + name) || fallback;
    }

    /* Below 992px the closed drawer is visibility:hidden (see styles.css), but
       `inert` is set too: it also blocks pointer events and stops a stray
       programmatic focus() landing inside a panel the user cannot see. Above
       992px the drawer is the ordinary desktop nav and must never be inert. */
    function syncInert() {
      if (desktop.matches || menu.classList.contains('is-open')) {
        menu.removeAttribute('inert');
      } else {
        menu.setAttribute('inert', '');
      }
    }

    function openMenu() {
      menu.classList.add('is-open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', label('close', 'Close navigation menu'));
      syncInert();
      var first = menu.querySelector('a, button');
      if (first) first.focus();
    }

    function closeMenu(returnFocus) {
      /* Move focus out before the panel goes inert, otherwise the browser drops
         focus to <body> and the next Tab restarts from the top of the page. */
      if (returnFocus) toggle.focus();
      else if (menu.contains(document.activeElement)) document.activeElement.blur();

      menu.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', label('open', 'Open navigation menu'));
      syncInert();
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () { closeMenu(false); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    // Close after choosing a destination on small screens
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (!desktop.matches) closeMenu(false);
      });
    });

    // Reset state when crossing the breakpoint in either direction: resizing up
    // closes the drawer, resizing down has to make the now-hidden panel inert.
    var onChange = function (e) {
      if (e.matches) closeMenu(false);
      else syncInert();
    };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onChange);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onChange);
    }

    syncInert();

    // Simple focus trap while the drawer is open
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || desktop.matches) return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;

      var focusables = menu.querySelectorAll('a[href], button:not([disabled]), input, select, textarea');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        toggle.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        toggle.focus();
      }
    });
  }

  /* ---------- 02. Sticky header ------------------------------------------ */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- 03. Scroll reveal ------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 04. Animated counters -------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1500;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 05. Accordion ---------------------------------------------- */
  function initAccordions() {
    var groups = document.querySelectorAll('[data-accordion]');
    if (!groups.length) return;

    groups.forEach(function (group) {
      /* Selected structurally, not by class name. This used to read `.acc__btn`,
         which silently matched nothing in the home page's media accordion
         (`.macc__btn`): no listeners were attached, so the panels could not be
         opened at all and the one marked open in the markup could not be closed.
         Any trigger that owns a panel is an accordion button, whatever it is
         called, so a new variant cannot fall through the gap again. */
      var buttons = group.querySelectorAll('button[aria-expanded][aria-controls]');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          var isOpen = btn.getAttribute('aria-expanded') === 'true';

          if (group.getAttribute('data-accordion') === 'single') {
            buttons.forEach(function (other) {
              if (other === btn) return;
              other.setAttribute('aria-expanded', 'false');
              var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
              if (otherPanel) otherPanel.classList.remove('is-open');
            });
          }

          btn.setAttribute('aria-expanded', String(!isOpen));
          if (panel) panel.classList.toggle('is-open', !isOpen);
        });
      });
    });
  }

  /* ---------- 06. Testimonial slider -------------------------------------- */
  function initSlider() {
    var slider = document.querySelector('[data-slider]');
    if (!slider) return;

    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.slider-dot'));
    var prev = slider.querySelector('[data-slide-prev]');
    var next = slider.querySelector('[data-slide-next]');
    if (slides.length < 2) return;

    var toggle = slider.querySelector('[data-slide-toggle]');
    var index = 0;
    var timer = null;
    /* Set once the visitor presses pause. Hover and focus still suspend the
       timer temporarily, but only this sticks — otherwise moving the mouse away
       would quietly restart something the visitor had deliberately stopped. */
    var stoppedByUser = prefersReducedMotion;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
        slide.setAttribute('aria-hidden', String(n !== index));
      });
      dots.forEach(function (dot, n) {
        dot.setAttribute('aria-current', String(n === index));
      });
    }

    function start() {
      if (prefersReducedMotion || stoppedByUser) return;
      stop();
      timer = window.setInterval(function () { show(index + 1); }, 7000);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function syncToggle() {
      if (!toggle) return;
      var paused = stoppedByUser;
      toggle.classList.toggle('is-paused', paused);
      toggle.setAttribute('aria-pressed', String(paused));
      var label = toggle.getAttribute(paused ? 'data-label-play' : 'data-label-pause');
      if (label) toggle.setAttribute('aria-label', label);
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { show(n); start(); });
    });
    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });

    if (toggle) {
      /* Reduced motion means it never auto-rotates, so the control would be a
         lie. The prev/next buttons still give full manual access. */
      if (prefersReducedMotion) {
        toggle.hidden = true;
      } else {
        toggle.addEventListener('click', function () {
          stoppedByUser = !stoppedByUser;
          if (stoppedByUser) stop(); else start();
          syncToggle();
        });
      }
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    show(0);
    syncToggle();
    start();
  }

  /* ---------- 07. Project filters ----------------------------------------- */
  function initFilters() {
    var bar = document.querySelector('[data-filters]');
    var grid = document.querySelector('[data-filter-grid]');
    if (!bar || !grid) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll('.filter-btn'));
    var items = Array.prototype.slice.call(grid.querySelectorAll('[data-category]'));
    var status = document.getElementById('filter-status');
    var empty = document.getElementById('filter-empty');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        var shown = 0;

        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });

        items.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        if (status) {
          /* Templates live on the element so i18n.js can translate them;
             the English wording here is only a fallback. */
          var tpl = shown === 1
            ? (status.getAttribute('data-count-one') || '{n} project shown for {f}.')
            : (status.getAttribute('data-count-many') || '{n} projects shown for {f}.');
          status.textContent = tpl.replace('{n}', shown).replace('{f}', btn.textContent.trim());
        }

        /* A filter with no matches would otherwise just blank the grid. */
        if (empty) empty.hidden = shown !== 0;
      });
    });
  }

  /* ---------- 08. Contact form validation ---------------------------------- */
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = document.getElementById('form-status');

    // Messages are authored in German on the form and swapped by i18n.js;
    // the English strings here are only a fallback if the attributes are absent.
    function msg(name, fallback) {
      return form.getAttribute('data-msg-' + name) || fallback;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function fieldWrap(input) {
      return input.closest('.field') || input.parentNode;
    }

    function setError(input, message) {
      var wrap = fieldWrap(input);
      var box = wrap.querySelector('.error-text');
      wrap.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (box) box.textContent = message;
    }

    function clearError(input) {
      var wrap = fieldWrap(input);
      wrap.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }

    function validate(input) {
      var value = (input.value || '').trim();
      var label = input.getAttribute('data-label') || 'This field';

      if (input.hasAttribute('required')) {
        if (input.type === 'checkbox' && !input.checked) {
          setError(input, msg('consent', 'Please confirm before sending.'));
          return false;
        }
        if (input.type !== 'checkbox' && value === '') {
          setError(input, msg('required', '{field} is required.').replace('{field}', label));
          return false;
        }
      }
      if (input.type === 'email' && value !== '' && !emailPattern.test(value)) {
        setError(input, msg('email', 'Enter a valid email address, for example name@company.com.'));
        return false;
      }
      if (input.tagName === 'TEXTAREA' && value !== '' && value.length < 20) {
        setError(input, msg('short', 'Please add a little more detail (at least 20 characters).'));
        return false;
      }
      clearError(input);
      return true;
    }

    var fields = Array.prototype.slice.call(
      form.querySelectorAll('input[name], select[name], textarea[name]')
    );

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldWrap(input).classList.contains('has-error')) validate(input);
      });
      input.addEventListener('change', function () {
        if (fieldWrap(input).classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (input) {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        if (status) {
          status.className = 'form-status form-status--err is-visible';
          status.textContent = msg('invalid', 'Please review the highlighted fields and try again.');
        }
        firstInvalid.focus();
        return;
      }

      if (status) {
        status.className = 'form-status form-status--ok is-visible';
        status.textContent = msg('success', 'Thanks — your message is ready to send. This demo front ' +
          'end does not submit anywhere yet; connect the form to your own endpoint or inbox to go live.');
      }
      form.reset();
    });
  }

  /* ---------- 09. Back to top ---------------------------------------------- */
  function initToTop() {
    var btn = document.querySelector('.to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ---------- 10. Click-to-load map ---------------------------------------
     Nothing is requested from OpenStreetMap until the visitor asks for it, so
     no IP address leaves the page on load. The consent is remembered per
     browser; clearing site data resets it. */
  function initMap() {
    var box = document.querySelector('[data-map]');
    if (!box) return;

    var STORE = 'veluma-map-consent';
    var placeholder = box.querySelector('.mapbox__ph');

    function build() {
      var frame = document.createElement('iframe');
      frame.src = box.getAttribute('data-embed');
      frame.title = box.getAttribute('data-map-title') || 'Map';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer';
      frame.setAttribute('allowfullscreen', '');
      if (placeholder) placeholder.remove();
      box.appendChild(frame);
    }

    var consented = false;
    try { consented = localStorage.getItem(STORE) === 'yes'; } catch (e) { /* private mode */ }
    if (consented) { build(); return; }

    var btn = box.querySelector('[data-map-load]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      try { localStorage.setItem(STORE, 'yes'); } catch (e) { /* private mode */ }
      build();
    });
  }

  /* ---------- 11. Footer year ---------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- 12. Site search ---------------------------------------------- */
  /* The header magnifier used to be a button with no handler at all. The index
     it searches is authored as real links in the markup (see #site-search), so
     i18n.js translates it with everything else and this module never holds a
     copy of any string: it reads the labels back out of the DOM at search time,
     which means it keeps working after a language switch. */
  function initSearch() {
    var panel = document.getElementById('site-search');
    var list = document.getElementById('search-results');
    var input = document.getElementById('search-input');
    if (!panel || !list || !input) return;

    var triggers = document.querySelectorAll('.nav-search');
    if (!triggers.length) return;

    var empty = document.getElementById('search-empty');
    var count = document.getElementById('search-count');
    var closeBtn = panel.querySelector('.search-field__close');
    var items = Array.prototype.slice.call(list.querySelectorAll('.search-item'));
    var lastFocused = null;

    /* Fold the German umlauts and ß so "uber"/"ueber", "losungen"/"lösungen"
       and "preise"/"Preise" all match. Latin-1 only — that is the alphabet
       both languages on this site use. */
    function fold(s) {
      var out = (s || '').toLowerCase();
      /* Strip the accents first ("über" -> "uber") so a visitor typing on a
         keyboard without umlauts still matches, then also accept the spelled
         -out forms ("ueber") that Germans type when the keys are unavailable. */
      if (String.prototype.normalize) {
        out = out.normalize('NFD').replace(/[̀-ͯ]/g, '');
      }
      return out.replace(/ß/g, 'ss')
                .replace(/ue/g, 'u').replace(/oe/g, 'o').replace(/ae/g, 'a');
    }

    function filter() {
      var q = fold(input.value.trim());
      var shown = 0;

      items.forEach(function (li) {
        var title = li.querySelector('.search-item__t');
        var group = li.querySelector('.search-item__g');
        var hay = fold((title ? title.textContent : '') + ' ' + (group ? group.textContent : ''));
        var hit = q === '' || hay.indexOf(q) !== -1;
        li.hidden = !hit;
        if (hit) shown++;
      });

      if (empty) empty.hidden = shown !== 0;
      if (count) {
        var tpl = shown === 1
          ? (list.getAttribute('data-count-one') || '{n} result')
          : (list.getAttribute('data-count-many') || '{n} results');
        count.textContent = tpl.replace('{n}', shown);
      }
    }

    function visibleLinks() {
      return items.filter(function (li) { return !li.hidden; })
                  .map(function (li) { return li.querySelector('a'); });
    }

    function open(trigger) {
      lastFocused = trigger || document.activeElement;
      panel.hidden = false;
      document.body.classList.add('search-open');
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'true'); });
      input.value = '';
      filter();
      input.focus();
    }

    function close() {
      if (panel.hidden) return;
      panel.hidden = true;
      document.body.classList.remove('search-open');
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      lastFocused = null;
    }

    triggers.forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      t.setAttribute('aria-controls', 'site-search');
      t.addEventListener('click', function () {
        if (panel.hidden) open(t); else close();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    /* Click the dimmed area, but not the sheet itself. */
    panel.addEventListener('mousedown', function (e) {
      if (e.target === panel) close();
    });

    input.addEventListener('input', filter);

    /* Down from the field walks into the results; Enter opens the first hit, so
       the common case is type-then-Enter without touching the mouse. */
    input.addEventListener('keydown', function (e) {
      var links = visibleLinks();
      if (e.key === 'ArrowDown' && links.length) { e.preventDefault(); links[0].focus(); }
      else if (e.key === 'Enter' && links.length) { e.preventDefault(); links[0].click(); }
    });

    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var links = visibleLinks();
      var i = links.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      if (e.key === 'ArrowDown') {
        if (i + 1 < links.length) links[i + 1].focus();
      } else {
        if (i > 0) links[i - 1].focus(); else input.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); close(); }
    });

    /* Keep focus inside the sheet while it is modal. */
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = [input].concat(visibleLinks());
      if (closeBtn) f.push(closeBtn);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    filter();
  }

  /* ---------- 13. Newsletter subscribe -------------------------------------- */
  /* The footer field was markup only — `onsubmit="return false"` and nothing
     else — so pressing Abonnieren did nothing at all and looked broken. It now
     validates the address and answers, using the same message pattern as the
     contact form: German authored on the element, translated by i18n.js. */
  function initSubscribe() {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    document.querySelectorAll('form.subscribe').forEach(function (form) {
      var input = form.querySelector('input[type="email"]');
      var status = form.parentNode.querySelector('.subscribe-status');
      if (!input) return;

      function msg(name, fallback) {
        return form.getAttribute('data-msg-' + name) || fallback;
      }

      function say(kind, text) {
        if (!status) return;
        status.className = 'subscribe-status subscribe-status--' + kind + ' is-visible';
        status.textContent = text;
      }

      input.addEventListener('input', function () {
        input.removeAttribute('aria-invalid');
        if (status) { status.className = 'subscribe-status'; status.textContent = ''; }
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var value = (input.value || '').trim();

        if (value === '') {
          input.setAttribute('aria-invalid', 'true');
          say('err', msg('required', 'Please enter your email address.'));
          input.focus();
          return;
        }
        if (!emailPattern.test(value)) {
          input.setAttribute('aria-invalid', 'true');
          say('err', msg('email', 'Enter a valid email address, for example name@company.com.'));
          input.focus();
          return;
        }

        input.removeAttribute('aria-invalid');
        say('ok', msg('success', 'Thanks — this demo front end does not store addresses yet; ' +
          'connect the field to your own list before going live.'));
        form.reset();
      });
    });
  }

  /* ---------- 13. Light / dark theme -------------------------------------- */
  /* The attribute on <html> is written by the inline script in each page's
     <head>, before the first paint — this module never decides the theme on
     load, it only reflects whatever that script resolved. It owns the control:
     remembering an explicit choice, and following the operating system for as
     long as the visitor has not made one. */
  function initTheme() {
    var STORE_KEY = 'veluma-theme';
    var root = document.documentElement;
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    var meta = document.querySelector('meta[name="theme-color"]');
    var system = window.matchMedia('(prefers-color-scheme: dark)');
    /* Matches --c-purple and the dark theme's --c-lav in styles.css. */
    var BAR = { light: '#5966e8', dark: '#14171f' };

    function stored() {
      try {
        var v = localStorage.getItem(STORE_KEY);
        return (v === 'dark' || v === 'light') ? v : null;
      } catch (e) { return null; }
    }

    function current() {
      return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function paint(theme) {
      root.setAttribute('data-theme', theme);
      if (meta) meta.setAttribute('content', BAR[theme]);
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(theme === 'dark'));
      });
    }

    /* Catch the button and the address bar up with the resolved theme. */
    paint(current());

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(STORE_KEY, next); } catch (e) { /* private mode */ }
        paint(next);
      });
    });

    /* A visitor who has never pressed the button keeps following their system,
       including a change made while the page is open. */
    function follow(e) { if (!stored()) paint(e.matches ? 'dark' : 'light'); }
    if (system.addEventListener) system.addEventListener('change', follow);
    else if (system.addListener) system.addListener(follow);
  }

  ready(function () {
    initTheme();
    initNav();
    initStickyHeader();
    initReveal();
    initCounters();
    initAccordions();
    initSlider();
    initFilters();
    initForm();
    initToTop();
    initMap();
    initYear();
    initSearch();
    initSubscribe();
  });
})();
