# Decisions log

Calls made while building the master template and the first client demo, and
the ones still waiting on Oskar. Handoff rule: make sensible calls, log them,
keep moving.

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

**Deliberately absent.** No prices — putting numbers in a real company's
mouth before speaking to them is how a warm lead goes cold. No reviews and no
rating — none exist online, and the validator would refuse a rating without
them anyway. The reviews section and the "Opinie" nav item hide themselves.
No emergency line, no WhatsApp — not advertised anywhere. The Google Business
Profile tidy-up is part of the pitch, not something to fake in the demo.

**Brand.** Warm charcoal (hue 32, chroma 0.07) with a flame-amber accent (hue
52, chroma 0.16): heat without the fire-engine red every heating site reaches
for. Bricolage Grotesque + Inter — a heating-tech wholesaler reads modern and
technical, where the plumber read established and warm.

**Where to show it.** `activa-szczecinek.pages.dev` as the preview host; demo
mode on, 30-day expiry set. Nothing of theirs is used beyond public listing
data — no logo, no photography.

---

## Higgsfield imagery

**The API is egress-blocked in this build environment** — `api.higgsfield.ai`
answers 403 at the proxy, an organisation policy denial, not a network fault.
So the generation could not be run from here. What was built instead:

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
