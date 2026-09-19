import type { Illustration as Kind } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Technical line illustrations of the equipment — the site's imagery until
 * real photography exists, and a deliberate visual language rather than a
 * placeholder. Drawn once here, coloured by `currentColor`, crisp at any
 * size, a few kilobytes each.
 *
 * Every drawing sits on the same 400×300 canvas so they interchange in any
 * frame a photograph would occupy.
 */
export function Illustration({
  kind,
  className,
  title,
}: {
  kind: Kind
  className?: string
  /** Accessible name. Omit for purely decorative use. */
  title?: string
}) {
  const Draw = DRAWINGS[kind] ?? DRAWINGS.tools
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={cn('block h-auto w-full', className)}
    >
      {title && <title>{title}</title>}
      <Draw />
    </svg>
  )
}

const DRAWINGS: Record<Kind, () => React.ReactElement> = {
  /** Wall-hung condensing boiler with flue, controls and pipe connections. */
  boiler: () => (
    <>
      <rect x="130" y="52" width="140" height="176" rx="8" />
      <rect x="150" y="70" width="100" height="14" rx="2" />
      <path d="M186 118a14 14 0 1 0 28 0a14 14 0 1 0-28 0" />
      <path d="M200 118v-8" />
      <rect x="150" y="150" width="100" height="56" rx="3" />
      <path d="M160 162h80M160 174h80M160 186h80M160 198h80" strokeOpacity="0.45" />
      <path d="M200 52V24" />
      <path d="M186 24h28" />
      <path d="M182 24v-8h36v8" />
      <path d="M150 228v40M170 228v40M190 228v40M210 228v40M230 228v40M250 228v40" />
      <path d="M150 268v12M190 268v12M230 268v12" />
      <circle cx="170" cy="250" r="5" />
      <circle cx="210" cy="250" r="5" />
      <circle cx="250" cy="250" r="5" />
      <path d="M60 280h280" strokeOpacity="0.35" />
    </>
  ),

  /** Air-source heat pump outdoor unit on a plinth. */
  heatpump: () => (
    <>
      <rect x="70" y="72" width="260" height="150" rx="10" />
      <circle cx="150" cy="147" r="52" />
      <circle cx="150" cy="147" r="8" />
      <path d="M150 95v44M150 155v44M98 147h44M158 147h44" strokeOpacity="0.55" />
      <path d="M113 110l30 30M157 154l30 30M187 110l-30 30M113 184l30-30" strokeOpacity="0.55" />
      <path d="M232 96h72M232 112h72M232 128h72M232 144h72M232 160h72M232 176h72M232 192h72" strokeOpacity="0.45" />
      <rect x="240" y="84" width="56" height="8" rx="2" />
      <path d="M90 222v24M310 222v24" />
      <path d="M60 246h280" />
      <path d="M330 130h30v90M330 150h20v70" strokeOpacity="0.7" />
      <path d="M40 280h320" strokeOpacity="0.35" />
    </>
  ),

  /** Panel radiator with thermostatic valve. */
  radiator: () => (
    <>
      <rect x="70" y="80" width="260" height="130" rx="6" />
      <path d="M86 92v106M102 92v106M118 92v106M134 92v106M150 92v106M166 92v106M182 92v106M198 92v106M214 92v106M230 92v106M246 92v106M262 92v106M278 92v106M294 92v106M310 92v106" strokeOpacity="0.4" />
      <path d="M70 100h260M70 190h260" strokeOpacity="0.55" />
      <path d="M62 190h-14v50" />
      <path d="M338 190h14v50" />
      <circle cx="48" cy="184" r="12" />
      <path d="M48 172v-8M36 184h-8" />
      <path d="M86 210v30M314 210v30" />
      <path d="M40 280h320" strokeOpacity="0.35" />
    </>
  ),

  /** Underfloor heating loop with manifold. */
  underfloor: () => (
    <>
      <rect x="60" y="120" width="280" height="150" rx="4" />
      <path d="M80 250V140h240v110H100V160h200v70H120V180h160v30H140V200h120" strokeOpacity="0.8" />
      <rect x="150" y="40" width="100" height="44" rx="4" />
      <circle cx="170" cy="62" r="6" />
      <circle cx="200" cy="62" r="6" />
      <circle cx="230" cy="62" r="6" />
      <path d="M170 84v36M230 84v36" />
      <path d="M150 52h-20M250 52h20" />
      <path d="M40 285h320" strokeOpacity="0.35" />
    </>
  ),

  /** Hot-water cylinder with connections and thermometer. */
  cylinder: () => (
    <>
      <path d="M140 70a60 24 0 0 1 120 0v170a60 24 0 0 1-120 0z" />
      <path d="M140 70a60 24 0 0 0 120 0" />
      <path d="M140 240a60 24 0 0 0 120 0" strokeOpacity="0.5" />
      <circle cx="200" cy="150" r="16" />
      <path d="M200 150l8-10" />
      <path d="M260 110h40v140M260 190h24v60" />
      <path d="M140 130h-40v120" />
      <path d="M200 46v-18M190 28h20" />
      <path d="M170 264v16M230 264v16" />
      <path d="M60 282h280" strokeOpacity="0.35" />
    </>
  ),

  /** Warehouse shelving with stock. */
  warehouse: () => (
    <>
      <path d="M60 40v240M340 40v240" />
      <path d="M60 110h280M60 180h280M60 250h280" />
      <path d="M60 40h280" strokeOpacity="0.4" />
      <rect x="80" y="70" width="52" height="40" rx="2" />
      <rect x="146" y="58" width="70" height="52" rx="2" />
      <rect x="232" y="80" width="40" height="30" rx="2" />
      <rect x="286" y="64" width="40" height="46" rx="2" />
      <rect x="80" y="140" width="110" height="40" rx="2" />
      <path d="M92 150v20M104 150v20M116 150v20M128 150v20M140 150v20M152 150v20M164 150v20M176 150v20" strokeOpacity="0.4" />
      <rect x="206" y="130" width="56" height="50" rx="2" />
      <rect x="276" y="150" width="50" height="30" rx="2" />
      <path d="M80 220h60M80 232h60M80 244h60" />
      <rect x="160" y="200" width="44" height="50" rx="2" />
      <rect x="218" y="212" width="36" height="38" rx="2" />
      <path d="M270 250v-40l24-10 24 10v40" />
      <path d="M40 280h320" strokeOpacity="0.35" />
    </>
  ),

  /** Trades van, side elevation. */
  van: () => (
    <>
      <path d="M60 210V120a10 10 0 0 1 10-10h150l48 40h72a12 12 0 0 1 12 12v48" />
      <path d="M60 210h292" />
      <path d="M220 110v40h48" strokeOpacity="0.7" />
      <path d="M232 122h26l22 20" strokeOpacity="0.5" />
      <circle cx="120" cy="212" r="22" />
      <circle cx="120" cy="212" r="8" />
      <circle cx="290" cy="212" r="22" />
      <circle cx="290" cy="212" r="8" />
      <path d="M80 140h120M80 160h120" strokeOpacity="0.4" />
      <path d="M340 180h12" />
      <path d="M40 260h320" strokeOpacity="0.35" />
    </>
  ),

  /** Hand tools laid out. */
  tools: () => (
    <>
      <path d="M90 230L230 90" />
      <path d="M230 90l26-26 20 20-26 26z" />
      <path d="M84 236a10 10 0 0 0 14-14" />
      <path d="M150 250l120-120" strokeOpacity="0.7" />
      <path d="M270 130a24 24 0 1 0 0-48 24 24 0 0 0 0 48z" />
      <path d="M262 104l16 16" />
      <path d="M300 200h50v20h-50z" />
      <path d="M300 210h-40" />
      <path d="M40 280h320" strokeOpacity="0.35" />
    </>
  ),
}
