import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, FilterTabs } from '../../components'
import { IconCheck, IconTicket, IconClock } from '../../components/Icons'

type CouponStatus = 'available' | 'claimed' | 'soldout'

type EventCoupon = {
  id: string
  title: string
  subtitle: string
  discountText: string // 표시용 (예: "5,000원", "10%", "무료")
  discountUnit?: string // "원 할인", "% 할인"
  condition: string // 사용 조건
  expireDate: string // ISO: 2026.05.15
  category?: string // "레슨권", "PT" 등
  highlight?: boolean // 추천 쿠폰
  status: CouponStatus
}

const INITIAL_COUPONS: EventCoupon[] = [
  {
    id: 'welcome',
    title: '신규회원 웰컴 쿠폰',
    subtitle: '첫 결제 시 한 번만 사용 가능',
    discountText: '10,000',
    discountUnit: '원 할인',
    condition: '3만원 이상 결제',
    expireDate: '2026.05.15',
    highlight: true,
    status: 'available',
  },
  {
    id: 'lesson',
    title: '레슨권 전용 할인',
    subtitle: '바레톤 · HIT35 · PT 모두 사용 가능',
    discountText: '15',
    discountUnit: '% 할인',
    condition: '레슨권 카테고리',
    expireDate: '2026.05.10',
    category: '레슨권',
    status: 'available',
  },
  {
    id: 'pt',
    title: 'PT 1회 무료 체험',
    subtitle: 'PT 패키지 신규 구매 회원 한정',
    discountText: '무료',
    condition: 'PT 패키지 결제 시',
    expireDate: '2026.04.30',
    category: 'PT',
    status: 'available',
  },
  {
    id: 'shop',
    title: '스토어 3,000원 할인',
    subtitle: '단백질/보충제/운동용품 사용 가능',
    discountText: '3,000',
    discountUnit: '원 할인',
    condition: '2만원 이상 결제',
    expireDate: '2026.06.30',
    category: '스토어',
    status: 'available',
  },
  {
    id: 'membership',
    title: '헬스 이용권 20% 할인',
    subtitle: '1개월/3개월/6개월권 모두 가능',
    discountText: '20',
    discountUnit: '% 할인',
    condition: '헬스 이용권 카테고리',
    expireDate: '2026.05.25',
    category: '헬스',
    status: 'soldout',
  },
  {
    id: 'meetup',
    title: '운동모임 참가비 할인',
    subtitle: '러닝/클라이밍/크로스핏 등',
    discountText: '2,000',
    discountUnit: '원 할인',
    condition: '모임 참가비 1만원 이상',
    expireDate: '2026.05.20',
    category: '모임',
    status: 'available',
  },
]

// "2026.05.15" → D-days
const daysUntil = (iso: string) => {
  const target = new Date(iso.replaceAll('.', '-'))
  const now = new Date(); now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

type FilterTab = '전체' | '추천' | '레슨권' | 'PT' | '헬스' | '스토어' | '모임'
const FILTER_TABS: FilterTab[] = ['전체', '추천', '레슨권', 'PT', '헬스', '스토어', '모임']

export const EventCouponPage = () => {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState<EventCoupon[]>(INITIAL_COUPONS)
  const [filter, setFilter] = useState<FilterTab>('전체')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === '전체') return coupons
    if (filter === '추천') return coupons.filter(c => c.highlight)
    return coupons.filter(c => c.category === filter)
  }, [coupons, filter])

  const availableCount = coupons.filter(c => c.status === 'available').length
  const claimedCount = coupons.filter(c => c.status === 'claimed').length

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const claim = (id: string) => {
    setCoupons(prev => prev.map(c =>
      c.id === id && c.status === 'available' ? { ...c, status: 'claimed' } : c
    ))
    showToast('쿠폰을 받았어요')
  }

  const claimAll = () => {
    const targets = coupons.filter(c => c.status === 'available')
    if (targets.length === 0) return
    setCoupons(prev => prev.map(c =>
      c.status === 'available' ? { ...c, status: 'claimed' } : c
    ))
    showToast(`${targets.length}장의 쿠폰을 모두 받았어요`)
  }

  const header = (
    <SubPageHeader
      title="이벤트 쿠폰"
      right={
        <button
          onClick={() => navigate('/wallet/coupon')}
          className="px-3 py-1.5 text-caption font-semibold text-ink-secondary hover:text-ink transition-colors"
        >
          내 쿠폰
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} hideBottomNav noPadding className="!pb-0">
      {/* 이벤트 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-white px-page pt-6 pb-6">
        {/* 장식 원 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute top-16 -right-20 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-14 -left-10 w-36 h-36 rounded-full bg-black/10" />

        <div className="relative">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-white/20 backdrop-blur-sm text-caption font-semibold mb-3">
            <IconClock className="w-3 h-3 stroke-white stroke-[2.5]" />
            4월 한정 이벤트
          </div>
          <h2 className="text-heading font-extrabold leading-tight mb-1">
            쿠폰 받고<br />혜택받으세요
          </h2>
          <p className="text-label text-white/80">쿠폰을 받고 결제 시 선택해 사용하세요</p>

          {/* 전체 받기 버튼 */}
          <button
            onClick={claimAll}
            disabled={availableCount === 0}
            className="w-full mt-5 py-3 bg-white text-primary text-body font-extrabold rounded-pill hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-card"
          >
            {availableCount > 0 ? (
              <>
                <IconTicket className="w-5 h-5 stroke-primary stroke-[1.8]" />
                쿠폰 모두 받기
              </>
            ) : (
              <>
                <IconCheck className="w-5 h-5 stroke-primary stroke-[2.5]" />
                모든 쿠폰을 받았어요
              </>
            )}
          </button>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <FilterTabs
          tabs={FILTER_TABS.map(t => ({ key: t, label: t }))}
          active={filter}
          onSelect={(k) => setFilter(k as FilterTab)}
          scrollable
          className="border-t border-border-light"
        />
      </div>

      {/* 받은 쿠폰 안내 */}
      {claimedCount > 0 && (
        <div className="px-page pt-3 -mb-1">
          <div className="flex items-center justify-between bg-primary-50 rounded-card px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <IconCheck className="w-4 h-4 stroke-white stroke-[2.5]" />
              </div>
              <span className="text-label font-semibold text-ink">
                <span className="text-primary tabular-nums">{claimedCount}장</span> 받음 · 지갑에서 확인
              </span>
            </div>
            <button
              onClick={() => navigate('/wallet/coupon')}
              className="text-label font-bold text-primary hover:text-primary-dark"
            >
              지갑으로 →
            </button>
          </div>
        </div>
      )}

      {/* 쿠폰 리스트 */}
      <div className="px-page py-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center">
              <IconTicket className="w-6 h-6 stroke-ink-placeholder" />
            </div>
            <p className="text-body text-ink-tertiary">해당 카테고리에 쿠폰이 없어요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(c => {
              const days = daysUntil(c.expireDate)
              const isUrgent = days <= 7 && days >= 0
              const isClaimed = c.status === 'claimed'
              const isSoldout = c.status === 'soldout'
              const disabled = isClaimed || isSoldout

              return (
                <div
                  key={c.id}
                  className={`relative flex bg-surface rounded-card-lg border overflow-hidden transition-all ${
                    disabled
                      ? 'border-border-light'
                      : c.highlight
                      ? 'border-primary/40 shadow-card hover:shadow-card-hover'
                      : 'border-border shadow-card hover:shadow-card-hover'
                  }`}
                >
                  {/* HOT 배지 */}
                  {c.highlight && !disabled && (
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-semantic-like text-white text-[11px] font-extrabold rounded-bl-card">
                      HOT
                    </div>
                  )}

                  {/* 좌측 할인 금액 블록 */}
                  <div className={`relative flex flex-col items-center justify-center w-[104px] flex-shrink-0 px-3 py-4 ${
                    disabled
                      ? 'bg-surface-muted'
                      : c.highlight
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
                      : 'bg-primary-50'
                  }`}>
                    {/* 톱니 점선 (오른쪽 경계) */}
                    <div
                      className="absolute top-0 right-0 h-full w-px"
                      style={{
                        backgroundImage: `radial-gradient(circle at 0 4px, ${disabled ? '#f5f5f5' : c.highlight ? '#ffffff' : '#ffffff'} 2.5px, transparent 3px)`,
                        backgroundSize: '6px 10px',
                        backgroundRepeat: 'repeat-y',
                      }}
                    />
                    {/* 톱니 절단 (상/하) */}
                    <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${disabled ? 'bg-surface' : 'bg-surface'}`} />
                    <div className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full ${disabled ? 'bg-surface' : 'bg-surface'}`} />

                    <div className="text-center">
                      <div className={`text-display leading-none font-extrabold tabular-nums ${
                        disabled ? 'text-ink-placeholder' : c.highlight ? 'text-white' : 'text-primary'
                      }`}>
                        {c.discountText}
                      </div>
                      {c.discountUnit && (
                        <div className={`text-label font-bold mt-1 ${
                          disabled ? 'text-ink-placeholder' : c.highlight ? 'text-white/90' : 'text-primary'
                        }`}>
                          {c.discountUnit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 우측 정보 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between p-4 pl-5">
                    <div>
                      <div className="flex items-start gap-1.5 mb-0.5">
                        <h3 className={`text-label font-bold leading-snug ${
                          disabled ? 'text-ink-tertiary' : 'text-ink'
                        }`}>
                          {c.title}
                        </h3>
                      </div>
                      <p className={`text-label mb-2 line-clamp-1 ${
                        disabled ? 'text-ink-placeholder' : 'text-ink-tertiary'
                      }`}>
                        {c.subtitle}
                      </p>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-caption font-semibold ${
                        disabled
                          ? 'bg-surface-muted text-ink-placeholder'
                          : 'bg-surface-muted text-ink-secondary'
                      }`}>
                        {c.condition}
                      </div>
                    </div>

                    {/* 하단: 만료/남은수량 + 버튼 */}
                    <div className="flex items-end justify-between gap-3 mt-3">
                      <div className="min-w-0 flex-1">
                        <div className={`text-label tabular-nums ${
                          isSoldout
                            ? 'text-ink-placeholder'
                            : isUrgent && !isClaimed
                            ? 'text-semantic-like font-semibold'
                            : 'text-ink-placeholder'
                        }`}>
                          {isUrgent && !isClaimed ? `⏰ D-${days} · ~${c.expireDate}` : `~${c.expireDate}까지`}
                        </div>
                      </div>

                      <button
                        onClick={() => claim(c.id)}
                        disabled={disabled}
                        className={`flex-shrink-0 px-4 py-2.5 rounded-pill text-label font-extrabold transition-all ${
                          isClaimed
                            ? 'bg-surface-muted text-ink-tertiary cursor-default'
                            : isSoldout
                            ? 'bg-surface-muted text-ink-placeholder cursor-not-allowed'
                            : 'bg-ink text-white hover:bg-ink/85 active:scale-95'
                        }`}
                      >
                        {isClaimed ? (
                          <span className="flex items-center gap-1">
                            <IconCheck className="w-4 h-4 stroke-ink-tertiary stroke-[2.5]" />
                            받음
                          </span>
                        ) : isSoldout ? (
                          '품절'
                        ) : (
                          '받기'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 안내 사항 */}
        <div className="mt-6 bg-surface-muted rounded-card-lg p-5">
          <h4 className="text-label font-extrabold text-ink mb-2 tracking-wider">쿠폰 유의사항</h4>
          <ul className="text-label text-ink-tertiary leading-relaxed space-y-0.5">
            <li>— 다운로드한 쿠폰은 내 지갑에서 확인할 수 있어요</li>
            <li>— 쿠폰은 최소 결제 금액 조건에 맞아야 사용 가능해요</li>
            <li>— 이벤트 쿠폰은 중복 사용이 불가합니다</li>
            <li>— 유효기간 내 미사용 시 자동 소멸됩니다</li>
          </ul>
        </div>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <IconCheck className="w-3 h-3 stroke-white stroke-[3]" />
          </div>
          {toast}
        </div>
      )}
    </PageLayout>
  )
}
