# Veluma Studio — multi-page agency website

A hand-built, responsive seven-page website for a fictional digital agency in Potsdam.
Semantic HTML, one organised stylesheet, one vanilla-JS file. Bootstrap 5 is loaded
from a CDN for its grid and spacing utilities only — all components (nav, cards,
accordion, slider, filters, forms) are custom.

## Files

```
Digitel Agency/
├── index.html              Start / Home        ->  /
├── leistungen/
│   └── index.html          Leistungen          ->  /leistungen/
├── projekte/
│   └── index.html          Projekte            ->  /projekte/
├── ueber-uns/
│   └── index.html          Über uns            ->  /ueber-uns/
├── kontakt/
│   └── index.html          Kontakt + Formular  ->  /kontakt/
├── impressum/
│   └── index.html          Impressum           ->  /impressum/
├── datenschutz/
│   └── index.html          Datenschutz         ->  /datenschutz/
├── assets/
│   ├── css/styles.css      Design tokens + all component styles
│   ├── js/main.js          Nav, reveal, counters, accordion, slider, filters, form
│   ├── js/i18n.js          DE/EN switch + the English dictionary
│   └── img/mesh.svg        Moiré line-art field behind the light sections
└── README.md
```

One folder per page, so URLs stay tidy — `/leistungen/` rather than
`/pages/leistungen.html`. Links are relative and always name the file: the homepage
points at `leistungen/index.html`, each page points home with `../index.html` and at its
siblings with `../projekte/index.html`, and loads assets from `../assets/`.

## Languages

This is a German agency site based in Potsdam. German is the default and is written
directly into the HTML, so it renders correctly with JavaScript disabled. English is an
overlay: `assets/js/i18n.js` snapshots the authored German out of the DOM on load, then
swaps in English strings from its dictionary. German therefore cannot drift out of sync
with the markup — only the English side is maintained by hand.

- Switch with the **DE / EN** control in the header or footer. The choice is stored in
  `localStorage` and persists across pages.
- A language can also be forced with `?lang=en` or `?lang=de`, so links are shareable.
- Strings are keyed with `data-i18n` (text), `data-i18n-html` (inline markup) and
  `data-i18n-attr` (attributes such as `alt` and `placeholder`) — 516 keys in total.
- Entity rule when editing: values applied as **text** use a literal `&`; only values
  applied as **innerHTML** use `&amp;`.

Because the switch is client-side, both languages share one URL. If you need separately
indexable URLs for SEO, the pages would have to be duplicated under `/de/` and `/en/`.

## German-market specifics

- **Impressum** and **Datenschutz** pages exist and are linked from every footer — both are
  expected of a German site. Content is placeholder but structured correctly (§ 5 DDG for the
  imprint; Art. 13 GDPR for the policy), and both carry `noindex`.
- The privacy page names the third-party resources the site actually loads today — Google
  Fonts, jsDelivr and Unsplash — and recommends self-hosting them for production, which is
  what removes the IP transfer that matters under GDPR.
- The contact page embeds an **OpenStreetMap** map using the two-click pattern: a styled
  placeholder is shown and nothing is requested from OSM until the visitor presses
  "Karte laden". Verified by recording network traffic — a page load makes zero requests
  to openstreetmap.org. Consent is then remembered in `localStorage`
  (`veluma-map-consent`); clearing site data revokes it.
- Only functional storage is used (the language choice and the map consent, both in
  `localStorage`), so no cookie consent banner is required as the site stands. Adding
  analytics would change that.
- To move the map, edit `data-embed` and the fallback link on the `[data-map]` element in
  `kontakt/index.html` — both carry the same coordinates.
- Sample client and project names are invented German ones (Nordlicht, Kiezgut, Datenwerk,
  Fernblick, Pappelgrün, Fährhaus Medien, Vitalpfad, Atelier Nord, Blaupause).
- The contact page uses two verified photographs of Potsdam: Schloss Sanssouci behind the
  page title and the Glienicker Brücke in the location band.

## One Bootstrap gotcha

Bootstrap ships its own `.btn`, and we reuse that class name. Its
`.btn:hover { background-color: var(--bs-btn-hover-bg) }` is more specific than a plain
`.btn { background: … }`, and `--bs-btn-hover-bg` is undefined unless a Bootstrap colour
class such as `.btn-primary` is present — so a hovered button silently lost its
background and left the label floating on the page.

The fix: `.btn` sets `background-color` as a **longhand**, and the hover rule restates it.
Every hover state in `styles.css` declares its own background *and* colour together for
the same reason — never rely on one of them being inherited from the resting state.

## Running it locally

The site is static — no build step, no dependencies to install.

**Quickest:** double-click `index.html`. Every internal link points at an explicit
`index.html` (`leistungen/index.html`, `../index.html`) rather than at a bare folder, so
navigation works straight off the file system with no server.

That matters because a link to a *folder* only works where something resolves the
directory index. Over `file://` nothing does — Chrome shows a directory listing instead
of the page. Explicit filenames work in both places: a real server still serves
`/leistungen/` as well, it just shows `index.html` in the address bar.

**Recommended (serves pages over `http://`, which matches production behaviour):**

```bash
# Python 3 — from inside the project folder
python -m http.server 8000
```

```powershell
# Windows PowerShell, same thing
python -m http.server 8000
```

```bash
# Node.js alternative
npx serve .
```

Then open <http://localhost:8000>.

An internet connection is needed for the Google Fonts, the Bootstrap CSS and the
Unsplash photography. Everything still lays out correctly without it — the type falls
back to the system sans-serif stack.

## What's in the build

**Layout reference** — the homepage follows the supplied screenshot's composition: centred navigation with search and a dark quote button, a two-line hero with an iridescent ring set inline in the headline, a single wide banner image with a notch masked out of its top-right corner so the stats card sits in open space and a 3D object breaking its corner, inset rounded dark blocks rather than full-bleed sections, glossy 3D objects (sphere, torus, plus, hex) rendered in CSS, a moiré line-art field behind the light sections, pastel-tinted project and team tiles, a media accordion, progress meters, pricing, and a footer with a subscribe field.

**Type and colour values** — the type scale, line heights, heading weight, text colours and container width are taken from the reference design: headings #222 at 700/1.3846, body #666 at 16px/1.8125, section titles 50px, 16px/700 uppercase section labels, 1350px container, Playfair Display italic for accent words. Body copy uses #666 rather than the reference's #707070 so it still clears WCAG AA (4.85:1) on the pastel tiles.

**Inner-page banners** — follow the reference `.page-title` pattern: a cover photograph
behind a #131313 scrim, centred white 64px title, 16px/26px lead capped at 520px, 240px/120px
padding and an oversized translucent page name across the bottom. The scrim is .78 rather than
the reference .7 so the 16px lead clears AA on brighter photos.

**Design system** — all colour, radius, shadow, type and spacing values are CSS custom
properties at the top of `styles.css`. Change the brand by editing `--c-purple`,
`--c-pink` and `--g-brand`; everything else follows. The palette matches the reference
design: primary #5966EC, secondary #F46A1C, lime #D9F45F, page tint #F2F1F6,
headings #222222, body #666666, stars #FFAA18.

**Layout** — soft lavender canvas, white cards with large radii, two dark sections per
page for contrast, floating decorative shapes (all `aria-hidden`), and an editorial
serif italic (`.accent-serif`) used for the accent words in headings.

**Responsive** — mobile-first breakpoints at 360px, 420px, 576px, 768px and 992px. Audited
at 320, 360, 390, 414, 480, 576, 768, 834, 992, 1024, 1280, 1440, 1920 and 2560px across all
seven pages in both languages: no element escapes the viewport, no text is clipped, and the
page can never be panned sideways. The shell caps at 1350px and centres beyond that. Verified at 390px on
every page: no horizontal overflow, no clipped text, form fields and filter pills stack to
full width. German compound nouns (`Entwicklungsleitung`, `Datenschutzerklärung`) were
overflowing narrow columns, so `hyphens: auto` is set on headings and card text — this
relies on the `<html lang>` attribute, which `i18n.js` keeps in sync, so each language
hyphenates with its own dictionary. The About page team grid drops from two columns to one
below 420px (`.team-grid`) and the card turns horizontal — 96px portrait on the left,
details on the right. That widens the text column from ~107px to ~200px while keeping the
section compact (~1,500px tall instead of ~3,700px for full-width stacked cards). The desktop pill navigation
becomes a slide-in drawer below 992px; the hero collage, project grid and footer all
reflow. Decorative shapes are hidden on small screens to keep things calm.

**Interactions** (`main.js`, each module is a no-op if its markup is absent):

| Module | What it does |
| --- | --- |
| Mobile nav | Drawer toggle, backdrop, Escape to close, focus moved in and trapped, `aria-expanded` kept in sync |
| Sticky header | Adds a blurred background after 24px of scroll |
| Scroll reveal | `IntersectionObserver` fade-up with optional `data-delay` |
| Counters | Animates `[data-count-to]` once in view |
| Accordion | One-open-at-a-time, driven by `aria-expanded` / `aria-controls` |
| Slider | Testimonials with dots, prev/next, autoplay paused on hover and focus |
| Filters | Project category filter with an `aria-live` result count |
| Form | Inline validation, error text wired through `aria-describedby`, focus sent to first error. Messages are authored in German as `data-msg-*` attributes on the form and translated like any other string — never hardcode them in `main.js` |
| Back to top | Appears after 600px |

**Accessibility** — skip link, landmark elements, one `h1` per page, labelled form
controls with visible required markers, `:focus-visible` outlines on light *and* dark
surfaces, descriptive `alt` text, decorative imagery marked `aria-hidden`, and a
`prefers-reduced-motion` block that disables animation and smooth scrolling.

## Placeholder content — read before publishing

Nothing on this site is a factual claim. Everything below is clearly labelled in the UI
and needs replacing with your own verified material:

- **Metrics** (home, about) carry a "Sample figures" badge and placeholder descriptions.
- **Testimonials** (home) are written as obvious placeholder text with "Client name" attribution. Only publish real quotes you have written permission to use.
- **Client logos** (home) are invented wordmarks under a "Sample client marks" heading.
- **Case studies** (projects) are sample write-ups for invented brands; card links point back to the same page until you add real case-study pages.
- **Pricing** (services) is shown as `ab 0.000 €` on purpose — insert your rates or remove the figures.
- **Team profiles** (home, about) are eight invented people — plausible German names and roles paired with stock portraits from Unsplash. They are labelled as sample profiles in the UI. Swap in your real team before publishing: presenting stock photos of strangers as named staff would misrepresent real people.
- **Contact details** are a `555` demo phone number, an `.example` email domain and a placeholder address.
- **Photography** is hot-linked from Unsplash (free to use under the Unsplash licence). For production, download the images, optimise them, self-host them and add proper attribution where you want to credit photographers.

## Wiring up the contact form

`kontakt/index.html` validates in the browser and then shows a success message — it does not
submit anywhere. To go live, give the `<form id="contact-form">` an `action` and `method`
(or post it with `fetch`) pointing at your endpoint, inbox service or CRM, and remove the
demo note under the submit button in `kontakt/index.html` plus the demo copy in the
`initForm()` success branch of `assets/js/main.js`.

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `IntersectionObserver`, CSS custom
properties, `clamp()`, `aspect-ratio` and grid — all with graceful fallbacks where it
matters (reveal animations simply show immediately if the observer is unavailable).
