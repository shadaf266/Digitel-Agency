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
├── 404.html                Not-found page      ->  any unmatched path
├── robots.txt              Crawl rules + sitemap pointer
├── sitemap.xml             The five indexable pages
├── site.webmanifest        Installable-app metadata
├── favicon.ico             32px fallback for clients that request /favicon.ico
├── .nojekyll               Tells GitHub Pages to serve the files as-is
├── assets/
│   ├── css/styles.css      Design tokens + all component styles
│   ├── js/main.js          Nav, reveal, counters, accordion, slider, filters, form, search
│   ├── js/i18n.js          DE/EN switch + the English dictionary
│   ├── img/mesh.svg        Moiré line-art field behind the light sections
│   └── img/icon-*.png      180 / 192 / 512px app icons (apple-touch + manifest)
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
  `data-i18n-attr` (attributes such as `alt` and `placeholder`) — 556 keys in total.
- Entity rule when editing: values applied as **text** use a literal `&`; only values
  applied as **innerHTML** use `&amp;`.

Because the switch is client-side, both languages share one URL. If you need separately
indexable URLs for SEO, the pages would have to be duplicated under `/de/` and `/en/`.

## German-market specifics

- **Impressum** and **Datenschutz** pages exist and are linked from every footer — both are
  expected of a German site. Content is placeholder but structured correctly (§ 5 DDG for the
  imprint; Art. 13 GDPR for the policy), and both carry `noindex`. They use the same wide
  shell and two-column grid as every other page: a sticky numbered index on the left, the
  text in a `.legal-card` on the right. Each `<h2>` carries a stable id (`imp-s1` … and
  `pri-s1` …, plus `speicherung`, which every footer's Cookies link points at) and the index
  links reuse **that heading's own `data-i18n` key**, so the contents list translates with
  the page and cannot drift from the headings it points to. Add a section and you add its
  id and one `<li>` — no new dictionary entries.
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

**Inner-page heroes** — the same composition as the home page, one step quieter. The
reference's `.page-title` pattern (cover photograph behind a #131313 scrim, centred white
64px title, oversized page name across the bottom) was dropped: against the home page's
light lavender canvas and 98px left-aligned #222 display type, all three primary signals
flipped at once — light to dark, left to centre, 98px to 64px — and leaving the home page
felt like arriving at a different website.

Every page now shares one canvas, one alignment and one type scale:

| | Home | Inner pages |
| --- | --- | --- |
| Canvas | lavender + moiré | same |
| `h1` | `clamp(50px, 6.8vw, 110px)`, #222, left | `clamp(36px, 5.4vw, 76px)`, #222, left |
| Text indent at 1440px | 57px | 57px |
| Cover photograph | `.banner__media`, notched for the stat card | `.page-hero__banner`, same radius and shell width, no notch |

The photograph moved out of the background and into `.page-hero__banner` below the lead,
which is also what makes it legible — Sanssouci on the contact page had been sitting under
78% black. The banner is not a `.reveal`: it is above the fold and must not depend on
JavaScript to become visible. Inner `h1`s stay a step below the home page's so the front
door still reads as the front door.

**Design system** — all colour, radius, shadow, type and spacing values are CSS custom
properties at the top of `styles.css`. Change the brand by editing `--c-purple`,
`--c-pink` and `--g-brand`; everything else follows. The palette matches the reference
design: primary #5966EC, secondary #F46A1C, lime #D9F45F, page tint #F2F1F6,
headings #222222, body #666666, stars #FFAA18.

**Layout** — soft lavender canvas, white cards with large radii, two dark sections per
page for contrast, floating decorative shapes (all `aria-hidden`), and an editorial
serif italic (`.accent-serif`) used for the accent words in headings.

**Responsive** — mobile-first breakpoints at 360px, 375px, 420px, 576px, 768px and 992px.
Audited across all eight pages (the 404 included) in both languages at portrait phone
(320×568, 360×640, 390×844, 414×896), **landscape phone** (568×320, 667×375, 844×390),
tablet (600×960, 768×1024, 1024×768), desktop (1280, 1440, 1920, 2560) and the WCAG 1.4.10
reflow size (320×256): no element escapes the viewport, no text is clipped, and the page
can never be panned sideways. The shell caps at 1350px and centres beyond that.

Behaviour was checked as well as layout. On a 568×320 landscape phone the nav drawer is
taller than the screen, so it scrolls internally, the background is locked, the close
button stays above the panel and the last item is reachable. Crossing the 992px breakpoint
in **both** directions closes the drawer, unlocks the body and adds or removes `inert`
correctly. The legal pages' sticky index caps at `100vh - 128px` so it never pins content
off-screen on a short viewport.

Form fields and filter pills stack to full width. Two flexbox `min-width: auto` traps were
found and fixed this way — the footer subscribe pill was sized by its contents and ran
33px past its column at 320px (it now takes `width: 100%` and stacks below 375px), and the
placeholder email address in the footer contact list could not shrink and overhung its
column at 1024px. German compound nouns (`Entwicklungsleitung`, `Datenschutzerklärung`) were
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
| Mobile nav | Drawer toggle, backdrop, Escape to close, focus moved in and trapped, `aria-expanded` kept in sync. The closed drawer is `visibility: hidden` *and* `inert`, so its ten controls are out of the tab order and the accessibility tree below 992px. Both toggle labels are authored as `data-label-open` / `data-label-close` so i18n.js translates them — never set them from `main.js` |
| Sticky header | Adds a blurred background after 24px of scroll |
| Scroll reveal | `IntersectionObserver` fade-up with optional `data-delay` |
| Counters | Animates `[data-count-to]` once in view |
| Accordion | One-open-at-a-time, driven by `aria-expanded` / `aria-controls` |
| Slider | Testimonials with dots, prev/next and a pause/resume button (WCAG 2.2.2 — the quotes rotate every 7s on their own). Dots are plain buttons marked with `aria-current`, not `role="tab"`: a tab has to own a tabpanel, and these do not. Hover and focus suspend the timer; only the button stops it for good |
| Filters | Project category filter with an `aria-live` result count and an empty state for a category with no matches |
| Form | Inline validation, error text wired through `aria-describedby`, focus sent to first error. Messages are authored in German as `data-msg-*` attributes on the form and translated like any other string — never hardcode them in `main.js` |
| Back to top | Appears after 600px |
| Site search | Opens from the header magnifier. The index is **real markup** — a hidden list of links in `#site-search` — so i18n.js translates it with everything else and it cannot drift; `main.js` only filters it. Accent-folding (`uber` finds `Über uns`), arrow-key navigation, Enter opens the first hit, Escape closes and returns focus |
| Subscribe | Footer newsletter field: validates the address and answers in place, same `data-msg-*` pattern as the contact form |

**Accessibility** — skip link, landmark elements, one `h1` per page, labelled form
controls with visible required markers, `:focus-visible` outlines on light *and* dark
surfaces, descriptive `alt` text, decorative imagery marked `aria-hidden`, and a
`prefers-reduced-motion` block that disables animation and smooth scrolling.
`:target` carries a `scroll-margin-top` so a `#hash` never lands under the sticky
header, and the footer's bottom row reserves the floating back-to-top button's
footprint so the legal links stay clickable.

**Colour and contrast** — every pastel tile tint is a `--tint-*` custom property in
`:root`, read by both the `.tint-*` classes and the `nth-child` cycles on the project
and team grids, so a card cannot be tinted with a value that was never checked. All six
clear 4.5:1 against `--c-muted` (#666 body copy) *and* `--c-purple-600` (#4655EA role
labels). `--c-pink-600` exists for small text in the secondary accent — the full-strength
`--c-pink` only reaches 3.03:1 on white, which is fine for a shape but not for a word.

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
  Every content image carries a `srcset` built from Unsplash's own `w=` parameter (320 → 1600) plus a `sizes` value measured from how wide that image actually renders at 390 / 768 / 1440. Before this, a 390px phone downloaded the 1600px hero — 253 KB where 58 KB would do — and the About page pulled 600px portraits into 96px slots. Verified that no image is served below 1× at any width, so nothing turned blurry. **If you self-host, keep the `srcset`**: regenerate the same width ladder locally, or the mobile saving goes away.
- **Social profiles** in the footer are `<span class="social-row__ph">` placeholders, not links, with a visible note saying so — the studio is fictional and an icon that goes nowhere is worse than no icon. Swap each `<span>` for an `<a href="https://…">` with an `aria-label` and drop `social-row--placeholder` (and its `aria-hidden`); the styling already covers both.
- **Article previews** on the home page are headings only, not links, because there are no article pages yet. Wrap them in an `<a>` once the blog exists.

## Wiring up the forms

**Contact form** — `kontakt/index.html` (and the home page copy) validates in the browser
and then shows a success message; it does not submit anywhere. To go live, give the
`<form id="contact-form">` an `action` and `method` (or post it with `fetch`) pointing at
your endpoint, inbox service or CRM, and remove the demo note under the submit button plus
the demo copy in the `initForm()` success branch of `assets/js/main.js`.

Field markup order is **label → control → hint → error**, and it matters. While the hint
lived inside the `<label>`, a field with one had a 51px label and its row neighbour without
one had 26px, so the two inputs started at different heights — 25px apart at 1280px and
48px at 992px, where the hint wrapped to a second line. Keeping every label to a single
line is what holds the grid together, so add new helper text *after* the control, never
inside the label; `aria-describedby` already carries the association for screen readers,
so nothing is lost by the move. An error hides the hint (`.field.has-error .field-hint`)
rather than stacking both messages under one field.

**Newsletter field** — the footer `form.subscribe` on all seven pages validates the address
and answers in place, but stores nothing. Point it at your list provider and replace the
`data-msg-success` string (and `sub.msg.success` in `i18n.js`) with real wording.

## Checks

No build step and no test runner, so verification is manual. What was run against the
local server, and what it covers:

- **Links and anchors** — every `href`/`src`/`action` resolved, every `#fragment` matched
  to an `id` on the page it points at: 388 internal references, plus all 49 external URLs
  requested. (The two bare Google Fonts origins return 404 to a GET by design — they are
  `rel="preconnect"` hints, not links.)
- **i18n parity** — 556 dictionary keys against 556 referenced in the markup, no missing
  and no orphans. Worth re-running after any copy change; an orphaned key is usually a
  string you deleted from the HTML but not from `i18n.js`.
- **Layout** — all seven pages at 320, 360, 390, 414, 576, 768, 1024, 1280, 1440, 1920 and
  2560px: no horizontal scroll, no clipped text, no control pushed outside its shell.
- **Accessibility** — per page: one `h1`, no heading-level jumps, no duplicate ids, no
  unlabelled field, no control without an accessible name, no `href="#"`, and every text
  node measured against its computed background for WCAG AA.

## Deploying — and the one thing to change

The site is configured for **`https://shadaf266.github.io/Digitel-Agency/`**. That origin
is written into six places, and they must all agree or search engines and social previews
will point at the wrong site:

| Where | What |
| --- | --- |
| `<link rel="canonical">` | one per page, 7 pages |
| `<meta property="og:url">` | one per page, 7 pages |
| `<meta property="og:image">` | absolute image URL, one per page |
| `sitemap.xml` | 5 `<loc>` entries |
| `robots.txt` | the `Sitemap:` line |
| `404.html` | `<base href="/Digitel-Agency/">` |
| `index.html` | the JSON-LD `url`, `@id` and `logo` |

**Moving to a custom domain** means updating all of those, adding a `CNAME` file
containing the bare domain, and changing the `<base>` in `404.html` to `/`.

A few deliberate choices worth knowing before you change them:

- **`robots.txt` does not `Disallow` the legal pages.** They are kept out of search with
  `<meta name="robots" content="noindex">` on the pages themselves. A disallowed URL is
  never fetched, so the `noindex` would never be read and the page could still be indexed
  from an external link — the two directives work against each other.
- **`sitemap.xml` lists only the five indexable pages.** Listing a `noindex` page asks a
  crawler to index something you told it not to.
- **`404.html` needs its `<base>`.** GitHub Pages serves it for any unmatched path while
  leaving the original URL in the address bar, so `assets/css/styles.css` would resolve
  against `/projekte/typo/` and the page would arrive unstyled. Verified by serving the
  site under `/Digitel-Agency/` and requesting a deep missing path: all eight assets and
  links resolve, and the DE/EN switch still works.
- **The JSON-LD is `Organization` only** — no `address`, `telephone` or `geo`. Those are
  placeholders here (a real-looking Potsdam street address and a dummy number), and
  structured data is machine-readable and trusted; publishing them would assert a physical
  business that does not exist. Add them back, as `LocalBusiness`, at the same time you
  replace the visible contact block.
- **`og:image` points at each page's own hero photograph**, re-cropped to 1200×630 by
  Unsplash's own parameters. Self-host proper social artwork for production, the same as
  the rest of the imagery.
- **The app icons are generated, not hand-drawn.** They are the brand chevron rendered by
  a small script; if you rebrand, regenerate them rather than editing the PNGs.

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `IntersectionObserver`, CSS custom
properties, `clamp()`, `aspect-ratio` and grid — all with graceful fallbacks where it
matters (reveal animations simply show immediately if the observer is unavailable).
