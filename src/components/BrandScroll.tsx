import { memo } from 'react'
import { SectionHeader } from './SectionHeader'

type Brand = {
  id: string
  name: string
  src: string
  bg: string
}

const BRANDS: Brand[] = [
  { id: 'bodychannel-classic', name: '바디채널 Classic', src: '/img/logo07.png', bg: 'bg-white' },
  { id: 'bodychannel-urban',   name: '바디채널 Urban',   src: '/img/logo08.png', bg: 'bg-white' },
  { id: 'hammer',              name: 'Hammer Strength', src: '/img/logo01.png', bg: 'bg-white' },
  { id: 'focus',               name: 'Focus Fitness',   src: '/img/logo02.png', bg: 'bg-white' },
  { id: 'technogym',           name: 'TechnoGym',       src: '/img/logo03.png', bg: 'bg-white' },
  { id: 'gymground',           name: 'Gym Ground',      src: '/img/logo04.png', bg: 'bg-white' },
  { id: 'cybex',               name: 'Cybex',           src: '/img/logo05.png', bg: 'bg-white' },
  { id: 'viliti',              name: 'VILITI',          src: '/img/logo06.png', bg: 'bg-white' },
  { id: 'rogers',              name: 'Rogers',          src: '/img/logo09.png', bg: 'bg-white' },
]

const BrandItem = memo(({ brand }: { brand: Brand }) => (
  <button className="flex-shrink-0 flex flex-col items-center gap-1.5 flex-1 min-w-[68px] active:scale-95 transition-transform">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-border-light ${brand.bg}`}>
      <img
        src={brand.src}
        alt={brand.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain p-1"
      />
    </div>
    <span className="text-label font-semibold text-ink text-center leading-tight line-clamp-1 w-full">
      {brand.name}
    </span>
  </button>
))
BrandItem.displayName = 'BrandItem'

export const BrandScroll = () => (
  <section className="mb-section">
    <SectionHeader title="피트니스 브랜드관" href="/brands" />
    <div className="flex gap-1 pb-1 overflow-x-auto hide-scrollbar">
      {BRANDS.map(b => (
        <BrandItem key={b.id} brand={b} />
      ))}
    </div>
  </section>
)
