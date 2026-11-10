/* ==========================================================================
   Veluma Studio — bilingual switch (German default, English alternative)

   The pages are authored in German, so German needs no JavaScript at all and
   renders correctly with scripting disabled. On load the engine snapshots the
   authored German out of the DOM, which means the German side can never drift
   from the markup — only the English dictionary below is maintained by hand.

   Markup contract
     data-i18n="key"                 -> textContent
     data-i18n-html="key"            -> innerHTML (for strings with inline tags)
     data-i18n-attr="attr:key, ..."  -> one or more attributes
     data-lang-btn="de|en"           -> a switcher button

   Language resolution: ?lang= in the URL, then the last stored choice, then de.
   ========================================================================== */
(function () {
  'use strict';

  var DEFAULT_LANG = 'de';
  var STORE_KEY = 'veluma-lang';

  /* ---------- English dictionary ----------------------------------------- */
  var EN = {
    /* --- shared chrome --- */
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.quote': 'Get a quote',
    'nav.search': 'Search the site',
    'nav.menuOpen': 'Open navigation menu',
    'nav.menuClose': 'Close navigation menu',
    'nav.theme': 'Dark mode',
    'legal.onThisPage': 'On this page',
    'e404.title': 'Page not found — Veluma Studio',
    'e404.desc': 'This page does not exist, or it has moved.',
    'e404.label': 'Error 404',
    'e404.h1': 'This page is <span class="accent-serif">no longer here</span>',
    'e404.lead': 'The link is out of date, has a typo in it, or the page has moved. Carry on from here:',
    'e404.home': 'Back to the home page',
    'e404.allPages': 'All pages',

    'srv.heroImgAlt': 'Two team members discussing a design on screen in the studio',
    'prj.heroImgAlt': 'A team presenting project work in the meeting room',
    'abt.heroImgAlt': 'Colleagues working together at a bright studio table',
    'ctc.heroImgAlt': 'Sanssouci Palace in Potsdam, where the studio is based',
    'imp.heroImgAlt': 'A bright studio with desks and plants',
    'pri.heroImgAlt': 'A bright studio with desks and plants',

    'search.title': 'Search the site',
    'search.ph': 'Search for a page or section …',
    'search.close': 'Close search',
    'search.empty': 'No matches. Try another term — “pricing”, “team” or “contact”, for example.',
    'search.countOne': '{n} result',
    'search.countMany': '{n} results',
    'search.g.page': 'Page',
    'search.g.legal': 'Legal',
    'search.g.service': 'Service',
    'search.g.work': 'Work',
    'search.g.studio': 'Studio',
    'search.g.contact': 'Contact',
    'search.i.pricing': 'Pricing and packages',
    'search.i.process': 'How we work, in four phases',
    'search.i.allWork': 'All projects',
    'search.i.caseBrand': 'Case study: brand identity',
    'search.i.caseWeb': 'Case study: web platform',
    'search.i.caseShop': 'Case study: e-commerce',
    'search.i.team': 'The team',
    'search.i.values': 'Values and ways of working',
    'search.i.story': 'How the studio grew',
    'search.i.enquiry': 'Send a project enquiry',
    'search.i.faq': 'Frequently asked questions',
    'search.i.visit': 'Getting here and address',

    'sub.msg.required': 'Please enter your email address.',
    'sub.msg.email': 'Enter a valid email address, for example name@company.com.',
    'sub.msg.success': 'Thanks — this demo front end does not store addresses yet; connect the field to your own list before going live.',
    'nav.lang': 'Choose a language',
    'nav.phoneLabel': 'Call us on ',
    'a11y.skip': 'Skip to main content',
    'a11y.toTop': 'Back to top',
    'a11y.breadcrumb': 'Breadcrumb',

    'foot.newsletter': 'Get studio notes and new work, a few times a year.',
    'foot.emailLabel': 'Email address for studio updates',
    'foot.emailPlaceholder': 'Your email address',
    'foot.subscribe': 'Subscribe',
    'foot.about': 'An independent digital agency in Potsdam, working with founders and in-house teams on brand, websites and digital products.',
    'foot.quickLinks': 'Quick links',
    'foot.solutions': 'Our solutions',
    'foot.contact': 'Contact',
    'foot.srv.brand': 'Brand & identity',
    'foot.srv.web': 'Web design & build',
    'foot.srv.product': 'Product & app UX',
    'foot.srv.growth': 'Growth & content',
    'foot.srv.care': 'Care & support',
    'foot.address': 'Gutenbergstraße 12<br>14467 Potsdam, Germany<br><small>(placeholder address)</small>',
    'foot.copyright': '© <span data-year>2026</span> Veluma Studio. Demo site — names, imagery, figures and contact details are placeholders.',
    'foot.imprint': 'Imprint',
    'foot.privacy': 'Privacy',
    'foot.socialNote': 'Placeholder profiles — connect your real accounts before going live.',
    'foot.cookies': 'Cookies',

    /* --- home --- */
    'home.title': 'Veluma Studio — digital agency in Potsdam',
    'home.desc': 'Independent digital agency in Potsdam: brands, websites and digital products for ambitious teams. Demo site with placeholder content.',
    'home.hero.h1': 'Designing the Future,<br>Powering <span class="obj-inline" aria-hidden="true"></span><span class="accent-serif">Your Solutions</span>',
    'home.hero.imgAlt': 'Team members working together at a shared table with open laptops',
    'home.hero.satisfied': 'Satisfied customers',
    'home.hero.proof': 'Placeholder copy for a short line of proof — swap in a sentence about the people your work reaches.',
    'home.hero.sampleFigure': 'Sample figure',

    'home.logos.head': 'Sample client marks — placeholders for your own logos',
    'home.logos.sr': 'Placeholder brand names shown for layout purposes: Nordlicht, Kiezgut, Datenwerk, Fährhaus Medien, Fernblick, Pappelgrün.',

    'home.srv.label': 'What we do',
    'home.srv.h2': 'A wide array of services for your business, <span class="accent-serif">tailored to how your team works</span>',
    'home.srv.1.h': 'Mobile & app development',
    'home.srv.1.p': 'Research, flows, prototypes and interface design for web and mobile products — handed to engineering build-ready.',
    'home.srv.2.h': 'Brand & identity',
    'home.srv.2.p': 'Positioning, visual identity, tone of voice and a design system your team can extend without us.',
    'home.srv.3.h': 'Digital marketing & growth',
    'home.srv.3.p': 'Technical SEO, content design, analytics and iterative testing — a steady loop rather than a one-off campaign.',
    'home.srv.more': 'Discover more',
    'home.srv.cta': "Let's build something together that's worth showing.",
    'home.srv.ctaBtn': 'Start a project',

    'home.about.label': 'About us',
    'home.about.h2': 'We develop ideas that strengthen your <span class="accent-serif">digital presence</span>',
    'home.about.lead': 'A small, senior studio in Potsdam that stays close to the problem. We take on only a handful of projects at a time, so the people who understand the task are the people who deliver it.',
    'home.about.img1Alt': 'Two team members working side by side at a desk with large monitors',
    'home.about.img2Alt': 'Workshop session mapping a customer journey with sticky notes on a wall',
    'home.about.intro': 'We offer a broad range of services for different needs:',
    'home.about.li1': 'Custom web design',
    'home.about.li2': 'Responsive front-end build',
    'home.about.li3': 'Social and content strategy',
    'home.about.li4': 'Design systems and tokens',
    'home.about.li5': 'Analytics and measurement',
    'home.about.li6': 'Motion and video direction',
    'home.about.more': 'Read more',

    'home.stats.sr': 'Studio figures',
    'home.stats.sample': 'Sample figures — please replace with your own verified numbers',
    'home.stats.1.l': 'Projects delivered',
    'home.stats.1.p': 'Placeholder value for the total number of completed projects.',
    'home.stats.2.l': 'Industries served',
    'home.stats.2.p': 'Placeholder value for sector coverage.',
    'home.stats.3.l': 'Satisfied partners',
    'home.stats.3.p': 'Placeholder value for client relationships.',
    'home.stats.4.l': 'Awards (placeholder)',
    'home.stats.4.p': 'Placeholder value — list only genuine recognitions.',

    'home.cap.label': 'Our services',
    'home.cap.h2': 'Digital services that <span class="accent-serif">genuinely move your business forward</span>',
    'home.cap.lead': 'Open a service to see what it includes.',
    'home.cap.1.h': 'Advanced analytics',
    'home.cap.1.p': 'Event tracking, dashboards and a measurement plan agreed before launch — so you can see which change actually made a difference.',
    'home.cap.1.li1': 'Tracking plan and implementation',
    'home.cap.1.li2': 'Dashboards your team understands',
    'home.cap.1.alt': 'Analytics dashboard showing traffic and conversion charts',
    'home.cap.2.h': 'Product & interface design',
    'home.cap.2.p': 'Interface design and prototypes grounded in real user research, with a component library documented down to states and tokens.',
    'home.cap.2.li1': 'Clickable prototypes',
    'home.cap.2.li2': 'Component library and specs',
    'home.cap.2.alt': 'Colourful interface designs open in design software on a large monitor',
    'home.cap.3.h': 'Systems & software',
    'home.cap.3.p': 'Semantic, accessible front-end builds and CMS setups — documented and handed over so your team owns all of it.',
    'home.cap.3.li1': 'Accessible, standards-based build',
    'home.cap.3.li2': 'CMS setup and training',
    'home.cap.3.alt': 'Screen showing website markup in a code editor',

    'home.work.label': 'Selected work',
    'home.work.h2': 'Recent <span class="accent-serif">projects</span>',
    'home.work.lead': 'Sample case studies that demonstrate the layout and tone.',
    'home.work.1.h': 'Datenwerk',
    'home.work.1.p': 'Product UX — analytics dashboard and component library',
    'home.work.2.h': 'Atelier Nord',
    'home.work.2.p': 'E-commerce — one brand system online and in store',
    'home.work.3.h': 'Fernblick',
    'home.work.3.p': 'Web platform — modular pages and a documented CMS',
    'home.work.4.h': 'Vitalpfad',
    'home.work.4.p': 'Product UX — appointment booking in plain language',
    'home.work.all': 'View all projects',

    'home.vision.label': 'Our approach',
    'home.vision.h2': 'Your digital <span class="accent-serif">success starts here</span>',
    'home.vision.p': 'We set the targets with you at kickoff and report against them every month — progress becomes something you can read rather than a matter of trust.',
    'home.vision.sample': 'Sample values',
    'home.vision.m1': 'Brand & identity',
    'home.vision.m2': 'Web design & build',
    'home.vision.m3': 'Growth & content',
    'home.vision.more': 'More about us',
    'home.vision.alt': 'Colleagues at a meeting table with open laptops',

    'home.team.label': 'The studio',
    'home.team.h2': 'Get to know our <span class="accent-serif">team</span>',
    'home.team.sample': 'Sample profiles — invented names, portraits from a stock library',
    'home.team.all': 'See everyone',

    'home.quote.label': 'Testimonials',
    'home.quote.h2': 'What others say about <span class="accent-serif">working with us</span>',
    'home.quote.sample': 'Sample testimonials — placeholder copy, not real client quotes',
    'home.quote.1': 'This is a placeholder for a client quote. Replace it with a real statement once you have written permission — the problem, the collaboration, the outcome.',
    'home.quote.2': 'A second placeholder quote, to check how shorter copy sits in the slider. Always keep real quotes verbatim and name the person’s role.',
    'home.quote.name': 'Client name',
    'home.quote.role': 'Role, company — placeholder attribution',
    'home.quote.prev': 'Previous quote',
    'home.quote.next': 'Next quote',
    'home.quote.choose': 'Choose a quote',
    'home.quote.dot1': 'Quote 1',
    'home.quote.dot2': 'Quote 2',
    'home.quote.pause': 'Pause the quote rotation',
    'home.quote.play': 'Resume the quote rotation',
    'home.quote.alt': 'Team discussing a project together at their desks',

    'home.plans.label': 'Working together',
    'home.plans.h2': 'The right <span class="accent-serif">model</span>',
    'home.plans.sample': 'Sample prices — placeholders only',
    'home.plans.1.t': 'Discovery sprint',
    'home.plans.1.per': '/ two weeks',
    'home.plans.1.p': 'A short piece of work to clarify the problem, the audience and a realistic plan.',
    'home.plans.1.li1': 'Interviews with stakeholders',
    'home.plans.1.li2': 'Audit of the existing site or app',
    'home.plans.1.li3': 'Opportunity map and priorities',
    'home.plans.1.li4': 'Costed roadmap that is yours to keep',
    'home.plans.2.t': 'Project',
    'home.plans.2.per': '/ project',
    'home.plans.2.p': 'Delivery of a brand, website or product release with a fixed scope.',
    'home.plans.2.li1': 'Strategy, design and build',
    'home.plans.2.li2': 'Weekly demos and a decision log',
    'home.plans.2.li3': 'Accessibility and performance checks',
    'home.plans.2.li4': 'Training and full handover',
    'home.plans.3.t': 'Monthly partnership',
    'home.plans.3.per': '/ month',
    'home.plans.3.p': 'A fixed allocation of studio time for teams with a running roadmap.',
    'home.plans.3.li1': 'Reserved design and build capacity',
    'home.plans.3.li2': 'Rolling backlog, reviewed monthly',
    'home.plans.3.li3': 'Care, monitoring and updates',
    'home.plans.3.li4': 'Quarterly strategy session',
    'home.plans.enquire': 'Enquire',
    'home.plans.note': 'The amounts are deliberately zeros — enter your own rates or remove the figures entirely.',

    'home.form.label': 'Contact',
    'home.form.h2': 'Digital strategies <span class="accent-serif">that work</span>',
    'home.form.name': 'Full name',
    'home.form.namePh': 'Alex Moreno',
    'home.form.email': 'Email',
    'home.form.emailPh': 'alex@company.com',
    'home.form.service': 'Interested in',
    'home.form.servicePh': 'Choose a service …',
    'home.form.opt.brand': 'Brand & identity',
    'home.form.opt.web': 'Web design & build',
    'home.form.opt.product': 'Product & app UX',
    'home.form.opt.growth': 'Growth & content',
    'home.form.opt.other': 'Something else',
    'home.form.message': 'Project details',
    'home.form.messagePh': 'What would you like to change?',
    'home.form.submit': 'Send enquiry',
    'home.form.demo': 'Demo form — validation runs in the browser, nothing is sent yet.',
    'home.form.alt': 'Colourful studio interior with bold accent colours',
    'home.form.required': '(required)',

    'home.news.label': 'Insights',
    'home.news.h2': 'Latest <span class="accent-serif">news &amp; articles</span>',
    'home.news.lead': 'Sample article previews — replace them with your own posts once the blog goes live.',
    'home.news.sub': 'Subscribe to updates',
    'home.news.1.tag': 'Content',
    'home.news.1.time': '6 min read',
    'home.news.1.h': 'A practical guide to content that earns attention',
    'home.news.1.alt': 'Team presenting a content plan to colleagues in a meeting room',
    'home.news.2.tag': 'Performance',
    'home.news.2.time': '4 min read',
    'home.news.2.h': 'Why the performance budget belongs in the brief',
    'home.news.2.alt': 'Laptop on a light desk with a code editor open',
    'home.news.3.tag': 'Design systems',
    'home.news.3.time': '7 min read',
    'home.news.3.h': 'Design systems that still hold up in year two',
    'home.news.3.alt': 'Hand sketching app screens on a whiteboard covered in wireframes',

    /* --- services page --- */
    'srv.title': 'Services — Veluma Studio Potsdam',
    'srv.desc': 'Brand and identity, web design and build, product UX, growth and content, plus ongoing care — the services of Veluma Studio in Potsdam.',
    'srv.label': 'Our services',
    'srv.h1': 'Everything for launch and <span class="accent-serif">growth</span>',
    'srv.lead': 'Five connected disciplines, delivered by the same small team. Start with one — or bring us in from strategy through to the months after launch.',
    'srv.detailSr': 'Services in detail',

    'srv.1.label': '01 — Brand & identity',
    'srv.1.h': 'An identity that <span class="accent-serif">holds up everywhere</span>',
    'srv.1.lead': 'We clarify what you stand for, then build the visual and verbal system on top of it — logo, typography, colour, image direction and the rules that hold it together.',
    'srv.1.li1': 'Positioning workshops and competitive review',
    'srv.1.li2': 'Logo family, type scale, colour system and icons',
    'srv.1.li3': 'Tone of voice and messaging framework',
    'srv.1.li4': 'Brand guidelines including open source files',
    'srv.1.alt': 'Tablet and stylus being used to work on an identity concept',

    'srv.2.label': '02 — Web design & build',
    'srv.2.h': 'Websites that <span class="accent-serif">load fast and stay easy to maintain</span>',
    'srv.2.lead': 'Company sites, campaign pages and content platforms. Designed around your real content and built on a component system your team extends itself.',
    'srv.2.li1': 'Information architecture, wireframes and copy structure',
    'srv.2.li2': 'Responsive interface design and prototypes',
    'srv.2.li3': 'Front-end build with semantic, accessible markup',
    'srv.2.li4': 'CMS setup, training and a documented handover',
    'srv.2.alt': 'Screen showing website markup in a code editor',

    'srv.3.label': '03 — Product & app UX',
    'srv.3.h': 'Interfaces shaped by <span class="accent-serif">real ways of working</span>',
    'srv.3.lead': 'From first concept to a build-ready design system. We research, map the flows, prototype the hard parts and stay with your engineers through to release.',
    'srv.3.li1': 'User interviews, journey mapping and usability testing',
    'srv.3.li2': 'Interaction design and clickable prototypes',
    'srv.3.li3': 'Component library with states, tokens and specs',
    'srv.3.li4': 'Support for your engineers through implementation',
    'srv.3.alt': 'Colourful interface designs open in design software on a large monitor',

    'srv.4.label': '04 — Growth & content',
    'srv.4.h': 'Launch is the beginning, <span class="accent-serif">not the finish line</span>',
    'srv.4.lead': 'Technical SEO, content design and measurement as a steady loop rather than a one-off campaign — so every change builds on what you learned the month before.',
    'srv.4.li1': 'Technical SEO audits and structured data',
    'srv.4.li2': 'Content strategy, editorial planning and writing support',
    'srv.4.li3': 'Analytics, event tracking and dashboards',
    'srv.4.li4': 'Experiment roadmaps and conversion reviews',
    'srv.4.alt': 'Analytics dashboard showing traffic and conversion charts',

    'srv.5.label': '05 — Care & support',
    'srv.5.h': 'A standing team <span class="accent-serif">after go-live</span>',
    'srv.5.lead': 'Monthly care packages for anyone who wants a reliable partner on call: updates, fixes, new pages and a quarterly look at what the numbers are saying.',
    'srv.5.li1': 'Monitoring of dependencies, security and accessibility',
    'srv.5.li2': 'Content updates and new page templates',
    'srv.5.li3': 'Monthly performance report with recommendations',
    'srv.5.li4': 'Priority response time during business hours',
    'srv.5.alt': 'Colleagues at a meeting table with open laptops',

    'srv.faq.label': 'Common questions',
    'srv.faq.h': 'What we are <span class="accent-serif">asked most often</span>',
    'srv.faq.lead': 'A quick look at how projects are structured here. If something does not fit the way you work, say so — we adapt the shape, not the standards.',
    'srv.faq.cta': 'Ask us anything',
    'srv.faq.q1': 'How long does a typical project take?',
    'srv.faq.a1': 'Brand and website together usually take eight to fourteen weeks, depending on how much content is written from scratch. Discovery sprints run two weeks. Product work is planned in monthly cycles you can stop or extend at any time.',
    'srv.faq.q2': 'Who exactly will we be working with?',
    'srv.faq.a2': 'The people doing the work. Every project has a permanent design lead and engineering lead who stay from kickoff to handover, plus a strategist in the opening phase. No intermediate layer relaying messages.',
    'srv.faq.q3': 'Can you work with our existing platform?',
    'srv.faq.a3': 'Usually yes. We regularly design into existing CMS and shop systems — and we will tell you openly if the current setup is what stands between you and your goals, before suggesting a move.',
    'srv.faq.q4': 'How do you handle accessibility?',
    'srv.faq.a4': 'It belongs to the definition of “done”, not to a late audit. Contrast, keyboard paths, focus states and screen reader labels are checked every sprint, and we test with assistive technology before launch.',
    'srv.faq.q5': 'What do we own at the end?',
    'srv.faq.a5': 'Everything: source files, repositories, design system, documentation and accounts. There is no proprietary layer you need us to maintain, and no licence that expires when you move on.',

    'srv.plans.h': 'Ways of <span class="accent-serif">working together</span>',
    'srv.plans.lead': 'Three common models. The amounts shown are placeholders for the layout — every real quote follows a conversation about scope.',

    'srv.proc.label': 'How we work',
    'srv.proc.h': 'Four stages, <span class="accent-serif">no guesswork</span>',
    'srv.proc.1.h': 'Understand',
    'srv.proc.1.p': 'Interviews, analytics and an audit of what exists today.',
    'srv.proc.2.h': 'Shape',
    'srv.proc.2.p': 'Concepts, structure and copy direction — discussed early and often.',
    'srv.proc.3.h': 'Build',
    'srv.proc.3.p': 'Design and engineering in parallel, tested as we go.',
    'srv.proc.4.h': 'Grow',
    'srv.proc.4.p': 'Measure, refine and plan the next meaningful change.',

    'srv.cta.label': 'Next step',
    'srv.cta.h': 'Tell us what you want <span class="accent-serif">to change</span>',
    'srv.cta.p': 'Send us the context — unsorted is fine. We reply within two working days with questions, a rough direction and a sense of the cost.',
    'srv.cta.alt': 'See our work',

    /* --- projects page --- */
    'prj.title': 'Projects — Veluma Studio Potsdam',
    'prj.desc': 'Selected sample projects from Veluma Studio in Potsdam: brand work, web platforms, e-commerce and product design. Demo site with placeholder content.',
    'prj.label': 'Our work',
    'prj.h1': 'Selected <span class="accent-serif">projects</span>',
    'prj.lead': 'A cross-section of what we take on — identity systems, content platforms, shops and product interfaces. Every case study below is sample content.',
    'prj.sample': 'Sample case studies',
    'prj.gridSr': 'Project overview',
    'prj.filterLabel': 'Filter by discipline',
    'prj.f.all': 'All work',
    'prj.f.brand': 'Brand',
    'prj.f.web': 'Web platforms',
    'prj.f.ecom': 'E-commerce',
    'prj.f.product': 'Product UX',
    'prj.c1.p': 'Identity system, tone of voice and launch material for a fictional strategy consultancy.',
    'prj.c2.p': 'Shop relaunch with a calmer product browse and a shorter checkout.',
    'prj.c3.p': 'Analytics product: information architecture and a documented component library.',
    'prj.c4.p': 'Modular marketing platform with design tokens and a CMS the team runs alone.',
    'prj.c5.p': 'Visual direction, motion principles and a flexible pattern library.',
    'prj.c6.p': 'Relaunch of an editorial site with a reusable article system and faster pages.',
    'prj.c7.p': 'Appointment booking rethought — plain language and fewer steps.',
    'prj.c8.p': 'Online and in store brought together into one consistent brand system.',
    'prj.c9.p': 'Documentation portal with search, versioning and an accessible dark mode.',
    'prj.note': 'In this demo the case study links point back to this page. Replace each card link with its own project page once real work is published.',
    'prj.status.one': '{n} project shown for {f}.',
    'prj.status.many': '{n} projects shown for {f}.',
    'prj.empty': 'No projects in this category yet. Choose “All work” to see everything again.',
    'prj.sp.label': 'Inside a project',
    'prj.sp.h': 'How a typical project <span class="accent-serif">runs</span>',
    'prj.sp.lead': 'A walk through the way we work, written as sample content.',
    'prj.sp.1.w': 'Week 1–2',
    'prj.sp.1.h': 'Framing the problem',
    'prj.sp.1.p': 'Interviews with stakeholders, an audit of the existing presence and a look at any analytics already in place.',
    'prj.sp.2.w': 'Week 3–5',
    'prj.sp.2.h': 'Structure and concepts',
    'prj.sp.2.p': 'Sitemap, content outline and two or three visual directions, reviewed together in one working session.',
    'prj.sp.3.w': 'Week 6–10',
    'prj.sp.3.h': 'Design and build',
    'prj.sp.3.p': 'Pages take shape in design and engineering in parallel, with weekly demos on a shared staging environment.',
    'prj.sp.4.w': 'Week 11–12',
    'prj.sp.4.h': 'Launch and handover',
    'prj.sp.4.p': 'Accessibility and performance checks, content migration, CMS training and documentation.',
    'prj.cta.label': 'Your project next',
    'prj.cta.h': 'Does any of this sound <span class="accent-serif">like your plan?</span>',
    'prj.cta.p': 'We are happy to talk through what a comparable project would mean for your team, your timeline and your budget.',
    'prj.cta.btn': 'Start a conversation',
    'prj.cta.alt': 'See our services',

    /* --- about page --- */
    'abt.title': 'About — Veluma Studio Potsdam',
    'abt.desc': 'Who we are, how we work and what matters to us. Veluma Studio is an independent, remote-first digital agency with a studio in Potsdam.',
    'abt.label': 'About Veluma',
    'abt.h1': 'A small studio with <span class="accent-serif">a long attention span</span>',
    'abt.lead': 'We are a remote-first team of designers, engineers and strategists with a studio in Potsdam — people who like finishing things properly.',
    'abt.story.label': 'Our story',
    'abt.story.h': 'Small teams <span class="accent-serif">finish better</span>',
    'abt.story.p1': 'Veluma began when two designers grew tired of watching good ideas get diluted on their way through large organisations. We wanted the people who understand the problem to be the people who deliver the answer.',
    'abt.story.p2': 'Nine years later the shape is the same. We keep the team deliberately small, take on few projects at a time and stay on board after launch — because the interesting part of digital work usually starts once real people are using it.',
    'abt.story.p3': 'We work with founders building something new and with in-house teams who need extra hands with senior judgement attached. Either way, you speak directly to the people doing the work.',
    'abt.story.badgeT': 'Founded 2016',
    'abt.story.badgeP': 'Two desks in Potsdam, one shared standard.',
    'abt.story.alt': 'Open-plan studio with team members at long shared desks',
    'abt.val.label': 'What matters to us',
    'abt.val.h': 'Four things we <span class="accent-serif">will not compromise on</span>',
    'abt.val.1.h': 'Care over volume',
    'abt.val.1.p': 'Fewer projects, at a quality we put our name to. Quality is a question of planning.',
    'abt.val.2.h': 'Accessible from the start',
    'abt.val.2.p': 'If something cannot be used with a keyboard or a screen reader, it is not finished yet.',
    'abt.val.3.h': 'Clear, direct language',
    'abt.val.3.p': 'Honest estimates, visible trade-offs and bad news early. No jargon as a shield.',
    'abt.val.4.h': 'Built for handover',
    'abt.val.4.p': 'Documented, standards-based work that is entirely yours. Staying should be a choice, not a dependency.',
    'abt.team.sample': 'Sample profiles — invented names, portraits from a stock library',
    'abt.team.h': 'Meet the <span class="accent-serif">studio team</span>',
    'abt.team.lead': 'Eight profiles show how the section is built. The names and roles are invented and the portraits come from a stock library — replace both with your real team before going live.',
    'form.msg.required': '{field} is required.',
    'form.msg.consent': 'Please confirm before sending.',
    'form.msg.email': 'Enter a valid email address, for example name@company.com.',
    'form.msg.short': 'Please add a little more detail (at least 20 characters).',
    'form.msg.invalid': 'Please review the highlighted fields and try again.',
    'form.msg.success': 'Thanks — your message is ready. This demo front end does not submit anywhere yet; connect the form to your own endpoint or inbox.',
    'form.lbl.name': 'Name',
    'form.lbl.email': 'Email',
    'form.lbl.company': 'Company',
    'form.lbl.service': 'Service',
    'form.lbl.budget': 'Budget',
    'form.lbl.timeline': 'Timeline',
    'form.lbl.message': 'Project details',
    'form.lbl.consent': 'Consent',
    'abt.t1.role': 'Founder & design lead',
    'abt.t1.line': 'Brand strategy and visual systems',
    'abt.t1.alt': 'Portrait of a smiling woman with dark hair — sample portrait',
    'abt.t1.mail': 'Email Lena Brandt',
    'abt.t2.role': 'Engineering lead',
    'abt.t2.line': 'Front-end architecture and performance',
    'abt.t2.alt': 'Portrait of a smiling man in a grey jumper — sample portrait',
    'abt.t2.mail': 'Email Jonas Weber',
    'abt.t3.role': 'Strategy & research',
    'abt.t3.line': 'User interviews and information architecture',
    'abt.t3.alt': 'Portrait of a smiling woman with curly hair — sample portrait',
    'abt.t3.mail': 'Email Mareike Sommer',
    'abt.t4.role': 'Content & growth',
    'abt.t4.line': 'Editorial planning and technical SEO',
    'abt.t4.alt': 'Portrait of a man with glasses against a grey background — sample portrait',
    'abt.t4.mail': 'Email Thomas Kern',
    'abt.t5.role': 'UX & accessibility',
    'abt.t5.line': 'Interaction design and WCAG reviews',
    'abt.t5.alt': 'Portrait of a smiling woman with long dark hair — sample portrait',
    'abt.t5.mail': 'Email Annika Vogt',
    'abt.t6.role': 'Front-end development',
    'abt.t6.line': 'Design systems and component libraries',
    'abt.t6.alt': 'Portrait of a bearded man in a dark jacket — sample portrait',
    'abt.t6.mail': 'Email Felix Hartmann',
    'abt.t7.role': 'Motion & video',
    'abt.t7.line': 'Moving image and animation guidelines',
    'abt.t7.alt': 'Portrait of a woman with an auburn bob outdoors — sample portrait',
    'abt.t7.mail': 'Email Clara Neumann',
    'abt.t8.role': 'Analytics & measurement',
    'abt.t8.line': 'Tracking plans and dashboards',
    'abt.t8.alt': 'Portrait of a man with glasses and a blazer — sample portrait',
    'abt.t8.mail': 'Email Milan Krause',
    'abt.ms.label': 'Milestones',
    'abt.ms.h': 'How the studio <span class="accent-serif">grew up</span>',
    'abt.ms.lead': 'A short, illustrative history as placeholder content.',
    'abt.ms.cta': 'Work with us',
    'abt.ms.1.h': 'Two desks, one studio',
    'abt.ms.1.p': 'Veluma starts in Potsdam as a two-person practice for identity and web projects.',
    'abt.ms.2.h': 'Engineering joins',
    'abt.ms.2.p': 'Front-end development moves in-house so design and build finally run together.',
    'abt.ms.3.h': 'Remote by design',
    'abt.ms.3.p': 'The team works distributed, with a steady rhythm of weekly demos and written decisions.',
    'abt.ms.4.w': 'Today',
    'abt.ms.4.h': 'Nine specialists, one roadmap',
    'abt.ms.4.p': 'Strategy, design, engineering and content under one roof — on a few projects at a time.',
    'abt.stats.sample': 'Sample values — placeholders only',
    'abt.stats.1.l': 'People in the studio',
    'abt.stats.1.p': 'Placeholder value for team size.',
    'abt.stats.2.l': 'Countries covered',
    'abt.stats.2.p': 'Placeholder value for where the team is based.',
    'abt.stats.3.l': 'Projects at a time',
    'abt.stats.3.p': 'Placeholder value for concurrent projects.',
    'abt.stats.4.l': 'Typical reply time',
    'abt.stats.4.p': 'Placeholder value for response speed.',
    'abt.cult.label': 'Inside the studio',
    'abt.cult.h': 'What a <span class="accent-serif">working week</span> looks like here',
    'abt.cult.lead': 'A reliable rhythm beats heroics. Our week is built so focused work has room and decisions do not sit waiting.',
    'abt.cult.li1': 'Monday: priorities set together in thirty minutes and written down',
    'abt.cult.li2': 'Midweek: focus time with no internal meetings',
    'abt.cult.li3': 'Thursday: client demo on a real staging environment',
    'abt.cult.li4': 'Friday: review, documentation and an hour for craft',
    'abt.cult.work': 'See our work',
    'abt.cult.alt': 'Two colleagues talking beside an office window',
    'abt.cta.label': 'Say hello',
    'abt.cta.h': 'Think this <span class="accent-serif">is a good fit?</span>',
    'abt.cta.p': 'We always like hearing what people are building — even when the timing is not right yet.',
    'abt.cta.btn': 'Contact the studio',

    /* --- contact page --- */
    'ctc.title': 'Contact — Veluma Studio Potsdam',
    'ctc.desc': 'Tell Veluma Studio in Potsdam about your project — by form, email or phone. Demo site with placeholder contact details.',
    'ctc.label': 'Get in touch',
    'ctc.h1': 'Let us talk about <span class="accent-serif">your plan</span>',
    'ctc.lead': 'Share as much or as little as you have. We read every message ourselves and reply within two working days — usually with a few questions and an honest first reaction.',
    'ctc.form.h': 'Project enquiry',
    'ctc.form.note': 'Fields marked with an asterisk are required.',
    'ctc.form.email': 'Email address',
    'ctc.form.company': 'Company or organisation',
    'ctc.form.companyHint': 'Optional — leave blank for personal projects.',
    'ctc.form.companyPh': 'Company name',
    'ctc.form.opt.care': 'Care & support',
    'ctc.form.budget': 'Approximate budget',
    'ctc.form.budgetHint': 'Optional — helps us suggest a realistic shape.',
    'ctc.form.budget0': 'Prefer not to say',
    'ctc.form.budget1': 'Discovery sprint only',
    'ctc.form.budget2': 'Smaller project',
    'ctc.form.budget3': 'Mid-size project',
    'ctc.form.budget4': 'Larger programme',
    'ctc.form.budget5': 'Ongoing partnership',
    'ctc.form.timeline': 'Preferred timeline',
    'ctc.form.timelineHint': 'Optional — when would you like to start?',
    'ctc.form.timelinePh': 'e.g. next quarter',
    'ctc.form.messageHint': 'What would you like to change, and what have you tried so far?',
    'ctc.form.messagePh': 'Tell us about the project, the audience and anything already decided.',
    'ctc.form.consent': 'I agree that Veluma Studio may store these details in order to answer my enquiry.',
    'ctc.form.submit': 'Send enquiry',
    'ctc.form.demo': 'This demo form only validates in the browser — it does not send anything yet. Connect it to your own endpoint, inbox or CRM before going live.',
    'ctc.info.sample': 'Placeholder contact details',
    'ctc.info.mailH': 'Email us',
    'ctc.info.mailP': 'For new projects, press enquiries and everything else.',
    'ctc.info.callH': 'Call us',
    'ctc.info.callP': 'Monday to Friday, 9:00–17:30 (CET).',
    'ctc.info.visitH': 'Visit us',
    'ctc.info.visitP': 'Gutenbergstraße 12<br>14467 Potsdam, Germany<br><small>(placeholder address — visits by arrangement)</small>',
    'ctc.info.workH': 'Working with us',
    'ctc.info.work1': 'A reply within two working days',
    'ctc.info.work2': 'A 30-minute intro call, free of charge',
    'ctc.info.work3': 'A written summary of what we heard',
    'ctc.info.work4': 'A proposal only once the scope is clear',
    'ctc.faq.label': 'Before you write',
    'ctc.faq.h': 'A few things that are <span class="accent-serif">good to know</span>',
    'ctc.faq.lead': 'Answers to what usually comes up in a first email.',
    'ctc.faq.q1': 'What belongs in the first message?',
    'ctc.faq.a1': 'The problem as you see it, who it affects and what is already decided — a deadline, a platform, a brand you are tied to. Links to the existing site or app help more than a long document.',
    'ctc.faq.q2': 'Do you work with early-stage teams?',
    'ctc.faq.a2': 'Often. If budget is tight we usually suggest a discovery sprint: you get a clear plan first and then decide how much to build and when.',
    'ctc.faq.q3': 'How far ahead are you booked?',
    'ctc.faq.a3': 'Because the team is small, new projects usually start a few weeks out. Name your deadline in the first message — we will be straight with you about whether it is feasible.',
    'ctc.faq.q4': 'Will you sign a non-disclosure agreement?',
    'ctc.faq.a4': 'Yes. Send us yours, or ask for ours. We would rather sign early than have you leave out the part of the brief that actually matters.',
    'ctc.loc.label': 'Where to find us',
    'ctc.loc.h': 'Remote-first, <span class="accent-serif">with a studio in Potsdam</span>',
    'ctc.loc.p': 'Most of our work happens online, but the studio keeps a space in Potsdam for workshops and kickoff days — a few minutes from the Glienicke Bridge. The address is a placeholder in this demo.',
    'ctc.loc.btn': 'Send an enquiry',
    'ctc.loc.alt': 'Email instead',
    'ctc.loc.alt2': 'The Glienicke Bridge in Potsdam in the evening light',
    'ctc.map.label': 'Getting here',
    'ctc.map.h2': 'How to find <span class="accent-serif">the studio</span>',
    'ctc.map.h': 'Load the map from OpenStreetMap?',
    'ctc.map.p': 'The map is only loaded once you click. Your IP address is transmitted to OpenStreetMap in the process. We remember your choice in this browser.',
    'ctc.map.btn': 'Load map',
    'ctc.map.ext': 'Open on OpenStreetMap instead',
    'ctc.map.frameTitle': 'Map of Potsdam on OpenStreetMap',
    'ctc.map.note': 'The map shows central Potsdam. The studio address is a placeholder in this demo — drop in the real coordinates before going live.',

    /* --- imprint (Impressum) --- */
    'imp.title': 'Imprint — Veluma Studio Potsdam',
    'imp.desc': 'Imprint and provider identification for Veluma Studio, Potsdam. Demo site with placeholder details.',
    'imp.label': 'Provider identification',
    'imp.h1': 'Imprint',
    'imp.lead': 'Details pursuant to § 5 DDG (German Digital Services Act). Every detail on this demo site is a placeholder.',
    'imp.sample': 'Placeholder details — replace with real data before going live',
    'imp.s1.h': 'Service provider',
    'imp.s1.p': 'Veluma Studio GbR<br>Gutenbergstraße 12<br>14467 Potsdam<br>Germany',
    'imp.s2.h': 'Represented by',
    'imp.s2.p': 'First name Last name, First name Last name (placeholder)',
    'imp.s3.h': 'Contact',
    'imp.s3.p': 'Phone: +49 331 2000000<br>Email: <a href="mailto:hallo@velumastudio.example">hallo@velumastudio.example</a>',
    'imp.s4.h': 'Register entry and VAT',
    'imp.s4.p': 'Register court: placeholder<br>Register number: placeholder<br>VAT identification number pursuant to § 27 a UStG: DE000000000 (placeholder)',
    'imp.s5.h': 'Responsible for content',
    'imp.s5.p': 'First name Last name (placeholder)<br>Address as above',
    'imp.s6.h': 'Dispute resolution',
    'imp.s6.p': 'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.',
    'imp.s7.h': 'Image credits',
    'imp.s7.p': 'The photographs are from Unsplash and used under the Unsplash licence. For production use the images should be downloaded, optimised and self-hosted.',

    /* --- privacy (Datenschutz) --- */
    'pri.title': 'Privacy policy — Veluma Studio Potsdam',
    'pri.desc': 'Privacy policy for Veluma Studio, Potsdam: what data is processed, which third-party services are embedded, and your rights. Demo site with placeholder details.',
    'pri.label': 'Privacy',
    'pri.h1': 'Privacy policy',
    'pri.lead': 'Information on the processing of personal data under Art. 13 GDPR. Every detail on this demo site is a placeholder.',
    'pri.sample': 'Placeholder text — replace it with a reviewed policy before going live',
    'pri.s1.h': 'Controller',
    'pri.s1.p': 'Veluma Studio GbR, Gutenbergstraße 12, 14467 Potsdam, Germany<br>Email: <a href="mailto:hallo@velumastudio.example">hallo@velumastudio.example</a>',
    'pri.s2.h': 'Server log files',
    'pri.s2.p': 'When the site is opened, your browser sends technically necessary data to the host, such as IP address, time, page requested and browser identifier. The legal basis is the legitimate interest in secure operation (Art. 6(1)(f) GDPR).',
    'pri.s3.h': 'Contact form',
    'pri.s3.p': 'We use the details entered in the form solely to answer your enquiry (Art. 6(1)(b) and (f) GDPR). In this demo version no data is transmitted or stored — the form only validates your input in the browser.',
    'pri.s4.h': 'Embedded third-party services',
    'pri.s4.p': 'This site loads fonts from Google Fonts, CSS from jsDelivr and photographs from Unsplash. Your IP address is transmitted to those providers in the process. For production use we recommend self-hosting the fonts, stylesheets and images so that this transfer no longer occurs.',
    'pri.s4b.h': 'Map display (OpenStreetMap)',
    'pri.s4b.p': 'The contact page embeds a map from OpenStreetMap. It is not loaded automatically: a connection to OpenStreetMap is only established — and your IP address only transmitted — once you explicitly click “Load map” (Art. 6(1)(a) GDPR). We store your consent locally in your browser so the map appears directly on later visits; you can withdraw it by clearing the site data.',
    'pri.s5.h': 'Local storage',
    'pri.s5.p': 'Your language choice (German or English) and your colour-scheme choice (light or dark) are kept in your browser’s local storage so that they survive a page change. These are technically necessary functions with no tracking; no cookies are set for analytics or advertising.',
    'pri.s6.h': 'Your rights',
    'pri.s6.p': 'You have the right to access, rectification, erasure, restriction of processing, data portability and objection. You may also lodge a complaint with a supervisory authority — for Brandenburg this is the State Commissioner for Data Protection and the Right to Inspect Files.'
  };

  /* ---------- Engine ------------------------------------------------------ */
  var snapshot = null;   /* authored German, captured from the DOM on load */

  function capture() {
    snapshot = { text: new Map(), html: new Map(), attr: new Map() };

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      snapshot.text.set(el, el.textContent);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      snapshot.html.set(el, el.innerHTML);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var store = {};
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var attr = pair.split(':')[0].trim();
        store[attr] = el.getAttribute(attr);
      });
      snapshot.attr.set(el, store);
    });
  }

  function stamp() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function apply(lang) {
    var toEnglish = lang === 'en';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (toEnglish) {
        if (Object.prototype.hasOwnProperty.call(EN, key)) el.textContent = EN[key];
      } else if (snapshot.text.has(el)) {
        el.textContent = snapshot.text.get(el);
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (toEnglish) {
        if (Object.prototype.hasOwnProperty.call(EN, key)) el.innerHTML = EN[key];
      } else if (snapshot.html.has(el)) {
        el.innerHTML = snapshot.html.get(el);
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var original = snapshot.attr.get(el) || {};
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length < 2) return;
        var attr = bits[0].trim();
        var key = bits.slice(1).join(':').trim();
        if (toEnglish) {
          if (Object.prototype.hasOwnProperty.call(EN, key)) el.setAttribute(attr, EN[key]);
        } else if (original[attr] != null) {
          el.setAttribute(attr, original[attr]);
        }
      });
    });

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
    });

    stamp();

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function resolve() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* older browser */ }
    if (q === 'de' || q === 'en') return q;
    try {
      var s = localStorage.getItem(STORE_KEY);
      if (s === 'de' || s === 'en') return s;
    } catch (e) { /* private mode */ }
    return DEFAULT_LANG;
  }

  function init() {
    capture();
    var lang = resolve();

    if (lang === DEFAULT_LANG) {
      stamp();
      document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
      });
    } else {
      apply(lang);
    }

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(btn.getAttribute('data-lang-btn'));
      });
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
