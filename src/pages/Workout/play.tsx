import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

type Exercise = {
  id: number
  name: string
  category: string
  muscle: string
  sets: string
  reps: string
  imageUrl: string
  description?: string
}

type AiProgram = {
  id: number
  title?: string
  period: string
  goal: string
  level: string
  createdAt: string
  schedule: { day: string; focus: string; exercises: Exercise[] }[]
}

type SetRecord = { reps: string; weight: string; done: boolean }

const EQUIPMENT_CATEGORIES = ['가슴', '등', '어깨', '하체', '팔']

const AI_PROGRAMS_KEY = 'ai-programs'

const loadAiPrograms = (): AiProgram[] => {
  try { return JSON.parse(localStorage.getItem(AI_PROGRAMS_KEY) || '[]') }
  catch { return [] }
}

const ALL_EXERCISES: Exercise[] = [
  { id: 1, name: '벤치프레스', category: '가슴', muscle: '대흉근 · 삼두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '평평한 벤치에 누워 바벨을 가슴까지 내렸다가 밀어올리는 동작입니다. 대흉근과 삼두근을 동시에 자극합니다.' },
  { id: 2, name: '인클라인 덤벨프레스', category: '가슴', muscle: '상부 흉근 · 삼두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '30~45도 경사 벤치에서 덤벨을 밀어올리는 동작입니다.' },
  { id: 3, name: '체스트 플라이 머신', category: '가슴', muscle: '대흉근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '머신에 앉아 양팔을 모아주는 동작입니다.' },
  { id: 4, name: '랫 풀다운', category: '등', muscle: '광배근 · 이두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '케이블 머신에서 바를 가슴 쪽으로 당기는 동작입니다.' },
  { id: 5, name: '시티드 로우', category: '등', muscle: '중부 승모근 · 능형근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '앉은 자세에서 케이블을 몸 쪽으로 당기는 동작입니다.' },
  { id: 6, name: '데드리프트', category: '등', muscle: '척추기립근 · 햄스트링', sets: '4', reps: '6-8', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '바닥에 놓인 바벨을 허리를 펴며 들어올리는 동작입니다.' },
  { id: 7, name: '오버헤드 프레스', category: '어깨', muscle: '전면 삼각근', sets: '4', reps: '8-10', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '바벨이나 덤벨을 머리 위로 밀어올리는 동작입니다.' },
  { id: 8, name: '사이드 레터럴 레이즈', category: '어깨', muscle: '측면 삼각근', sets: '4', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '덤벨을 양손에 들고 옆으로 들어올리는 동작입니다.' },
  { id: 9, name: '페이스 풀', category: '어깨', muscle: '후면 삼각근 · 승모근', sets: '3', reps: '15-20', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '케이블을 얼굴 높이로 당기는 동작입니다.' },
  { id: 10, name: '바벨 스쿼트', category: '하체', muscle: '대퇴사두 · 둔근', sets: '5', reps: '6-8', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '바벨을 어깨에 올려놓고 앉았다 일어서는 동작입니다.' },
  { id: 11, name: '레그프레스', category: '하체', muscle: '대퇴사두 · 둔근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '머신에 앉아 발판을 밀어내는 동작입니다.' },
  { id: 12, name: '루마니안 데드리프트', category: '하체', muscle: '햄스트링 · 둔근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '무릎을 살짝 굽힌 채 상체를 숙여 바벨을 내렸다 올리는 동작입니다.' },
  { id: 13, name: '레그 컬', category: '하체', muscle: '햄스트링', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '엎드린 자세에서 발뒤꿈치를 엉덩이 쪽으로 당기는 동작입니다.' },
  { id: 14, name: '바벨 컬', category: '팔', muscle: '이두근', sets: '3', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '바벨을 언더그립으로 잡고 들어올리는 동작입니다.' },
  { id: 15, name: '트라이셉스 푸시다운', category: '팔', muscle: '삼두근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '케이블 머신에서 바를 아래로 밀어내리는 동작입니다.' },
  { id: 16, name: '딥스', category: '팔', muscle: '삼두근 · 흉근', sets: '3', reps: '10-15', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '평행봉을 잡고 몸을 내렸다 올리는 동작입니다.' },
  { id: 17, name: '플랭크', category: '코어', muscle: '복직근 · 복횡근', sets: '3', reps: '30-60초', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '팔꿈치와 발끝으로 몸을 일직선으로 유지하는 동작입니다.' },
  { id: 18, name: '행잉 레그레이즈', category: '코어', muscle: '하복부 · 고관절 굴근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '철봉에 매달려 다리를 들어올리는 동작입니다.' },
  { id: 19, name: '러시안 트위스트', category: '코어', muscle: '복사근', sets: '3', reps: '20-30', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '앉은 자세에서 상체를 좌우로 회전하는 동작입니다.' },
  { id: 20, name: '트레드밀 인터벌', category: '유산소', muscle: '전신 · 심폐', sets: '-', reps: '20-30분', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '러닝머신에서 고강도와 저강도를 번갈아 수행합니다.' },
  { id: 21, name: '로잉 머신', category: '유산소', muscle: '전신 · 심폐', sets: '-', reps: '15-20분', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '노를 젓는 동작을 재현한 전신 유산소 운동입니다.' },
]

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const WorkoutPlayPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const program = loadAiPrograms().find(p => p.id === Number(id))

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const todayDay = dayNames[new Date().getDay()]
  const allDaysWithExercises = program?.schedule.filter(s => s.exercises.length > 0) || []
  const todaySchedule = allDaysWithExercises.find(s => s.day === todayDay) || allDaysWithExercises[0]
  const exercises = todaySchedule?.exercises || []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(true)
  const [setRecords, setSetRecords] = useState<Record<number, SetRecord[]>>(() => {
    const defaultWeights: Record<number, string> = {
      1: '60', 2: '22', 3: '45', 4: '40', 5: '35', 6: '80',
      7: '30', 8: '8', 9: '15', 10: '60', 11: '100', 12: '50',
      13: '25', 14: '20', 15: '25', 16: '0',
    }
    const init: Record<number, SetRecord[]> = {}
    exercises.forEach(ex => {
      const numSets = ex.sets !== '-' ? Number(ex.sets) || 1 : 1
      const repsNum = (ex.reps.match(/\d+/) || ['0'])[0]
      const isEquip = EQUIPMENT_CATEGORIES.includes(ex.category || (ALL_EXERCISES.find(e => e.id === ex.id)?.category || ''))
      const defaultW = isEquip ? (defaultWeights[ex.id] || '20') : ''
      init[ex.id] = Array.from({ length: numSets }, () => ({ reps: repsNum, weight: defaultW, done: false }))
    })
    return init
  })
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    tabRefs.current[currentIdx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [currentIdx])

  useEffect(() => {
    if (running && !finished) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, finished])

  const currentEx = exercises[currentIdx]
  const fullEx = ALL_EXERCISES.find(e => e.id === currentEx?.id) || currentEx
  const records = currentEx ? (setRecords[currentEx.id] || []) : []
  const updateReps = useCallback((setIdx: number, reps: string) => {
    if (!currentEx) return
    setSetRecords(prev => ({
      ...prev,
      [currentEx.id]: prev[currentEx.id].map((s, i) => i === setIdx ? { ...s, reps } : s)
    }))
  }, [currentEx])

  const updateWeight = useCallback((setIdx: number, weight: string) => {
    if (!currentEx) return
    setSetRecords(prev => ({
      ...prev,
      [currentEx.id]: prev[currentEx.id].map((s, i) => i === setIdx ? { ...s, weight } : s)
    }))
  }, [currentEx])

  const exCategory = fullEx?.category || currentEx?.category || ''
  const hasEquipment = EQUIPMENT_CATEGORIES.includes(exCategory)

  const addSet = useCallback(() => {
    if (!currentEx) return
    const prev = setRecords[currentEx.id] || []
    const lastWeight = prev.length > 0 ? prev[prev.length - 1].weight : ''
    const lastReps = prev.length > 0 ? prev[prev.length - 1].reps : (currentEx.reps.match(/\d+/) || ['0'])[0]
    setSetRecords(p => ({
      ...p,
      [currentEx.id]: [...p[currentEx.id], { reps: lastReps, weight: lastWeight, done: false }]
    }))
  }, [currentEx, setRecords])

  const removeSet = useCallback((setIdx: number) => {
    if (!currentEx) return
    setSetRecords(prev => ({
      ...prev,
      [currentEx.id]: prev[currentEx.id].filter((_, i) => i !== setIdx)
    }))
  }, [currentEx])

  const totalSets = Object.values(setRecords).flat().length

  const goNext = () => {
    if (currentIdx < exercises.length - 1) setCurrentIdx(i => i + 1)
    else { setFinished(true); setRunning(false) }
  }
  const goPrev = () => { if (currentIdx > 0) setCurrentIdx(i => i - 1) }

  if (!program || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-page">
        <div className="text-[48px] mb-4">😢</div>
        <div className="text-body font-bold text-ink mb-2">운동 프로그램을 찾을 수 없어요</div>
        <button onClick={() => navigate(-1)} className="text-label font-semibold text-primary">돌아가기</button>
      </div>
    )
  }

  // 통계 계산
  const totalVolume = exercises.reduce((sum, ex) => {
    const r = setRecords[ex.id] || []
    return sum + r.reduce((s, rec) => s + (Number(rec.weight) || 0) * (Number(rec.reps) || 0), 0)
  }, 0)
  const estCalories = Math.round(elapsed * 0.15 * exercises.length)
  const elapsedMin = Math.floor(elapsed / 60)
  const timeLabel = elapsedMin >= 60 ? `${Math.floor(elapsedMin / 60)}시간 ${elapsedMin % 60}분` : `${elapsedMin}분`

  // 완료 화면
  if (finished) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-lg mx-auto px-page py-6">
          {/* 완료 헤더 */}
          <div className="flex flex-col items-center pt-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-accent-green stroke-[2.5] fill-none"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="text-heading font-bold text-ink mb-1">운동 완료!</h2>
            <div className="flex items-center gap-2 text-caption text-ink-tertiary">
              <span>{timeLabel}</span>
              <span>·</span>
              <span>{exercises.length}종목</span>
              <span>·</span>
              <span>{todaySchedule?.focus}</span>
            </div>
          </div>

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-card-lg bg-primary/5 border border-primary/20 mb-5">
            <div className="text-center">
              {totalVolume > 0 ? (
                <div className="text-heading font-extrabold text-ink leading-none tabular-nums">{totalVolume.toLocaleString()}<span className="text-caption font-semibold text-ink-placeholder ml-0.5">kg</span></div>
              ) : (
                <div className="text-heading font-extrabold text-ink leading-none tabular-nums">{Object.values(setRecords).flat().reduce((s, r) => s + (Number(r.reps) || 0), 0)}<span className="text-caption font-semibold text-ink-placeholder ml-0.5">회</span></div>
              )}
              <div className="text-caption text-ink-tertiary mt-1">{totalVolume > 0 ? '총 볼륨' : '총 횟수'}</div>
            </div>
            <div className="text-center border-x border-primary/10">
              <div className="text-heading font-extrabold text-ink leading-none tabular-nums">{totalSets}</div>
              <div className="text-caption text-ink-tertiary mt-1">세트</div>
            </div>
            <div className="text-center">
              <div className="text-heading font-extrabold text-primary leading-none tabular-nums">{estCalories}<span className="text-caption font-semibold text-ink-placeholder ml-0.5">kcal</span></div>
              <div className="text-caption text-ink-tertiary mt-1">칼로리</div>
            </div>
          </div>

          {/* 종목별 상세 */}
          <div className="mb-6">
            <div className="text-caption font-semibold text-ink-tertiary mb-3">종목별 기록</div>
            <div className="flex flex-col gap-2">
              {exercises.map((ex, i) => {
                const r = setRecords[ex.id] || []
                const exFull = ALL_EXERCISES.find(e => e.id === ex.id) || ex
                const isEquip = EQUIPMENT_CATEGORIES.includes(exFull.category)
                return (
                  <div key={ex.id} className="p-4 rounded-card-lg border border-border bg-surface">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-caption font-bold flex items-center justify-center shrink-0 tabular-nums">{i + 1}</span>
                        <div className="text-body font-semibold text-ink truncate">{ex.name}</div>
                      </div>
                      <span className="text-caption text-ink-placeholder tabular-nums shrink-0 ml-2">{r.length}세트</span>
                    </div>
                    <div className="flex flex-col">
                      {r.map((rec, j) => (
                        <div key={j} className="grid grid-cols-[20px_1fr_1fr] gap-3 py-1.5 text-label tabular-nums border-t border-border first:border-t-0">
                          <span className="text-ink-placeholder text-center">{j + 1}</span>
                          <span className="text-ink font-semibold">{isEquip ? (rec.weight ? `${rec.weight} kg` : '맨몸') : '맨몸'}</span>
                          <span className="text-ink-tertiary">{rec.reps} 회</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


          {/* 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                const feedData = {
                  type: 'workout',
                  date: new Date().toISOString(),
                  elapsed,
                  totalVolume,
                  totalSets,
                  estCalories,
                  focus: todaySchedule?.focus || '',
                  exercises: exercises.map(ex => {
                    const r = setRecords[ex.id] || []
                    const exFull = ALL_EXERCISES.find(e => e.id === ex.id) || ex
                    return { name: ex.name, category: exFull.category, sets: r.map(s => ({ weight: s.weight, reps: s.reps })) }
                  })
                }
                localStorage.setItem('pending-workout-feed', JSON.stringify(feedData))
                // 운동 기록도 함께 저장
                const history = JSON.parse(localStorage.getItem('workout-history') || '[]')
                history.unshift({
                  date: feedData.date,
                  programTitle: program.title || `${program.period} 프로그램`,
                  elapsed,
                  totalVolume,
                  totalSets,
                  estCalories,
                  focus: feedData.focus,
                  exercises: feedData.exercises,
                })
                localStorage.setItem('workout-history', JSON.stringify(history))
                navigate('/feed/new?type=workout')
              }}
              className="w-full py-4 bg-primary text-white font-bold rounded-card hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white stroke-2 fill-none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
              피드에 등록하기
            </button>
            <button
              onClick={() => {
                const history = JSON.parse(localStorage.getItem('workout-history') || '[]')
                history.unshift({
                  date: new Date().toISOString(),
                  programTitle: program.title || `${program.period} 프로그램`,
                  elapsed,
                  totalVolume,
                  totalSets,
                  estCalories,
                  focus: todaySchedule?.focus || '',
                  exercises: exercises.map(ex => {
                    const r = setRecords[ex.id] || []
                    const exFull = ALL_EXERCISES.find(e => e.id === ex.id) || ex
                    return { name: ex.name, category: exFull.category, sets: r.map(s => ({ weight: s.weight, reps: s.reps })) }
                  })
                })
                localStorage.setItem('workout-history', JSON.stringify(history))
                navigate('/mypage')
              }}
              className="w-full py-4 bg-surface-muted text-ink font-semibold rounded-card hover:bg-ink-disabled transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-surface border-b border-border px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-muted rounded-pill">
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              <span className="text-label font-bold text-ink tabular-nums">{formatTime(elapsed)}</span>
            </div>
            <button
              onClick={() => setRunning(!running)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${running ? 'bg-ink' : 'bg-primary'}`}
            >
              {running ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white ml-0.5"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
          </div>
          <button
            onClick={() => { setFinished(true); setRunning(false) }}
            className="text-caption font-semibold text-ink-tertiary"
          >
            종료
          </button>
        </div>

        {/* 오늘의 운동 헤더 */}
        <div className="flex items-center justify-between px-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-caption font-bold text-white">{todaySchedule?.day}</span>
            <span className="text-label font-bold text-ink">오늘의 운동</span>
            <span className="text-caption text-ink-tertiary">{todaySchedule?.focus}</span>
          </div>
          <span className="text-caption font-semibold text-ink-placeholder">{exercises.length}종목</span>
        </div>

        {/* 운동 진행 탭 */}
        <div className="flex gap-1">
          {exercises.map((ex, i) => {
            const r = setRecords[ex.id] || []
            const done = r.filter(s => s.done).length
            const allDone = done === r.length
            const isCurrent = i === currentIdx
            return (
              <button
                key={ex.id}
                onClick={() => setCurrentIdx(i)}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  allDone ? 'bg-accent-green' : isCurrent ? 'bg-primary' : 'bg-border'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* 운동 목록 (가로 스크롤 미니 카드) */}
      <div className="bg-surface-muted/50 border-b border-border">
        <div className="flex gap-2 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {exercises.map((ex, i) => {
            const r = setRecords[ex.id] || []
            const done = r.filter(s => s.done).length
            const allDone = done === r.length
            const isCurrent = i === currentIdx
            return (
              <button
                key={ex.id}
                ref={el => { tabRefs.current[i] = el }}
                onClick={() => setCurrentIdx(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-card whitespace-nowrap flex-shrink-0 transition-all ${
                  isCurrent ? 'bg-primary text-white shadow-card' : allDone ? 'bg-accent-green/10 text-accent-green' : 'bg-surface text-ink-tertiary border border-border'
                }`}
              >
                {allDone && !isCurrent && (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-accent-green stroke-[2.5] fill-none"><polyline points="20 6 9 17 4 12" /></svg>
                )}
                <span className="text-caption font-semibold">{ex.name}</span>
                {!allDone && <span className={`text-[10px] font-bold ${isCurrent ? 'text-white/70' : 'text-ink-placeholder'}`}>{done}/{r.length}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-5">
          {/* 튜토리얼 영상 */}
          <div className="rounded-card-lg overflow-hidden mb-4 bg-ink">
            <video
              key={`${currentEx.id}-${currentEx.category}`}
              src={
                exCategory === '가슴' || exCategory === '등' ? '/tu.mp4'
                : exCategory === '어깨' || exCategory === '팔' ? '/tu2.mp4'
                : exCategory === '하체' ? '/tu3.mp4'
                : '/tu4.mp4'
              }
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-48 object-cover"
            />
          </div>

          {/* 현재 운동 정보 */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-caption font-semibold text-primary">{currentIdx + 1}/{exercises.length}</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-caption font-semibold rounded">{currentEx.category}</span>
            </div>
            <h2 className="text-heading font-bold text-ink mb-1">{currentEx.name}</h2>
            <div className="text-caption text-ink-tertiary">{currentEx.muscle}</div>
          </div>

          {/* 운동 가이드 */}
          {fullEx?.description && (
            <div className="bg-primary/5 border border-primary/10 rounded-card-lg p-4 mb-5">
              <div className="flex items-center gap-1.5 mb-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary stroke-2 fill-none"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                <span className="text-caption font-semibold text-primary">운동 가이드</span>
              </div>
              <div className="text-label text-ink-secondary leading-relaxed">{fullEx.description}</div>
            </div>
          )}

          {/* 세트 기록 */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-body font-bold text-ink">세트 기록</h3>
              <span className="text-caption font-semibold text-ink-tertiary">{records.length}세트</span>
            </div>

            {/* 헤더 */}
            <div className={`grid ${hasEquipment ? 'grid-cols-[48px_1fr_1fr_28px]' : 'grid-cols-[48px_1fr_28px]'} gap-2 px-3 mb-2`}>
              <span className="text-caption text-ink-placeholder">세트</span>
              {hasEquipment && <span className="text-caption text-ink-placeholder text-center">무게(kg)</span>}
              <span className="text-caption text-ink-placeholder text-center">횟수(회)</span>
              <span />
            </div>

            <div className="flex flex-col gap-1.5">
              {records.map((rec, i) => (
                <div key={i} className={`grid ${hasEquipment ? 'grid-cols-[48px_1fr_1fr_28px]' : 'grid-cols-[48px_1fr_28px]'} gap-2 items-center p-3 rounded-card-lg border border-border bg-surface`}>
                  <span className="text-label font-bold text-ink">{i + 1}</span>
                  {hasEquipment && (
                    <input
                      type="number"
                      inputMode="decimal"
                      value={rec.weight}
                      onChange={e => updateWeight(i, e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 rounded-card text-center text-body font-bold bg-surface-muted text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                  <input
                    type="number"
                    inputMode="numeric"
                    value={rec.reps}
                    onChange={e => updateReps(i, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 rounded-card text-center text-body font-bold bg-surface-muted text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {records.length > 1 ? (
                    <button
                      onClick={() => removeSet(i)}
                      className="w-7 h-7 rounded-full bg-semantic-like/10 flex items-center justify-center hover:bg-semantic-like/20"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-semantic-like stroke-2 fill-none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  ) : <span />}
                </div>
              ))}
              <button
                onClick={addSet}
                className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-border rounded-card-lg text-caption font-semibold text-ink-tertiary hover:border-primary hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current stroke-2 fill-none"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                세트 추가
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="border-t border-border bg-surface px-5 py-4 flex gap-3">
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          className="w-12 h-12 rounded-card bg-surface-muted flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={goNext}
          className="flex-1 h-12 bg-primary text-white font-bold text-body rounded-card hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          {currentIdx < exercises.length - 1 ? (
            <>다음 운동 <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white stroke-2 fill-none"><path d="M9 18l6-6-6-6" /></svg></>
          ) : '운동 완료'}
        </button>
      </div>
    </div>
  )
}
