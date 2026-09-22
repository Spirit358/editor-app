# Design direction

Why the first version looked generated, what good sites in this trade actually
do, and the rules the rebuild follows. Read this before touching the visual
layer.

---

## 1. The honest audit of version one

Research into "how to spot an AI-generated site" turns up a consistent list
of fingerprints. Version one hit almost all of them:

| Documented tell | Version one |
| --- | --- |
| Permanent dark theme (the single most common tell, ~34% of generated pages) | Dark hero on every page, dark bands between sections, dark footer |
| Gradient / radial-glow backgrounds | Two radial glows on every dark band, plus a "grain" overlay |
| Row of three icon-cards with rounded corners and 1 px borders | The services grid, the areas grid, the stats row |
| Oversized headline with one italic accent word | Every hero and every section heading |
| Giant rounded corners, soft shadows, glass panels | The "What you get" card, the CTA panel, the review cards |
| Inter for headlines | Inter for body, a "distinctive" display face on top — the same recipe |
| Reveal-on-scroll fade-ups on everything | `Reveal` on every section |
| Placeholder gradient blobs where photographs should be | Every image |

None of these are wrong in isolation. Together they are the statistical
average of a training set, and a business owner in Szczecinek has seen that
average a hundred times this year.

Sources: [The Fountain Institute — 7 signs a UI has been vibe coded](https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui) · [925 Studios — AI slop fonts and gradients](https://www.925studios.co/blog/ai-slop-design-tells) · [Developers Digest — 16 patterns that out your app](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it) · [Laith Junaidy — 9 visible signs](https://uxskill.laithjunaidy.com/how-to-tell-if-a-website-was-ai-generated.html)

## 2. What good sites in this trade do

Across the HVAC / heating / plumbing round-ups and the service-business
conversion guides, the same things keep winning — and they are not visual
flourishes:

- **The phone number and the address are on every screen.** Sites with a
  visible number convert ~54% more leads; NAP in header and footer signals a
  real business at a real premises.
- **Proof before polish.** Review count and score, years trading, real photos
  of the team and the premises. One authentic photo of the actual workshop
  outperforms ten stock images — and generic stock actively signals "nothing
  real to show".
- **Light pages, one brand colour, one warm accent.** Blue and orange is the
  category's own vocabulary (cool/heat). Dark themes read as "tech startup",
  not "heating engineer".
- **Services as a clear list**, each with its own page; service-area pages
  so a visitor can see they are covered. Less content than owners think,
  better organised than they usually make it.
- **Two-click contact.** Phone in the header, a short form, hours shown.
- **Product literacy.** The manufacturers (Viessmann, Vaillant, Bosch)
  present a reduced, uncluttered look with generous surfaces and the
  equipment photographed cleanly in real rooms. Installers who look credible
  borrow that restraint rather than adding decoration.

Sources: [ServiceTitan — best HVAC websites](https://www.servicetitan.com/blog/hvac-websites) · [Hook Agency — HVAC](https://hookagency.com/blog/hvac-websites/) and [plumbing](https://hookagency.com/blog/plumbing-websites/) · [WebFX — 21 plumbing sites](https://www.webfx.com/blog/home-services/plumber-website-examples/) · [Jobber — plumbing site design](https://www.getjobber.com/academy/plumbing/best-plumbing-websites-designs/) · [Verlua — trust-signal checklist](https://www.verlua.com/blog/website-trust-signals-convert-visitors) · [Palmer Creative — trust signals](https://palmercreative.co/blog/website-trust-signals-that-make-people-contact-you) · [Wilco — local business web design](https://wilcowebservices.com/web-design-for-local-businesses/) · [iF Design — Viessmann product programme](https://ifdesign.com/en/winner-ranking/project/viessmann-produktprogramm/128745)

## 3. Typography numbers the rebuild uses

- Modular scale, base 16 px, ratio 1.25: 16 / 20 / 25 / 31 / 39 / 49 / 61 / 76.
- Body line-height 1.5; headings 1.0–1.1 and tight tracking; large numerals
  at 0.95.
- Measure 60–75 characters: every paragraph is capped at `68ch`.
- One family, hierarchy by size, weight and **width** — not by mixing faces.

Sources: [Typography Handbook](https://typographyhandbook.com/) · [Bamboo — line height and type scales](https://www.bamboomanchester.uk/a-web-designers-guide-to-line-height/) · [designsystems.com — typography guides](https://www.designsystems.com/typography-guides/)

## 4. The direction: a technical catalogue

Activa is a wholesaler and installer whose building carries a painted sign
reading *HURTOWNIA MATERIAŁÓW INSTALACYJNYCH*. The site should feel like the
best version of that: a clear, literate trade catalogue. Confident, plain,
product-aware. Not a startup landing page.

**Paper, not dark.** Warm off-white pages. The brand blue is structural —
rules, labels, links, one solid block — never a gradient. The orange accent
appears on exactly one thing: the phone button.

**One typeface, Archivo,** using its width axis: condensed and heavy for
headlines (signage), normal width for reading. Numbers are tabular. No
italic accent words.

**Hairlines, not cards.** A 12-column grid with 1 px rules. Services are an
index list, not a grid of tiles. Facts sit in a single ruled strip. Steps
are numbered 01–04 with rules between them.

**Drawn, not blurred.** Until real photography exists, the imagery is a set
of technical line illustrations of the actual equipment — wall-hung boiler,
heat-pump unit, panel radiator, underfloor manifold, cylinder, warehouse
shelving. Deliberate, on-brand, crisp at any size, a few kilobytes. They
occupy the same frames a photograph will, so `pnpm imagery` swaps them out
without a layout change.

**No motion.** Nothing fades in on scroll. Links underline on hover. That
is all.

**Proof in the first screen.** Founded year, address, hours, Google rating —
as a ruled strip of facts under the hero, not as badges.

## 5. Rules for every client on this template

1. Light page. The brand colour is applied, not ambient.
2. No gradients, no glows, no grain, no glass.
3. No cards for content that is a list. Rules and whitespace.
4. One family; hierarchy by size, weight, width.
5. Real photography as soon as it exists; drawn illustrations until then;
   never a blurred placeholder in front of a prospect.
6. Phone number and address in the header and footer on every page.
7. Facts over adjectives. "Od 1991" beats "doświadczony zespół".
8. Nothing animates on scroll. (One exception: the header slides away on
   scroll down and back on scroll up — `DECISIONS.md`.)

## 6. What this environment could not do

Higgsfield, every stock-photo host and every reference site are blocked by
this session's egress policy. The critique above is built from search
summaries and documented patterns, not from opening the sites. The imagery
pipeline is written and dry-run verified; it needs one command from a machine
that can reach the API: `HIGGSFIELD_KEY="id:secret" pnpm imagery --slug activa`.
