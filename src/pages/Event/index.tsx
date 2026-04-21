import { memo, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, FilterTabs } from '../../components'
import { IconCalendar, IconChevronRight, IconStarFilled } from '../../components/Icons'

type EventStatus = 'live' | 'ending' | 'upcoming' | 'ended'

type Event = {
  id: string
  badge?: string // "신규", "HOT", "마감임박"
  title: string
  reward: string // 혜택 요약
  description: string
  startDate: string // 2026.04.01
  endDate: string // 2026.05.31
  href: string
  accent: 'primary' | 'blue' | 'pink' | 'green' | 'purple' | 'ink'
  participants?: number
  status: EventStatus
}

const EVENTS: Event[] = [
  {
    id: 'welcome',
    badge: '신규',
    title: '첫 방문 웰컴 패키지',
    reward: '쿠폰 10,000원 + 체험권 1장',
    description: '가입 후 7일 이내 사용 가능한 혜택',
    startDate: '2026.04.01',
    endDate: '2026.05.31',
    href: '/coupon',
    accent: 'primary',
    participants: 12480,
    status: 'live',
  },
  {
    id: 'attendance',
    title: '매일 출석 체크',
    reward: '최대 10,000P + 쿠폰',
    description: '7일 연속 출석 시 보너스 3,000P',
    startDate: '상시',
    endDate: '종료일 없음',
    href: '/attendance',
    accent: 'blue',
    participants: 8721,
    status: 'live',
  },
  {
    id: 'invite',
    badge: 'HOT',
    title: '친구 초대하고 혜택받기',
    reward: '초대 1명당 5,000원',
    description: '내 친구가 첫 결제하면 나에게도',
    startDate: '2026.03.15',
    endDate: '2026.06.30',
    href: '/invite',
    accent: 'pink',
    participants: 5632,
    status: 'live',
  },
  {
    id: 'review',
    title: '리뷰 작성 이벤트',
    reward: '작성 시 1,000P · 사진 포함 3,000P',
    description: '수업 후 리뷰를 남기고 포인트 받기',
    startDate: '2026.04.01',
    endDate: '2026.04.30',
    href: '/review-event',
    accent: 'green',
    participants: 2147,
    status: 'ending',
  },
  {
    id: 'challenge',
    badge: '마감임박',
    title: '30일 러닝 챌린지',
    reward: '완주 시 10만원 상당 굿즈',
    description: '매일 3km 이상 러닝 기록 인증',
    startDate: '2026.04.01',
    endDate: '2026.04.30',
    href: '/challenge',
    accent: 'purple',
    participants: 1824,
    status: 'ending',
  },
  {
    id: 'trial',
    title: '체험특가',
    reward: '최대 90% 할인 체험권',
    description: '오늘만, 선착순으로 만나보세요',
    startDate: '매일 00:00',
    endDate: '매일 자정',
    href: '/flash-sale',
    accent: 'ink',
    participants: 9842,
    status: 'live',
  },
]

type FilterKey = '전체' | '진행중' | '마감임박' | '종료'
const FILTERS: FilterKey[] = ['전체', '진행중', '마감임박', '종료']

const ACCENT_STYLE: Record<Event['accent'], { bg: string; text: string; icon: string }> = {
  primary: { bg: 'bg-gradient-to-br from-primary to-primary-dark', text: 'text-white', icon: 'text-white/80' },
  blue:    { bg: 'bg-gradient-to-br from-[#3b82f6] to-[#1e40af]', text: 'text-white', icon: 'text-white/80' },
  pink:    { bg: 'bg-gradient-to-br from-[#ec4899] to-[#be185d]', text: 'text-white', icon: 'text-white/80' },
  green:   { bg: 'bg-gradient-to-br from-[#10b981] to-[#047857]', text: 'text-white', icon: 'text-white/80' },
  purple:  { bg: 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]', text: 'text-white', icon: 'text-white/80' },
  ink:     { bg: 'bg-gradient-to-br from-ink to-ink/80', text: 'text-white', icon: 'text-white/80' },
}

// "2026.04.30" → 남은 일수
const daysUntil = (iso: string) => {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(iso)) return null
  const target = new Date(iso.replaceAll('.', '-'))
  const now = new Date(); now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000)
}

interface EventCardProps {
  event: Event
  onClick: (href: string) => void
  featured?: boolean
}

const EventCard = memo(({ event, onClick, featured }: EventCardProps) => {
  const style = ACCENT_STYLE[event.accent]
  const d = daysUntil(event.endDate)
  const dayLabel = d === null ? null : d < 0 ? '종료' : d === 0 ? '오늘 마감' : `D-${d}`
  const isEnded = event.status === 'ended'
  const isUrgent = event.status === 'ending'

  return (
    <button
      onClick={() => onClick(event.href)}
      disabled={isEnded}
      className={`group relative w-full text-left rounded-card-lg overflow-hidden ${style.bg} shadow-card active:scale-[0.99] transition-all disabled:grayscale disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {/* 장식 */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-black/10 blur-xl pointer-events-none" />

      <div className={`relative ${style.text} ${featured ? 'p-6' : 'p-5'}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            {event.badge && (
              <span className={`px-2 py-0.5 rounded-pill text-[11px] font-extrabold ${
                event.badge === 'HOT' ? 'bg-semantic-like text-white'
                : event.badge === '마감임박' ? 'bg-white text-ink'
                : 'bg-white/20 backdrop-blur text-white'
              }`}>
                {event.badge}
              </span>
            )}
            {dayLabel && !event.badge && (
              <span className={`px-2 py-0.5 rounded-pill text-[11px] font-extrabold ${
                isUrgent ? 'bg-white text-ink' : 'bg-white/20 backdrop-blur text-white'
              }`}>
                {dayLabel}
              </span>
            )}
          </div>
          <IconChevronRight className={`w-5 h-5 stroke-[2.5] ${style.icon} group-active:translate-x-0.5 transition-transform`} />
        </div>

        <h3 className={`${featured ? 'text-heading' : 'text-title'} font-extrabold leading-tight mb-1.5`}>
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 mb-2">
          <IconStarFilled className="w-3.5 h-3.5 fill-semantic-star" />
          <span className="text-label font-bold">{event.reward}</span>
        </div>
        <p className={`text-caption ${style.icon} leading-relaxed`}>
          {event.description}
        </p>

        {/* 메타 */}
        <div className={`flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/15 text-caption ${style.icon}`}>
          <div className="flex items-center gap-1 tabular-nums">
            <IconCalendar className={`w-3.5 h-3.5 stroke-2 ${style.icon}`} />
            <span>
              {event.startDate === '상시' || event.startDate === '매일 00:00'
                ? event.startDate
                : `${event.startDate.slice(5).replace('.', '/')} ~ ${event.endDate.slice(5).replace('.', '/')}`}
            </span>
          </div>
          {event.participants !== undefined && (
            <span className="tabular-nums">
              <span className="font-bold text-white">{event.participants.toLocaleString()}</span>명 참여중
            </span>
          )}
        </div>
      </div>
    </button>
  )
})
EventCard.displayName = 'EventCard'

export const EventPage = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterKey>('전체')

  const filtered = useMemo(() => {
    if (filter === '전체') return EVENTS
    if (filter === '진행중') return EVENTS.filter(e => e.status === 'live' || e.status === 'ending')
    if (filter === '마감임박') return EVENTS.filter(e => e.status === 'ending')
    return EVENTS.filter(e => e.status === 'ended')
  }, [filter])

  const counts = useMemo(() => ({
    전체: EVENTS.length,
    진행중: EVENTS.filter(e => e.status === 'live' || e.status === 'ending').length,
    마감임박: EVENTS.filter(e => e.status === 'ending').length,
    종료: EVENTS.filter(e => e.status === 'ended').length,
  }), [])

  const [featured, ...rest] = filtered

  const handleClick = (href: string) => navigate(href)

  return (
    <PageLayout
      header={<SubPageHeader title="이벤트" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 인트로 */}
      <div className="px-page pt-5 pb-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-label font-bold tracking-[0.2em] text-primary">
            TODAY'S EVENT
          </span>
          <span className="text-label text-ink-tertiary tabular-nums">
            {counts.진행중}개 진행중
          </span>
        </div>
        <h1 className="text-[30px] leading-[1.15] font-extrabold text-ink">
          진행중인 이벤트에 <span className="text-ink/50">참여하세요</span>
        </h1>
        <p className="text-body text-ink-tertiary mt-2">
          쿠폰·포인트·체험권까지 한 번에 챙기는 혜택
        </p>
      </div>

      {/* 필터 */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <FilterTabs
          tabs={FILTERS.map(f => ({ key: f, label: `${f} ${counts[f]}` }))}
          active={filter}
          onSelect={(k) => setFilter(k as FilterKey)}
          scrollable
          className="border-t border-border-light"
        />
      </div>

      {/* 이벤트 카드들 */}
      <div className="px-page pt-4 pb-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-body text-ink-tertiary">해당 상태의 이벤트가 없어요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {featured && <EventCard event={featured} onClick={handleClick} featured />}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {rest.map(e => (
                  <EventCard key={e.id} event={e} onClick={handleClick} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 안내 */}
        <div className="mt-6 bg-surface-muted rounded-card-lg p-5">
          <h4 className="text-label font-extrabold text-ink mb-2 tracking-wider">이벤트 안내</h4>
          <ul className="text-label text-ink-tertiary leading-relaxed space-y-0.5">
            <li>— 이벤트 보상은 조건 충족 후 1~3영업일 내 지급</li>
            <li>— 중복 참여 가능 여부는 각 이벤트 상세를 확인</li>
            <li>— 부정 참여 적발 시 보상 회수·계정 제한 조치</li>
            <li>— 이벤트 내용은 사정에 따라 변경될 수 있음</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}
