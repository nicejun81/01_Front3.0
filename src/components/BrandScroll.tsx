import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'
import { BRANDS, type Brand } from '../data/brands'

interface BrandItemProps {
  brand: Brand
  onOpen: (id: string) => void
}

const BrandItem = memo(({ brand, onOpen }: BrandItemProps) => (
  <button
    onClick={() => onOpen(brand.id)}
    className="flex-shrink-0 flex flex-col items-center gap-1.5 flex-1 min-w-[68px] active:scale-95 transition-transform"
  >
    <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-border-light bg-white">
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

export const BrandScroll = () => {
  const navigate = useNavigate()
  const handleOpen = useCallback((id: string) => navigate(`/brands/${id}`), [navigate])

  return (
    <section className="mb-section">
      <SectionHeader title="피트니스 브랜드관" href="/brands" />
      <div className="flex gap-1 pb-1 overflow-x-auto hide-scrollbar">
        {BRANDS.map(b => (
          <BrandItem key={b.id} brand={b} onOpen={handleOpen} />
        ))}
      </div>
    </section>
  )
}
