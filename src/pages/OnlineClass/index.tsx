import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch, IconChevronRight } from '../../components/Icons'
import { CATEGORIES, classes, levelStyles, badgeStyles, type Category } from './data'

type SortKey = '인기순' | '평점순' | '최신순'
const SORTS: SortKey[] = ['인기순', '평점순', '최신순']

type ViewMode = 'grid' | 'list'

const IconStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className}>
    <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" />
  </svg>
)

const IconGridView = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconListView = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1" />
    <circle cx="4" cy="12" r="1" />
    <circle cx="4" cy="18" r="1" />
  </svg>
)

export const OnlineClassPage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category>('전체')
  const [sort, setSort] = useState<SortKey>('인기순')
  const [view, setView] = useState<ViewMode>('grid')

  const myClasses = classes.filter(c => c.progress !== undefined && c.progress > 0)

  const filtered = useMemo(() => {
    const list = classes.filter(c => category === '전체' || c.category === category)
    const sorted = [...list]
    if (sort === '인기순') sorted.sort((a, b) => b.studentCount - a.studentCount)
    else if (sort === '평점순') sorted.sort((a, b) => b.rating - a.rating)
    else sorted.sort((a, b) => b.id - a.id)
    return sorted
  }, [category, sort])

  const header = (
    <SubPageHeader
      title="온라인 강의"
      right={
        <button className="icon-btn" onClick={() => navigate('/branch')} aria-label="지점 검색">
          <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding>
      {/* 수강 중인 강의 */}
      {myClasses.length > 0 && (
        <div className="px-page pt-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-body font-bold text-ink">이어서 수강하기</h2>
            <button
              onClick={() => navigate('/online-class/my')}
              className="flex items-center gap-0.5 text-caption text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              내 강의 {myClasses.length}개
              <IconChevronRight className="w-3.5 h-3.5 stroke-ink-tertiary" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-page px-page">
            {myClasses.map(c => (
              <button
                key={c.id}
                onClick={() => navigate(`/class/${c.id}`)}
                className="flex-shrink-0 w-[240px] bg-surface rounded-card-lg border border-border overflow-hidden text-left hover:border-ink-placeholder transition-colors"
              >
                <div className="relative">
                  <img src={c.imageUrl} alt={c.title} className="w-full h-[110px] object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div className="h-full bg-primary rounded-r-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-label font-semibold text-ink truncate mb-1">{c.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-ink-tertiary">{c.instructor} 강사</span>
                    <span className="text-caption font-bold text-primary tabular-nums">{c.progress}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {myClasses.length > 0 && <div className="h-1.5 bg-surface-muted" />}

      {/* 카테고리 (sticky) */}
      <div className="sticky top-0 z-10 bg-surface">
        <div className="flex gap-2 px-page py-3 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-pill text-label font-semibold whitespace-nowrap transition-colors ${
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
      </div>

      {/* 툴바: 강의 수 + 정렬 + 뷰 토글 */}
      <div className="flex items-center justify-between px-page py-2.5">
        <span className="text-caption text-ink-tertiary">
          총 <span className="font-bold text-ink tabular-nums">{filtered.length}</span>개
        </span>
        <div className="flex items-center gap-1">
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
          <div className="w-px h-3.5 bg-border mx-1" />
          <button
            onClick={() => setView('grid')}
            aria-label="그리드 보기"
            className={`p-1.5 rounded transition-colors ${
              view === 'grid' ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
            }`}
          >
            <IconGridView className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            aria-label="리스트 보기"
            className={`p-1.5 rounded transition-colors ${
              view === 'list' ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
            }`}
          >
            <IconListView className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 강의 목록 */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-page pb-8">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => navigate(`/class/${c.id}`)}
              className="text-left group"
            >
              <div className="relative rounded-card-lg overflow-hidden mb-2">
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {c.badge && (
                  <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 text-caption font-bold rounded ${badgeStyles[c.badge]}`}>
                    {c.badge}
                  </span>
                )}
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/60 text-white text-caption font-medium rounded tabular-nums">
                  {c.lessonCount}강
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`px-1.5 py-0.5 text-caption font-bold rounded ${levelStyles[c.level]}`}>{c.level}</span>
                <span className="text-caption text-ink-placeholder">{c.duration}</span>
              </div>
              <h3 className="text-label font-semibold text-ink line-clamp-2 leading-snug mb-1">{c.title}</h3>
              <div className="flex items-center gap-1">
                <IconStar className="w-3 h-3 fill-[#FACC15]" />
                <span className="text-caption font-semibold text-ink tabular-nums">{c.rating}</span>
                <span className="text-caption text-ink-placeholder">({c.studentCount.toLocaleString()})</span>
              </div>
              {c.progress !== undefined && c.progress > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="text-caption font-bold text-primary tabular-nums">{c.progress}%</span>
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-border-light pb-8">
          {filtered.map(c => (
            <li key={c.id}>
              <button
                onClick={() => navigate(`/class/${c.id}`)}
                className="w-full flex gap-3 px-page py-3 text-left hover:bg-surface-subtle active:bg-surface-muted transition-colors"
              >
                <div className="relative flex-shrink-0 w-[112px] h-[72px] rounded-card overflow-hidden">
                  <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                  {c.badge && (
                    <span className={`absolute top-1 left-1 px-1 py-px text-[10px] font-bold rounded ${badgeStyles[c.badge]}`}>
                      {c.badge}
                    </span>
                  )}
                  <span className="absolute bottom-1 right-1 px-1 py-px bg-black/60 text-white text-[10px] font-medium rounded tabular-nums">
                    {c.lessonCount}강
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`px-1.5 py-px text-caption font-bold rounded ${levelStyles[c.level]}`}>{c.level}</span>
                    <span className="text-caption text-ink-placeholder">{c.duration}</span>
                  </div>
                  <h3 className="text-label font-semibold text-ink line-clamp-1 mb-0.5">{c.title}</h3>
                  <div className="flex items-center gap-2 text-caption text-ink-tertiary">
                    <span className="truncate">{c.instructor} 강사</span>
                    <span className="text-ink-placeholder">·</span>
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                      <IconStar className="w-3 h-3 fill-[#FACC15]" />
                      <span className="font-semibold text-ink tabular-nums">{c.rating}</span>
                      <span className="text-ink-placeholder">({c.studentCount.toLocaleString()})</span>
                    </span>
                  </div>
                  {c.progress !== undefined && c.progress > 0 && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                      <span className="text-caption font-bold text-primary tabular-nums">{c.progress}%</span>
                    </div>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-ink-placeholder">
          <span className="text-body">해당 카테고리의 강의가 없습니다.</span>
        </div>
      )}
    </PageLayout>
  )
}
