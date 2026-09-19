# Decisions log

Calls made while building the master template and the first client demo, and
the ones still waiting on Oskar. Handoff rule: make sensible calls, log them,
keep moving.

---

## The redesign

Oskar's verdict on version one: "looks like a Claude website." He was right,
and `DESIGN.md` §1 lists the evidence — dark theme, glows, icon-card grids,
italic accent words, scroll fades, gradient placeholders. The visual layer
was rewritten; the architecture (config-driven, i18n, static export,
Lighthouse gate, Higgsfield pipeline) was sound and stayed.

| Decision | Reasoning |
| --- | --- |
| **Light paper, brand colour applied not ambient** | The dark theme is the single most common tell. Good trades sites are light; the brand blue does its work as rules, labels, links and one solid block. |
| **Archivo alone, width axis for hierarchy** | One family removes the "display + Inter" recipe. Condensed heavy headlines read as signage — Activa's building has a painted sign. Body at normal width. |
| **Hairlines, not cards** | Services are an index; steps are numbered and ruled; facts sit in a ruled strip. Nothing has a 1 px grey border and a shadow. |
| **Drawn equipment, not blurred blobs** | Every photographic source is blocked here, and a gradient smear in front of a prospect is worse than nothing. Eight line drawings of the actual kit are a deliberate visual language; they occupy the frames photographs will. |
| **Gallery hides itself when empty** | Same reason. The nav item and sitemap entry go with it. |
| **No scroll animation** | A tell, and the earlier LCP investigation showed the reveal component cost more than it gave. Deleted, not disabled. |
| **Contact on the homepage** | The trade's own convention: the form is never a click away. |
| **Facts strip under the hero** | "Od 1991 roku · Harcerska 2 · Pon–Pt 7:30–16:00 · 4,2 w Google" — the trust layer as text, which is what the conversion research says works. |

The plumber demo moved onto the same design and runs on illustrations too.

---

## Activa — first lead (Szczecinek, Poland)

**Why this one is a good first target.** Their live domain,
`activa-szczecinek.pl`, serves an unconfigured default WordPress theme — the
"My Store / Études" placeholder. Under the handoff's own scoring that is not a
bad website, it is no website: the hottest kind of lead.

**What is verified** (KRS/REGON, Panorama Firm, pkt.pl, zimno-cieplo.pl):
trading name *Activa. Technika grzewcza*, legal entity *Activa Józef Czebotar
s.c.* (Józef, Irena, Maciej Czebotar, Aneta Dubas), founded 1991, ul. Harcerska
2, 78-400 Szczecinek, tel. 94 374 11 32, info@activa-szczecinek.pl, Mon–Fri
07:30–16:00, Sat 08:00–13:00. Registered activity: wholesale and production
of heating equipment, plus sanitary equipment. A sibling *Activa Sp. z o.o.*
(2019) does building-materials wholesale at the same address.

**What is inferred and marked `[VERIFY]` in the config** — the intake
questions for the first conversation:

| Assumption | Why it matters |
| --- | --- |
| They install and service, not only sell | The registers prove selling; "technika grzewcza" firms normally fit too, but the whole service list rests on it |
| The six services listed | Boilers, heat pumps, underfloor, sanitary, wholesale, service — a sensible set for the trade, not their catalogue |
| The eight areas | Powiat szczecinecki plus neighbouring towns a Szczecinek firm would plausibly cover |
| Geo coordinates | Town centre, approximate |
| Gallery captions | The imagery is generated; the captions name plausible jobs, not real ones |

**Corrected by a screenshot of their Google panel.** The web search only
reached directory sites, which carry no reviews; Google itself shows
**4.2★ from 32 reviews** and lists them as an *HVAC contractor*, which
supports the install-and-service side of the offer. The panel also shows
their logo — a mid-blue wordmark — and that the profile has no opening
hours and a hostel's banner as its lead photo. Lesson: for a lead, look at
the Google panel first; it beats every directory.

**Deliberately absent.** No prices — putting numbers in a real company's
mouth before speaking to them is how a warm lead goes cold. No review texts
and no rating schema — the texts are not ours to reproduce, and the
validator refuses an aggregate rating without visible reviews. The 4.2★ is
shown in the hero as a link to Google (`googleRating`, visible text only).
Transcribing the best reviews with the owner at intake unlocks the reviews
section and the schema. No emergency line, no WhatsApp — not advertised.

**Brand.** Their blue (hue 248, chroma 0.15) with a hot amber accent (hue 55):
the owner should see their own company on the screen, and blue/orange is the
complementary pair, so the calls-to-action carry the heat cue at maximum
contrast. A first pass in warm charcoal looked good and was wrong — it was a
designer's palette, not theirs. Bricolage Grotesque + Inter: a heating-tech
wholesaler reads modern and technical, where the plumber read established and
warm.

**GBP tidy-up, the add-on from the handoff, is concrete here:** add hours,
replace the lead photo, link the website, respond to reviews.

**Where to show it.** Live at **https://activa-szczecinek.vercel.app** — Oskar
asked for Vercel, so the static export in `out/` was deployed there directly
rather than to Cloudflare Pages; open decision 2 below is still open for the
agency as a whole. Demo mode on, 30-day expiry set, `noindex` and a blocking
`robots.txt` verified on the live URL. Vercel's SSO protection covers the
deployment URLs and the `-editx` alias, but the production alias is public to
anyone with the link, which is what showing it on a phone needs. Delete the
project if the lead goes cold. Nothing of theirs is used beyond public listing
data — no logo, no photography.

---

## Going live on the client's own hosting

Activa said yes, so the demo becomes their site. Their domain has the trap
that catches most of these migrations:

```
activa-szczecinek.pl   A    195.128.154.18      (hostingrd.pl, WordPress)
activa-szczecinek.pl   MX   activa-szczecinek.pl
```

The mail exchanger **is the domain**, so repointing the A record at a preview
host would have stopped `info@activa-szczecinek.pl` from receiving anything,
the same afternoon, with nothing in the panel to explain it. Splitting them
first (`mail.<domain>` A at the current host, MX at that name, a day to
propagate) is the fix wherever DNS has to move.

It does not have to move here. Oskar's call: upload the static export to the
hosting Activa already pays for, in place of the WordPress default. Nothing in
DNS changes, the mail keeps working, and the hosting is already bought. So
`pnpm deploy-ftp` exists:

- FTPS, credentials from `.env.local` only
- generates `.htaccess` from the build — `DirectoryIndex index.html` ahead of
  any leftover `index.php` (otherwise the old WordPress keeps winning),
  `mod_deflate` (the compression finding below is worth ~20 points), immutable
  caching for `/_next/static`, revalidating for HTML, canonical host and HTTPS
  redirects derived from `seo.baseUrl`
- **refuses to upload a demo build** unless `--allow-demo` is passed. A
  `noindex` page on a client's real domain is the expensive kind of mistake,
  so the rule is in code, like the rest of demo safety
- overwrites and adds, never deletes: clearing a web root over FTP is a
  destructive operation worth doing by hand, after a backup

`seo.baseUrl` moved to `https://activa-szczecinek.pl` — it drives canonical
tags, OG URLs and the sitemap, so it has to be the real domain before the
first indexed build.

**Still open before the files go up:** the six `[VERIFY]` items (they are
statements about a real company, and nobody has confirmed them), and
`forms.endpoint`, which is deliberately empty — on a live site that form tells
visitors it is a preview instead of delivering their enquiry.

---

## Higgsfield imagery

**The API was egress-blocked when this was built** — `api.higgsfield.ai`
answered 403 at the proxy, an organisation policy denial, not a network fault.
Switching the environment to full network access fixed it: the endpoint now
answers `401 Invalid credentials`, so only the key is missing. What was built
while it was blocked:

- `scripts/higgsfield.mjs` — the full pipeline, written against the official
  SDK source (`higgsfield-ai/higgsfield-js`, fetched from
  raw.githubusercontent.com, which is reachable) rather than a blog post.
  Submit → poll `/requests/{id}/status` → download → ladder → OG crop.
  `--dry-run` was used to verify every request it would send.
- `clients/activa/imagery.json` — twelve prompts, one per asset the config
  references. Dark, warm, no people, no text, matching how the hero is
  composited.

**Run it from a machine that can reach the API:**
`HIGGSFIELD_KEY="<id>:<secret>" pnpm imagery --slug activa`. Roughly twelve
generations at 2K; a `403` mid-run means credits ran out.

**Model.** `bytedance/seedream/v4/text-to-image` by default — photoreal,
simple parameters (`resolution`, `aspect_ratio`), good with architectural
interiors. Soul is tuned for fashion and portraits. Per-client override is one
line in `imagery.json`.

**The key was pasted into chat.** It was stored only in the session's
scratchpad (mode 600), never written under the repo, and never sent to any
service from here. It does now exist in a conversation transcript, so **rotate
it in Higgsfield Cloud once the Activa imagery has been generated.**

---

## Localisation

A strings layer (`src/lib/i18n.ts`) rather than a Polish fork of the
template. Every chrome string — buttons, ARIA, form messages, fallback
headings, meta descriptions, the privacy notice — is keyed per locale;
client content stays in the config in whatever language it is written.

Three things that only became visible with a second language:

- **`tel:` links assumed the UK.** `0113…` → `+44113…` dropped the trunk zero;
  Polish numbers have no trunk prefix. The country now comes from the locale
  (or `contact.phoneCountry`), and only `+44` strips a leading zero.
- **Functions cannot cross the server→client boundary.** `t.form.sentBody` is
  a function; passing the strings object into the client-side form crashed
  the build. Resolved to a string before it is handed over.
- **`*asterisk*` emphasis has to be applied centrally.** Two headings rendered
  literal asterisks because their sections passed a plain string. `SectionHeading`
  now runs every string title through `Highlight`; the emphasis convention
  survives translation because it travels inside the string.

---

## Font registry and the width axis

Pairings live in `src/fonts/` and the config names one in `brand.fonts`;
`pnpm use-site` rewrites the re-export because `next/font` needs a static
import. All pairings include `latin-ext`.

Bricolage Grotesque was first requested with its `opsz` and `wdth` axes. The
width axis roughly doubles the outline data — 128 KB for one subset — and
nothing uses `font-stretch`. With two subsets of two fonts preloaded before
first paint, that axis was being paid for on every page load. Dropped:
310 KB of preloaded fonts became 234 KB.

**Tried and reverted: not preloading the body font.** The idea was to let the
hero image win the bandwidth race on a throttled phone. The homepage did not
measurably move (clean runs were 99 either way — an 88 in between coincided
with a concurrent job in the container, and Lighthouse's 4× CPU throttle
makes any background load look like a regression). What did move was every
service page on desktop: 98 → 84, CLS 0.40. The Polish paragraphs paint in
the size-adjusted fallback and re-flow when Inter arrives; the adjustment is
not close enough for diacritics and long compounds. Both fonts stay
preloaded.

**Measurement discipline.** Run the audit alone. A single low reading is not a
regression until it repeats on a quiet machine.

---

## Client originals moved out of `public/`

`optimize-images` first read from `public/clients/<slug>/_source/`. A static
export copies `public/` wholesale, so a client's 6 MB originals would have
shipped to the CDN on every deploy. Originals now live in
`clients/<slug>/source/`, git-ignored; only the ladder is committed and served.

---

## Open — need Oskar

| # | Decision | Why it is blocking | Default in place |
| --- | --- | --- | --- |
| 1 | **Which niche first?** | Only affects niche-specific *copy*, not the template. The demo is a plumber because the handoff named one. | Trades. Swap by writing a new config — the template is niche-agnostic. |
| 2 | **Cloudflare Pages or Vercel Pro?** | Changes the build mode and the cost per site. | Cloudflare Pages. The build is a static export by default; `SITE_MODE=server` switches it. |
| 3 | **Agency brand name, and does it trade under the existing Ltd?** | Nothing in the template depends on it. Needed before any outreach. | Not set. |
| 4 | **Final price points** | Demo config shows illustrative prices for a *plumber's* services, not agency pricing. | Handoff range used as-is. |

None of these blocked the build. Answer them when convenient.

---

## Where the code lives

**The template is in `web-template/` inside the `editor-app` repo.**

The handoff assumed a fresh repo. The only repo in scope for this session is
`spirit358/editor-app`, which holds the unrelated EDITOR fashion app. Rather
than stall or mix two products together, the template is a **self-contained
directory** with its own `package.json`, lockfile and `node_modules` — nothing
is shared with the fashion app.

Lifting it into its own repo later is a move and a commit, nothing more. Worth
doing before the first paying client.

The handoff also said to save itself as `CLAUDE.md` in the repo root. It is at
`web-template/CLAUDE.md` instead — a root `CLAUDE.md` would apply its
instructions to the fashion app as well.

---

## Stack

| Decision | Reasoning |
| --- | --- |
| **Next.js 15**, not 16 | The handoff specified 15 and it is the known-good stack. Next 16 is out; upgrading is a version bump and a test run, not a rewrite. Worth doing deliberately, not by accident. |
| **Static export by default** | No server means it deploys free anywhere, has nothing to patch, and cannot be knocked over. It is also what makes Cloudflare Pages' free commercial tier viable, which is the difference between ~£0 and £20/month per site. |
| **Tailwind v4, CSS-first** | The OKLCH token system needs `@theme` and runtime custom properties. A single `--brand-h` driving a whole palette is not practical in the v3 config format. |
| **shadcn-style primitives, hand-written** | Only five primitives were needed. `components.json` is present so `npx shadcn add` works later. |
| **No animation library** | Motion was in the brief, but every animation here is two CSS properties. Shipping ~30kb of JavaScript to fade things in directly costs the Lighthouse score that is in the definition of done. Section reveals use one shared IntersectionObserver, ~50 lines. Add Motion later if something genuinely needs spring physics or gestures. |
| **Radix only for the accordion** | Keyboard handling and ARIA on a disclosure widget are worth a dependency. Nothing else needed one. |
| **Form posts to a third-party endpoint** | Keeps the site fully static. Web3Forms / Formspree / an n8n webhook all work. An empty endpoint makes the form say it is a preview rather than silently dropping enquiries — a demo that eats a real customer's message is worse than no form. |

---

## Design

| Decision | Reasoning |
| --- | --- |
| **Four numbers drive the palette** | `hue`, `chroma`, `accentHue`, `radius`. Hand-tuned OKLCH ramp where chroma peaks mid-scale, like pigment — flat-chroma ramps are what make generated palettes look synthetic. Neutrals carry a trace of the brand hue so greys never look dead. |
| **Fraunces + Inter** | A serif display face reads established and family-run, which is what a trades business is selling. A geometric sans would look like every other AI-built site. Four alternative pairings are listed in `src/config/fonts.ts`. |
| **Copper accent against navy** | Warm/cool contrast, and it happens to suit pipework. Italic copper is the site's single emphasis gesture, set in the hero and repeated in every section heading. |
| **Dark band on every page** | Each page opens with the same dark hero, so the site has one consistent top edge and the transparent header always has something to sit on. |
| **Section copy in the config** | Headings started out hardcoded with plumbing jokes. Anything niche-specific now lives in `copy` with neutral fallbacks — otherwise the tenth client site reads exactly like the first. |

---

## Performance findings

Three things mattered far more than expected. All three are documented in the
README because they are easy to undo by accident.

1. **Fading the `<h1>` in cost ~10 Lighthouse points.** An element at
   `opacity: 0` is not "painted", so an 0.9s fade postpones LCP by 0.9s.
   `animate-rise-lcp` animates transform only.
2. **Hiding above-the-fold content for scroll reveals cost more.** The usual
   pattern — hide in CSS, reveal on intersection — leaves anything on screen at
   load invisible until hydration. `Reveal` now starts visible and arms only
   what is below the fold.
3. **Auditing against an uncompressed server reported ~20 points low.** Mobile
   read 76 before compression and 98–99 after, with no code change. `pnpm
   audit-site` serves brotli, as every real host does.

Also: responsive image variants are generated at build time because static
hosting has no optimiser at request time. Without them a phone downloads the
1920px hero.

Result across all 20 routes, mobile and desktop: **performance 96–99,
accessibility 100, best practices 100.**

---

## Demo safety

The handoff's rule — never publish an indexed site under a business's name
before they agree — is enforced in code rather than left to memory:

- `demo.enabled` defaults to `true` for every new site
- demo builds emit `noindex, nofollow`, a blocking `robots.txt` and an empty sitemap
- the preview banner names the business and shows an expiry date
- `new-site` sets that expiry 30 days out automatically

The demo client is fictional: **Vale Street Plumbing & Heating**, with a phone
number from Ofcom's `0113 496 0xxx` range, which is reserved for drama and
demos and cannot ring a real person.
