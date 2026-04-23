import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch, IconShoppingBag } from '../../components/Icons'

const CATEGORIES = ['전체', '보충제', '운동용품', '웨어', '소도구', '케어'] as const
type Category = typeof CATEGORIES[number]

type Product = {
  id: number
  imageUrl: string
  name: string
  price: number
  originalPrice: number
  discount: number
  category: Category
  badge?: 'BEST' | 'NEW' | 'SALE' | '품절임박'
  rating: number
  reviewCount: number
  soldOut?: boolean
}

const BANNERS = [
  { id: 1, title: '신규 회원 전용', sub: '첫 구매 20% 할인쿠폰', bg: 'from-primary to-[#ff8f6a]', emoji: '🎉' },
  { id: 2, title: '이달의 베스트', sub: '프로틴 파우더 최대 30% OFF', bg: 'from-ink to-ink-secondary', emoji: '🏆' },
  { id: 3, title: '여름 준비 세일', sub: '운동 웨어 전 품목 할인', bg: 'from-[#7C3AED] to-[#EC4899]', emoji: '☀️' },
]

/* 상품 이미지 플레이스홀더 생성 (SVG data URL) */
const makeProductImage = (emoji: string, bgColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${bgColor}"/><text x="200" y="220" font-size="100" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const products: Product[] = [
  {
    id: 1, category: '보충제', badge: 'BEST',
    imageUrl: makeProductImage('🥛', '#FFF5E6'),
    name: '골드 스탠다드 웨이 프로틴 2kg',
    price: 59000, originalPrice: 79000, discount: 25, rating: 4.8, reviewCount: 324,
  },
  {
    id: 2, category: '보충제',
    imageUrl: makeProductImage('💊', '#EFF6FF'),
    name: 'BCAA 아미노산 파우더 300g',
    price: 32000, originalPrice: 40000, discount: 20, rating: 4.6, reviewCount: 187,
  },
  {
    id: 3, category: '보충제', badge: 'NEW',
    imageUrl: makeProductImage('⚡', '#FEF3C7'),
    name: '프리워크아웃 부스터 30서빙',
    price: 28000, originalPrice: 35000, discount: 20, rating: 4.5, reviewCount: 92,
  },
  {
    id: 4, category: '운동용품', badge: 'BEST',
    imageUrl: makeProductImage('🧘', '#ECFDF5'),
    name: '프리미엄 요가매트 10mm',
    price: 35000, originalPrice: 45000, discount: 22, rating: 4.9, reviewCount: 512,
  },
  {
    id: 5, category: '운동용품',
    imageUrl: makeProductImage('🔵', '#EDE9FE'),
    name: '고밀도 폼롤러 45cm',
    price: 28000, originalPrice: 35000, discount: 20, rating: 4.7, reviewCount: 203,
  },
  {
    id: 6, category: '소도구', badge: 'SALE',
    imageUrl: makeProductImage('🏋️', '#FEE2E2'),
    name: '저항 밴드 5종 세트',
    price: 18000, originalPrice: 30000, discount: 40, rating: 4.6, reviewCount: 278,
  },
  {
    id: 7, category: '웨어', badge: 'NEW',
    imageUrl: makeProductImage('👕', '#F0F9FF'),
    name: '드라이핏 트레이닝 반팔 티셔츠',
    price: 29000, originalPrice: 39000, discount: 26, rating: 4.7, reviewCount: 156,
  },
  {
    id: 8, category: '웨어',
    imageUrl: makeProductImage('👖', '#1a1a2e'),
    name: '컴프레션 레깅스 하이웨스트',
    price: 38000, originalPrice: 52000, discount: 27, rating: 4.8, reviewCount: 341,
  },
  {
    id: 9, category: '소도구',
    imageUrl: makeProductImage('🧤', '#F5F5F4'),
    name: '네오프렌 운동 장갑',
    price: 15000, originalPrice: 22000, discount: 32, rating: 4.4, reviewCount: 98,
  },
  {
    id: 10, category: '소도구',
    imageUrl: makeProductImage('🥤', '#E0F2FE'),
    name: '프리미엄 쉐이커 보틀 700ml',
    price: 12000, originalPrice: 15000, discount: 20, rating: 4.5, reviewCount: 445,
  },
  {
    id: 11, category: '케어', badge: 'NEW',
    imageUrl: makeProductImage('💆', '#FDF4FF'),
    name: '근육 마사지건 프로',
    price: 89000, originalPrice: 129000, discount: 31, rating: 4.9, reviewCount: 67,
  },
  {
    id: 12, category: '케어',
    imageUrl: makeProductImage('🧊', '#F0FDFA'),
    name: '냉온 찜질팩 대형',
    price: 15000, originalPrice: 20000, discount: 25, rating: 4.3, reviewCount: 132,
  },
]

const SORT_OPTIONS = ['인기순', '할인율순', '낮은가격순', '리뷰순'] as const

const badgeStyles: Record<string, string> = {
  BEST: 'bg-primary text-white',
  NEW: 'bg-ink text-white',
  SALE: 'bg-semantic-like text-white',
  '품절임박': 'bg-ink-secondary text-white',
}

export const ShopPage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category>('전체')
  const [sort, setSort] = useState<typeof SORT_OPTIONS[number]>('인기순')
  const [bannerIdx, setBannerIdx] = useState(0)
  const bannerRef = useRef<HTMLDivElement>(null)

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000)
    return () => clearInterval(timer)
  }, [])

  // 배너 스크롤 동기화
  useEffect(() => {
    bannerRef.current?.scrollTo({ left: bannerIdx * bannerRef.current.offsetWidth, behavior: 'smooth' })
  }, [bannerIdx])

  const filtered = products.filter(p => category === '전체' || p.category === category)
  const sorted = [...filtered].sort((a, b) => {
    if (sort === '할인율순') return b.discount - a.discount
    if (sort === '낮은가격순') return a.price - b.price
    if (sort === '리뷰순') return b.reviewCount - a.reviewCount
    return (b.badge === 'BEST' ? 1 : 0) - (a.badge === 'BEST' ? 1 : 0) || b.reviewCount - a.reviewCount
  })

  const header = (
    <SubPageHeader
      title="쇼핑몰"
      right={
        <div className="flex items-center gap-1">
          <button className="icon-btn" onClick={() => navigate('/branch')} aria-label="지점 검색">
            <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
          </button>
          <button className="icon-btn relative">
            <IconShoppingBag className="w-[22px] h-[22px] stroke-ink stroke-2" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-caption font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding>
      {/* 배너 슬라이드 */}
      <div className="pt-4 pb-3 px-page">
        <div
          ref={bannerRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-card-lg"
          onScroll={(e) => {
            const el = e.currentTarget
            const idx = Math.round(el.scrollLeft / el.offsetWidth)
            if (idx !== bannerIdx && idx >= 0 && idx < BANNERS.length) setBannerIdx(idx)
          }}
        >
          {BANNERS.map((b) => (
            <div
              key={b.id}
              className={`flex-shrink-0 w-full snap-center bg-gradient-to-r ${b.bg} rounded-card-lg p-5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-caption font-bold rounded mb-2">EVENT</span>
                  <h3 className="text-heading font-bold text-white">{b.title}</h3>
                  <p className="text-body text-white/80 mt-0.5">{b.sub}</p>
                </div>
                <span className="text-[40px] leading-none">{b.emoji}</span>
              </div>
            </div>
          ))}
        </div>
        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-2.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === bannerIdx ? 'w-5 bg-primary' : 'w-1.5 bg-ink-disabled'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="flex gap-2 px-page pb-3 overflow-x-auto hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-pill text-label font-semibold whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-ink text-white'
                : 'bg-surface-muted text-ink-secondary hover:bg-border-light'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="h-px bg-border" />

      {/* 정렬 & 상품 수 */}
      <div className="flex items-center justify-between px-page py-2.5">
        <span className="text-caption text-ink-tertiary">총 <span className="font-bold text-ink">{sorted.length}</span>개</span>
        <div className="flex gap-2">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`text-caption transition-colors ${sort === opt ? 'text-ink font-bold' : 'text-ink-placeholder'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-page pb-8">
        {sorted.map((product) => (
          <button
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-left group"
          >
            {/* 이미지 */}
            <div className="relative rounded-card-lg overflow-hidden mb-2.5">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <span className={`absolute top-2 left-2 px-2 py-0.5 text-caption font-bold rounded ${badgeStyles[product.badge]}`}>
                  {product.badge}
                </span>
              )}
              {/* 할인율 뱃지 */}
              {product.discount >= 30 && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-semantic-like text-white text-caption font-bold rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* 정보 */}
            <div>
              <p className="text-label text-ink-tertiary mb-0.5">{product.category}</p>
              <h3 className="text-body font-semibold text-ink line-clamp-2 mb-1.5 leading-snug">{product.name}</h3>
              <div className="flex items-baseline gap-1.5">
                <span className="text-primary font-extrabold text-body">{product.discount}%</span>
                <span className="text-title font-bold text-ink tabular-nums">{product.price.toLocaleString()}<span className="text-body">원</span></span>
              </div>
              <span className="text-caption text-ink-placeholder line-through tabular-nums">{product.originalPrice.toLocaleString()}원</span>
              {/* 별점 & 리뷰 */}
              <div className="flex items-center gap-1 mt-1.5">
                <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-[#FACC15]"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z"/></svg>
                <span className="text-caption font-semibold text-ink tabular-nums">{product.rating}</span>
                <span className="text-caption text-ink-placeholder tabular-nums">({product.reviewCount})</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
