import { memo, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconStar, IconStarFilled } from '../../components/Icons'
import { BRANDS, findBrand, type Brand } from '../../data/brands'

const RatingStars = memo(({ rating }: { rating: number }) => {
  const full  = Math.floor(rating)
  const total = 5
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) =>
        i < full ? (
          <IconStarFilled key={i} className="w-4 h-4 stroke-amber-400 fill-amber-400" />
        ) : (
          <IconStar key={i} className="w-4 h-4 stroke-ink-placeholder" />
        ),
      )}
    </div>
  )
})
RatingStars.displayName = 'RatingStars'

const RelatedCard = memo(({ brand, onOpen }: { brand: Brand; onOpen: (id: string) => void }) => (
  <button
    onClick={() => onOpen(brand.id)}
    className="flex-shrink-0 w-[148px] flex flex-col items-center p-3.5 bg-surface border border-border-light rounded-card-lg hover:border-primary/40 hover:shadow-elevated active:scale-[0.99] transition-all"
  >
    <div className="w-16 h-16 rounded-full bg-white ring-1 ring-border-light flex items-center justify-center overflow-hidden mb-2.5">
      <img src={brand.src} alt={brand.name} loading="lazy" className="w-full h-full object-contain p-2" />
    </div>
    <span className="text-body font-bold text-ink line-clamp-1 w-full text-center">{brand.name}</span>
    <span className="text-label text-ink-tertiary mt-0.5">{brand.type}</span>
  </button>
))
RelatedCard.displayName = 'RelatedCard'

export const BrandDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const brand = id ? findBrand(id) : undefined

  const related = useMemo(() => {
    if (!brand) return []
    return BRANDS.filter(b => b.id !== brand.id && b.type === brand.type).slice(0, 6)
  }, [brand])

  if (!brand) {
    return (
      <PageLayout
        header={<SubPageHeader title="브랜드" />}
        hideBottomNav
        noPadding
        className="!pb-0"
      >
        <div className="px-page py-20 text-center">
          <p className="text-body text-ink-tertiary">존재하지 않는 브랜드예요</p>
          <button
            onClick={() => navigate('/brands')}
            className="mt-4 px-4 py-2 text-label font-bold text-primary"
          >
            브랜드관으로 돌아가기
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      header={<SubPageHeader title={brand.name} />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-6 pb-6 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="w-24 h-24 rounded-card-lg bg-white ring-1 ring-border-light flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
            <img src={brand.src} alt={brand.name} className="w-full h-full object-contain p-2.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-caption font-bold px-2 py-0.5 rounded bg-surface-muted text-ink-secondary">
                {brand.type}
              </span>
              {brand.featured && (
                <span className="text-caption font-extrabold px-2 py-0.5 rounded bg-primary-50 text-primary">
                  인기
                </span>
              )}
            </div>
            <h1 className="text-display font-extrabold text-ink leading-tight">{brand.name}</h1>
            <p className="text-body text-ink-secondary mt-1.5 leading-snug">{brand.description}</p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <RatingStars rating={brand.rating} />
              <span className="text-label font-extrabold text-ink tabular-nums">{brand.rating.toFixed(1)}</span>
              <span className="text-label text-ink-placeholder tabular-nums">
                ({brand.reviewCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 소개 */}
      <section className="px-page pt-6">
        <h2 className="text-heading font-bold text-ink mb-3">브랜드 소개</h2>
        <p className="text-body text-ink-secondary leading-relaxed">{brand.longDescription}</p>
      </section>

      {/* 하이라이트 */}
      <section className="px-page pt-7">
        <h2 className="text-heading font-bold text-ink mb-3">하이라이트</h2>
        <div className="flex flex-col gap-2">
          {brand.highlights.map((h, i) => (
            <div key={i} className="flex gap-3 p-4 bg-surface-muted rounded-card-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-label font-extrabold tabular-nums">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-body font-bold text-ink">{h.label}</div>
                <p className="text-label text-ink-tertiary leading-relaxed mt-1">{h.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 갤러리 */}
      <section className="pt-7">
        <h2 className="px-page text-heading font-bold text-ink mb-3">갤러리</h2>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar px-page pb-1">
          {brand.gallery.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] h-[180px] rounded-card-lg overflow-hidden bg-surface-muted"
            >
              <img
                src={src}
                alt={`${brand.name} ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 관련 브랜드 */}
      {related.length > 0 && (
        <section className="pt-7 pb-6">
          <h2 className="px-page text-heading font-bold text-ink mb-3">
            같은 유형의 다른 브랜드
          </h2>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-page pb-1">
            {related.map(b => (
              <RelatedCard key={b.id} brand={b} onOpen={() => navigate(`/brands/${b.id}`)} />
            ))}
          </div>
        </section>
      )}

    </PageLayout>
  )
}
