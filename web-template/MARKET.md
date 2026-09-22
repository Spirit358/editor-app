# Market — who sells chat to small businesses, and what that means for the offer

Written 2026-09-20 to answer one question: if the system (site + assistant +
add-ons) is to be sold to other businesses, what does it compete with, what
do those products actually do, and what does the market prove people pay
for? Prices are as shown on the vendors' own pages on that date; they drift.
Reddit could not be read from the build environment, so the community half
of the picture comes from vendor pages, agency blogs and measured data.

---

## Three kinds of competitor

### 1. Chat SaaS sold straight to the business

Tidio (Szczecin — the same voivodeship as Activa), Smartsupp (Brno),
ChatBot.com (LiveChat, Wrocław), Crisp (Nantes), Chatbase (San Francisco).
All price the AI by the **conversation** or **resolution**, on top of a
base plan for the human inbox:

| Vendor | Base plan | AI, as priced | What that buys |
| --- | --- | --- | --- |
| Tidio | Free / Starter $24.17 / Growth from $49.17 / Plus from $300 | **Lyro from $32.50/mo for 50 AI conversations** | 50 conversations. A conversation is any exchange with at least one AI reply. |
| Smartsupp | Free (25 conv.) / Solo $17 / Plus $25 / Expert $83 | **Mira from $16/mo per 100 conversations**, packs to 5,000 | Scrapes 20 pages of the site; handover to a human on paid plans. Prices in PLN available. |
| ChatBot.com | Essential $19 / Growth $79 per **user** per month | **10 resolutions** on Essential, 200 on Growth; **$49.50 per 50** over | A resolution is a question the AI solved. Ten a month is a demo, not a plan. |
| Chatbase | Hobby $40 / Standard $150 / Pro $500 | 700 / 4,000 / 15,000 **credits**; a premium model costs 2–5 credits per answer | **$99/mo extra to remove the "Powered by Chatbase" badge.** |
| Crisp | Mini $45 / Essentials $95 / Plus $295 per workspace | ~$5 / $25 / $75 of AI credits ≈ 90 / 450 / 1,350 conversations | Unlimited AI only on Plus. |

A Polish agency's own arithmetic, from its blog: *"plan 'Starter za 29 USD'
z aktywną AI kosztuje realnie 97–107 USD miesięcznie."* That matches the
international reviews — the realistic bill for a small business with the AI
switched on is **$100–200 a month**, before anyone removes a badge.

What they do well: set up in half an hour from a URL, learn from the site
itself, hand over to a human inbox, run on WhatsApp/Messenger/Instagram too,
detect language, show analytics.

What they do badly for a heating wholesaler or a plumber:

- **Every curious visitor costs money.** Per-conversation pricing means the
  owner is paying for "are you open on Saturday" — and the vendors' own
  docs say most conversations are exactly that.
- **The inbox nobody opens.** Handover assumes someone is staffing live
  chat. A two-person firm is on a roof.
- **Weight.** DebugBear's measurement of 21 chat widgets (updated
  November 2025): Tidio 208 KB and 540 ms of main-thread time, Smartsupp
  164 KB / 1,000 ms, Crisp 155 KB / 311 ms, LiveChat 385 KB / 328 ms,
  Intercom 301 KB / 514 ms, Zendesk 533 KB / 991 ms. The site's own audit
  gate is 90+ on mobile; any of these would take that on its own. This
  system's assistant is 7 KB in the layout and 9 KB on the first click.
- **They look like what they are** — the same bubble on ten thousand sites.
- **A third party in the middle** of a Polish customer's message. Every
  Polish agency article on the subject ends with a RODO paragraph: where is
  the data, is there a processing agreement, can it be deleted.

### 2. Local-business platforms — what "add-ons" means to the market

**Podium** (US, home services among its verticals) and **GoHighLevel** (the
platform agencies resell white-label) do not sell a chatbot. They sell a
bundle around one idea: *the enquiry must not be lost*. Webchat that turns
into an SMS thread so the visitor can leave the page; missed-call text-back;
lead qualification (where, what, when); booking on the calendar; review
requests after the job; a unified inbox; a CRM behind it. Podium's own
numbers for the AI employee are 30 % more sales and 80 % more after-hours
appointments; the realistic Podium bill for one location is $500–800 a
month. GoHighLevel costs an agency $97 (3 clients) / $297 (unlimited, white
label) / $497 (resell as SaaS) a month plus usage, and its AI employee is
$50–97 per client on top. Reputation management, booking and the chat widget
are in every tier.

This is the list of what the market has already proven small businesses pay
for. It is also, almost line for line, the add-on list in the brief.

### 3. Agencies selling "a site plus a chatbot" — the direct competitor

Poland: one Warsaw agency's packages are 2,899 / 5,299 / 9,499 / 16,499 PLN
one-off, the chatbot only in the two upper tiers, WhatsApp handover on the
top two, hosting and domain bought separately by the client, and support for
30 days to 12 months. Agency-built custom bots are quoted at 7,300–22,000 PLN
setup plus 550–1,280 PLN a month, or 5,000–15,000 PLN plus 900–2,200 PLN a
month with maintenance. Another agency's advice to small firms: not worth it
under a few enquiries a week, break-even in 1–3 months above that.

UK: an agency selling exactly Oskar's target — trades — charges £800–2,500
setup and £40–120 a month, WhatsApp-first, with emergency-vs-routine triage
by postcode and job type, photo upload for quotes, booking into Jobber /
Tradify / ServiceM8, 24 h and 72 h quote follow-ups, and review requests
after the job. Their own caveat is the honest one: *it does not generate
leads, it stops existing ones being lost*; and their own trigger is the
timing of trade enquiries in the UK — 7–11 pm weekdays, Saturday mornings —
exactly when the tradesperson cannot answer.

---

## Where the system stands against that

| | Chat SaaS | Platforms | Agencies | **This system** |
| --- | --- | --- | --- | --- |
| Cost to run the AI | $16–40 per 100 conversations | usage-billed | 550–2,200 PLN/mo | **pennies** (~800 tokens in, 60 out, Haiku) |
| Who pays for "are you open Saturday?" | the owner | the owner | the owner | **nobody** — answered in the browser |
| Widget on the page | 67–749 KB | heavy | varies | **7 KB in the layout, 9 KB on first click** |
| Where the customer's message goes | vendor's cloud | vendor's cloud | agency's stack | **the client's own server**, then the model |
| Hallucination control | "trained on your data" | playbooks | varies | **one knowledge file, hard rules, prices intercepted before the model** |
| Branding | badge, or pay | white label at $297+ | agency's | **none** |
| Human handover to a live inbox | yes | yes | yes | **no — hand-off to phone/form/WhatsApp** |
| Lead capture in the chat | yes | yes (→ SMS) | yes | **not yet** |
| Channels beyond the site | WhatsApp, Messenger, IG | all | WhatsApp | **not yet** |
| Booking | some | yes | yes | **not yet** |
| Review requests | no | yes | some | **not yet** (in the brief) |
| Analytics for the client | dashboard | dashboard | reports | **usage log only** |

The first five rows are the pitch. The last five are the roadmap.

---

## What to build next, in the order the market pays for it

1. **Lead capture inside the chat.** After the hand-off line, or after two
   model turns: "Zostaw numer — oddzwonimy" with a name + phone field that
   posts to the existing `form.php`. No new infrastructure, and it turns the
   assistant from an FAQ into what Podium sells: the enquiry that is not
   lost. This is the single highest-value change.
2. **WhatsApp hand-off.** A `wa.me` link with the conversation's last
   question prefilled — `whatsappHref` already exists in `utils.ts`. Trades
   in Poland and the UK live on WhatsApp; it is the channel every competitor
   above leads with. Zero infrastructure.
3. **Review requests.** In the brief already (NFC cards). The software half
   is a Google review link, a card, and a message template sent after the
   job. Near-zero infrastructure; the platforms charge for it monthly.
4. **The monthly report.** `chat.php` already logs tokens per call. Add a
   line per intent (hours / address / price-intercept / FAQ / model) and a
   script that turns a month into one page: questions answered, leads left,
   the ten most common questions — which is also the list of FAQ entries to
   add next. This is what justifies the retainer every month.
5. **The phone assistant.** The fonio.ai product — the AI answers the calls
   the owner misses, takes the lead, emails it. The 7–11 pm problem solved
   at the source, and the one add-on the market prices at €119 a month.
   Wholesale ~$0.10 a minute; the section below has the numbers, the
   platform choice and what it needs. Medium effort: an agent generated
   from the same `/chatbot.json`, a webhook into the same `form.php`.
6. **Missed-call text-back.** The SMS-only version of the above (SMSAPI in
   Poland, Twilio in the UK); GoHighLevel charges per segment for the same
   thing. Cheaper, and a fallback for clients who will not have an AI voice.
7. **Booking.** A Calendly / Google Calendar embed on the contact page first;
   an in-chat "book a survey" only once the calendar is real.
8. **A client portal** for edits — already in "not yet built"; still last.

Not worth building: a live-chat inbox. It is the feature every SaaS has and
the one a two-person firm never staffs; the hand-off to phone is the honest
version of it.

---

## The phone assistant — fonio.ai and what it would take to offer the same

Oskar sent fonio.ai's ad on 2026-09-22 ("Musimy dodać taki bajer"): an AI
that answers the business's phone, takes the calls nobody picked up, writes
the lead down and emails it, and demos itself with "get a call from your AI
in 10 seconds". Researched the same day; prices as shown on the vendors' pages.

### What fonio.ai is, and charges

An AI receptionist sold to small businesses, hosted in the EU, Polish in the
language menu. Inbound answering 24/7, missed-call handling with a
transcript to email, lead capture, appointment booking, call routing to a
human, a 10-second outbound demo call as the sales hook. Plans: **Solo €119
for 1,000 minutes**, Team €359 for 3,600, Scale from €599; extra minutes
€0.15 / €0.12 / €0.08; prepaid €0.20 a minute with a €300 minimum. RODO and
EU AI Act compliance are on the front page because every buyer asks.

The rest of the market is priced the same way — a monthly plan wrapping a
bucket of minutes:

| Product | Entry plan | What it buys |
| --- | --- | --- |
| fonio.ai | €119/mo | 1,000 min, EU, Polish |
| Dialzara | $29/mo | 60 min |
| Synthflow | $29 / $99/mo | 50 / 200 min |
| Goodcall | $59–199/mo | priced per unique caller, not minutes |
| My AI Front Desk | $95–99/mo | unlimited-ish, US-centric |

Nobody sells this under $29 a month, and the Polish-speaking option costs
€119. The buyer's alternative is a missed call.

### What it costs to run

Every one of those products is the same three components rented from
someone: a phone number, a voice-agent platform (speech-to-text, the model,
text-to-speech, turn-taking), and the model. The wholesale prices:

| Component | Option | Price |
| --- | --- | --- |
| Voice platform | **ElevenLabs Agents** — one vendor, its own voices (the best Polish TTS available), SIP trunk or Twilio in, tools/webhooks, custom LLM allowed | **$0.08/min** on every plan (Creator $22 buys 275 min, Pro $99 buys 1,238); model and telephony billed on top; $0.16/min above the plan's concurrency |
| Voice platform | **Vapi** — orchestrator; bring your own keys for STT, TTS and the model (Anthropic included) | $0.05/min orchestration; realistic **$0.12–0.24/min** all-in |
| Voice platform | **Retell** — same shape, fewer knobs | $0.07/min platform; **$0.11–0.31/min** all-in |
| Model | Claude Haiku 4.5 — a two-minute call is ~8 turns, ~12k tokens in, 400 out | **~$0.015 per call** |
| Number | **Telnyx** — Polish numbers from $1/mo, EU company ID accepted, SIP to any platform | ~$1/mo + about a cent a minute inbound |
| Number | Twilio — Polish numbers need a regulatory bundle (ID + proof of address) before purchase | similar, more paperwork |

So a minute of AI phone in Polish costs **about $0.10 all-in** on ElevenLabs
Agents, or $0.12–0.24 assembled on Vapi. A tradesperson or a wholesaler
taking five two-minute calls a day is ~220 minutes a month:

| | Per month |
| --- | --- |
| Wholesale cost to run (220 min) | **~$25 ≈ 100 PLN** |
| fonio.ai for the same client | €119 ≈ 510 PLN |
| Market entry tier (Synthflow, Dialzara) | $29 for 50–60 min — the 220-minute client is on a $99 plan |

The margin is the same shape as the chatbot's: the market prices the fear of
a missed call; the inputs cost a fraction of it. Unlike the chatbot the
inputs are not pennies — this add-on needs a per-minute term in the price.

### Recommendation: ElevenLabs Agents for the pilot, number from Telnyx

- **Polish voice quality is the whole product.** A robotic or accented voice
  on a Polish business's phone is worse than voicemail. ElevenLabs' Polish
  voices are the ones every other platform resells; going direct removes a
  layer and $0.04–0.15 a minute.
- **One vendor, one bill, one dashboard** for the pilot. Vapi's advantage —
  our own Anthropic key, so the model spend shows per client in the same
  console as the chatbot — matters at ten clients, not at one. The agent's
  definition is plain JSON either way; moving it is a script, not a rewrite.
- **Telnyx for the number.** Polish numbers without Twilio's regulatory
  bundle; SIP-trunks straight into ElevenLabs. The client's ID and address
  are still needed for the number — Polish law, not the vendor.
- **Missed-call mode first, not a new public number.** The business keeps
  its number; the owner's phone gets conditional forwarding on no-answer and
  busy (`**61*<AI number>**20#`, `**67*<AI number>#` — a GSM code, no
  operator involved). The owner still answers when they can; the AI takes
  only what would have gone to voicemail. Lowest risk, highest-value minutes,
  and the pitch writes itself: *"nie tracisz już żadnego telefonu"*.

### How it plugs into the system

Same knowledge, same rules, one more channel:

1. **The agent is generated from `/chatbot.json`.** A `build-voice-agent`
   script reads the build's knowledge file and creates or updates the
   ElevenLabs agent by API: hours, address, services, areas and the FAQ as
   facts; the same rules as `chat.php` — Polish, short, no prices, no
   promises, hand off to the owner — plus the phone-only ones: say it is an
   assistant in the first sentence, ask for name, number, what, where and
   when, read it back, end the call. A retainer edit updates the phone
   assistant on the next deploy, exactly as it updates the widget.
2. **The lead goes where leads already go.** A `capture_lead` tool on the
   agent posts to the site's existing `form.php` (or the Vercel function),
   which emails the owner — no new mail path. The post-call webhook sends
   the summary and transcript to the same address; an SMS to the owner via
   SMSAPI is an option for the clients who never open email.
3. **The 10-second demo is fonio's best sales idea and costs nothing to
   copy.** A "Zadzwoń do mnie" form on the agency site posts a number to a
   function that starts an outbound call through the same agent. The
   prospect's own phone rings with the assistant they would be buying.
4. **The monthly report gains a page:** calls answered, after-hours share,
   leads captured, average length, the questions asked — the same list that
   grows the FAQ.

### Watch-outs

- **The AI must say it is an AI** — EU AI Act transparency, and it is what
  fonio prints on its front page. First sentence of the greeting, always.
- **Recording and RODO.** Keep the transcript and summary, not the audio,
  unless the client wants recordings — then the greeting says the call is
  recorded. ElevenLabs offers a DPA; EU data residency is an enterprise
  feature there, so the privacy page names the processor. A client who needs
  data to stay in the EU is fonio's customer, not ours, until that changes.
- **Do not let it quote, book or promise.** The same rule as the widget. It
  takes the message and says who will call back and roughly when.
- **Barge-in and background noise** are what makes a phone agent feel dumb.
  Test on a real handset from a van, not from a laptop.
- **Concurrency.** One call at a time is enough for one small business;
  ElevenLabs doubles the per-minute rate above the plan's concurrency, so
  the number's forwarding should not fan out.

### What it needs from Oskar before it can be built

1. An **ElevenLabs** account on the Creator plan ($22/mo, 275 minutes —
   enough for the pilot) and its API key in `.env.local` as
   `ELEVENLABS_API_KEY`.
2. A **Telnyx** account with one Polish number (the client's company details
   are required for the number) and its SIP credentials.
3. The **decision on the number model** for Activa: forwarding from their
   existing line (recommended) or a new public number.
4. A **price** — open decision 6 in `DECISIONS.md`.

---

## Pricing — the market's anchors, for Oskar to decide

- AI chat SaaS alone, realistically: **$100–200/mo** with the AI on.
- Polish agencies: **400–2,200 PLN/mo** maintenance, or 2,899–16,499 PLN
  one-off with the bot in the upper tiers.
- UK trades chatbot as a service: **£800–2,500 setup, £40–120/mo.**
- GoHighLevel resellers: platform cost £80–400/mo, resold at £97–297 per
  client typically.

The retainer in the brief is £30–60/mo for hosting and edits. Against the
anchors above, the assistant as an add-on at **+£15–25/mo** (or +80–120 PLN)
is a fraction of Tidio-with-Lyro, costs under £1 to serve, and leaves room
for the same "strona + asystent" bundle at £60–80/mo that the agencies sell
at five to ten times that. Whether to undercut or to price nearer the market
is open decision 5 in `DECISIONS.md`.

---

## Watch-outs

- **RODO / EU AI Act.** Visitors must be told they are talking to an AI —
  the widget says so under the input. No transcripts are stored, so there is
  nothing to delete; the message does leave for the model provider, so the
  privacy page should say which one and that no account data goes with it.
  Tidio and Smartsupp advertise EU hosting; some clients will ask.
- **Do not oversell.** The chatbot converts the enquiries the site already
  gets. It does not create demand — the agency that says so on its own sales
  page is the credible one.
- **The FAQ is the product.** Every competitor's AI is only as good as what
  it is fed. The monthly report's "most common questions" is how the FAQ
  grows, and the FAQ is answered for free.

---

## Sources

- Tidio pricing — https://www.tidio.com/pricing/ ; Lyro review — https://www.tidio.com/blog/lyro-review/
- Smartsupp pricing — https://www.smartsupp.com/pricing/
- ChatBot.com pricing — https://www.chatbot.com/pricing/
- Chatbase pricing — https://www.chatbase.co/pricing
- Crisp pricing — https://crisp.chat/en/pricing/
- GoHighLevel pricing — https://www.gohighlevel.com/pricing
- Podium AI employee — https://www.podium.com/product/ai-employee ; real-cost reporting — https://checkthat.ai/brands/podium/pricing
- DebugBear, chat widget performance (21 widgets measured) — https://www.debugbear.com/blog/chat-widget-site-performance
- rjweb.pl, pakiety stron z chatbotem — https://rjweb.pl/pakiety-stron-www-z-chatbotem-ai/
- RSO, chatbot dla małej firmy 2026 — https://rso.pl/chatbot-dla-malej-firmy-czy-warto-i-ile-to-kosztuje-w-2026-roku/
- syntalith.ai, ile kosztuje chatbot AI 2026 — https://syntalith.ai/pl/blog/ile-kosztuje-chatbot-ai-dla-firmy-2026
- Softomate, AI chatbot for UK trades — https://www.softomatesolutions.com/blog/ai-chatbot-uk-trades-businesses-2026/
- fonio.ai pricing — https://fonio.ai/pricing
- ElevenLabs Agents pricing — https://elevenlabs.io/pricing/agents
- Vapi pricing — https://vapi.ai/pricing ; Retell pricing — https://www.retellai.com/pricing
- Telnyx Polish numbers — https://telnyx.com/products/phone-numbers ; Twilio regulatory requirements (Poland) — https://www.twilio.com/en-us/guidelines/pl/regulatory
- Dialzara — https://dialzara.com/pricing ; Synthflow — https://synthflow.ai/pricing ; Goodcall — https://www.goodcall.com/pricing ; My AI Front Desk — https://www.myaifrontdesk.com/pricing
