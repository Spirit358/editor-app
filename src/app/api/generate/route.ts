import { NextRequest, NextResponse } from 'next/server'
import { generateMockOutfit } from '@/lib/data'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY

const SYSTEM_PROMPT = `You are EDITOR — a world-class AI fashion director. Given a vibe description, return a complete outfit as structured JSON.

Rules:
- Each category (hat, outerwear, top, bottom, bag, shoes) must have exactly 4 options
- Each option needs: id, category, name, brand, price (number, GBP), tier (budget/mid/premium/luxury), description, colors (array of hex), tags, retailers (array of {name, url, icon})
- Retailers: always include Depop search, ASOS search, Google Shopping link
- Be specific with brands: "Toteme" not "designer brand"
- Descriptions: 1-2 sentences, editorial voice, knowledgeable
- vibeName: 3-5 word poetic name for the aesthetic
- trendScore: 1-10
- trendStatus: "Trending Now" | "Emerging" | "Timeless Classic" | "Fading Out"

Return ONLY valid JSON, no markdown, no preamble.`

async function callGemini(prompt: string): Promise<unknown> {
  if (!GEMINI_KEY) throw new Error('No Gemini key')
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: `Design an outfit for: "${prompt}"` }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.8, maxOutputTokens: 4000 },
      }),
    }
  )
  const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return JSON.parse(text)
}

async function callOpenAI(prompt: string): Promise<unknown> {
  if (!OPENAI_KEY) throw new Error('No OpenAI key')
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      max_tokens: 4000,
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Design an outfit for: "${prompt}"` },
      ],
    }),
  })
  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
  return JSON.parse(data.choices?.[0]?.message?.content || '{}')
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json() as { prompt?: string }
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 })

    // Try AI providers, fall back to mock data
    let result: unknown
    try {
      result = await callGemini(prompt)
    } catch {
      try {
        result = await callOpenAI(prompt)
      } catch {
        // Fall back to curated mock data
        result = generateMockOutfit(prompt)
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
