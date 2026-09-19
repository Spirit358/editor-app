import Image from 'next/image'
import { site, copy } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Reveal } from '@/components/reveal'

export function Gallery({ limit }: { limit?: number }) {
  const items = limit ? site.gallery?.slice(0, limit) : site.gallery
  if (!items?.length) return null

  return (
    <section id="gallery" className="section-y bg-surface-2">
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.galleryEyebrow}
          title={copy.galleryTitle}
          intro={copy.galleryIntro}
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.src} delay={(i % 3) * 80}>
              <figure className="group relative overflow-hidden rounded-[var(--radius-lg)] bg-brand-950">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width ?? 1200}
                  height={item.height ?? 900}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                />
                {item.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/90 to-transparent p-5 pt-10 text-sm text-brand-50">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
