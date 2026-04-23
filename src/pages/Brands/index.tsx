import { memo, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, FilterTabs } from '../../components'
import { IconChevronRight, IconSearch, IconX } from '../../components/Icons'
import { BRANDS, type Brand, type BrandType } from '../../data/brands'

type Filter = '전체' | BrandType
const FILTERS: Filter[] = ['전체', '종합 헬스', '스튜디오', '전문 스포츠']

interface BrandCardProps {
  brand: Brand
  onOpen: (b: Brand) => void
}

const BrandCard = memo(({ brand: b, onOpen }: BrandCardProps) => (
  <button
    onClick={() => onOpen(b)}
    className="w-full flex items-start gap-3.5 p-4 bg-surface border border-border-light rounded-card-lg hover:border-primary/40 hover:shadow-elevated active:scale-[0.99] transition-all text-left"
  >
    <div className="w-16 h-16 rounded-card bg-white ring-1 ring-border-light flex items-center justify-center flex-shrink-0 overflow-hidden">
      <img
        src={b.src}
        alt={b.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain p-1.5"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-title text-ink truncate">{b.name}</span>
        {b.featured && (
          <span className="text-caption font-extrabold px-2 py-0.5 rounded bg-primary-50 text-primary flex-shrink-0">
            인기
          </span>
        )}
      </div>
      <p className="text-label text-ink-tertiary line-clamp-2 leading-snug">{b.description}</p>
      <div className="flex items-center gap-1.5 text-label text-ink-placeholder mt-2">
        <span>{b.type}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-ink-placeholder" />
        <span className="tabular-nums">전국 {b.branchCount.toLocaleString()}개 지점</span>
      </div>
    </div>
    <IconChevronRight className="w-4 h-4 stroke-ink-placeholder stroke-[1.5] flex-shrink-0 mt-1.5" />
  </button>
))
BrandCard.displayName = 'BrandCard'

export const BrandsPage = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('전체')
  const [brandQuery, setBrandQuery] = useState('')
  const [branchQuery, setBranchQuery] = useState('')

  const filtered = useMemo(() => {
    const bq = brandQuery.trim().toLowerCase()
    const lq = branchQuery.trim().toLowerCase()
    return BRANDS.filter(b => {
      if (filter !== '전체' && b.type !== filter) return false
      if (bq) {
        const hitBrand =
          b.name.toLowerCase().includes(bq) ||
          b.description.toLowerCase().includes(bq) ||
          b.tags.some(t => t.toLowerCase().includes(bq))
        if (!hitBrand) return false
      }
      if (lq) {
        const hitBranch = b.origin.toLowerCase().includes(lq)
        if (!hitBranch) return false
      }
      return true
    })
  }, [filter, brandQuery, branchQuery])

  const handleFilter = useCallback((k: string) => setFilter(k as Filter), [])

  const handleOpen = useCallback((b: Brand) => {
    navigate(`/brands/${b.id}`)
  }, [navigate])

  return (
    <PageLayout
      header={<SubPageHeader title="피트니스 브랜드관" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-6 pb-5 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-display font-extrabold text-ink leading-tight">피트니스 브랜드관</h1>
          <p className="text-body text-ink-secondary mt-2 leading-snug">
            전국 헬스·스튜디오 프랜차이즈를 한 곳에서 만나보세요
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="px-page pt-4 pb-1">
        <div className="flex items-center gap-2">
          <label className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-2.5 bg-surface-muted rounded-pill focus-within:bg-primary-50 focus-within:ring-1 focus-within:ring-primary/30 transition-colors">
            <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              value={branchQuery}
              onChange={e => setBranchQuery(e.target.value)}
              placeholder="지점 검색"
              className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
            />
            {branchQuery && (
              <button
                onClick={() => setBranchQuery('')}
                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                aria-label="지점 검색어 지우기"
              >
                <IconX className="w-3 h-3 stroke-white stroke-[3]" />
              </button>
            )}
          </label>
          <label className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-2.5 bg-surface-muted rounded-pill focus-within:bg-primary-50 focus-within:ring-1 focus-within:ring-primary/30 transition-colors">
            <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              value={brandQuery}
              onChange={e => setBrandQuery(e.target.value)}
              placeholder="브랜드 검색"
              className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
            />
            {brandQuery && (
              <button
                onClick={() => setBrandQuery('')}
                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                aria-label="브랜드 검색어 지우기"
              >
                <IconX className="w-3 h-3 stroke-white stroke-[3]" />
              </button>
            )}
          </label>
        </div>
      </div>

      {/* 카테고리 */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border mt-2">
        <FilterTabs
          tabs={FILTERS.map(c => ({ key: c, label: c }))}
          active={filter}
          onSelect={handleFilter}
          scrollable
          className="border-t border-border-light"
        />
      </div>

      {/* 리스트 */}
      <div className="px-page pt-4 pb-8">
        <div className="flex items-baseline justify-between py-1 mb-3">
          <h2 className="text-heading font-bold text-ink">브랜드 목록</h2>
          <span className="text-label text-ink-tertiary tabular-nums">{filtered.length}개</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center">
              <IconSearch className="w-5 h-5 stroke-ink-placeholder stroke-2" />
            </div>
            <p className="text-body text-ink-tertiary">해당 브랜드를 찾을 수 없어요</p>
            <p className="text-label text-ink-placeholder mt-1">다른 키워드로 검색해 보세요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map(b => (
              <BrandCard key={b.id} brand={b} onOpen={handleOpen} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
