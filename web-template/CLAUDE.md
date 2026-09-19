# Project brief — AI web design business (Leeds)

Context for anyone, human or model, picking this up. Read `README.md` for how
to run it and `DECISIONS.md` for why it is built the way it is.

---

## The business

Oskar — solo developer, Leeds. Builds and rebuilds websites for local
businesses and sells them, mainly on a monthly retainer.

1. **Build first, pitch second.** Find local businesses with no website or a
   bad one, build a redesigned demo of *their* site, then show it to them. The
   demo is the pitch.
2. **Demos are private and unindexed.** Never publish a live, indexed site
   under a business's name or branding before they have agreed. Preview
   subdomain, `noindex`, and delete unsold demos after ~30 days.
3. **The retainer is the business.** Setup £300–1,000; £30–60/month for
   hosting, edits and updates. Add-ons: booking, Google Business Profile
   tidy-up, NFC review cards, chatbot.
4. **Client owns their domain.** Short written agreement: scope, edits per
   month, cancellation.
5. **Target cost per site: under £5**, excluding Oskar's time.

Working style: big prompts, then he walks away. Make sensible calls, log them
in `DECISIONS.md`, keep moving. Be blunt about problems.

## Open decisions

Listed in `DECISIONS.md` with the defaults currently in place: niche, hosting,
agency brand name, final pricing. None of them block building.

---

## Per-site workflow

1. **Intake** — business name, Google Maps listing, existing site, services,
   areas, reviews, phone, hours, photos.
2. **Visuals first.** Generate or collect the hero image before writing
   anything: it sets the palette and the mood. Video loops should be slow,
   dark, 4–8 seconds, seamless, no text, no faces.
3. `pnpm new-site <slug> --hue <h>` then fill in the one config file.
4. `pnpm optimize-images --slug <slug>` once real photos exist.
5. **Visual QA.** `pnpm shoot` → review at 390px and 1440px → fix → repeat.
6. `pnpm audit-site` — every route at 90+, mobile and desktop. Not optional.
7. Deploy `out/` to a private preview URL. Demo mode stays on.
8. Log the lead and the demo URL in the tracker.

## Conventions that are load-bearing

Undoing any of these quietly breaks something measurable:

- **Never fade in the `<h1>`.** Use `animate-rise-lcp`. See README.
- **`Reveal` starts visible** and hides only what is below the fold.
- **Never hardcode niche or client copy in a component.** It goes in
  `site.config.ts`, under `copy` if it is a section heading.
- **The build validates the config.** If a field should be mandatory, add it to
  `validate()` in `src/lib/site.ts` rather than hoping someone notices.
- **`demo.enabled` stays true** until the client has signed.
- **Only emit an aggregate rating when real reviews back it.** Otherwise it is
  review spam and can earn a manual action.
- **Responsive image ladder widths** live in three files and must stay in step:
  `scripts/lib/images.mjs`, `src/lib/image-loader.ts`, `next.config.ts`.

## Outreach rules (UK, PECR)

- **Limited companies and LLPs:** cold email is allowed without prior consent.
  Identify yourself, include an opt-out.
- **Sole traders and partnerships** count as individuals and need **consent
  before marketing email**. Most tradespeople are sole traders — reach them in
  person or by phone instead.
- Check TPS/CTPS before cold calling.
- Best channel here is walk-ins and conversations while driving the taxi. Show
  the demo on a phone. Bundle with NFC review cards and a GBP tidy-up.

## Not yet built

- **Lead pipeline.** `gosom/google-maps-scraper` for Leeds businesses in the
  chosen niche → a table of name, phone, website, rating, review count, status,
  demo URL. Score: no website = hot; slow or dated site = warm; good reviews
  plus a bad site = best pitch. Scrape politely, public business data only.
- **Hermes pipeline.** Business name + Maps listing in, finished demo out.
- **Seedance / image-model API calls** from Hermes for bulk visual assets.
- **Client portal** for retainer edit requests.
