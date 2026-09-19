import { Eye } from 'lucide-react'

/**
 * Shown on every demo build. Two jobs: make it unmistakable to anyone who
 * stumbles on the URL that this is an unsolicited preview and not the
 * business's real site, and give the owner a date so a stale demo is obvious.
 *
 * Paired with noindex + a blocking robots.txt in demo mode. See DECISIONS.md.
 */
export function DemoBanner({
  preparedFor,
  expiresOn,
  note,
}: {
  preparedFor: string
  expiresOn?: string
  note?: string
}) {
  const expiry = expiresOn
    ? new Date(expiresOn).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="relative z-60 bg-brand-950 text-brand-100 no-print">
      <div className="container-page">
        {/* On a phone only the headline sentence shows: the banner is already
            unmissable, and three wrapped lines would push the hero's
            call-to-action off the first screen. */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center text-xs sm:text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-brand-50">
            <Eye className="size-3.5 shrink-0 text-accent-400" aria-hidden />
            Preview prepared for {preparedFor}
          </span>
          {note && <span className="hidden text-brand-300 sm:inline">{note}</span>}
          {expiry && (
            <span className="hidden text-brand-300 sm:inline">
              Private link · removed after {expiry}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
