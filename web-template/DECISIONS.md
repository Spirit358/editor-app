# Decisions log

Calls made while building the master template, and the ones still waiting on
Oskar. Handoff rule: make sensible calls, log them, keep moving.

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
