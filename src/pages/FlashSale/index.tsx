import { memo, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, FilterTabs } from '../../components'
import { IconClock, IconStarFilled } from '../../components/Icons'

type TrialCategory = '바레톤' | '필라테스' | '요가' | 'PT' | 'HIT35' | '짐그라운드'

type Trial = {
  id: string
  category: TrialCategory
  title: string
  tag?: string
  gym: string
  trainer?: string
  rating: number
  reviewCount: number
  imageUrl: string
  originalPrice: number
  salePrice: number
  sessionText: string
  remainingSeats: number
  totalSeats: number
  endAt: Date
}

type TrialComputed = Trial & {
  discountPct: number
  stockPct: number
}

// 마감 시간을 분 단위 오프셋으로 저장 (초기 1회만 계산)
const MINUTES_FROM_NOW = (m: number) => new Date(Date.now() + m * 60_000)

const TRIALS_RAW: Trial[] = [
  {
    id: 'bareton-1',
    category: '바레톤',
    title: '첫 수업 3회 체험권',
    tag: '신규 회원 전용',
    gym: '바디채널 강남점',
    trainer: '박지영 강사',
    rating: 4.9,
    reviewCount: 1284,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=720&h=720&fit=crop',
    originalPrice: 99000,
    salePrice: 9900,
    sessionText: '체험 3회 · 회당 50분',
    remainingSeats: 7,
    totalSeats: 50,
    endAt: MINUTES_FROM_NOW(186),
  },
  {
    id: 'pilates-1',
    category: '필라테스',
    title: '그룹 필라테스 1회 체험',
    tag: '첫 방문 한정',
    gym: '바디채널 삼성점',
    rating: 4.8,
    reviewCount: 842,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&sat=-30',
    originalPrice: 45000,
    salePrice: 5000,
    sessionText: '체험 1회 · 50분',
    remainingSeats: 12,
    totalSeats: 40,
    endAt: MINUTES_FROM_NOW(42),
  },
  {
    id: 'hit35-1',
    category: 'HIT35',
    title: 'HIT35 체험 2회권',
    gym: '바디채널 강남점',
    trainer: '한동훈 강사',
    rating: 4.7,
    reviewCount: 623,
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop',
    originalPrice: 60000,
    salePrice: 12000,
    sessionText: '체험 2회 · 회당 35분',
    remainingSeats: 23,
    totalSeats: 60,
    endAt: MINUTES_FROM_NOW(320),
  },
  {
    id: 'pt-1',
    category: 'PT',
    title: 'PT 1:1 체험권',
    tag: '트레이너 매칭',
    gym: '바디채널 잠실점',
    rating: 4.9,
    reviewCount: 1124,
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop',
    originalPrice: 88000,
    salePrice: 19000,
    sessionText: '체험 1회 · 60분',
    remainingSeats: 4,
    totalSeats: 30,
    endAt: MINUTES_FROM_NOW(95),
  },
  {
    id: 'yoga-1',
    category: '요가',
    title: '하타 요가 2회 체험',
    gym: '바디채널 역삼점',
    rating: 4.6,
    reviewCount: 412,
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=400&fit=crop',
    originalPrice: 36000,
    salePrice: 6000,
    sessionText: '체험 2회 · 회당 60분',
    remainingSeats: 18,
    totalSeats: 40,
    endAt: MINUTES_FROM_NOW(720),
  },
  {
    id: 'gymground-1',
    category: '짐그라운드',
    title: '그룹 서킷 체험',
    tag: '소도구 활용',
    gym: '바디채널 종로점',
    trainer: '이준혁 강사',
    rating: 4.7,
    reviewCount: 287,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    originalPrice: 32000,
    salePrice: 7000,
    sessionText: '체험 1회 · 55분',
    remainingSeats: 9,
    totalSeats: 30,
    endAt: MINUTES_FROM_NOW(510),
  },
  {
    id: 'bareton-2',
    category: '바레톤',
    title: '1회 체험 클래스',
    gym: '바디채널 판교점',
    rating: 4.8,
    reviewCount: 356,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&hue=30',
    originalPrice: 38000,
    salePrice: 4900,
    sessionText: '체험 1회 · 50분',
    remainingSeats: 2,
    totalSeats: 20,
    endAt: MINUTES_FROM_NOW(28),
  },
]

// 파생값 사전 계산 (컴포넌트 외부, 모듈 최초 평가 시 1회)
const TRIALS: TrialComputed[] = TRIALS_RAW.map(t => ({
  ...t,
  discountPct: Math.round((1 - t.salePrice / t.originalPrice) * 100),
  stockPct: Math.round(((t.totalSeats - t.remainingSeats) / t.totalSeats) * 100),
}))

const CATEGORIES: ('전체' | TrialCategory)[] = ['전체', '바레톤', '필라테스', '요가', 'PT', 'HIT35', '짐그라운드']

// ─── 타이머 유틸 ──────────────────────────────────────
const secondsLeft = (target: Date) => Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000))

const formatRemaining = (total: number) => {
  if (total <= 0) return '마감'
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}시간 ${String(m).padStart(2, '0')}분`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * 적응형 틱 훅:
 * - 어떤 타이머라도 60초 이하면 1초 간격
 * - 그렇지 않으면 30초 간격
 * - 페이지 비표시(hidden) 상태에선 정지 → 리소스 절약
 */
const useAdaptiveTick = (nextDeadlinesSec: number[]) => {
  const [, setTick] = useState(0)

  useEffect(() => {
    let timerId: number | undefined

    const schedule = () => {
      if (document.hidden) return
      const min = Math.min(...nextDeadlinesSec, Infinity)
      const interval = min <= 60 ? 1000 : 30000
      timerId = window.setTimeout(() => {
        setTick(t => t + 1)
        schedule()
      }, interval)
    }

    const onVisibility = () => {
      if (timerId) window.clearTimeout(timerId)
      if (!document.hidden) schedule()
    }

    schedule()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (timerId) window.clearTimeout(timerId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// ─── 서브 컴포넌트 ────────────────────────────────────
interface TrialRowProps {
  trial: TrialComputed
  onClick: (id: string) => void
}

const TrialRow = memo(({ trial: t, onClick }: TrialRowProps) => {
  const countdownSec = secondsLeft(t.endAt)
  const isUrgent = countdownSec > 0 && countdownSec <= 3600
  const isLastSeats = t.remainingSeats <= 5

  return (
    <button
      onClick={() => onClick(t.id)}
      className="group flex gap-3.5 py-4 text-left active:bg-surface-muted/50 transition-colors"
    >
      <div className="relative w-28 h-28 flex-shrink-0 rounded-card-lg overflow-hidden bg-surface-muted">
        <img
          src={t.imageUrl}
          alt={t.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-active:scale-[1.02] transition-transform"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-caption font-extrabold text-primary tracking-wider">
              {t.category.toUpperCase()}
            </span>
            {t.tag && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-ink-placeholder" />
                <span className="text-caption text-ink-tertiary">{t.tag}</span>
              </>
            )}
          </div>
          <h4 className="text-body font-bold text-ink leading-snug line-clamp-1">
            {t.title}
          </h4>
          <p className="text-label text-ink-tertiary mt-0.5 line-clamp-1">
            {t.gym}{t.trainer ? ` · ${t.trainer}` : ''} · {t.sessionText}
          </p>
          <div className="flex items-center gap-0.5 mt-1 text-label">
            <IconStarFilled className="w-3.5 h-3.5 fill-ink" />
            <span className="font-bold text-ink tabular-nums">{t.rating}</span>
            <span className="text-ink-placeholder tabular-nums">({t.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-label font-extrabold text-primary tabular-nums">
              {t.discountPct}%
            </span>
            <span className="text-title font-extrabold text-ink tabular-nums leading-none">
              {t.salePrice.toLocaleString()}
              <span className="text-label font-semibold ml-0.5">원</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-label">
            {isLastSeats && (
              <span className="text-caption font-extrabold text-semantic-like tabular-nums">
                {t.remainingSeats}석
              </span>
            )}
            <span className={`flex items-center gap-0.5 font-bold tabular-nums ${
              isUrgent ? 'text-semantic-like' : 'text-ink-tertiary'
            }`}>
              <IconClock className={`w-3.5 h-3.5 stroke-[2.5] ${
                isUrgent ? 'stroke-semantic-like' : 'stroke-ink-tertiary'
              }`} />
              {formatRemaining(countdownSec)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
})
TrialRow.displayName = 'TrialRow'

// ─── 페이지 ──────────────────────────────────────────
export const FlashSalePage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<'전체' | TrialCategory>('전체')

  const filteredTrials = useMemo(
    () => category === '전체' ? TRIALS : TRIALS.filter(t => t.category === category),
    [category],
  )

  // 적응형 틱: 모든 카드의 남은 시간을 기반으로 간격 결정
  useAdaptiveTick(TRIALS.map(t => secondsLeft(t.endAt)))

  const todayDateStr = useMemo(() => {
    const d = new Date()
    const week = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getMonth() + 1}.${d.getDate()} (${week[d.getDay()]})`
  }, [])

  const handleTrialClick = useMemo(
    () => (_id: string) => navigate('/gym/gym1'),
    [navigate],
  )

  return (
    <PageLayout
      header={<SubPageHeader title="체험특가" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 인트로 */}
      <div className="px-page pt-5 pb-3 bg-surface">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-label font-bold tracking-[0.2em] text-primary">
            TODAY'S TRIAL
          </span>
          <span className="text-label text-ink-tertiary tabular-nums">{todayDateStr}</span>
        </div>
        <h1 className="text-[30px] leading-[1.15] font-extrabold text-ink">
          먼저 체험하고 <span className="text-ink/50">결정하세요</span>
        </h1>
        <p className="text-body text-ink-tertiary mt-2">
          최대 <span className="font-bold text-ink">90%</span> 할인 · 오늘 마감 {TRIALS.length}개
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <FilterTabs
          tabs={CATEGORIES.map(c => ({ key: c, label: c }))}
          active={category}
          onSelect={(k) => setCategory(k as typeof category)}
          scrollable
          className="border-t border-border-light"
        />
      </div>

      {/* 리스트 */}
      <div className="px-page pt-4 pb-4">
        <div className="flex items-baseline justify-between py-1">
          <h3 className="text-title font-extrabold text-ink">오늘의 체험권</h3>
          <span className="text-label text-ink-tertiary tabular-nums">
            {filteredTrials.length}개
          </span>
        </div>

        {filteredTrials.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-body text-ink-tertiary">해당 카테고리 체험권이 없어요</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border-light">
            {filteredTrials.map(t => (
              <TrialRow key={t.id} trial={t} onClick={handleTrialClick} />
            ))}
          </div>
        )}

        {/* 유의사항 */}
        <div className="mt-6 bg-surface-muted rounded-card-lg p-5">
          <h4 className="text-label font-extrabold text-ink mb-2 tracking-wider">체험권 안내</h4>
          <ul className="text-label text-ink-tertiary leading-relaxed space-y-0.5">
            <li>— 체험권은 1인 1회, 신규/재방문 기준 상이</li>
            <li>— 한정 수량 소진 시 마감되며 환불 불가</li>
            <li>— 쿠폰과 중복 할인 적용되지 않음</li>
            <li>— 결제 후 30일 이내 사용 가능</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}
