/**
 * Structured data. Rendered server-side into the HTML so crawlers see it
 * without executing JavaScript.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own config, never user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
