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

    function openMenu() {
      menu.classList.add('is-open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      var first = menu.querySelector('a, button');
      if (first) first.focus();
    }

    function closeMenu(returnFocus) {
      menu.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (returnFocus) toggle.focus();
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

    // Reset state when resizing up to desktop
    var onChange = function (e) { if (e.matches) closeMenu(false); };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onChange);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onChange);
    }

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
      var buttons = group.querySelectorAll('.acc__btn');

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

    var index = 0;
    var timer = null;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
        slide.setAttribute('aria-hidden', String(n !== index));
      });
      dots.forEach(function (dot, n) {
        dot.setAttribute('aria-selected', String(n === index));
      });
    }

    function start() {
      if (prefersReducedMotion) return;
      stop();
      timer = window.setInterval(function () { show(index + 1); }, 7000);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { show(n); start(); });
    });
    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    show(0);
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

  ready(function () {
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
  });
})();
