/**
 * Shown on every demo build: unmistakable to anyone who stumbles on the URL,
 * dated so a stale demo is obvious. Paired with noindex + a blocking
 * robots.txt in demo mode. Plain text on a plain bar — it is a notice, not a
 * design element.
 */
export function DemoBanner({
  headline,
  note,
  expiry,
}: {
  headline: string
  note?: string
  expiry?: string
}) {
  return (
    <div className="rule-b bg-paper-3 text-ink-2 no-print">
      <div className="container-page">
        <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5 py-2 text-center text-xs sm:text-sm">
          <span className="font-medium text-ink">{headline}</span>
          {note && <span className="hidden sm:inline">{note}</span>}
          {expiry && <span className="hidden sm:inline">{expiry}</span>}
        </p>
      </div>
    </div>
  )
}
