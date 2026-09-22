# SEO — Google, reviews, and the AI answers

Written 2026-09-22, the day Activa went live, when Oskar asked for "first
place on Google, good reviews, first place in ChatGPT and the other AIs".
This is the playbook for that, for Activa first and for every client after.
It separates what the code already does, what only the owner can do, and
what nobody can promise.

---

## Three races, not one

"First on Google" is three different results, ranked by three different
systems, and a local trades business wins them in this order:

1. **The map pack** — the three pins under the map. This is where "pompy
   ciepła Szczecinek" buyers actually click. Ranked by the Google Business
   Profile: category, distance, reviews, completeness, activity. The website
   matters here only as the profile's link.
2. **The AI answers** — ChatGPT, Perplexity, Gemini, Google's AI Overviews,
   Claude. They cross-check three pools: the business's own site, its
   Google profile, and third-party listings — and name the business whose
   facts agree everywhere and whose reviews are good. ChatGPT's browsing
   runs on Bing's index; Google's AI runs on Google's. Studies in 2026 put
   the businesses ChatGPT names at ~4.3★ average, and rarely under a
   substantial review count.
3. **The organic links** — the blue results. For "montaż pompy ciepła
   Szczecinek" the top of the page today is aggregators (Fixly lists 64
   installers, Oferteo, cenauslug.pl) and a handful of installers
   (agdszczecinek.pl, instalacjeeko-dom.pl, Hartmann, OZE-EFEKT, BMG Energy).
   For "hurtownia instalacyjna Szczecinek": Sanpol (ul. 1 Maja 52),
   EkoWodrol (Koszalińska 85), Hryszkiewicz. This race is content and time.

**What nobody can promise:** position 1. What is realistic for Activa —
35 years, warehouse and installation under one roof, 4.2★ from 32 reviews
already, in a town of 40,000 — is the map-pack top three for the
"technika grzewcza / hurtownia instalacyjna / pompy ciepła + Szczecinek"
family within 4–12 weeks of a complete profile and a review habit, page one
for the brand and the wholesale queries about as fast, and a named place in
the AI answers once the reviews pass the bar and the listings agree. The
installer queries against aggregators are a months-long content race, won
page by page.

---

## What the site already does (shipped 2026-09-22)

- Every page: a title that names the service and the town, a description
  that names the business, the town and the phone, one `<h1>`, canonical
  URL, Open Graph, and a sitemap of all 20 routes with trailing slashes.
- `robots.txt` allows everything, and names the AI crawlers as well —
  OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot,
  Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot,
  Amazonbot, CCBot, meta-externalagent — because a brochure site wants to
  be in the answer *and* in the training data.
- JSON-LD on every page: `HVACBusiness` with name, legal name, founding
  year, NAP, geo, opening hours, `areaServed` (the eight towns), an offer
  catalogue of the six services, and `sameAs` to the Google listing;
  `Service` on each service and area page; `FAQPage` on the FAQ;
  `BreadcrumbList` everywhere. `aggregateRating` only when real review
  texts are in the config — never from a number alone.
- `/llms.txt`: the facts in the plain-text shape AI crawlers look for —
  who, since when, where, phone, hours, areas, services with links, the
  FAQ, the house rules. Same source as the pages and the assistant.
- `/indexnow.txt` + an IndexNow ping from every deploy: Bing (and so
  ChatGPT search) is told which URLs changed the minute they change.
- Verification tags for Search Console and Bing Webmaster Tools come from
  `seo.verification` in the config; the Google review link from
  `contact.googleReviewUrl` (shown in the footer as "Oceń nas w Google").
- Mobile Lighthouse 90+ on every route, which is the ranking floor, not a
  ranking factor.

Deliberately not done: a `keywords` meta tag (ignored since 2009), fake
`aggregateRating`, doorway pages for towns the firm does not serve.

---

## Track 1 — the map pack: the Business Profile

Owner's work, with Oskar at the keyboard. In this order:

1. **Claim and verify** the existing profile ("Activa", Harcerska 2,
   category *HVAC contractor*, 4.2★ / 32). Business name exactly as it
   trades — no "Activa Pompy Ciepła Szczecinek Tanio"; keyword-stuffed
   names get suspended.
2. **Categories.** Primary stays the installer category; add the wholesale
   and heating-shop categories the profile UI offers in Polish
   ([VERIFY] the exact labels in the picker — roughly "Hurtownia
   hydrauliczna / instalacyjna", "Sklep z systemami grzewczymi",
   "Sprzedawca kotłów").
3. **NAP and hours** identical to the site: `Activa Technika Grzewcza`,
   `ul. Harcerska 2, 78-400 Szczecinek`, `94 374 11 32`, Mon–Fri 07:30–16:00,
   Sat 08:00–13:00. Website: `https://activa-szczecinek.pl/?utm_source=google&utm_medium=gbp`.
4. **Services** — the six from the site, same names. **Products** — the
   boiler and pump brands on the shelves ([VERIFY] which).
5. **Photos**: shopfront, the warehouse aisles, the team, ten finished jobs.
   Twenty photos is where profiles stop looking abandoned.
6. **Description** (750 chars): the `business.description` from the config,
   plus the areas. **Q&A**: seed the FAQ from the site as questions and
   answers. **Posts**: one a month — a job, a brand, a seasonal reminder.
7. **Appointment link** → `/contact/`; messaging on, if someone will answer.

**NAP consistency across the web** is the other half. Every listing must
carry the same name, address, phone and the new website: Google, Bing
Places, Apple Business Connect, Facebook, Panorama Firm, pkt.pl,
zimno-cieplo.pl, Oferteo, Fixly, the KRS/REGON registers' public mirrors.
One stale phone number or the old WordPress URL on a directory is enough
for a machine to skip the business for a safer answer.

---

## Track 2 — reviews

The rules first, because they are law as much as policy: **no bought,
traded, staff-written or AI-written reviews.** Google filters them and can
suspend the profile; since 2023 Polish consumer law (the Omnibus
implementation) requires a business to be able to show that published
reviews come from real customers. The honest version is also the one that
works:

- **The counter is the review machine.** A wholesale counter sees more
  customers in a week than an installer sees in a quarter. A card with a
  QR code at the till and a line from whoever serves — *"Jeśli wszystko
  grało, zostaw nam opinię — 30 sekund, ten kod"* — is the whole system.
- **The link**: from the profile, *Ask for reviews* → share
  (`https://g.page/r/<code>/review`). It goes in `contact.googleReviewUrl`
  (footer link), on the NFC cards, and in the assistant's hand-off later.
- **After every installation**, the same ask by text message the day the
  job is signed off, from the fitter's phone, with the link.
- **Reply to every review within 48 hours**, positive ones included, as the
  owner, by name. Replies are a ranking signal, and the AIs read them.
- **Negative reviews**: reply once, factually, offer the phone. Never
  argue in public.
- **Targets**: 50 reviews by the end of the third month, 100 within the
  year, rating held above 4.5. The card and the text message do this on
  their own; the monthly report tracks the count.

---

## Track 3 — the AI answers

What the AIs do, and what to do about it:

| They check | Done by the site | Owner's part |
| --- | --- | --- |
| Can we read it? | `robots.txt` names them; `/llms.txt`; plain HTML, no walls | — |
| Is it in Bing? | IndexNow ping on every deploy | **Bing Webmaster Tools** (import the Search Console property) and **Bing Places** |
| Is it in Google? | sitemap, canonicals, JSON-LD | **Search Console**: verify, submit the sitemap |
| Do the facts agree everywhere? | one config drives pages, schema, llms.txt and the assistant | the NAP sweep in Track 1 |
| Is it well reviewed? | review link in the footer | Track 2 |
| Do others mention it? | — | manufacturer "find an installer" directories for the brands sold ([VERIFY] which), the local portals (iSzczecinek, Temat Szczecinecki, Głos Koszaliński — a "35 lat Activy" story is a real story), the trade bodies |
| Does the page answer the question? | FAQ, service and area pages, `FAQPage` schema | the FAQ grows from the assistant's monthly question list |

**Test it, monthly.** Ask ChatGPT, Perplexity, Gemini and Claude the same
five questions in Polish — *"Kto montuje pompy ciepła w Szczecinku?"*,
*"Hurtownia instalacyjna Szczecinek"*, *"Gdzie kupić kocioł gazowy w
Szczecinku?"*, *"Serwis pomp ciepła Szczecinek"*, *"Ogrzewanie podłogowe
Szczecinek wykonawca"* — and log whether Activa is named, and in which
position. That line goes in the monthly report next to the map-pack rank.

---

## Track 4 — organic: earning the installer queries

The pages that exist are the base. The pages that win the aggregator
queries, in the order to write them:

1. **Kotły gazowe** and **Pompy ciepła**: brands carried, three typical jobs
   with the building type, what a survey covers, five FAQs each. This is
   what the aggregators cannot write.
2. **"Czyste Powietrze" and the other grants** — the single largest heat-pump
   query family in Poland. One honest page: what the programme funds, what
   Activa does and does not help with ([VERIFY]), and a phone number.
3. **"Wymiana starego kotła"** — the job most of the powiat needs. Process,
   timeline, what to have ready.
4. The **area pages** already exist for eight towns; give each one a real
   sentence about jobs done there when the gallery has them.

Rules that hold: one town per page, no page for a town not served, no
prices, no keyword lists, alt text on every image, every page linked from
somewhere. Measure in Search Console: the queries that bring impressions
without clicks are the next page to write, and the questions people ask
the assistant are the next FAQ entries.

---

## The first 90 days

**Week 1** (Oskar + client, one sitting):
- Search Console property (HTML-tag method) and Bing Webmaster Tools → tokens
  into `seo.verification` → deploy → submit `sitemap.xml` in both.
- Business Profile: claim, categories, hours, website, services, description,
  first ten photos. Review link → `contact.googleReviewUrl` → deploy.
- Order NFC/QR review cards for the counter.
- NAP sweep: the eight listings above, old URL and phone replaced.

**Weeks 2–4**:
- Twenty reviews from the counter and the last month's installations.
- Bing Places, Apple Business Connect, Oferteo, Fixly profiles, all with the
  same NAP and the site.
- Manufacturer installer directories for every brand sold.
- One profile post; the Q&A seeded.

**Months 2–3**:
- The two service pages and the grants page from Track 4.
- First monthly report: impressions and clicks by query (Search Console),
  map-pack rank for the five target queries, review count and rating, the
  AI-visibility test, the assistant's question list → FAQ additions.

---

## Target queries — Activa

| Query | Race | Who holds it today | Realistic |
| --- | --- | --- | --- |
| activa szczecinek | organic + pack | the old WordPress, directories | #1 within days of indexing |
| hurtownia instalacyjna szczecinek | pack + organic | Sanpol, EkoWodrol, Oferteo | pack top 3; page 1 |
| technika grzewcza szczecinek | pack + organic | thin | pack top 3; page 1 |
| pompy ciepła szczecinek | pack + organic | aggregators, 5 installers | pack top 3 in weeks; organic page 1 in months, with Track 4 |
| kotły gazowe szczecinek | pack + organic | thin | pack top 3; page 1 |
| ogrzewanie podłogowe szczecinek | organic | thin | page 1 with the service page |
| serwis pomp ciepła szczecinek | pack + organic | few | page 1 |
| montaż pompy ciepła <town> (8 towns) | organic | aggregators | area pages; long tail |

---

## As a product

This is the retainer's "SEO + opinie" line: the profile kept current, the
review cards, the monthly report with the map-pack ranks, the AI-visibility
test and the FAQ growth. The market prices it at 400–2,200 PLN a month
(`MARKET.md`); the work above is a few hours a month once the first ninety
days are done, because the site does the technical half by itself.

---

## Sources

- Fixly, montaż pompy ciepła Szczecinek — https://fixly.pl/kategoria/montaz-pompy-ciepla/szczecinek
- Oferteo, pompy ciepła Szczecinek — https://www.oferteo.pl/pompy-ciepla/szczecinek
- cenauslug.pl, montaż pompy ciepła Szczecinek — https://cenauslug.pl/budowa-i-remont/montaz-pompy-ciepla-powietrze-woda/szczecinek
- Sanpol Szczecinek — https://sanpol.pl/kontakt/sanpol-szczecinek ; EkoWodrol — https://hurtownia.ekowodrol.pl/technika-grzewcza/
- AI crawlers and robots.txt in 2026 — https://www.anagram.ai/blog/ai-crawlers-explained-gptbot-claudebot-perplexitybot-and-how-to-let-them-in-2026 ; https://presenc.ai/research/state-of-robots-txt-for-ai-2026
- How ChatGPT picks local businesses — https://formativedigital.com/research/chatgpt-google-maps-local-citations/ ; https://leadlocalseo.com/blog/how-to-get-recommended-by-chatgpt/ ; https://probablygenius.com/articles/google-business-profile-and-chatgpt/
- IndexNow — https://www.indexnow.org/documentation
