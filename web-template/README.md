# Local site template

One Next.js template that every client site is generated from. A new client is
**one config file plus their imagery** — no forking, no find-and-replace, and
the site's language is a config switch.

Built for the build-first-pitch-second model: make a redesigned demo of a local
business's site, show it to them on a phone, sell the retainer.

---

## Quick start

```bash
pnpm install
pnpm dev                 # http://localhost:3000 — whichever client is active
pnpm list-sites          # see which one that is
```

A whole new client:

```bash
pnpm new-site kirkstall-plumbing --hue 190 --accent 35
pnpm new-site activa --locale pl-PL --fonts bricolage-inter --hue 32 --accent 52
# fill in clients/<slug>/site.config.ts and clients/<slug>/imagery.json
pnpm dev
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server for the active client |
| `pnpm build` | Static export to `out/` |
| `pnpm new-site <slug>` | Scaffold a client: config, imagery manifest, placeholders, switch to it |
| `pnpm use-site <slug>` | Switch which client this checkout builds (also wires the font pairing) |
| `pnpm list-sites` | List clients, marking the active one |
| `pnpm imagery --slug <slug>` | Generate the client's imagery with Higgsfield, straight into the ladder |
| `pnpm optimize-images --slug <slug>` | Turn real photos in `clients/<slug>/source/` into the ladder |
| `pnpm gen-assets --slug <slug>` | On-brand abstract placeholders, so a demo builds before any imagery exists |
| `pnpm shoot` | Screenshot every route at 390px and 1440px into `.qa/` |
| `pnpm audit-site` | Lighthouse on every route, mobile + desktop. Fails under 90 |
| `pnpm check` | typecheck → build → audit |

## Design

Read `DESIGN.md` first. In one paragraph: light paper, one typeface (Archivo,
width axis for hierarchy), hairlines instead of cards, the brand colour
applied as rules, labels, links and one solid block, the accent on the phone
button only, drawn technical illustrations of the equipment until real
photography exists, and nothing that animates on scroll. It exists because
version one hit nearly every documented "this was generated" tell.

## The one file that matters

`clients/<slug>/site.config.ts` holds everything: business details, services,
areas, reviews, FAQs, hours, brand colour, section copy. The types in
`src/lib/types.ts` document every field, and the build **fails by name** if
something required is missing or a skeleton `__PLACEHOLDER__` is still there —
you cannot ship a site with a blank phone number or a headline that reads
`__HEADLINE__`.

`src/config/active.ts` is a single re-export naming the live client.
`pnpm use-site` rewrites it. Nothing else in the app imports a client config.

### Language

```ts
locale: 'pl-PL'   // or 'en-GB'
```

Every button, label, ARIA string, form message, fallback heading and legal
paragraph comes from `src/lib/i18n.ts` in that language. Client content is
whatever language you write it in. The phone prefix for `tel:` links, the
weekday names, `<html lang>` and the Open Graph locale all follow.

Components never hardcode English — they read `t` from `@/lib/site`. Adding a
language is one entry in `LOCALES`.

The privacy page is per-locale because the legal basis and regulator differ
(UK GDPR / ICO vs RODO / UODO). If a client adds analytics or booking, update
that locale's text — it is the transparency obligation, not decoration.

### Theming

The entire palette comes from four numbers:

```ts
brand: {
  hue: 224,        // OKLCH hue, 0–360. This alone re-themes the site.
  chroma: 0.13,    // 0.10 muted → 0.16 vivid
  accentHue: 38,   // the one emphasis colour
  radius: 0.625,   // corner radius in rem
  fonts: 'fraunces-inter',
}
```

They land as inline custom properties on `<html>`, and every colour token in
`globals.css` is derived from them in OKLCH. Change `hue` and the buttons,
shadows, greys, focus rings, glows and generated imagery all move together.

**Fonts** are a registry in `src/fonts/` because `next/font` needs static
imports. `brand.fonts` names a pairing; `pnpm use-site` rewrites the one-line
re-export in `src/config/fonts.ts` to match. Every pairing includes the
`latin-ext` subset — without it Polish diacritics fall back mid-word.

| Pairing | Feel |
| --- | --- |
| `archivo` | one family, condensed headlines, the default |
| `fraunces-inter` | serif display, warm |
| `bricolage-inter` | grotesk display, technical |

The design's `display` utility sets Archivo at 84% width and 700 weight; the
other pairings ignore the width axis and simply set heavier.

### Section copy

Section headings fall back to neutral sentences in the site's language, so a
minimal config still reads properly. Fill in `copy` to give a client their own
voice — that is what stops ten sites sounding identical. Wrap a fragment in
`*asterisks*` to render it in the accent style; it survives translation
because the emphasis travels with the string:

```ts
copy: { servicesTitle: 'Od hurtowni po *gotową instalację*' }
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

## Imagery

**Drawn until real.** Every frame a photograph would occupy — the hero panel,
the spotlight block, each service — takes either a `MediaAsset` or an
`illustration` key (`boiler`, `heatpump`, `radiator`, `underfloor`,
`cylinder`, `warehouse`, `van`, `tools`; see `src/components/illustration.tsx`).
The drawings are the site's imagery until photography exists; a blurred
placeholder never goes in front of a prospect. The gallery, its nav item and
its sitemap entry hide themselves while `gallery` is empty.

Three ways to get real images in, all ending in the same responsive ladder:

```
clients/<slug>/
  imagery.json        the manifest: every asset name the config references,
                      with a prompt for each                         (committed)
  source/             originals — client photos or generated masters (git-ignored)
public/clients/<slug>/
  hero.webp, hero-256.webp … hero-1920.webp     the ladder the site serves
```

1. **Higgsfield** — `pnpm imagery --slug <slug>`. Reads `imagery.json`, submits
   each prompt, polls to completion, saves the original to `source/`, builds
   the ladder, and crops the hero into `og.jpg`. Credentials come from the
   environment only:

   ```bash
   HIGGSFIELD_KEY="<key id>:<key secret>" pnpm imagery --slug activa
   # or put HIGGSFIELD_KEY=… in .env.local (git-ignored)
   ```

   `--only hero,about` regenerates a subset, `--force` overwrites existing
   originals, `--dry-run` prints the exact requests without spending credits.
   A `403` from the API means the account is out of credits, not bad auth.

2. **Client photos** — drop them in `clients/<slug>/source/`, then
   `pnpm optimize-images --slug <slug>`. 6 MB phone JPEGs are fine.

3. **Placeholders** — `pnpm gen-assets --slug <slug>` still writes abstract
   stand-ins for every name in `imagery.json`, for pipeline testing. They are
   not referenced by any config any more; use `illustration` keys instead.

Originals live outside `public/` on purpose: a static export copies `public/`
wholesale, so anything in there ships to the CDN.

The ladder widths appear in three places and must stay in step:
`scripts/lib/images.mjs`, `src/lib/image-loader.ts`, `next.config.ts`.

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
on performance, accessibility and best practices.

SEO reads ~66–69 on a demo build because it is deliberately noindex. That is
the correct result, and the audit script says so rather than letting it look
like a defect.

Four things keep the numbers there — be careful with all of them:

1. **The `<h1>` never fades in.** An element at `opacity: 0` does not count as
   painted, so fading a headline in over 0.9s delays LCP by 0.9s and costs
   about ten points. `animate-rise-lcp` moves it without fading it.
2. **`Reveal` only hides content below the fold.** Hiding everything in CSS and
   revealing on intersection means anything on screen at load is invisible
   until hydration — the same LCP problem, one second worse.
3. **Measure against a compressing server.** `pnpm audit-site` serves brotli,
   as real hosts do. Auditing an uncompressed build reports ~20 points low.
4. **Request only the font axes you use, and keep both fonts preloaded.**
   Bricolage with its width axis was 128 KB per subset; without it, half that.
   Two subsets × two fonts are preloaded before first paint, so every axis is
   paid for four times. But do not "save" bandwidth by un-preloading the body
   font: Polish text re-flows when it swaps in, and desktop CLS goes to 0.40.
5. **Audit on a quiet machine.** Lighthouse's mobile run throttles CPU 4×;
   a build or a grep running alongside reads as a ten-point regression.

## Layout

```
clients/               one folder per client, plus _template/
  demo-plumber/        the worked example (en-GB)
  activa/              first real lead (pl-PL)
scripts/               scaffolding, imagery pipeline, QA
src/
  app/                 routes — home, services, areas, about, gallery,
                       contact, privacy, sitemap, robots
  components/
    illustration.tsx   the drawn equipment
    layout/            header, footer, mobile call bar, demo banner
    sections/          hero, facts, services, spotlight, process, about,
                       reviews, areas, gallery, faq, cta, contact
    ui/                button, accordion, form fields
  config/              active client + font pairing (both rewritten by use-site)
  fonts/               the pairing registry
  lib/                 types, config loader/validator, i18n, SEO + JSON-LD
```

Structured data is emitted per page: `LocalBusiness` (or the subtype in
`business.type`) with NAP, hours, geo and area served; `Service` on service
and area pages; `FAQPage` on the homepage; `BreadcrumbList` everywhere. An
aggregate rating is only emitted when real reviews back it, because a rating
without them can earn a manual action.
