import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch } from '../../components/Icons'
import { classes, levelStyles, type OnlineClass } from './data'

type Tab = '전체' | '수강중' | '완료'
const TABS: Tab[] = ['전체', '수강중', '완료']

type SortKey = '최근순' | '진행률↑' | '진행률↓' | '제목순'
const SORTS: SortKey[] = ['최근순', '진행률↑', '진행률↓', '제목순']

// "최근순" 정렬용: lastWatchedAt 문자열 → 가중치
const recencyWeight: Record<string, number> = {
  '방금 전': 0,
  '5시간 전': 1,
  '2시간 전': 2,
  '어제': 3,
  '3일 전': 4,
  '1주 전': 5,
}

const IconStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className}>
    <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" />
  </svg>
)

const IconPlay = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const IconClock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconFlame = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4-1 3 2 4 3 2 0-2-2-3 0-7z" />
  </svg>
)

const IconTrophy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 4H4v3a3 3 0 0 0 3 3M17 4h3v3a3 3 0 0 1-3 3" />
  </svg>
)

const IconClose = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// "3시간 24분" → 분
const parseDuration = (d: string): number => {
  const h = d.match(/(\d+)시간/)
  const m = d.match(/(\d+)분/)
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0)
}

const fmtMinutes = (mins: number) => {
  if (mins < 60) return `${mins}분`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`
}

const getStatusBadge = (progress: number) => {
  if (progress >= 100) return { label: '완료', cls: 'bg-accent-green text-white' }
  if (progress >= 80) return { label: '거의 완료', cls: 'bg-primary text-white' }
  if (progress < 20) return { label: '방금 시작', cls: 'bg-ink/80 text-white' }
  return null
}

export const MyOnlineClassesPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('전체')
  const [sort, setSort] = useState<SortKey>('최근순')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const myClasses = useMemo(
    () => classes.filter(c => c.progress !== undefined && c.progress > 0),
    [],
  )

  // 가장 최근 시청 강의 (히어로)
  const continueClass: OnlineClass | undefined = useMemo(() => {
    const inProgress = myClasses.filter(c => (c.progress ?? 0) < 100)
    return [...inProgress].sort(
      (a, b) => (recencyWeight[a.lastWatchedAt ?? ''] ?? 99) - (recencyWeight[b.lastWatchedAt ?? ''] ?? 99),
    )[0]
  }, [myClasses])

  const counts = useMemo(() => ({
    전체: myClasses.length,
    수강중: myClasses.filter(c => (c.progress ?? 0) < 100).length,
    완료: myClasses.filter(c => (c.progress ?? 0) >= 100).length,
  }), [myClasses])

  const filtered = useMemo(() => {
    let list = myClasses
    if (tab === '수강중') list = list.filter(c => (c.progress ?? 0) < 100)
    else if (tab === '완료') list = list.filter(c => (c.progress ?? 0) >= 100)

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        c => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q),
      )
    }

    const sorted = [...list]
    if (sort === '최근순') sorted.sort((a, b) => (recencyWeight[a.lastWatchedAt ?? ''] ?? 99) - (recencyWeight[b.lastWatchedAt ?? ''] ?? 99))
    else if (sort === '진행률↑') sorted.sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0))
    else if (sort === '진행률↓') sorted.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
    else sorted.sort((a, b) => a.title.localeCompare(b.title))
    return sorted
  }, [tab, sort, query, myClasses])

  // 한눈 학습 통계
  const stats = useMemo(() => {
    const total = myClasses.length
    const completed = myClasses.filter(c => (c.progress ?? 0) >= 100).length
    const totalMinutes = myClasses.reduce(
      (sum, c) => sum + Math.round(parseDuration(c.duration) * ((c.progress ?? 0) / 100)),
      0,
    )
    return { total, completed, totalMinutes, streak: 7 } // streak는 가상치
  }, [myClasses])

  const header = (
    <SubPageHeader
      title="내 강의"
      right={
        <button onClick={() => setSearchOpen(s => !s)} className="icon-btn" aria-label="검색">
          {searchOpen
            ? <IconClose className="w-[22px] h-[22px] stroke-ink" />
            : <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />}
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding>
      {/* 검색 바 */}
      {searchOpen && (
        <div className="px-page py-2 border-b border-border-light bg-surface">
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-muted rounded-pill">
            <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="강의명 · 강사명 검색"
              autoFocus
              className="flex-1 bg-transparent text-label text-ink placeholder:text-ink-placeholder outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-ink-tertiary">
                <IconClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 학습 통계 */}
      <div className="px-page pt-4 pb-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-muted rounded-card-lg p-3 flex flex-col items-center">
            <IconFlame className="w-4 h-4 stroke-semantic-like mb-1" />
            <div className="text-h3 font-bold text-ink tabular-nums leading-none">{stats.streak}</div>
            <div className="text-caption text-ink-tertiary mt-1">연속 학습일</div>
          </div>
          <div className="bg-surface-muted rounded-card-lg p-3 flex flex-col items-center">
            <IconClock className="w-4 h-4 stroke-primary mb-1" />
            <div className="text-h3 font-bold text-ink tabular-nums leading-none">{Math.round(stats.totalMinutes / 60)}<span className="text-label font-semibold text-ink-tertiary ml-0.5">h</span></div>
            <div className="text-caption text-ink-tertiary mt-1">누적 학습</div>
          </div>
          <div className="bg-surface-muted rounded-card-lg p-3 flex flex-col items-center">
            <IconTrophy className="w-4 h-4 stroke-accent-green mb-1" />
            <div className="text-h3 font-bold text-ink tabular-nums leading-none">{stats.completed}<span className="text-label font-semibold text-ink-tertiary ml-0.5">/{stats.total}</span></div>
            <div className="text-caption text-ink-tertiary mt-1">완료</div>
          </div>
        </div>
      </div>

      {/* 이어서 보기 — 히어로 */}
      {continueClass && (
        <div className="px-page pb-4">
          <button
            onClick={() => navigate(`/class/${continueClass.id}`)}
            className="relative w-full overflow-hidden rounded-card-lg text-left group"
          >
            <img
              src={continueClass.imageUrl}
              alt={continueClass.title}
              className="w-full h-[160px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-caption font-bold text-ink">
              이어서 보기
            </div>
            <div className="absolute right-3 top-3 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <IconPlay className="w-5 h-5 text-ink ml-0.5" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="flex items-center gap-1.5 text-caption opacity-90 mb-1">
                <span>{continueClass.instructor} 강사</span>
                <span>·</span>
                <span>{continueClass.lastWatchedAt}</span>
              </div>
              <h2 className="text-body font-bold mb-2 line-clamp-1">{continueClass.title}</h2>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${continueClass.progress}%` }} />
                </div>
                <span className="text-caption font-bold tabular-nums">{continueClass.progress}%</span>
              </div>
            </div>
          </button>
        </div>
      )}

      <div className="h-1.5 bg-surface-muted" />

      {/* 탭 (sticky) */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="flex px-page overflow-x-auto hide-scrollbar">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 min-w-[68px] py-3 text-label font-semibold relative whitespace-nowrap transition-colors ${
                tab === t ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
              }`}
            >
              {t} <span className="tabular-nums text-caption">{counts[t]}</span>
              {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-t" />}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 툴바 */}
      <div className="flex items-center justify-between px-page py-2.5">
        <span className="text-caption text-ink-tertiary">
          <span className="font-bold text-ink tabular-nums">{filtered.length}</span>개 강의
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

      {/* 강의 카드 리스트 */}
      <ul className="px-page space-y-2.5 pb-8">
        {filtered.map(c => {
          const progress = c.progress ?? 0
          const isDone = progress >= 100
          const status = getStatusBadge(progress)
          const totalMin = parseDuration(c.duration)
          const watchedMin = Math.round(totalMin * (progress / 100))
          const remainingMin = Math.max(totalMin - watchedMin, 0)

          return (
            <li key={c.id}>
              <button
                onClick={() => navigate(`/class/${c.id}`)}
                className="w-full bg-surface border border-border rounded-card-lg p-3 flex gap-3 text-left hover:border-ink-placeholder active:bg-surface-subtle transition-colors"
              >
                {/* 썸네일 */}
                <div className="relative flex-shrink-0 w-[100px] h-[100px] rounded-card overflow-hidden bg-surface-muted">
                  <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                  {!isDone && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                      <span className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow">
                        <IconPlay className="w-4 h-4 text-ink ml-0.5" />
                      </span>
                    </div>
                  )}
                  {/* 진행률 오버레이 바 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                    <div
                      className={`h-full ${isDone ? 'bg-accent-green' : 'bg-primary'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`px-1.5 py-px text-caption font-bold rounded ${levelStyles[c.level]}`}>{c.level}</span>
                    {status && (
                      <span className={`px-1.5 py-px text-caption font-bold rounded ${status.cls}`}>{status.label}</span>
                    )}
                    {c.lastWatchedAt && (
                      <span className="text-caption text-ink-placeholder ml-auto">{c.lastWatchedAt}</span>
                    )}
                  </div>
                  <h3 className="text-body font-semibold text-ink line-clamp-2 leading-snug mb-1">{c.title}</h3>
                  <div className="flex items-center gap-1.5 text-caption text-ink-tertiary">
                    <span className="truncate">{c.instructor} 강사</span>
                    <span className="text-ink-placeholder">·</span>
                    <IconStar className="w-3 h-3 fill-[#FACC15] flex-shrink-0" />
                    <span className="font-semibold text-ink tabular-nums">{c.rating}</span>
                  </div>

                  {/* 진행률 라인 */}
                  <div className="mt-auto pt-2">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className={`text-caption font-bold tabular-nums ${isDone ? 'text-accent-green' : 'text-primary'}`}>
                        {progress}%
                      </span>
                      <span className="text-caption text-ink-placeholder tabular-nums">
                        {isDone ? `총 ${fmtMinutes(totalMin)}` : `${fmtMinutes(remainingMin)} 남음`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isDone ? 'bg-accent-green' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-ink-placeholder">
          <span className="text-body mb-3">{query ? '검색 결과가 없습니다' : '해당하는 강의가 없습니다'}</span>
          <button
            onClick={() => navigate('/online-class')}
            className="px-4 py-2 rounded-pill bg-ink text-white text-label font-semibold"
          >
            강의 둘러보기
          </button>
        </div>
      )}
    </PageLayout>
  )
}
