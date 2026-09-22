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

**The form now posts to PHP on their own server.** `forms.endpoint` was
deliberately empty, which on a live site means a visitor who submits is told
the form is a preview — a defect, not a safeguard, once the site is real.
Their hosting runs PHP (WordPress was on it), so `deploy-ftp` generates
`form.php` beside the site and mails straight to `info@activa-szczecinek.pl`.
No third-party form service, no monthly fee, nothing leaves their server, and
mail sent from that host already passes their SPF record, which names that
same IP. Honeypot, length caps, header-injection stripping, a 20-second
per-IP throttle that only counts submissions actually being sent, and a
failure log written **outside the web root** — it holds names, phone numbers
and email addresses, and in the web root anyone who guessed the filename
could download it.

**Demo mode is off.** Activa agreed, so `demo.enabled: false`: the banner,
the `noindex` and the blocking `robots.txt` are gone and the sitemap has all
20 routes. Turning it off exposed a latent bug — the sitemap emitted URLs
without the trailing slash the static export serves, so every entry but the
homepage pointed at a 301 to its own canonical form. Next adds that slash to
canonical tags but not to sitemap entries handed to it.

**Knowingly shipped unverified:** the six `[VERIFY]` items are still
assumptions — that they install and service rather than only sell, the six
services, the eight areas, the map coordinates. Oskar's call to publish
without confirming them. They remain the agenda for the first conversation,
and each one is a sentence on a real company's live site until then.

---

## The chat assistant

Oskar's brief lists a chatbot among the retainer add-ons, and asked for one
"that does not cost millions to run". The research first, then what was built.

**What the research said.** Reddit could not be read from this environment
(fetches refused, and the search engine does not index its threads), so the
Reddit half of the ask is unmet; GitHub and the primary sources were enough.
The freeCodeCamp Cloudflare Workers widget tutorial is the canonical
"embed a chatbot" recipe: script-tag injection, SSE streaming, KV sessions,
`Access-Control-Allow-Origin: *` and no rate limiting — the last two are
exactly what an unattended endpoint on a small business's site must not do.
DebugBear measured 21 commercial chat widgets at 67–749 KB and 259–1000 ms of
main-thread time; the only ones that stay cheap defer nearly everything until
the visitor opens the chat. `deftio/quikchat` shows a complete widget fits in
5 KB gzipped with no dependencies. `RumenDamyanov/php-chatbot` and
`benwills/SimpleGptApiReq` confirm the PHP-on-shared-hosting pattern is
ordinary (Composer for the first, one curl call for the second). Cloudflare's
rate-limit binding is per-colo and eventually consistent, with 10 s or 60 s
windows only, and its free-plan availability is not documented. And the
incidents every thread cites — Cursor's support bot inventing a device
policy, Air Canada's bot inventing a refund policy, Klarna walking back its
all-AI support — all have one shape: the retrieval found nothing, and the
model filled the gap with something plausible.

| Decision | Reasoning |
| --- | --- |
| **The model is the third layer, not the first** | Hours, address, phone, areas and services are quick replies answered from `/chatbot.json` in the browser; a typed question is matched against intent patterns and the FAQ before anything is sent. On a trades site that is most of the traffic, at zero cost and zero hallucination risk. |
| **Price questions never reach the model** | The widget intercepts `cen`/`koszt`/`price`/`cost` and answers with the hand-off line. Putting a number in a real company's mouth is how a warm lead goes cold (the same rule the site follows), and the Cursor and Air Canada incidents are the cautionary tales. The system prompt repeats the rule for anything that slips through. |
| **One knowledge file for widget and server** | `/chatbot.json` is written by the build from `site.config.ts`; `chat.php` reads the same file from disk. The model cannot know what the page does not say, and a retainer edit updates the assistant on the next deploy with no change to the PHP. |
| **PHP on the client's own hosting, not a Worker** | The site already deploys there by FTP with a generated `form.php`; the assistant is the same shape. No second platform to run, no CORS, no shared key across clients — one key per client makes the console show spend per client. A Worker wins on streaming and on shared rate limiting, and the widget posts to a configurable `endpoint`, so that swap is one line if it is ever wanted. |
| **Raw HTTP, not the official PHP SDK** | The SDK is a Composer package; this file reaches the server by FTP with no Composer on either end. One documented curl call is a smaller risk than vendoring a dependency tree onto shared hosting. |
| **Claude Haiku 4.5 by default** | $1 / $5 per million tokens. The measured Activa system prompt is under 1,200 characters; a call is ~800 tokens in, ~60 out — a fraction of a cent. Prompt caching would not apply (Haiku's minimum cacheable prefix is 4,096 tokens) and does not need to. `CHATBOT_MODEL` changes it; if answer quality ever matters more than cost, Sonnet 5 is the next step up. |
| **Hard limits in the handler, not in the prompt** | Origin must be the site's host (nobody else's page can spend this key); 8 turns of 500 characters; 6 calls a minute and 40 a day per visitor; a site-wide daily cap after which the widget hands off to the phone. A bill has a ceiling before anyone reads a dashboard. |
| **Secrets above the web root, usage below the radar** | `.chat-secret.php` is written one directory up by the deploy, and is PHP that outputs nothing even if it lands inside the root. The usage log records tokens per call, never text — enough to price the add-on per client, nothing a subject-access request would mind. |
| **Nothing on the critical path** | The launcher is a button in the layout chunk; the panel and matcher are a 9 KB chunk and the knowledge file a 4 KB fetch, both on the first click. Homepage mobile measured 92 with it on a quiet run, 98 without — within this build's run-to-run spread, so it was not chased further; `/contact` stayed at 99. |

**Matching is conservative on purpose.** A question the FAQ matcher is not
sure about goes to the model, which has the whole FAQ in its facts anyway. A
wrong FAQ answer delivered confidently is worse than a model call that costs
a fraction of a cent.

**Preview host.** The Vercel preview cannot run PHP, so
`scripts/lib/chat-function.mjs` generates the same endpoint as a Vercel
function and `deploy-vercel` rewrites `/chat.php` to it — the widget posts to
one path on either host. Two implementations of one contract is a known
debt: the rules text lives in both files, and a change to one must be made
in the other. The function uses the official SDK (it is installed by npm at
build time, so nothing argues for raw HTTP there), keeps its rate limits per
instance (a noindex preview does not need the PHP file's durability), and
logs usage to Vercel's function logs instead of a file.

**Not done.** No streaming (LiteSpeed buffers PHP output unreliably, and a
three-sentence answer arrives in a second or two behind a typing indicator);
no transcript storage (nothing to leak, nothing to be asked for); no
analytics beyond the usage log.

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
| 5 | **What the assistant costs the client** | It costs under £1 a month to serve and the market charges $100–200 for the equivalent (`MARKET.md`). Undercut, or price nearer the market? | Not set. Suggested: +£15–25/mo as an add-on, or a "site + assistant" bundle at £60–80/mo. |
| 6 | **The phone assistant: price, and which number model** | Wholesale is ~$0.10 a minute, not pennies, so the price needs a per-minute term; fonio.ai charges €119 for 1,000 minutes and the US entry tiers $29 for 50–60 (`MARKET.md` → The phone assistant). Forwarding from the client's existing line, or a new public number? | Not set. Suggested: +150–250 PLN/mo including 300 minutes, then 0.60 PLN/min; forwarding on no-answer from the existing line. Blocked on an ElevenLabs account and a Telnyx number. |

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
