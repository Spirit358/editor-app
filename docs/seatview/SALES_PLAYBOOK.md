# Vantage 3D Seat View: how to sell it

The product is live at `/seatview` on this app's Vercel deploy. It covers 99 venues across the three waves you asked for: 29 in the UK & Ireland, 31 in Europe and 39 worldwide. Every venue is generated procedurally from its capacity, shape, tier count and sport, so adding a new stadium takes one line in `public/seatview/stadiums.js`.

## 1. Read this first

- **The demo layouts are approximations.** Capacities match published figures to within about 1%, but section numbers, row letters, aisles and prices are generated. Before any venue goes live, its official seating manifest replaces the generated layout (see §6). Say "concept built from public data" in every demo.
- **The biggest clubs already have 3D seat maps.** 3D Digital Venue, IOMEDIA and the ticketing platforms' own tools have most Premier League, LaLiga and NFL venues covered. Expect "we already have one" from many Wave-1 A-list venues.
- **The real advantage is speed and cost.** A bespoke 3D venue build usually takes weeks of modelling. Ours builds in under a second. That makes the long tail of venues profitable to serve: Championship and League One, the Scottish Premiership, Premiership Rugby, county cricket, arenas, EuroLeague and second divisions. It also lets you give every prospect a free demo of their own venue.
- **Don't use club crests, kits or sponsor marks** in demos or clips without permission. Public clips should use fictional fixtures (e.g. "Ravens vs Atlas") and say "concept". Never imply a partnership that doesn't exist.

## 1b. Who already has 3D seat views (web check, Nov 2026)

The `existing_3d_view` column in `leads.csv` has the detail for each venue. "Not found" means the search turned up no evidence, not that the venue definitely has nothing.

- **Already have it (8):** Tottenham, Arsenal (Emirates), Everton (Hill Dickinson), Celtic, Principality Stadium and Co-op Live, all on Ticketmaster Virtual Venue; Benfica, on 3D Digital Venue. Chelsea has a 3D planner for corporate hospitality only.
- **Probably have it:** Old Trafford, Etihad, Anfield, St James' Park and Villa Park (listed on 3D Digital Venue's seat-view directory); Twickenham and Atlético's Metropolitano (3D Digital Venue). Most US and Canadian NFL/NBA/NHL venues are likely covered too: Ticketmaster had Virtual Venue in 110+ North American venues by 2017.
- **Nothing found (63):** Wembley, The O2, AO Arena, OVO Hydro, Ibrox, Hampden, Murrayfield, Aviva, Croke Park, Stadium of Light and the Sheffield and Leeds grounds in the UK. In Europe, all but Benfica and Atlético, including the Bernabéu, Camp Nou, Allianz Arena, San Siro and Signal Iduna Park.

**What this means for selling:** Ticketmaster is the main competitor. It sells Virtual Venue as an add-on to its own ticketing clients, and it is moving down the leagues (Burnley, Bolton and Fulham have it). Lead with the venues where nothing was found, and with clubs whose ticketing isn't Ticketmaster: a Ticketmaster club can switch Virtual Venue on without buying anything new. Use continental Europe and the non-Ticketmaster UK venues for Wave 1 targets, and skip the venues that already have it.

## 2. The way to reach all of them: four channels

1. **A personalised demo link for every venue.** `leads.csv` gives each venue its own link (`/seatview/#venue-id`) to its stadium, already built. The first message is "here's your stadium in 3D", not a pitch deck. Regenerate the links with your domain: `node docs/seatview/export-leads.mjs https://your-domain.com`.
2. **Ticketing platforms (OEM).** One integration with a ticketing system reaches hundreds of venues. Target the box-office platforms that clubs and arenas buy: Secutix/ELCA, Eventim, See Tickets, Ticketmaster (Sport), AXS, Tixr, Ticketco, Ticketek. Offer a white-label embed (`?embed=1&accent=hex`), a seat-selection postMessage API (already built) and a wholesale price per venue.
3. **Venue operator groups.** ASM Global (part of Legends), Oak View Group, AEG and SMG-style operators each run dozens of arenas. One group deal can cover many venues.
4. **Social clips as top of funnel.** Use the **Cinematic** button, or `?tour=1`, to screen-record a fly-around and a dive into a seat for each venue. Feed those recordings to your clipper agent. A "Your stadium in 3D 🏟️" series, one venue per post, generates inbound requests. Reply to "do my stadium" comments with a demo link.

## 3. Who to contact

| Buyer | Job titles | What they care about |
|---|---|---|
| Club / governing body | Head of Ticketing, Ticketing & Membership Manager, Chief Revenue / Commercial Officer, Head of Digital | Fewer "where will I sit?" calls; more upgrades to dearer seats; cleaner season-ticket renewals |
| Venue operator | GM, Director of Ticketing / Box Office, Head of Premium | Selling more premium and hospitality inventory; one tool across all events |
| Ticketing platform | Head of Product, Partnerships / BD | A feature their competitors lack, and ready coverage for every client venue |

Use LinkedIn or a sales-intelligence tool to find the named people. Add them to the empty `contact_name` and `contact_role` columns in `leads.csv`. Don't guess email addresses.

## 4. Offer and pricing (starting points to test)

| Package | Price (GBP, ex VAT) | Includes |
|---|---|---|
| **Pilot** | Free for 90 days, or £1,500 | One venue, embedded on one sales flow (e.g. season-ticket renewal or hospitality). In return: KPI data and a case study |
| **Venue licence** | Setup £2.5k (<25k seats) / £6k (25–60k) / £12k (60k+), then £400–£2,500 per month | Manifest import, accuracy check, live availability, branding, analytics |
| **Per-ticket** | £0.05–£0.15 per ticket sold through the map | No setup fee. Suits smaller clubs and arenas |
| **Platform / OEM** | Per-venue wholesale (about 40–50% of list) or revenue share | White-label, API, all of the platform's venues |

Pilot KPIs to agree up front: conversion rate on the seat-selection step, average order value, share of buyers who upgrade price band, and "where's my seat" support contacts.

## 5. Outreach sequence

**Email 1 (day 0)**

Subject: {Venue} in 3D, built for you

> Hi {Name}, we rebuilt {Venue} as a live 3D seat map: all {capacity} seats, a "view from your seat" for each one, and "find seats together" for groups. Have a look: {demo_link}
>
> Clubs use it to cut "where will I sit?" questions and to move fans up to better seats. It embeds in your current ticketing flow, with no new ticketing system needed.
>
> Worth 15 minutes to see it running on your real seating plan? We offer a free 90-day pilot on one sales flow.

**Email 2 (day 4):** a 15-second clip of their own venue, plus one line: "This is what fans see before they buy."

**Email 3 (day 10):** "Should I close this off, or is {colleague role} the better person to show it to?"

**LinkedIn:** connect with a one-line note and the demo link. Don't pitch in the connection request.

**Events:** TheStadiumBusiness Summit, Ticketing Business Forum (London), SportsPro Live, and INTIX (North America, Wave 3). Bring a laptop with their venue open.

## 6. Work before the first paid venue

These steps make a venue real instead of a demo:

1. **Manifest import.** Load the venue's seating manifest (a CSV export from their ticketing system, or CAD/DWG) so section, row and seat IDs match what's sold. The renderer already takes per-seat positions, so this means swapping the generator for a loader.
2. **Live availability and prices** from the ticketing system's API. This usually needs the platform's partner programme, which is another reason to lead with channel 2.
3. **Seat attributes:** wheelchair and companion spaces, restricted views, away sections, family zones, hospitality lounges.
4. **Venue-specific architecture** where it matters: open corners, single-tier ends, roof pillars.
5. **Hosting:** an SLA, analytics, GDPR-compliant cookies, and an accessible fallback list view (WCAG).

## 7. Rollout plan

| Wave | Venues in demo | Long tail to add | Lead channel |
|---|---|---|---|
| 1. UK & Ireland | 29 | EFL and Scottish clubs, Premiership Rugby, county cricket, UK arenas (~150 venues) | Direct + social + See Tickets / Secutix / Eventim UK |
| 2. Europe | 31 | Bundesliga 2, Ligue 2, Serie B, EuroLeague and handball arenas | Platform OEM + operator groups |
| 3. World | 39 | MLS, college football, NBL/A-League, Japanese baseball | Platform OEM (AXS, Tixr, Ticketek) + INTIX |

## 8. Demo URLs

- `/seatview/#wembley`: open a specific venue
- `?embed=1`: partner embed with no venue list or branding
- `?accent=ff3366`: white-label highlight colour
- `?tour=1`: cinematic auto-tour for recording clips (`&loop=0` plays a single venue)
- postMessage events to the parent page: `venue`, `select` (seats and prices) and `checkout`. The parent can send `{target:'vantage-seatview', type:'load', venue}` or `type:'best', qty, budget`.
