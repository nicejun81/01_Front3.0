import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconBot } from '../../components/Icons'

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

const GOALS = [
  { key: 'muscle', label: '근력 향상' },
  { key: 'diet', label: '다이어트' },
  { key: 'stamina', label: '체력 증진' },
  { key: 'rehab', label: '재활 · 교정' },
] as const
const LEVELS = [
  { key: 'beginner', label: '입문' },
  { key: 'intermediate', label: '중급' },
  { key: 'advanced', label: '고급' },
] as const

const ALL_EXERCISES: Exercise[] = [
  { id: 1, name: '벤치프레스', category: '가슴', muscle: '대흉근 · 삼두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '평평한 벤치에 누워 바벨을 가슴까지 내렸다가 밀어올리는 동작입니다. 가슴 근육 발달의 기본이 되는 대표적인 복합 운동으로, 대흉근과 삼두근을 동시에 자극합니다.' },
  { id: 2, name: '인클라인 덤벨프레스', category: '가슴', muscle: '상부 흉근 · 삼두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '30~45도 경사 벤치에서 덤벨을 밀어올리는 동작입니다. 상부 가슴 근육을 집중적으로 발달시키며, 덤벨 사용으로 좌우 균형 발달에 효과적입니다.' },
  { id: 3, name: '체스트 플라이 머신', category: '가슴', muscle: '대흉근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '머신에 앉아 양팔을 모아주는 동작입니다. 가슴 근육의 안쪽 라인을 강화하며, 머신 가이드로 부상 위험이 적어 초보자에게 적합합니다.' },
  { id: 4, name: '랫 풀다운', category: '등', muscle: '광배근 · 이두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '케이블 머신에서 바를 가슴 쪽으로 당기는 동작입니다. 넓은 등(광배근)을 발달시키는 핵심 운동으로, 턱걸이가 어려운 경우 대체 운동으로 활용됩니다.' },
  { id: 5, name: '시티드 로우', category: '등', muscle: '중부 승모근 · 능형근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '앉은 자세에서 케이블을 몸 쪽으로 당기는 동작입니다. 등 중앙부의 두께를 만들어주며, 자세 교정과 어깨 안정성 향상에 도움이 됩니다.' },
  { id: 6, name: '데드리프트', category: '등', muscle: '척추기립근 · 햄스트링', sets: '4', reps: '6-8', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '바닥에 놓인 바벨을 허리를 펴며 들어올리는 동작입니다. 전신 근력 발달의 핵심 운동으로, 후면 사슬(등, 둔근, 햄스트링) 전체를 강화합니다.' },
  { id: 7, name: '오버헤드 프레스', category: '어깨', muscle: '전면 삼각근', sets: '4', reps: '8-10', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '서서 바벨이나 덤벨을 머리 위로 밀어올리는 동작입니다. 어깨 전면부를 강화하고 코어 안정성을 동시에 훈련할 수 있는 복합 운동입니다.' },
  { id: 8, name: '사이드 레터럴 레이즈', category: '어깨', muscle: '측면 삼각근', sets: '4', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '덤벨을 양손에 들고 옆으로 들어올리는 동작입니다. 어깨의 넓이를 만들어주는 핵심 고립 운동으로, 측면 삼각근을 집중 자극합니다.' },
  { id: 9, name: '페이스 풀', category: '어깨', muscle: '후면 삼각근 · 승모근', sets: '3', reps: '15-20', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '케이블을 얼굴 높이로 당기는 동작입니다. 후면 삼각근과 상부 승모근을 강화하여 라운드 숄더를 교정하고 어깨 건강을 유지하는 데 효과적입니다.' },
  { id: 10, name: '바벨 스쿼트', category: '하체', muscle: '대퇴사두 · 둔근', sets: '5', reps: '6-8', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '바벨을 어깨에 올려놓고 앉았다 일어서는 동작입니다. 하체 전체를 강화하는 최고의 복합 운동으로, 대퇴사두근과 둔근을 집중적으로 발달시킵니다.' },
  { id: 11, name: '레그프레스', category: '하체', muscle: '대퇴사두 · 둔근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '머신에 앉아 발판을 밀어내는 동작입니다. 스쿼트보다 허리 부담이 적으면서 하체 근력을 효과적으로 키울 수 있어 보조 운동으로 적합합니다.' },
  { id: 12, name: '루마니안 데드리프트', category: '하체', muscle: '햄스트링 · 둔근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '무릎을 살짝 굽힌 채 상체를 숙여 바벨을 내렸다 올리는 동작입니다. 햄스트링과 둔근을 집중 자극하며, 후면 사슬 강화에 필수적인 운동입니다.' },
  { id: 13, name: '레그 컬', category: '하체', muscle: '햄스트링', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '엎드린 자세에서 발뒤꿈치를 엉덩이 쪽으로 당기는 동작입니다. 햄스트링을 고립시켜 훈련하며, 무릎 안정성 강화에도 도움이 됩니다.' },
  { id: 14, name: '바벨 컬', category: '팔', muscle: '이두근', sets: '3', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '바벨을 언더그립으로 잡고 팔꿈치를 고정한 채 들어올리는 동작입니다. 이두근 벌크업의 기본 운동으로, 팔 전면부를 효과적으로 발달시킵니다.' },
  { id: 15, name: '트라이셉스 푸시다운', category: '팔', muscle: '삼두근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '케이블 머신에서 바를 아래로 밀어내리는 동작입니다. 삼두근을 고립시켜 훈련하며, 팔 뒤쪽 라인을 만드는 데 효과적인 운동입니다.' },
  { id: 16, name: '딥스', category: '팔', muscle: '삼두근 · 흉근', sets: '3', reps: '10-15', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '평행봉을 잡고 몸을 내렸다 올리는 동작입니다. 삼두근과 하부 가슴을 동시에 자극하는 복합 운동으로, 체중을 이용한 효율적인 상체 훈련입니다.' },
  { id: 17, name: '플랭크', category: '코어', muscle: '복직근 · 복횡근', sets: '3', reps: '30-60초', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '팔꿈치와 발끝으로 몸을 일직선으로 유지하는 동작입니다. 코어 전체를 등척성으로 훈련하며, 체간 안정성과 자세 유지 능력을 향상시킵니다.' },
  { id: 18, name: '행잉 레그레이즈', category: '코어', muscle: '하복부 · 고관절 굴근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', description: '철봉에 매달려 다리를 들어올리는 동작입니다. 하복부를 강하게 자극하며, 그립 근력과 코어 안정성을 동시에 훈련할 수 있는 고급 운동입니다.' },
  { id: 19, name: '러시안 트위스트', category: '코어', muscle: '복사근', sets: '3', reps: '20-30', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', description: '앉은 자세에서 상체를 좌우로 회전하는 동작입니다. 복사근(옆구리)을 집중 자극하며, 회전 안정성과 코어 근력을 강화하는 데 효과적입니다.' },
  { id: 20, name: '트레드밀 인터벌', category: '유산소', muscle: '전신 · 심폐', sets: '-', reps: '20-30분', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', description: '러닝머신에서 고강도와 저강도를 번갈아 수행하는 훈련입니다. 심폐 지구력을 효과적으로 향상시키며, 짧은 시간에 높은 칼로리 소모가 가능합니다.' },
  { id: 21, name: '로잉 머신', category: '유산소', muscle: '전신 · 심폐', sets: '-', reps: '15-20분', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop', description: '노를 젓는 동작을 재현한 전신 유산소 운동입니다. 상·하체를 동시에 사용하여 심폐 기능과 근지구력을 균형 있게 발달시킵니다.' },
]

const CATEGORIES = ['전체', '가슴', '등', '어깨', '하체', '팔', '코어', '유산소'] as const

const AI_PROGRAMS_KEY = 'ai-programs'

const loadAiPrograms = (): AiProgram[] => {
  try { return JSON.parse(localStorage.getItem(AI_PROGRAMS_KEY) || '[]') }
  catch { return [] }
}

export const AiProgramDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [programs, setPrograms] = useState<AiProgram[]>(loadAiPrograms)
  const program = programs.find(p => p.id === Number(id))

  const [addingDay, setAddingDay] = useState<string | null>(null)
  const [viewingEx, setViewingEx] = useState<Exercise | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState<string>('전체')
  const [toast, setToast] = useState<string | null>(null)
  const [titleError, setTitleError] = useState(false)

  const savePrograms = (updated: AiProgram[]) => {
    setPrograms(updated)
    localStorage.setItem(AI_PROGRAMS_KEY, JSON.stringify(updated))
  }

  const updateTitle = (title: string) => {
    if (!program) return
    const updated = programs.map(p => p.id === program.id ? { ...p, title: title.trim() || undefined } : p)
    savePrograms(updated)
  }

  const updateSchedule = (newSchedule: AiProgram['schedule']) => {
    if (!program) return
    const updated = programs.map(p => p.id === program.id ? { ...p, schedule: newSchedule } : p)
    savePrograms(updated)
  }

  const removeExercise = (dayLabel: string, exId: number) => {
    if (!program) return
    updateSchedule(program.schedule.map(s =>
      s.day === dayLabel ? { ...s, exercises: s.exercises.filter(e => e.id !== exId) } : s
    ))
  }

  const addExercise = (dayLabel: string, ex: Exercise) => {
    if (!program) return
    updateSchedule(program.schedule.map(s =>
      s.day === dayLabel ? { ...s, exercises: [...s.exercises, ex] } : s
    ))
  }

  const updateExercise = (dayLabel: string, exId: number, field: 'sets' | 'reps', value: string) => {
    if (!program) return
    updateSchedule(program.schedule.map(s =>
      s.day === dayLabel ? { ...s, exercises: s.exercises.map(e => e.id === exId ? { ...e, [field]: value } : e) } : s
    ))
  }

  const deleteProgram = () => {
    if (!program) return
    savePrograms(programs.filter(p => p.id !== program.id))
    navigate('/workout', { replace: true })
  }

  const currentDayExerciseIds = useMemo(() => {
    if (!addingDay || !program) return [] as number[]
    return program.schedule.find(s => s.day === addingDay)?.exercises.map(e => e.id) || []
  }, [addingDay, program])

  const filteredExercises = useMemo(() => {
    return ALL_EXERCISES
      .filter(e => !currentDayExerciseIds.includes(e.id))
      .filter(e => searchCategory === '전체' || e.category === searchCategory)
      .filter(e => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      })
  }, [currentDayExerciseIds, searchQuery, searchCategory])

  if (!program) {
    return (
      <PageLayout header={<SubPageHeader title="프로그램" />}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-[48px] mb-4">😢</div>
          <div className="text-body font-bold text-ink mb-2">프로그램을 찾을 수 없어요</div>
          <button onClick={() => navigate('/workout')} className="text-label font-semibold text-primary">목록으로 돌아가기</button>
        </div>
      </PageLayout>
    )
  }

  const periodDays: Record<string, number> = { '1일': 1, '1주': 7, '2주': 14, '1개월': 30, '3개월': 90, '6개월': 180, '1년': 365 }
  const days = periodDays[program.period] || 1
  const goalLabel = GOALS.find(g => g.key === program.goal)?.label || ''
  const levelLabel = LEVELS.find(l => l.key === program.level)?.label || ''

  return (
    <>
    <PageLayout header={<SubPageHeader title={program.title || `${program.period} ${goalLabel}`} showChat />}>
      {/* 프로그램 헤더 카드 */}
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-card-lg p-5 text-white mb-5">
        <div className="flex items-center gap-2 mb-2">
          <IconBot className="w-7 h-7 text-white stroke-white stroke-[1.5]" />
          <span className="text-body font-bold">AI 맞춤 운동 프로그램</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-white/20 rounded-pill text-caption font-semibold">{goalLabel}</span>
          <span className="px-2.5 py-1 bg-white/20 rounded-pill text-caption font-semibold">{levelLabel}</span>
          <span className="px-2.5 py-1 bg-white/20 rounded-pill text-caption font-semibold">{program.period} ({days}일)</span>
          <span className="px-2.5 py-1 bg-white/20 rounded-pill text-caption font-semibold">{program.createdAt}</span>
        </div>
      </div>

      {/* 주간 스케줄 — 항상 편집 모드 */}
      {/* 프로그램 제목 */}
      <div className="mb-5">
        <label className="text-caption font-semibold text-ink-tertiary mb-1.5 block">프로그램 제목 <span className="text-primary">*</span></label>
        <input
          type="text"
          defaultValue={program.title || ''}
          onBlur={e => { updateTitle(e.target.value); if (e.target.value.trim()) setTitleError(false) }}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
          onChange={() => { if (titleError) setTitleError(false) }}
          placeholder="프로그램 이름을 입력하세요"
          className={`w-full px-4 py-3 bg-surface-muted rounded-card text-body font-semibold text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 ${
            titleError ? 'ring-2 ring-semantic-like/50 border border-semantic-like' : 'focus:ring-primary/30'
          }`}
        />
        {titleError && (
          <div className="flex items-center gap-1 mt-1.5 text-semantic-like">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current stroke-2 fill-none"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
            <span className="text-caption font-semibold">프로그램 이름을 입력해 주세요</span>
          </div>
        )}
      </div>

      <h3 className="text-body font-bold text-ink mb-3">{days === 1 ? '오늘의 운동' : '주간 운동 스케줄'}</h3>
      <div className="flex flex-col gap-3 mb-6">
        {program.schedule.map(s => (
          <div key={s.day} className="border border-border rounded-card-lg overflow-hidden">
            <div className={`flex items-center justify-between px-4 py-2.5 ${s.exercises.length > 0 ? 'bg-primary/5' : 'bg-surface-muted'}`}>
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-caption font-bold ${
                  s.exercises.length > 0 ? 'bg-primary text-white' : 'bg-ink-disabled text-ink-placeholder'
                }`}>{days === 1 ? 'D1' : s.day}</span>
                <span className="text-label font-bold text-ink">{s.focus}</span>
              </div>
              {s.exercises.length > 0 && (
                <span className="text-caption text-ink-tertiary">{s.exercises.length}종목</span>
              )}
            </div>
            {s.exercises.length > 0 && (
              <div className="divide-y divide-border">
                {s.exercises.map(ex => {
                  const fullEx = ALL_EXERCISES.find(e => e.id === ex.id) || ex
                  return (
                    <div key={ex.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setViewingEx(fullEx)}>
                        <img src={ex.imageUrl} alt={ex.name} className="w-10 h-10 rounded-card object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-label font-semibold text-ink truncate">{ex.name}</div>
                          <div className="text-caption text-ink-tertiary">{ex.muscle}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExercise(s.day, ex.id)}
                        className="w-7 h-7 rounded-full bg-semantic-like/10 flex items-center justify-center flex-shrink-0 hover:bg-semantic-like/20"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-semantic-like stroke-2 fill-none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            {s.focus !== '휴식' && (
              <button
                onClick={() => { setAddingDay(s.day); setSearchQuery(''); setSearchCategory('전체') }}
                className="w-full flex items-center justify-center gap-1.5 py-3 text-label font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-border"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary stroke-2 fill-none"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                운동 추가
              </button>
            )}
            {s.exercises.length === 0 && s.focus === '휴식' && (
              <div className="px-4 py-4 text-center text-caption text-ink-placeholder">충분한 휴식으로 근육을 회복하세요</div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={deleteProgram}
          className="px-5 py-4 bg-semantic-like/10 text-semantic-like font-semibold rounded-card hover:bg-semantic-like/20 transition-colors"
        >
          삭제
        </button>
        <button
          onClick={() => {
            if (!program.title) {
              setTitleError(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
              return
            }
            setToast('프로그램이 저장되었습니다')
            setTimeout(() => { setToast(null); navigate('/workout') }, 1200)
          }}
          className="flex-1 py-4 bg-primary text-white font-bold rounded-card hover:bg-primary-dark transition-colors"
        >
          저장 완료
        </button>
      </div>
    </PageLayout>

    {/* 운동 추가 모달 */}
    {addingDay && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => { setAddingDay(null); setSearchQuery(''); setSearchCategory('전체') }}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg bg-surface rounded-t-[20px] max-h-[80vh] flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-ink-disabled" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 pb-3">
              <span className="text-body font-bold text-ink">{addingDay}요일에 운동 추가</span>
              <button onClick={() => { setAddingDay(null); setSearchQuery(''); setSearchCategory('전체') }} className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* 검색 */}
            <div className="px-5 pb-2">
              <div className="relative mb-2">
                <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 stroke-ink-placeholder stroke-2 fill-none">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="운동 이름, 부위, 근육으로 검색"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-ink-disabled flex items-center justify-center"
                  >
                    <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-white stroke-2 fill-none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSearchCategory(cat)}
                    className={`px-3 py-1.5 rounded-pill text-caption font-semibold whitespace-nowrap transition-colors ${
                      searchCategory === cat ? 'bg-primary text-white' : 'bg-surface-muted text-ink-tertiary hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 결과 목록 */}
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {filteredExercises.length > 0 ? filteredExercises.map(ex => (
                <div key={ex.id} className="flex items-center gap-3 px-5 py-3 hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setViewingEx(ex)}>
                    <img src={ex.imageUrl} alt={ex.name} className="w-10 h-10 rounded-card object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-label font-semibold text-ink truncate">{ex.name}</div>
                      <div className="text-caption text-ink-tertiary">{ex.category} · {ex.muscle}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { addExercise(addingDay!, ex); setToast(`${ex.name} 추가됨`); setTimeout(() => setToast(null), 1200) }}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:bg-primary/20"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary stroke-2 fill-none"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>
              )) : (
                <div className="px-5 py-12 text-center">
                  <div className="text-caption text-ink-placeholder">검색 결과가 없습니다</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 운동 상세 모달 */}
      {viewingEx && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setViewingEx(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg bg-surface rounded-t-[20px] max-h-[85vh] flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-ink-disabled" />
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-body font-bold text-ink">{viewingEx.name}</h3>
                <button onClick={() => setViewingEx(null)} className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <img src={viewingEx.imageUrl} alt={viewingEx.name} className="w-full h-48 rounded-card-lg object-cover mb-4" />
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-caption font-semibold rounded-pill">{viewingEx.category}</span>
                <span className="px-2.5 py-1 bg-surface-muted text-ink-tertiary text-caption font-semibold rounded-pill">{viewingEx.muscle}</span>
                {viewingEx.sets !== '-' && (
                  <span className="px-2.5 py-1 bg-surface-muted text-ink-tertiary text-caption font-semibold rounded-pill">{viewingEx.sets}세트</span>
                )}
              </div>
              {viewingEx.description && (
                <div className="bg-surface-muted rounded-card-lg p-4">
                  <div className="text-caption font-semibold text-ink-tertiary mb-1.5">운동 설명</div>
                  <div className="text-label text-ink leading-relaxed">{viewingEx.description}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    {/* Toast */}
    {toast && (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 bg-ink text-white text-label font-semibold rounded-pill shadow-elevated z-50 animate-slide-up">
        {toast}
      </div>
    )}
    </>
  )
}
