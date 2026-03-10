# EDITOR — AI Fashion Director

> Describe any vibe. Get a complete outfit across every price point.

Vogue-editorial AI fashion app. Three-column layout: input panel → fashion sketch → item carousel.

## Stack
- **Next.js 15** + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (all animations)
- **Gemini 2.5 Flash + GPT-4.1-mini** (dual provider, falls back to curated data)

## Setup

```bash
npm install
cp .env.example .env.local
# Add your API keys to .env.local (optional — app works without them)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod

# Add env vars
vercel env add GEMINI_API_KEY production
vercel env add OPENAI_API_KEY production
vercel --prod  # redeploy with keys
```

## Features

### Live (v1)
- ✅ Vogue editorial design system
- ✅ Hero landing with animated fashion sketch
- ✅ Text input + 12 style presets + image upload zone
- ✅ Three-column designer workspace
- ✅ Front/Side/Back figure rotation
- ✅ Interactive SVG fashion sketch (click hotspots)
- ✅ Item carousel with 4 options per category
- ✅ Tier-coloured pricing (Budget/Mid/Premium/Luxury)
- ✅ Real retailer links (Depop, ASOS, Google Shopping)
- ✅ Colour swatches per item
- ✅ Fit summary with total price
- ✅ Save + Share to Runway
- ✅ Pinterest/Instagram/TikTok share
- ✅ Sustainability score
- ✅ Styling notes
- ✅ Loading animation (sketch drawing itself)
- ✅ Full TypeScript — zero errors
- ✅ Vercel-ready

### Roadmap (v2)
- 🔜 Real AI generation via Gemini/GPT
- 🔜 TikTok/Pinterest trend scanning
- 🔜 Daily trending fits (auto-generated)
- 🔜 Community runway feed
- 🔜 User accounts (Supabase)
- 🔜 Pinterest OAuth for mood inspiration
- 🔜 3D-style figure rotation
- 🔜 Image upload → find similar items

## Design System

| Token         | Value       | Use                          |
|---------------|-------------|------------------------------|
| `--bg`        | `#fafaf8`   | Main background              |
| `--bg-warm`   | `#f5f2ed`   | Sketch column                |
| `--gold`      | `#c8a96e`   | Primary accent, CTAs         |
| `--text`      | `#1a1a1a`   | Headings                     |
| `--border`    | `#e8e4de`   | All dividers                 |
| Font display  | Playfair Display | Headings, item names    |
| Font body     | Poppins          | Body text                |
| Font mono     | DM Mono          | Labels, metadata         |

## Outfit Data

The app ships with 5 complete curated outfit sets:
- **Dark Academia** (The Studied Scholar)
- **Quiet Luxury** (The Quiet Authority)
- **Gorpcore** (The Technical Romantic)
- **Streetwear** (The Archive Edit)
- **Editorial Chic** (The Editorial Dream)

Each outfit has 4–6 item categories × 4 price tiers = 16–24 options per outfit.
