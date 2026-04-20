import { useState, useMemo, useCallback, memo, useEffect } from 'react'
import { PageLayout, SubPageHeader } from '../../components'

interface WorkoutSet { weight: string; reps: string }
interface Exercise { name: string; category: string; sets: WorkoutSet[] }
interface WorkoutRecord {
  date: string
  programTitle?: string
  elapsed: number
  totalVolume: number
  totalSets: number
  estCalories: number
  focus: string
  exercises: Exercise[]
}

/* ── Mock 데이터 ── */
const createMockDate = (offset: number) => {
  const d = new Date(); d.setDate(d.getDate() - offset); return d.toISOString()
}

const mockHistory: WorkoutRecord[] = [
  {
    date: createMockDate(0), programTitle: '가슴 · 삼두 프로그램', elapsed: 4800, totalVolume: 8420, totalSets: 18, estCalories: 412, focus: '가슴 · 삼두',
    exercises: [
      { name: '벤치프레스', category: '가슴', sets: [{ weight: '60', reps: '12' }, { weight: '80', reps: '10' }, { weight: '80', reps: '10' }, { weight: '80', reps: '8' }] },
      { name: '인클라인 덤벨프레스', category: '가슴', sets: [{ weight: '22', reps: '12' }, { weight: '22', reps: '12' }, { weight: '24', reps: '10' }] },
      { name: '딥스', category: '삼두', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }, { weight: '10', reps: '10' }] },
      { name: '케이블 푸시다운', category: '삼두', sets: [{ weight: '25', reps: '15' }, { weight: '30', reps: '12' }, { weight: '30', reps: '12' }] },
    ],
  },
  {
    date: createMockDate(1), programTitle: '하체 · 등 프로그램', elapsed: 6300, totalVolume: 12680, totalSets: 22, estCalories: 612, focus: '하체 · 등',
    exercises: [
      { name: '바벨 스쿼트', category: '하체', sets: [{ weight: '60', reps: '12' }, { weight: '100', reps: '8' }, { weight: '120', reps: '6' }, { weight: '120', reps: '6' }] },
      { name: '루마니안 데드리프트', category: '하체', sets: [{ weight: '80', reps: '10' }, { weight: '100', reps: '8' }, { weight: '100', reps: '8' }] },
      { name: '레그프레스', category: '하체', sets: [{ weight: '160', reps: '12' }, { weight: '180', reps: '10' }, { weight: '200', reps: '8' }] },
      { name: '랫 풀다운', category: '등', sets: [{ weight: '55', reps: '12' }, { weight: '65', reps: '10' }, { weight: '70', reps: '8' }] },
      { name: '시티드 로우', category: '등', sets: [{ weight: '50', reps: '12' }, { weight: '60', reps: '10' }, { weight: '60', reps: '10' }] },
    ],
  },
  {
    date: createMockDate(3), programTitle: '어깨 · 코어 프로그램', elapsed: 3000, totalVolume: 3240, totalSets: 14, estCalories: 320, focus: '어깨 · 코어',
    exercises: [
      { name: '오버헤드 프레스', category: '어깨', sets: [{ weight: '30', reps: '12' }, { weight: '35', reps: '10' }, { weight: '35', reps: '10' }] },
      { name: '사이드 레터럴 레이즈', category: '어깨', sets: [{ weight: '8', reps: '15' }, { weight: '10', reps: '12' }, { weight: '10', reps: '12' }] },
      { name: '행잉 레그레이즈', category: '코어', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }, { weight: '0', reps: '10' }] },
      { name: '러시안 트위스트', category: '코어', sets: [{ weight: '5', reps: '30' }, { weight: '5', reps: '30' }] },
    ],
  },
  {
    date: createMockDate(5), programTitle: '전신 서킷', elapsed: 3600, totalVolume: 5400, totalSets: 16, estCalories: 480, focus: '전신',
    exercises: [
      { name: '버피', category: '전신', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }, { weight: '0', reps: '10' }] },
      { name: '케틀벨 스윙', category: '전신', sets: [{ weight: '16', reps: '20' }, { weight: '16', reps: '20' }, { weight: '20', reps: '15' }] },
      { name: '박스 점프', category: '전신', sets: [{ weight: '0', reps: '12' }, { weight: '0', reps: '12' }, { weight: '0', reps: '10' }] },
      { name: '마운틴 클라이머', category: '전신', sets: [{ weight: '0', reps: '40' }, { weight: '0', reps: '40' }, { weight: '0', reps: '30' }] },
    ],
  },
  {
    date: createMockDate(7), programTitle: '가슴 · 삼두 프로그램', elapsed: 4500, totalVolume: 7800, totalSets: 16, estCalories: 385, focus: '가슴 · 삼두',
    exercises: [
      { name: '벤치프레스', category: '가슴', sets: [{ weight: '60', reps: '12' }, { weight: '70', reps: '10' }, { weight: '70', reps: '10' }, { weight: '70', reps: '8' }] },
      { name: '체스트 플라이 머신', category: '가슴', sets: [{ weight: '45', reps: '15' }, { weight: '45', reps: '15' }, { weight: '50', reps: '12' }] },
      { name: '딥스', category: '삼두', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }] },
      { name: '케이블 푸시다운', category: '삼두', sets: [{ weight: '25', reps: '15' }, { weight: '30', reps: '12' }, { weight: '30', reps: '12' }] },
    ],
  },
  {
    date: createMockDate(9), programTitle: '바레톤 그룹수업', elapsed: 3300, totalVolume: 0, totalSets: 12, estCalories: 285, focus: '바레톤',
    exercises: [
      { name: '플리에 스쿼트', category: '하체', sets: [{ weight: '0', reps: '20' }, { weight: '0', reps: '20' }, { weight: '0', reps: '16' }] },
      { name: '레그 리프트', category: '하체', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '15' }, { weight: '0', reps: '12' }] },
      { name: '플랭크 홀드', category: '코어', sets: [{ weight: '0', reps: '60' }, { weight: '0', reps: '45' }] },
      { name: '브릿지', category: '하체', sets: [{ weight: '0', reps: '20' }, { weight: '0', reps: '20' }] },
    ],
  },
]

/* ── 유틸 ── */
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  if (mins >= 60) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m ? `${h}h ${m}m` : `${h}h`
  }
  return `${mins}분`
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

const DumbbellIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current stroke-2 fill-none">
    <path d="M6.5 6.5 17.5 17.5M2 12l3-3 3 3-3 3-3-3zM16 22l3-3-3-3-3 3 3 3zM8 8l8 8M22 12l-3 3-3-3 3-3 3 3zM12 2l3 3-3 3-3-3 3-3z" />
  </svg>
))

const ChevronIcon = memo(({ expanded }: { expanded: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 stroke-ink-tertiary stroke-2 fill-none flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
))

const IconCalendarView = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
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

/* ── 종목 상세 카드 ── */
const ExerciseCard = memo(({ ex, index }: { ex: Exercise; index: number }) => (
  <div className="p-3.5 rounded-card bg-surface-muted">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-5 h-5 rounded-full bg-primary text-white text-caption font-bold flex items-center justify-center shrink-0 tabular-nums">{index + 1}</span>
        <div className="text-label font-semibold text-ink truncate">{ex.name}</div>
      </div>
      <span className="text-caption text-ink-tertiary tabular-nums shrink-0 ml-2">{ex.sets.length}세트</span>
    </div>
    <div className="flex flex-col">
      {ex.sets.map((s, si) => (
        <div key={si} className="grid grid-cols-[20px_1fr_1fr] gap-3 py-1.5 text-caption tabular-nums border-t border-border-light first:border-t-0">
          <span className="text-ink-placeholder text-center">{si + 1}</span>
          <span className="text-ink font-semibold">{!s.weight || s.weight === '0' ? '맨몸' : `${s.weight} kg`}</span>
          <span className="text-ink-secondary">{s.reps} 회</span>
        </div>
      ))}
    </div>
  </div>
))

/* ── 운동 기록 카드 ── */
const RecordCard = memo(({ record, expanded, onToggle, showDate }: { record: WorkoutRecord; expanded: boolean; onToggle: () => void; showDate?: boolean }) => {
  const date = new Date(record.date)
  return (
    <div className="rounded-card-lg border border-border-light overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-subtle transition-colors">
        <div className="w-11 h-11 rounded-full bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
          <DumbbellIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-body font-semibold text-ink truncate">{record.focus || record.programTitle}</div>
          <div className="flex items-center gap-1.5 text-caption text-ink-tertiary mt-0.5 tabular-nums">
            {showDate && <><span>{date.getMonth() + 1}/{date.getDate()} ({WEEKDAYS[date.getDay()]})</span><span>·</span></>}
            <span>{formatDuration(record.elapsed)}</span>
            <span>·</span>
            <span>{record.exercises.length}종목</span>
            <span>·</span>
            <span>{record.estCalories}kcal</span>
          </div>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className="border-t border-border-light bg-surface-subtle">
          <div className="px-4 py-4 flex flex-col gap-4">
            {/* 3 stat 카드 */}
            <div className="grid grid-cols-3 gap-2 p-4 rounded-card-lg bg-surface border border-border-light">
              <div>
                <div className="text-heading font-extrabold leading-none text-ink tabular-nums">
                  {record.totalVolume > 0 ? record.totalVolume.toLocaleString() : '-'}
                  {record.totalVolume > 0 && <span className="text-label font-semibold text-ink-tertiary ml-1">kg</span>}
                </div>
                <div className="text-caption text-ink-tertiary mt-1.5">총 볼륨</div>
              </div>
              <div className="border-x border-border-light px-3">
                <div className="text-heading font-extrabold leading-none text-ink tabular-nums">{record.totalSets}</div>
                <div className="text-caption text-ink-tertiary mt-1.5">세트</div>
              </div>
              <div>
                <div className="text-heading font-extrabold leading-none text-ink tabular-nums">
                  {record.estCalories}<span className="text-label font-semibold text-ink-tertiary ml-1">kcal</span>
                </div>
                <div className="text-caption text-ink-tertiary mt-1.5">칼로리</div>
              </div>
            </div>

            {/* 종목 */}
            <div className="flex flex-col gap-2">
              {record.exercises.map((ex, i) => (
                <ExerciseCard key={i} ex={ex} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

/* ── 메인 페이지 ── */
type ViewMode = 'calendar' | 'list'

export const WorkoutHistoryPage = () => {
  const history = useMemo(() => {
    const raw: WorkoutRecord[] = JSON.parse(localStorage.getItem('workout-history') || '[]')
    if (raw.length >= 3) return raw
    const rawDates = new Set(raw.map(r => new Date(r.date).toDateString()))
    return [...raw, ...mockHistory.filter(m => !rawDates.has(new Date(m.date).toDateString()))]
  }, [])

  const now = useMemo(() => new Date(), [])
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  // 달력 셀 계산
  const { cells, today, daysInMonth } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const dim = new Date(viewYear, viewMonth + 1, 0).getDate()
    const td = now.getFullYear() === viewYear && now.getMonth() === viewMonth ? now.getDate() : -1
    const c: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= dim; d++) c.push(d)
    while (c.length % 7) c.push(null)
    return { cells: c, today: td, daysInMonth: dim }
  }, [viewYear, viewMonth, now])

  const dayOfWeekMap = useMemo(() => {
    const map = new Map<number, number>()
    for (let d = 1; d <= daysInMonth; d++) {
      map.set(d, new Date(viewYear, viewMonth, d).getDay())
    }
    return map
  }, [viewYear, viewMonth, daysInMonth])

  const workoutDayMap = useMemo(() => {
    const map = new Map<number, WorkoutRecord[]>()
    history.forEach(r => {
      const d = new Date(r.date)
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate()
        if (!map.has(day)) map.set(day, [])
        map.get(day)!.push(r)
      }
    })
    return map
  }, [history, viewYear, viewMonth])

  // 월 바뀌면 가장 최근 운동일 자동 선택
  useEffect(() => {
    setExpandedIdx(null)
    const days = Array.from(workoutDayMap.keys()).sort((a, b) => b - a)
    setSelectedDay(days.length > 0 ? days[0] : null)
  }, [workoutDayMap])

  // 월 요약 통계
  const stats = useMemo(() => {
    let totalWorkouts = 0, totalTime = 0, totalCalories = 0, totalVolume = 0
    workoutDayMap.forEach(records => {
      totalWorkouts += records.length
      records.forEach(r => {
        totalTime += r.elapsed
        totalCalories += r.estCalories
        totalVolume += r.totalVolume
      })
    })
    let streak = 0
    if (today > 0) {
      for (let d = today; d >= 1; d--) { if (workoutDayMap.has(d)) streak++; else break }
    }
    return { totalWorkouts, totalTime, totalCalories, totalVolume, streak }
  }, [workoutDayMap, today])

  // 일별 미니 차트 (현재 보고 있는 월의 매일 칼로리)
  const dailyChart = useMemo(() => {
    const days: { day: number; calories: number }[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const recs = workoutDayMap.get(d)
      const cal = recs ? recs.reduce((s, r) => s + r.estCalories, 0) : 0
      days.push({ day: d, calories: cal })
    }
    return days
  }, [workoutDayMap, daysInMonth])

  const maxDailyCal = Math.max(1, ...dailyChart.map(d => d.calories))

  const selectedRecords = useMemo(
    () => selectedDay ? (workoutDayMap.get(selectedDay) || []) : [],
    [selectedDay, workoutDayMap]
  )

  // 전체 정렬된 기록 (리스트 뷰용)
  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [history]
  )

  const prevMonth = useCallback(() => {
    setViewMonth(m => m === 0 ? (setViewYear(y => y - 1), 11) : m - 1)
  }, [])

  const nextMonth = useCallback(() => {
    setViewMonth(m => m === 11 ? (setViewYear(y => y + 1), 0) : m + 1)
  }, [])

  const handleDayClick = useCallback((day: number) => {
    setSelectedDay(prev => prev === day ? null : day)
    setExpandedIdx(null)
  }, [])

  const handleToggleExpand = useCallback((idx: number) => {
    setExpandedIdx(prev => prev === idx ? null : idx)
  }, [])

  const isFutureMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()
  const avgDuration = stats.totalWorkouts > 0 ? Math.round(stats.totalTime / stats.totalWorkouts) : 0

  return (
    <PageLayout header={<SubPageHeader title="운동 기록" />} noPadding>
      {/* 월 요약 — 컴팩트 */}
      <div className="px-page pt-4 pb-3">
        <div className="grid grid-cols-4 gap-1.5 p-3 bg-primary-50 rounded-card-lg">
          <div className="text-center">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{stats.totalWorkouts}</div>
            <div className="text-caption text-ink-tertiary mt-1">운동</div>
          </div>
          <div className="text-center border-l border-primary/20">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{stats.streak}</div>
            <div className="text-caption text-ink-tertiary mt-1">연속</div>
          </div>
          <div className="text-center border-l border-primary/20">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{formatDuration(stats.totalTime)}</div>
            <div className="text-caption text-ink-tertiary mt-1">시간</div>
          </div>
          <div className="text-center border-l border-primary/20">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{stats.totalCalories.toLocaleString()}</div>
            <div className="text-caption text-ink-tertiary mt-1">kcal</div>
          </div>
        </div>

        {/* 주차별 미니 차트 */}
        {stats.totalWorkouts > 0 && (
          <div className="mt-3">
            <div className="flex items-end gap-[3px] h-14">
              {dailyChart.map((d) => {
                const isSelected = d.day === selectedDay
                const isToday = d.day === today
                return (
                  <button
                    key={d.day}
                    onClick={() => handleDayClick(d.day)}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                    title={d.calories > 0 ? `${viewMonth + 1}/${d.day}: ${d.calories}kcal` : `${viewMonth + 1}/${d.day}: 휴식`}
                  >
                    <div
                      className={`w-full rounded-sm transition-all ${
                        d.calories > 0 ? 'bg-primary' : 'bg-surface-muted'
                      } ${isSelected ? 'ring-2 ring-ink ring-offset-1' : ''} ${isToday && !isSelected ? 'opacity-100' : ''} group-hover:opacity-80`}
                      style={{ height: d.calories > 0 ? `${Math.max((d.calories / maxDailyCal) * 100, 12)}%` : '3px' }}
                    />
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between mt-1.5 px-0.5">
              {[1, Math.ceil(daysInMonth / 4), Math.ceil(daysInMonth / 2), Math.ceil(daysInMonth * 3 / 4), daysInMonth].map((d, i) => (
                <span key={i} className="text-[10px] text-ink-placeholder tabular-nums">{d}일</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 뷰 모드 토글 */}
      <div className="flex items-center justify-between px-page py-2 border-y border-border-light">
        <div className="flex items-center gap-3 text-caption text-ink-tertiary tabular-nums">
          {avgDuration > 0 && (
            <>
              <span>평균 <span className="font-bold text-ink">{formatDuration(avgDuration)}</span></span>
              <span>·</span>
              <span>볼륨 <span className="font-bold text-ink">{(stats.totalVolume / 1000).toFixed(1)}t</span></span>
            </>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setViewMode('calendar')}
            aria-label="달력 보기"
            className={`p-1.5 rounded transition-colors ${viewMode === 'calendar' ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'}`}
          >
            <IconCalendarView className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="리스트 보기"
            className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'}`}
          >
            <IconListView className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* 달력 */}
          <div className="px-page py-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div className="text-body font-bold text-ink tabular-nums">{viewYear}년 {viewMonth + 1}월</div>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map(w => (
                <div key={w} className={`text-center text-caption font-semibold ${w === '일' ? 'text-semantic-like' : w === '토' ? 'text-accent-purple' : 'text-ink-tertiary'}`}>{w}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const isToday = day === today
                const records = workoutDayMap.get(day)
                const worked = !!records
                const isFuture = isFutureMonth && day > now.getDate()
                const isSelected = day === selectedDay
                const dow = dayOfWeekMap.get(day) ?? 0
                return (
                  <button
                    key={i}
                    onClick={() => handleDayClick(day)}
                    className={`relative flex flex-col items-center justify-center py-2.5 rounded-card transition-colors ${
                      isSelected ? 'bg-primary text-white' : isToday ? 'bg-primary-50' : worked ? 'bg-surface-muted' : 'hover:bg-surface-subtle'
                    }`}
                  >
                    <span className={`text-label font-semibold tabular-nums ${
                      isSelected ? 'text-white' :
                      isFuture ? 'text-ink-disabled' :
                      dow === 0 ? 'text-semantic-like' :
                      dow === 6 ? 'text-accent-purple' :
                      'text-ink'
                    }`}>{day}</span>
                    {worked && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 선택된 날짜의 운동 기록 */}
          {selectedDay !== null ? (
            <div className="px-page pb-6">
              <div className="text-body font-bold text-ink mb-3 tabular-nums">
                {viewMonth + 1}월 {selectedDay}일 ({WEEKDAYS[dayOfWeekMap.get(selectedDay) ?? 0]}) 기록
              </div>

              {selectedRecords.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {selectedRecords.map((record, idx) => (
                    <RecordCard
                      key={idx}
                      record={record}
                      expanded={expandedIdx === idx}
                      onToggle={() => handleToggleExpand(idx)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center rounded-card-lg bg-surface-muted">
                  <div className="text-[32px] mb-2">😴</div>
                  <div className="text-body text-ink-tertiary">이 날은 쉬는 날이에요</div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-page pb-6">
              <div className="py-8 text-center text-ink-tertiary text-body">
                날짜를 선택해 운동 기록을 확인하세요
              </div>
            </div>
          )}
        </>
      ) : (
        /* 리스트 뷰 */
        <div className="px-page py-4">
          {sortedHistory.length === 0 ? (
            <div className="py-12 text-center text-ink-tertiary text-body">
              아직 운동 기록이 없어요
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-6">
              {sortedHistory.map((record, idx) => (
                <RecordCard
                  key={idx}
                  record={record}
                  expanded={expandedIdx === idx}
                  onToggle={() => handleToggleExpand(idx)}
                  showDate
                />
              ))}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  )
}
