# BillSwipe

> Upload your bills. Bored billionaires swipe right to pay them.

A full-stack demo: people post bills, "billionaires" work through a swipe deck —
right to pay, left to pass.

**Payments are simulated. No real money moves.**

## Run

Needs Node 22.13+ (uses the built-in `node:sqlite`, no native dependencies).

```bash
cd billswipe
npm install
npm run dev        # http://localhost:3000
```

Open it in two browsers (or one normal + one private window): post a bill as
one person, swipe as the other. The database is seeded with six sample bills on
first start; set `BILLSWIPE_NO_SEED=1` to skip that.

## How it fits together

| Layer | Where | Notes |
| --- | --- | --- |
| Database | `src/lib/db.ts` | SQLite file at `data/billswipe.db`. Tables: `users`, `sessions`, `bills`, `swipes`, `payments`. |
| Auth | `src/lib/auth.ts` | Name + role sign-in, httpOnly session cookie, token stored hashed. |
| Payments | `src/lib/payments.ts` | `PaymentProvider` interface with a simulated implementation. |
| API | `src/app/api/*` | See below. |
| UI | `src/app/page.tsx`, `src/components/*` | Onboarding, poster dashboard, swipe deck. |

### API

| Route | Who | Does |
| --- | --- | --- |
| `GET/POST/DELETE /api/session` | anyone | Current user / sign in / sign out |
| `GET /api/bills` | signed in | Your own bills |
| `POST /api/bills` | poster | Create a bill (multipart; optional JPEG/PNG/WebP/PDF up to 5 MB) |
| `GET /api/bills/:id/attachment` | owner or billionaire | The uploaded bill scan |
| `GET /api/deck` | billionaire | Open bills you have not swiped yet |
| `POST /api/bills/:id/swipe` | billionaire | `{ "direction": "left" \| "right" }` — right pays the bill |
| `GET /api/leaderboard` | anyone | Totals and top payers |

A right swipe atomically claims the bill (`open → pending`) before charging, so
two people can never pay the same bill; the loser gets a `409`.

## Before this could be a real product

- **Real payments.** Implement `PaymentProvider.charge` against a processor and
  add payouts to the poster (or pay the biller directly). That brings KYC,
  fraud screening and money-transmission rules with it.
- **Real accounts.** Sign-in is a name and a role with no verification —
  anyone can claim to be a billionaire. Add proper auth and verify both sides.
- **Bill verification and moderation.** Nothing checks that a bill is genuine.
- **Hosting.** SQLite and uploads live on local disk (`data/`), so this needs a
  host with a persistent volume, or a swap to Postgres + object storage for
  serverless platforms such as Vercel.
