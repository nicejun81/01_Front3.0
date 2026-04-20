import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

type Role = '모임장' | '멤버'
type Tab = '전체' | '모임장' | '멤버'
const TABS: Tab[] = ['전체', '모임장', '멤버']

type SortKey = '임박순' | '최신순' | '인기순'
const SORTS: SortKey[] = ['임박순', '최신순', '인기순']

type Meetup = {
  id: number
  title: string
  category: string
  schedule: string
  location: string
  imageUrl: string
  role: Role
  memberCount: number
  maxMembers: number
  nextMeetingAt: string // ISO
  unreadCount?: number
  joinedAt: string // ISO
}

// 오늘 기준으로 임박한 모임 데이터
const today = new Date()
const addDays = (n: number, h = 7, m = 0) => {
  const d = new Date(today); d.setDate(d.getDate() + n); d.setHours(h, m, 0, 0); return d.toISOString()
}

const myMeetups: Meetup[] = [
  {
    id: 2,
    title: '모닝 바레톤 클럽',
    category: '바레톤',
    schedule: '매주 수/금 오전 6시',
    location: '바디채널 강남점',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    role: '모임장',
    memberCount: 12,
    maxMembers: 15,
    nextMeetingAt: addDays(2, 6, 0),
    unreadCount: 7,
    joinedAt: '2026-02-10',
  },
  {
    id: 1,
    title: '강남 러닝크루',
    category: '러닝',
    schedule: '매주 토요일 오전 7시',
    location: '한강공원 잠원지구',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    role: '멤버',
    memberCount: 24,
    maxMembers: 30,
    nextMeetingAt: addDays(5, 7, 0),
    unreadCount: 3,
    joinedAt: '2026-03-22',
  },
]

const roleStyles: Record<Role, string> = {
  '모임장': 'bg-primary text-white',
  '멤버': 'bg-white/95 text-ink',
}

const formatRelativeDay = (iso: string) => {
  const target = new Date(iso)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: '지남', urgent: false }
  if (diffDays === 0) return { label: '오늘', urgent: true }
  if (diffDays === 1) return { label: '내일', urgent: true }
  if (diffDays <= 3) return { label: `D-${diffDays}`, urgent: true }
  return { label: `D-${diffDays}`, urgent: false }
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${week}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const formatHourMin = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const IconCalendar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconLocation = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const IconUsers = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconChat = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const IconPlus = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const IconClock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export const MyMeetupsPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('전체')
  const [sort, setSort] = useState<SortKey>('임박순')

  const counts = useMemo(() => ({
    전체: myMeetups.length,
    모임장: myMeetups.filter(m => m.role === '모임장').length,
    멤버: myMeetups.filter(m => m.role === '멤버').length,
  }), [])

  const filtered = useMemo(() => {
    let list = tab === '전체' ? myMeetups : myMeetups.filter(m => m.role === tab)
    list = [...list]
    if (sort === '임박순') list.sort((a, b) => new Date(a.nextMeetingAt).getTime() - new Date(b.nextMeetingAt).getTime())
    else if (sort === '최신순') list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    else list.sort((a, b) => b.memberCount - a.memberCount)
    return list
  }, [tab, sort])

  // 가장 임박한 모임 (히어로)
  const upcoming = useMemo(
    () => [...myMeetups].sort((a, b) => new Date(a.nextMeetingAt).getTime() - new Date(b.nextMeetingAt).getTime())[0],
    [],
  )

  const totalUnread = myMeetups.reduce((s, m) => s + (m.unreadCount ?? 0), 0)
  const upcomingRel = upcoming ? formatRelativeDay(upcoming.nextMeetingAt) : null

  const header = (
    <SubPageHeader
      title="내 모임"
      right={
        <button onClick={() => navigate('/meetup/new')} className="icon-btn" aria-label="모임 만들기">
          <IconPlus className="w-[22px] h-[22px] stroke-ink" />
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding>
      {/* 요약 통계 */}
      <div className="px-page pt-4 pb-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-muted rounded-card-lg p-3 text-center">
            <div className="text-h3 font-bold text-ink tabular-nums leading-none">{counts.전체}</div>
            <div className="text-caption text-ink-tertiary mt-1">참여중</div>
          </div>
          <div className="bg-surface-muted rounded-card-lg p-3 text-center">
            <div className="text-h3 font-bold text-primary tabular-nums leading-none">{counts.모임장}</div>
            <div className="text-caption text-ink-tertiary mt-1">모임장</div>
          </div>
          <div className="bg-surface-muted rounded-card-lg p-3 text-center">
            <div className="text-h3 font-bold text-ink tabular-nums leading-none">
              {totalUnread}
              <span className="text-label font-semibold text-ink-tertiary ml-0.5">건</span>
            </div>
            <div className="text-caption text-ink-tertiary mt-1">새 소식</div>
          </div>
        </div>
      </div>

      {/* 다가오는 모임 — 히어로 */}
      {upcoming && upcomingRel && (
        <div className="px-page pb-4">
          <button
            onClick={() => navigate(`/meetup/${upcoming.id}`)}
            className="relative w-full overflow-hidden rounded-card-lg text-left group"
          >
            <img src={upcoming.imageUrl} alt={upcoming.title} className="w-full h-[150px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-white/95 backdrop-blur rounded text-caption font-bold text-ink">
                다가오는 모임
              </span>
              <span className={`px-2 py-0.5 rounded text-caption font-bold ${upcomingRel.urgent ? 'bg-semantic-like text-white' : 'bg-white/90 text-ink'}`}>
                {upcomingRel.label}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="flex items-center gap-1.5 text-caption mb-1 opacity-90">
                <IconClock className="w-3.5 h-3.5 stroke-white" />
                <span className="tabular-nums">{formatDateTime(upcoming.nextMeetingAt)}</span>
              </div>
              <h2 className="text-body font-bold mb-1 line-clamp-1">{upcoming.title}</h2>
              <div className="flex items-center gap-1.5 text-caption opacity-90">
                <IconLocation className="w-3.5 h-3.5 stroke-white" />
                <span className="truncate">{upcoming.location}</span>
              </div>
            </div>
          </button>
        </div>
      )}

      <div className="h-1.5 bg-surface-muted" />

      {/* 탭 (sticky) */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="flex px-page">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-label font-semibold relative transition-colors ${
                tab === t ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
              }`}
            >
              {t} <span className="tabular-nums text-caption">{counts[t]}</span>
              {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-t" />}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div className="flex items-center justify-between px-page py-2.5">
        <span className="text-caption text-ink-tertiary">
          <span className="font-bold text-ink tabular-nums">{filtered.length}</span>개 모임
        </span>
        <div className="flex items-center gap-0.5">
          {SORTS.map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-2 py-1 text-caption font-semibold rounded transition-colors ${
                sort === s ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 컴팩트 카드 리스트 */}
      {filtered.length > 0 ? (
        <ul className="px-page space-y-3 pb-8">
          {filtered.map(m => {
            const fillRate = (m.memberCount / m.maxMembers) * 100
            const rel = formatRelativeDay(m.nextMeetingAt)
            return (
              <li key={m.id}>
                <div className="bg-surface border border-border rounded-card-lg overflow-hidden">
                  {/* 메인 영역 */}
                  <button
                    onClick={() => navigate(`/meetup/${m.id}`)}
                    className="w-full flex gap-3 p-3 text-left hover:bg-surface-subtle active:bg-surface-muted transition-colors"
                  >
                    {/* 썸네일 */}
                    <div className="relative flex-shrink-0 w-[100px] h-[100px] rounded-card overflow-hidden">
                      <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
                      <span className={`absolute top-1.5 left-1.5 px-1.5 py-px text-[10px] font-bold rounded ${roleStyles[m.role]}`}>
                        {m.role}
                      </span>
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-px text-caption font-medium rounded bg-surface-muted text-ink-secondary">
                          {m.category}
                        </span>
                        <span className={`ml-auto px-1.5 py-px text-caption font-bold rounded tabular-nums ${
                          rel.urgent ? 'bg-semantic-like/10 text-semantic-like' : 'bg-surface-muted text-ink-tertiary'
                        }`}>
                          {rel.label}
                        </span>
                      </div>
                      <h3 className="text-body font-semibold text-ink line-clamp-1 mb-1">{m.title}</h3>

                      {/* 다음 모임 */}
                      <div className="flex items-center gap-1.5 text-caption text-ink-secondary tabular-nums mb-1">
                        <IconClock className="w-3.5 h-3.5 stroke-ink-tertiary flex-shrink-0" />
                        <span className="font-semibold">
                          {`${new Date(m.nextMeetingAt).getMonth() + 1}/${new Date(m.nextMeetingAt).getDate()}`} {formatHourMin(m.nextMeetingAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-caption text-ink-tertiary">
                        <IconLocation className="w-3.5 h-3.5 stroke-ink-tertiary flex-shrink-0" />
                        <span className="truncate">{m.location}</span>
                      </div>

                      {/* 멤버 진행률 */}
                      <div className="mt-auto pt-2 flex items-center gap-1.5">
                        <IconUsers className="w-3.5 h-3.5 stroke-ink-tertiary flex-shrink-0" />
                        <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${fillRate}%` }} />
                        </div>
                        <span className="text-caption text-ink-tertiary tabular-nums">
                          <span className="font-bold text-ink">{m.memberCount}</span>/{m.maxMembers}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* 빠른 액션 */}
                  <div className="flex border-t border-border-light divide-x divide-border-light">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/chat/${m.id}`) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-caption font-semibold text-ink-secondary hover:bg-surface-subtle transition-colors"
                    >
                      <IconChat className="w-4 h-4 stroke-ink-secondary" />
                      <span>채팅</span>
                      {m.unreadCount !== undefined && m.unreadCount > 0 && (
                        <span className="ml-0.5 min-w-[16px] h-4 px-1 rounded-full bg-semantic-like text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                          {m.unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/meetup/${m.id}`) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-caption font-semibold text-ink-secondary hover:bg-surface-subtle transition-colors"
                    >
                      <IconCalendar className="w-4 h-4 stroke-ink-secondary" />
                      <span>일정</span>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-ink-placeholder">
          <span className="text-body mb-4">참여 중인 모임이 없습니다</span>
          <button
            onClick={() => navigate('/activity')}
            className="px-4 py-2 rounded-pill bg-ink text-white text-label font-semibold"
          >
            모임 둘러보기
          </button>
        </div>
      )}
    </PageLayout>
  )
}
