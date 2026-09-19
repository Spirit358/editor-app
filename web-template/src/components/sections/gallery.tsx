import Image from 'next/image'
import { site, copy } from '@/lib/site'
import { SectionHeading } from './section-heading'

/** Only rendered when real photographs exist. Captions below, not overlaid. */
export function Gallery({ limit }: { limit?: number }) {
  const items = limit ? site.gallery?.slice(0, limit) : site.gallery
  if (!items?.length) return null

  return (
    <section id="gallery" className="section rule-b">
      <div className="container-page">
        <SectionHeading eyebrow={copy.galleryEyebrow} title={copy.galleryTitle} intro={copy.galleryIntro} />
        <ul className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.src}>
              <figure>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width ?? 1200}
                  height={item.height ?? 900}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[var(--radius-md)] object-cover"
                />
                {item.caption && <figcaption className="mt-2 text-sm text-ink-2">{item.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
