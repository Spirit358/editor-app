import {
  Bath,
  Droplets,
  Flame,
  Gauge,
  Hammer,
  Key,
  PaintRoller,
  Scissors,
  ShowerHead,
  Siren,
  Sparkles,
  Thermometer,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * An explicit map rather than a dynamic lookup, so a typo in a config becomes
 * a visible fallback instead of a build-time crash, and the bundle only ever
 * carries these icons.
 */
const ICONS: Record<string, LucideIcon> = {
  Bath,
  Droplets,
  Flame,
  Gauge,
  Hammer,
  Key,
  PaintRoller,
  Scissors,
  ShowerHead,
  Siren,
  Sparkles,
  Thermometer,
  Truck,
  Wrench,
  Zap,
}

export function ServiceIcon({
  name,
  className,
}: {
  name?: string
  className?: string
}) {
  const Icon = (name && ICONS[name]) || Wrench
  return <Icon className={className} aria-hidden strokeWidth={1.5} />
}
