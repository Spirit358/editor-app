# Local site template

One Next.js template that every client site is generated from. A new client is
**one config file plus their photos** — no forking, no find-and-replace.

Built for the build-first-pitch-second model: make a redesigned demo of a local
business's site, show it to them on a phone, sell the retainer.

---

## Quick start

```bash
pnpm install
pnpm dev                 # http://localhost:3000 — the demo plumber
```

A whole new client:

```bash
pnpm new-site kirkstall-plumbing --hue 190 --accent 35
# fill in clients/kirkstall-plumbing/site.config.ts
pnpm dev
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server for the active client |
| `pnpm build` | Static export to `out/` |
| `pnpm new-site <slug>` | Scaffold a client: config + placeholder assets + switch to it |
| `pnpm use-site <slug>` | Switch which client this checkout builds |
| `pnpm list-sites` | List clients, marking the active one |
| `pnpm gen-assets --slug <slug>` | Regenerate on-brand placeholder imagery |
| `pnpm optimize-images --slug <slug>` | Turn real photos into the responsive ladder |
| `pnpm shoot` | Screenshot every route at 390px and 1440px into `.qa/` |
| `pnpm audit-site` | Lighthouse on every route, mobile + desktop. Fails under 90 |
| `pnpm check` | typecheck → build → audit |

## The one file that matters

`clients/<slug>/site.config.ts` holds everything: business details, services,
areas, reviews, FAQs, hours, brand colour, section copy. The types in
`src/lib/types.ts` document every field, and the build **fails by name** if
something required is missing — you cannot ship a site with a blank phone
number.

`src/config/active.ts` is a single re-export naming the live client.
`pnpm use-site` rewrites it. Nothing else in the app imports a client config.

### Theming

The entire palette comes from four numbers:

```ts
brand: {
  hue: 224,        // OKLCH hue, 0–360. This alone re-themes the site.
  chroma: 0.13,    // 0.10 muted → 0.16 vivid
  accentHue: 38,   // the one emphasis colour
  radius: 0.625,   // corner radius in rem
}
```

They land as inline custom properties on `<html>`, and every colour token in
`globals.css` is derived from them in OKLCH. Change `hue` and the buttons,
shadows, greys, focus rings, glows and generated imagery all move together.

Fonts are the exception — `next/font` needs static imports, so the pairing
lives in `src/config/fonts.ts` with tested alternatives listed in a comment.

### Section copy

Section headings fall back to neutral sentences built from the business
details, so a minimal config still reads properly. Fill in `copy` to give a
client their own voice — that is what stops ten sites sounding identical.
Wrap a fragment in `*asterisks*` to render it in the accent style:

```ts
copy: { servicesTitle: 'Everything from a dripping tap to a *full heating system*' }
```

## Demo mode

`demo.enabled: true` (the default for a new site) means:

- `noindex, nofollow` on every page
- `robots.txt` disallows everything
- empty `sitemap.xml`
- a "Preview prepared for X" bar above the header, with an expiry date

**Never turn this off before the client has agreed.** Publishing an indexed
site under a business's name and branding without their say-so is the one
thing that turns a clever pitch into a problem.

Flip it off only once they have signed, and set `forms.endpoint` at the same
time — the form deliberately refuses to pretend it sent something while the
endpoint is blank.

## Images

Static hosting has no image optimiser at request time, so every size is built
up front:

```
public/clients/<slug>/
  _source/            originals the client sent (not deployed)
  hero.webp           full size
  hero-256.webp … hero-1920.webp    the responsive ladder
```

`pnpm optimize-images --slug <slug>` builds the ladder from `_source/`.
`src/lib/image-loader.ts` points `next/image` at the right rung. Reference
images by the **base name** only; the loader handles the rest.

The ladder widths appear in three places and must stay in step:
`scripts/lib/images.mjs`, `src/lib/image-loader.ts`, `next.config.ts`.

Placeholder imagery from `pnpm gen-assets` is abstract and on-brand so a demo
can be built before any photography exists. **Replace it before going live.**

## Deploying

Default is a static export — `out/` is a plain folder of files.

**Cloudflare Pages** (the default: free tier permits commercial use)

```
Build command:     pnpm build
Output directory:  out
```

**Vercel** requires a Pro plan for client work — the Hobby tier forbids
commercial use. If you go that way, `SITE_MODE=server pnpm build` keeps the
Node server and the built-in image optimiser.

Point the preview at an unguessable subdomain while the site is a demo.

## Quality bar

`pnpm audit-site` is the gate. Every route, mobile and desktop, must be at 90+
on performance, accessibility and best practices. The demo plumber currently
runs 96–99 performance and 100 across the rest.

SEO reads ~66–69 on a demo build because it is deliberately noindex. That is
the correct result, and the audit script says so rather than letting it look
like a defect.

Three things keep the numbers there — be careful with all of them:

1. **The `<h1>` never fades in.** An element at `opacity: 0` does not count as
   painted, so fading a headline in over 0.9s delays LCP by 0.9s and costs
   about ten points. `animate-rise-lcp` moves it without fading it.
2. **`Reveal` only hides content below the fold.** Hiding everything in CSS and
   revealing on intersection means anything on screen at load is invisible
   until hydration — the same LCP problem, one second worse.
3. **Measure against a compressing server.** `pnpm audit-site` serves brotli,
   as real hosts do. Auditing an uncompressed build reports ~20 points low.

## Layout

```
clients/               one folder per client, plus _template/
  demo-plumber/        the worked example
scripts/               scaffolding, image pipeline, QA
src/
  app/                 routes — home, services, areas, about, gallery,
                       contact, privacy, sitemap, robots
  components/
    layout/            header, footer, mobile call bar, demo banner
    sections/          hero, services, about, reviews, areas, gallery,
                       faq, cta, contact
    ui/                button, card, badge, accordion, form fields
  config/              active client + fonts
  lib/                 types, config loader/validator, SEO + JSON-LD
```

Structured data is emitted per page: `LocalBusiness` with NAP, hours, geo and
area served; `Service` on service and area pages; `FAQPage` on the homepage;
`BreadcrumbList` everywhere. An aggregate rating is only emitted when real
reviews back it, because a rating without them can earn a manual action.
