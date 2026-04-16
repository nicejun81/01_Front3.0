import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconCheck, IconBot } from '../../components/Icons'

const InField = ({ label, value, onChange, unit, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; unit: string; placeholder: string; required?: boolean }) => (
  <div className="relative">
    <label className="text-caption font-semibold text-ink-tertiary mb-1 block">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-3 pr-10 py-3 bg-surface-muted rounded-card text-body font-semibold text-ink placeholder:text-ink-placeholder focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-caption font-semibold text-ink-placeholder">{unit}</span>
    </div>
  </div>
)

const BarGauge = ({ value, min, low, high, max, labels }: { value: number; min: number; low: number; high: number; max: number; labels: [string, string, string] }) => {
  const pos = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const color = value < low ? '#06B6D4' : value <= high ? '#10B981' : '#EF4444'
  return (
    <div>
      <div className="relative h-2 rounded-full overflow-hidden bg-surface-muted mb-1">
        <div className="absolute inset-y-0 left-0 bg-[#06B6D4]/30" style={{ width: `${((low - min) / (max - min)) * 100}%` }} />
        <div className="absolute inset-y-0 bg-accent-green/30" style={{ left: `${((low - min) / (max - min)) * 100}%`, width: `${((high - low) / (max - min)) * 100}%` }} />
        <div className="absolute inset-y-0 right-0 bg-semantic-like/30" style={{ width: `${((max - high) / (max - min)) * 100}%` }} />
        {value > 0 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ left: `${pos}%`, background: color, transform: 'translate(-50%, -50%)' }} />
        )}
      </div>
      <div className="flex justify-between text-[9px] text-ink-placeholder">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  )
}

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

type InBody = {
  height: string
  weight: string
  muscleMass: string
  bodyFat: string
  bodyWater: string
  basalMetab: string
  visceralFat: string
  bmi: string
}

type BodyCheck = {
  painAreas: string[]
  goal: string
  level: string
  inbody: InBody | null
}

const GOALS = [
  { key: 'muscle', label: '근력 향상', desc: '근비대 · 근력 증가', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop' },
  { key: 'diet', label: '다이어트', desc: '체지방 감소 · 유산소', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop' },
  { key: 'stamina', label: '체력 증진', desc: '심폐 · 전신 컨디션', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
  { key: 'rehab', label: '재활 · 교정', desc: '통증 완화 · 자세 교정', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
] as const
const LEVELS = [
  { key: 'beginner', label: '입문', desc: '운동 시작한 지 3개월 이내', imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&h=200&fit=crop' },
  { key: 'intermediate', label: '중급', desc: '6개월~2년 꾸준히 운동', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=200&fit=crop' },
  { key: 'advanced', label: '고급', desc: '2년 이상 · 분할 루틴 숙지', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop' },
] as const

const ALL_EXERCISES: Exercise[] = [
  { id: 1, name: '벤치프레스', category: '가슴', muscle: '대흉근 · 삼두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { id: 2, name: '인클라인 덤벨프레스', category: '가슴', muscle: '상부 흉근 · 삼두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop' },
  { id: 3, name: '체스트 플라이 머신', category: '가슴', muscle: '대흉근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop' },
  { id: 4, name: '랫 풀다운', category: '등', muscle: '광배근 · 이두', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { id: 5, name: '시티드 로우', category: '등', muscle: '중부 승모근 · 능형근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop' },
  { id: 6, name: '데드리프트', category: '등', muscle: '척추기립근 · 햄스트링', sets: '4', reps: '6-8', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' },
  { id: 7, name: '오버헤드 프레스', category: '어깨', muscle: '전면 삼각근', sets: '4', reps: '8-10', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { id: 8, name: '사이드 레터럴 레이즈', category: '어깨', muscle: '측면 삼각근', sets: '4', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop' },
  { id: 9, name: '페이스 풀', category: '어깨', muscle: '후면 삼각근 · 승모근', sets: '3', reps: '15-20', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop' },
  { id: 10, name: '바벨 스쿼트', category: '하체', muscle: '대퇴사두 · 둔근', sets: '5', reps: '6-8', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' },
  { id: 11, name: '레그프레스', category: '하체', muscle: '대퇴사두 · 둔근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { id: 12, name: '루마니안 데드리프트', category: '하체', muscle: '햄스트링 · 둔근', sets: '4', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop' },
  { id: 13, name: '레그 컬', category: '하체', muscle: '햄스트링', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop' },
  { id: 14, name: '바벨 컬', category: '팔', muscle: '이두근', sets: '3', reps: '10-12', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { id: 15, name: '트라이셉스 푸시다운', category: '팔', muscle: '삼두근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop' },
  { id: 16, name: '딥스', category: '팔', muscle: '삼두근 · 흉근', sets: '3', reps: '10-15', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' },
  { id: 17, name: '플랭크', category: '코어', muscle: '복직근 · 복횡근', sets: '3', reps: '30-60초', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop' },
  { id: 18, name: '행잉 레그레이즈', category: '코어', muscle: '하복부 · 고관절 굴근', sets: '3', reps: '12-15', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
  { id: 19, name: '러시안 트위스트', category: '코어', muscle: '복사근', sets: '3', reps: '20-30', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop' },
  { id: 20, name: '트레드밀 인터벌', category: '유산소', muscle: '전신 · 심폐', sets: '-', reps: '20-30분', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' },
  { id: 21, name: '로잉 머신', category: '유산소', muscle: '전신 · 심폐', sets: '-', reps: '15-20분', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop' },
]

type AiProgram = {
  id: number
  title?: string
  period: string
  goal: string
  level: string
  createdAt: string
  schedule: { day: string; focus: string; exercises: Exercise[] }[]
}

const BODY_CHECK_KEY = 'body-check'
const AI_PROGRAMS_KEY = 'ai-programs'

const loadBodyCheck = (): BodyCheck | null => {
  try { return JSON.parse(localStorage.getItem(BODY_CHECK_KEY) || 'null') }
  catch { return null }
}
const loadAiPrograms = (): AiProgram[] => {
  try { return JSON.parse(localStorage.getItem(AI_PROGRAMS_KEY) || '[]') }
  catch { return [] }
}

export const WorkoutPage = () => {
  const [bodyCheck, setBodyCheck] = useState<BodyCheck | null>(loadBodyCheck)
  const [checkStep, setCheckStep] = useState(0)

  // body check form state
  const [painAreas, setPainAreas] = useState<string[]>(bodyCheck?.painAreas || [])
  const [goal, setGoal] = useState(bodyCheck?.goal || '')
  const [level, setLevel] = useState(bodyCheck?.level || '')
  const [inbody, setInbody] = useState<InBody>(bodyCheck?.inbody || { height: '', weight: '', muscleMass: '', bodyFat: '', bodyWater: '', basalMetab: '', visceralFat: '', bmi: '' })

  // mode: null = 체크 전, 'confirm' = 저장 확인, 'custom' = 직접 커스텀
  const [mode, setMode] = useState<null | 'confirm' | 'custom'>(null)

  // workout state
  const [toast, setToast] = useState<string | null>(null)

  // AI 맞춤운동 state
  const [aiMode, setAiMode] = useState<null | 'select-period' | 'generating'>(null)
  const [aiPeriod, setAiPeriod] = useState<string | null>(null)
  const [aiPrograms, setAiPrograms] = useState<AiProgram[]>(loadAiPrograms)
  const [wearableModal, setWearableModal] = useState<{ progId: number } | null>(null)
  const [wearableConnecting, setWearableConnecting] = useState(false)
  const [wearableConnected, setWearableConnected] = useState<string | null>(null)
  const [wearableFailed, setWearableFailed] = useState(false)
  const wearableAttemptRef = useRef(0)
  const nav = useNavigate()

  const generateAiProgram = () => {
    const periodDays: Record<string, number> = { '1일': 1, '1주': 7, '2주': 14, '1개월': 30, '3개월': 90, '6개월': 180, '1년': 365 }
    const days = periodDays[aiPeriod || '1일'] || 1
    const weeklySchedule = [
      { day: '월', focus: '가슴 · 삼두', exercises: ALL_EXERCISES.filter(e => ['가슴', '팔'].includes(e.category)).slice(0, 4) },
      { day: '화', focus: '등 · 이두', exercises: ALL_EXERCISES.filter(e => ['등', '팔'].includes(e.category)).slice(0, 4) },
      { day: '수', focus: '유산소 · 코어', exercises: ALL_EXERCISES.filter(e => ['유산소', '코어'].includes(e.category)).slice(0, 4) },
      { day: '목', focus: '어깨', exercises: ALL_EXERCISES.filter(e => e.category === '어깨').slice(0, 3) },
      { day: '금', focus: '하체', exercises: ALL_EXERCISES.filter(e => e.category === '하체').slice(0, 4) },
      { day: '토', focus: '전신 · 유산소', exercises: [...ALL_EXERCISES.filter(e => e.category === '유산소'), ...ALL_EXERCISES.filter(e => e.category === '코어')].slice(0, 3) },
      { day: '일', focus: '휴식', exercises: [] },
    ]
    const schedule = days === 1 ? weeklySchedule.slice(0, 1) : weeklySchedule
    const program: AiProgram = {
      id: Date.now(),
      period: aiPeriod || '1일',
      goal: bodyCheck?.goal || '',
      level: bodyCheck?.level || '',
      createdAt: new Date().toLocaleDateString('ko-KR'),
      schedule,
    }
    const updated = [program, ...aiPrograms]
    setAiPrograms(updated)
    localStorage.setItem(AI_PROGRAMS_KEY, JSON.stringify(updated))
    setAiMode(null)
    setAiPeriod(null)
    nav(`/workout/${program.id}`)
  }

  const togglePain = (key: string) => {
    if (key === '없음') { setPainAreas(['없음']); return }
    setPainAreas(prev => {
      const without = prev.filter(a => a !== '없음')
      return without.includes(key) ? without.filter(a => a !== key) : [...without, key]
    })
  }

  const checkSteps = [
    { label: '통증 부위', done: painAreas.length > 0 },
    { label: '운동 목표', done: !!goal },
    { label: '운동 수준', done: !!level },
    { label: '인바디', done: !!(inbody.height && inbody.weight) },
  ]
  const canNext = checkSteps[checkStep].done

  const submitBodyCheck = () => {
    const ib = (inbody.height && inbody.weight) ? inbody : null
    const data: BodyCheck = { painAreas, goal, level, inbody: ib }
    setBodyCheck(data)
    localStorage.setItem(BODY_CHECK_KEY, JSON.stringify(data))
    setMode('confirm')
    setToast(null)
  }

  const resetCheck = () => {
    setBodyCheck(null)
    localStorage.removeItem(BODY_CHECK_KEY)
    setCheckStep(0)
    setPainAreas([])
    setGoal('')
    setLevel('')
    setInbody({ height: '', weight: '', muscleMass: '', bodyFat: '', bodyWater: '', basalMetab: '', visceralFat: '', bmi: '' })
  }

  // 몸상태 체크 전
  if (!bodyCheck) {
    return (
      <PageLayout header={<SubPageHeader title="운동" showChat />}>
        {/* 진행 바 */}
        <div className="flex gap-1.5 mb-6">
          {checkSteps.map((s, i) => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1 w-full rounded-full ${i <= checkStep ? 'bg-primary' : 'bg-surface-muted'}`} />
              <span className={`text-caption ${i === checkStep ? 'text-primary font-bold' : 'text-ink-placeholder'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 0: 통증 부위 */}
        {checkStep === 0 && (
          <div>
            <h2 className="text-heading font-bold text-ink mb-1">통증이 있는 부위가 있나요?</h2>
            <p className="text-body text-ink-secondary mb-5">이미지를 터치하여 통증 부위를 선택해 주세요</p>

            {/* man.jpg - 첫 번째 남성 실루엣 크롭 */}
            <div className="relative mx-auto mb-5" style={{ width: 200, height: 380 }}>
              <div className="w-full h-full overflow-hidden rounded-card-lg bg-white">
                <img
                  src="/man.jpg"
                  alt="body"
                  className="h-full object-cover"
                  style={{ width: 800, maxWidth: 'none', objectPosition: '3% center' }}
                />
              </div>

              {/* 좌/우 가이드 */}
              <div className="absolute top-2 left-2 text-[10px] font-bold text-ink-placeholder bg-white/70 px-1 rounded">L</div>
              <div className="absolute top-2 right-2 text-[10px] font-bold text-ink-placeholder bg-white/70 px-1 rounded">R</div>

              {/* 터치 포인트 - 좌우 분리, 실루엣 해부학 기준 좌표 */}
              {([
                { key: '목', label: '목', top: '15%', left: '50%' },
                { key: '좌 어깨', label: '어깨', top: '22%', left: '28%', side: 'L' },
                { key: '우 어깨', label: '어깨', top: '22%', left: '72%', side: 'R' },
                { key: '좌 팔꿈치', label: '팔꿈치', top: '40%', left: '15%', side: 'L' },
                { key: '우 팔꿈치', label: '팔꿈치', top: '40%', left: '85%', side: 'R' },
                { key: '좌 손목', label: '손목', top: '54%', left: '10%', side: 'L' },
                { key: '우 손목', label: '손목', top: '54%', left: '90%', side: 'R' },
                { key: '허리', label: '허리', top: '46%', left: '50%' },
                { key: '좌 무릎', label: '무릎', top: '72%', left: '38%', side: 'L' },
                { key: '우 무릎', label: '무릎', top: '72%', left: '62%', side: 'R' },
                { key: '좌 발목', label: '발목', top: '90%', left: '38%', side: 'L' },
                { key: '우 발목', label: '발목', top: '90%', left: '62%', side: 'R' },
              ] as const).map(p => {
                const on = painAreas.includes(p.key)
                const side = 'side' in p ? p.side : null
                return (
                  <button
                    key={p.key}
                    onClick={() => togglePain(p.key)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    style={{ top: p.top, left: p.left }}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      on
                        ? 'bg-semantic-like/60 border-semantic-like shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                        : 'bg-black/10 border-ink-disabled/60 group-hover:bg-primary/15 group-hover:border-primary/40'
                    }`}>
                      {on && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className={`absolute left-1/2 -translate-x-1/2 -bottom-3.5 text-[9px] font-bold whitespace-nowrap px-1 py-px rounded ${
                      on ? 'bg-semantic-like text-white' : 'text-ink-tertiary'
                    }`}>
                      {side ? `${p.label}(${side})` : p.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 없음 버튼 + 선택 요약 */}
            <button
              onClick={() => togglePain('없음')}
              className={`w-full py-3 rounded-card-lg border-2 text-body font-semibold transition-all ${
                painAreas.includes('없음')
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border bg-surface text-ink-secondary hover:border-ink-disabled'
              }`}
            >
              ✅ 통증 없음
            </button>
            {painAreas.length > 0 && !painAreas.includes('없음') && (
              <div className="mt-3 p-3 bg-semantic-like/10 border border-semantic-like/20 rounded-card flex items-start gap-2">
                <span className="text-semantic-like text-body">⚠️</span>
                <div>
                  <span className="text-label font-bold text-semantic-like">{painAreas.join(', ')}</span>
                  <span className="text-caption text-ink-tertiary ml-1">부위에 부담이 가는 운동은 제외됩니다</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: 운동 목표 */}
        {checkStep === 1 && (
          <div>
            <h2 className="text-heading font-bold text-ink mb-1">오늘의 운동 목표는?</h2>
            <p className="text-body text-ink-secondary mb-4">목표에 맞는 운동을 우선 추천해 드릴게요</p>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map(g => {
                const on = goal === g.key
                return (
                  <button
                    key={g.key}
                    onClick={() => setGoal(g.key)}
                    className={`relative rounded-card-lg overflow-hidden border-2 transition-all ${
                      on ? 'border-primary shadow-card' : 'border-transparent'
                    }`}
                  >
                    <img src={g.imageUrl} alt={g.label} className="w-full h-[110px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3">
                      <div className="text-body font-bold text-white">{g.label}</div>
                      <div className="text-caption text-white/70">{g.desc}</div>
                    </div>
                    {on && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <IconCheck className="w-3.5 h-3.5 stroke-white stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: 운동 수준 */}
        {checkStep === 2 && (
          <div>
            <h2 className="text-heading font-bold text-ink mb-1">운동 수준을 알려주세요</h2>
            <p className="text-body text-ink-secondary mb-4">수준에 맞는 세트와 무게를 추천해 드릴게요</p>
            <div className="flex flex-col gap-2">
              {LEVELS.map(l => {
                const on = level === l.key
                return (
                  <button
                    key={l.key}
                    onClick={() => setLevel(l.key)}
                    className={`relative rounded-card-lg overflow-hidden border-2 transition-all ${
                      on ? 'border-primary shadow-card' : 'border-transparent'
                    }`}
                  >
                    <img src={l.imageUrl} alt={l.label} className="w-full h-[90px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-4">
                      <div>
                        <div className="text-body font-bold text-white">{l.label}</div>
                        <div className="text-caption text-white/70">{l.desc}</div>
                      </div>
                    </div>
                    {on && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <IconCheck className="w-3.5 h-3.5 stroke-white stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: 인바디 */}
        {checkStep === 3 && (() => {
          const bmiVal = inbody.bmi ? Number(inbody.bmi) : 0
          const bmiLabel = bmiVal < 18.5 ? '저체중' : bmiVal < 23 ? '정상' : bmiVal < 25 ? '과체중' : '비만'
          const bmiColor = bmiVal < 18.5 ? '#06B6D4' : bmiVal < 23 ? '#10B981' : bmiVal < 25 ? '#F59E0B' : '#EF4444'
          const bmiPos = Math.min(100, Math.max(0, ((bmiVal - 14) / 20) * 100))

          const updateHeight = (h: string) => {
            const bmi = (h && inbody.weight) ? (Number(inbody.weight) / ((Number(h) / 100) ** 2)).toFixed(1) : ''
            setInbody(p => ({ ...p, height: h, bmi }))
          }
          const updateWeight = (w: string) => {
            const bmi = (inbody.height && w) ? (Number(w) / ((Number(inbody.height) / 100) ** 2)).toFixed(1) : ''
            setInbody(p => ({ ...p, weight: w, bmi }))
          }

          return (
          <div>
            <h2 className="text-heading font-bold text-ink mb-1">인바디 정보</h2>
            <p className="text-body text-ink-secondary mb-4">체성분 기반으로 더 정확한 운동을 추천해 드릴게요</p>

            {/* 기본 정보 - 키/체중 */}
            <div className="border border-border rounded-card-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-caption font-bold flex items-center justify-center">1</span>
                <span className="text-body font-bold text-ink">기본 정보</span>
                <span className="text-primary text-caption font-semibold">필수</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InField label="키" value={inbody.height} onChange={updateHeight} unit="cm" placeholder="170" required />
                <InField label="체중" value={inbody.weight} onChange={updateWeight} unit="kg" placeholder="70" required />
              </div>
            </div>

            {/* 체성분 정보 */}
            <div className="border border-border rounded-card-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-accent-purple text-white text-caption font-bold flex items-center justify-center">2</span>
                <span className="text-body font-bold text-ink">체성분 분석</span>
                <span className="text-ink-placeholder text-caption">선택</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <InField label="골격근량" value={inbody.muscleMass} onChange={v => setInbody(p => ({ ...p, muscleMass: v }))} unit="kg" placeholder="30" />
                <InField label="체지방률" value={inbody.bodyFat} onChange={v => setInbody(p => ({ ...p, bodyFat: v }))} unit="%" placeholder="20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InField label="체수분" value={inbody.bodyWater} onChange={v => setInbody(p => ({ ...p, bodyWater: v }))} unit="L" placeholder="35" />
                <InField label="기초대사량" value={inbody.basalMetab} onChange={v => setInbody(p => ({ ...p, basalMetab: v }))} unit="kcal" placeholder="1500" />
              </div>
            </div>

            {/* 내장지방 */}
            <div className="border border-border rounded-card-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[#F59E0B] text-white text-caption font-bold flex items-center justify-center">3</span>
                <span className="text-body font-bold text-ink">내장지방</span>
                <span className="text-ink-placeholder text-caption">선택</span>
              </div>
              <InField label="내장지방 레벨" value={inbody.visceralFat} onChange={v => setInbody(p => ({ ...p, visceralFat: v }))} unit="lv" placeholder="8" />
              {inbody.visceralFat && (
                <div className="mt-2">
                  <BarGauge value={Number(inbody.visceralFat)} min={0} low={10} high={15} max={20} labels={['정상 (1-9)', '주의 (10-14)', '위험 (15+)']} />
                </div>
              )}
            </div>

            {/* 분석 결과 카드 - 키/체중 입력 시 표시 */}
            {inbody.bmi && (
              <div className="bg-ink rounded-card-lg p-5 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📊</span>
                  <span className="text-body font-bold">나의 체성분 분석</span>
                </div>

                {/* BMI */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-caption text-white/60">BMI (체질량지수)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-heading font-extrabold tabular-nums">{inbody.bmi}</span>
                      <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold" style={{ background: bmiColor, color: 'white' }}>{bmiLabel}</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden mb-1">
                    <div className="absolute inset-y-0 bg-[#06B6D4]" style={{ width: '20%' }} />
                    <div className="absolute inset-y-0 bg-accent-green" style={{ left: '20%', width: '30%' }} />
                    <div className="absolute inset-y-0 bg-[#F59E0B]" style={{ left: '50%', width: '20%' }} />
                    <div className="absolute inset-y-0 bg-semantic-like" style={{ left: '70%', width: '30%' }} />
                    <div className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm" style={{ left: `${bmiPos}%`, borderColor: bmiColor, transform: 'translate(-50%, -50%)' }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>18.5</span>
                    <span>23</span>
                    <span>25</span>
                    <span>30+</span>
                  </div>
                </div>

                {/* 골격근량 게이지 */}
                {inbody.muscleMass && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-caption text-white/60">골격근량</span>
                      <span className="text-body font-bold tabular-nums">{inbody.muscleMass} <span className="text-caption text-white/50">kg</span></span>
                    </div>
                    <BarGauge value={Number(inbody.muscleMass)} min={15} low={24} high={35} max={45} labels={['부족', '표준', '우수']} />
                  </div>
                )}

                {/* 체지방률 게이지 */}
                {inbody.bodyFat && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-caption text-white/60">체지방률</span>
                      <span className="text-body font-bold tabular-nums">{inbody.bodyFat} <span className="text-caption text-white/50">%</span></span>
                    </div>
                    <BarGauge value={Number(inbody.bodyFat)} min={5} low={10} high={25} max={40} labels={['부족', '표준', '과다']} />
                  </div>
                )}

                {/* 요약 스탯 */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-caption text-white/50 mb-0.5">체수분</div>
                    <div className="text-label font-bold tabular-nums">{inbody.bodyWater || '-'} <span className="text-caption text-white/40">L</span></div>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-caption text-white/50 mb-0.5">기초대사량</div>
                    <div className="text-label font-bold tabular-nums">{inbody.basalMetab || '-'} <span className="text-caption text-white/40">kcal</span></div>
                  </div>
                  <div className="text-center">
                    <div className="text-caption text-white/50 mb-0.5">내장지방</div>
                    <div className="text-label font-bold tabular-nums">{inbody.visceralFat || '-'} <span className="text-caption text-white/40">lv</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* 안내 */}
            {!inbody.bmi && (
              <div className="flex items-start gap-2 p-3 bg-surface-muted rounded-card">
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span className="text-caption text-ink-tertiary">인바디 결과지를 참고하여 입력해 주세요. 키와 체중만 입력해도 BMI 기반 추천이 가능합니다.</span>
              </div>
            )}
          </div>
          )
        })()}

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-8">
          {checkStep > 0 && (
            <button
              onClick={() => setCheckStep(s => s - 1)}
              className="px-5 py-4 bg-surface-muted text-ink font-semibold rounded-card hover:bg-ink-disabled transition-colors"
            >
              이전
            </button>
          )}
          <button
            disabled={!canNext}
            onClick={() => {
              if (checkStep < 3) setCheckStep(s => s + 1)
              else submitBodyCheck()
            }}
            className="flex-1 py-4 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
          >
            {checkStep < 3 ? '다음' : '저장'}
          </button>
        </div>
      </PageLayout>
    )
  }

  // 저장 확인 화면
  if (bodyCheck && mode === 'confirm') {
    return (
      <PageLayout header={<SubPageHeader title="맞춤운동" showChat />}>
        <div className="flex flex-col items-center justify-center py-10">
          {/* 체크 아이콘 */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <IconCheck className="w-8 h-8 stroke-white stroke-[2.5]" />
            </div>
          </div>

          <h2 className="text-heading font-bold text-ink text-center mb-2">
            나의 몸상태를 확인했어요
          </h2>
          <p className="text-body text-ink-secondary text-center leading-relaxed mb-8">
            입력하신 정보를 바탕으로<br />
            <span className="font-semibold text-primary">맞춤 운동 설정</span>이 가능합니다
          </p>

          {/* 요약 */}
          <div className="w-full bg-surface-muted rounded-card-lg p-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <div className="text-caption text-ink-placeholder">운동 목표</div>
                  <div className="text-label font-bold text-ink">{GOALS.find(g => g.key === bodyCheck.goal)?.label}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏋️</span>
                <div>
                  <div className="text-caption text-ink-placeholder">운동 수준</div>
                  <div className="text-label font-bold text-ink">{LEVELS.find(l => l.key === bodyCheck.level)?.label}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{bodyCheck.painAreas.includes('없음') ? '✅' : '⚠️'}</span>
                <div>
                  <div className="text-caption text-ink-placeholder">통증 부위</div>
                  <div className="text-label font-bold text-ink">{bodyCheck.painAreas.includes('없음') ? '없음' : bodyCheck.painAreas.join(', ')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <div className="text-caption text-ink-placeholder">BMI</div>
                  <div className="text-label font-bold text-ink">{bodyCheck.inbody?.bmi || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <button
            onClick={() => setMode('custom')}
            className="w-full py-4 bg-primary text-white font-bold text-body rounded-card hover:bg-primary-dark transition-colors mb-3"
          >
            맞춤 운동 설정하기
          </button>
          <button
            onClick={resetCheck}
            className="w-full py-3 text-label font-semibold text-ink-tertiary hover:text-ink transition-colors"
          >
            다시 체크하기
          </button>
        </div>
      </PageLayout>
    )
  }

  // 몸상태 체크 완료 후
  return (
    <PageLayout header={<SubPageHeader title="맞춤운동" showChat />}>
      {/* AI 맞춤운동 */}
      <div>
          {/* 기간 선택 모드 */}
          {aiMode === 'select-period' && (
            <div>
              <h2 className="text-heading font-bold text-ink mb-1">운동 기간을 선택하세요</h2>
              <p className="text-body text-ink-secondary mb-5">선택한 기간에 맞춰 AI가 운동 프로그램을 설계합니다</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: '1일', label: '1일', desc: '오늘 하루 운동', icon: '⚡' },
                  { key: '1주', label: '1주', desc: '일주일 루틴', icon: '📅' },
                  { key: '2주', label: '2주', desc: '2주 집중 프로그램', icon: '🔥' },
                  { key: '1개월', label: '1개월', desc: '한 달 체계적 관리', icon: '💪' },
                  { key: '3개월', label: '3개월', desc: '분기별 체형 변화', icon: '🏆' },
                  { key: '6개월', label: '6개월', desc: '반년 장기 프로젝트', icon: '🎯' },
                  { key: '1년', label: '1년', desc: '연간 바디 프로젝트', icon: '👑' },
                ] as const).map(p => {
                  const on = aiPeriod === p.key
                  return (
                    <button
                      key={p.key}
                      onClick={() => setAiPeriod(p.key)}
                      className={`flex items-center gap-3 p-4 rounded-card-lg border-2 transition-all text-left ${
                        on ? 'border-primary bg-primary/5 shadow-card' : 'border-border bg-surface hover:border-ink-disabled'
                      }`}
                    >
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <div className={`text-body font-bold ${on ? 'text-primary' : 'text-ink'}`}>{p.label}</div>
                        <div className="text-caption text-ink-tertiary">{p.desc}</div>
                      </div>
                      {on && (
                        <div className="ml-auto">
                          <IconCheck className="w-5 h-5 stroke-primary stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => { setAiMode(null); setAiPeriod(null) }}
                  className="px-5 py-4 bg-surface-muted text-ink font-semibold rounded-card hover:bg-ink-disabled transition-colors"
                >
                  취소
                </button>
                <button
                  disabled={!aiPeriod}
                  onClick={() => {
                    setAiMode('generating')
                    setTimeout(() => generateAiProgram(), 2000)
                  }}
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
                >
                  AI 운동 프로그램 생성
                </button>
              </div>
            </div>
          )}

          {/* 생성 중 */}
          {aiMode === 'generating' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><IconBot className="w-8 h-8 text-primary stroke-primary stroke-[1.5]" /></div>
              </div>
              <div className="text-body font-bold text-ink mb-1">AI가 운동 프로그램을 만들고 있어요</div>
              <div className="text-caption text-ink-tertiary">{aiPeriod} 맞춤 프로그램 설계 중...</div>
            </div>
          )}

          {/* 프로그램 리스트 (기본 화면) */}
          {!aiMode && (
            <div>
              {/* 내 몸상태 요약 + 만들기 버튼 */}
              <div className="relative rounded-card-lg overflow-hidden mb-5">
                <img
                  src={GOALS.find(g => g.key === bodyCheck.goal)?.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop'}
                  alt="" className="w-full h-[210px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-body font-bold text-white">오늘의 몸상태</h2>
                    <button onClick={resetCheck} className="px-3 py-1.5 rounded-pill bg-white text-caption text-ink font-bold shadow-sm hover:bg-white/90 transition-colors">다시 체크</button>
                  </div>
                  <div>
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-card py-2">
                        <div className="text-lg mb-0.5">🎯</div>
                        <div className="text-caption text-white/60">목표</div>
                        <div className="text-label font-bold text-white">{GOALS.find(g => g.key === bodyCheck.goal)?.label}</div>
                      </div>
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-card py-2">
                        <div className="text-lg mb-0.5">🏋️</div>
                        <div className="text-caption text-white/60">수준</div>
                        <div className="text-label font-bold text-white">{LEVELS.find(l => l.key === bodyCheck.level)?.label}</div>
                      </div>
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-card py-2">
                        <div className="text-lg mb-0.5">{bodyCheck.painAreas.includes('없음') ? '✅' : '⚠️'}</div>
                        <div className="text-caption text-white/60">통증</div>
                        <div className="text-label font-bold text-white truncate">{bodyCheck.painAreas.includes('없음') ? '없음' : bodyCheck.painAreas.length > 2 ? `${bodyCheck.painAreas[0]} 외 ${bodyCheck.painAreas.length - 1}곳` : bodyCheck.painAreas.join('·')}</div>
                      </div>
                      <div className="text-center bg-white/10 backdrop-blur-sm rounded-card py-2">
                        <div className="text-lg mb-0.5">📊</div>
                        <div className="text-caption text-white/60">BMI</div>
                        <div className="text-label font-bold text-white">{bodyCheck.inbody?.bmi || '-'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAiMode('select-period')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold text-label rounded-card shadow-sm hover:bg-primary-dark transition-colors"
                    >
                      <IconBot className="w-5 h-5 text-white stroke-white stroke-[1.5]" />
                      AI 맞춤운동 만들기
                    </button>
                  </div>
                </div>
              </div>

              {/* 만든 프로그램 리스트 */}
              {aiPrograms.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-body font-bold text-ink">내 운동 프로그램</h3>
                    <span className="text-caption text-ink-tertiary">{aiPrograms.length}개</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {aiPrograms.map(prog => {
                      const goalLabel = GOALS.find(g => g.key === prog.goal)?.label || ''
                      const totalExercises = prog.schedule.reduce((sum, s) => sum + s.exercises.length, 0)
                      const todayDayName = ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
                      const todaySch = prog.schedule.find(s => s.day === todayDayName && s.exercises.length > 0)
                      const todayLabel = todaySch ? `${todaySch.day}요일 · ${todaySch.focus}` : null
                      return (
                        <div key={prog.id} className="bg-surface border border-border rounded-card-lg overflow-hidden hover:border-primary/30 hover:shadow-card transition-all">
                          <div className="flex items-center gap-3 p-4">
                            <button onClick={() => nav(`/workout/${prog.id}`)} className="w-12 h-12 rounded-card bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <IconBot className="w-7 h-7 text-primary stroke-primary stroke-[1.5]" />
                            </button>
                            <button onClick={() => nav(`/workout/${prog.id}`)} className="flex-1 min-w-0 text-left">
                              <div className="text-body font-bold text-ink truncate">{prog.title || `${prog.period} ${goalLabel} 프로그램`}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-caption text-ink-tertiary">{prog.createdAt}</span>
                                <span className="text-caption text-ink-placeholder">·</span>
                                <span className="text-caption text-ink-tertiary">{totalExercises}종목</span>
                              </div>
                            </button>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => nav(`/workout/${prog.id}`)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-placeholder hover:text-primary hover:bg-primary/10 transition-colors"
                                title="수정"
                              >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (!confirm(`"${prog.title || `${prog.period} ${goalLabel} 프로그램`}"을 삭제하시겠습니까?`)) return
                                  const updated = aiPrograms.filter(p => p.id !== prog.id)
                                  setAiPrograms(updated)
                                  localStorage.setItem(AI_PROGRAMS_KEY, JSON.stringify(updated))
                                  setToast('프로그램이 삭제되었습니다')
                                  setTimeout(() => setToast(null), 1500)
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-placeholder hover:text-semantic-like hover:bg-semantic-like/10 transition-colors"
                                title="삭제"
                              >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-2 fill-none">
                                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <button
                              onClick={() => setWearableModal({ progId: prog.id })}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-primary/30 text-primary font-semibold text-label rounded-card hover:bg-primary/5 transition-colors active:scale-[0.98] shadow-[0_2px_8px_rgba(255,107,53,0.2)]"
                            >
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-primary"><path d="M8 5v14l11-7z" /></svg>
                              {todayLabel ? `${todayLabel} 시작하기` : '오늘의 운동 시작하기'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-[40px] mb-3">💪</div>
                  <div className="text-body font-bold text-ink mb-1">아직 만든 프로그램이 없어요</div>
                  <div className="text-caption text-ink-tertiary">위 버튼을 눌러 AI 맞춤운동을 만들어 보세요</div>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 bg-ink text-white text-label font-semibold rounded-pill shadow-elevated z-50 animate-slide-up">
          {toast}
        </div>
      )}

      {/* 웨어러블 연결 모달 */}
      {wearableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8" onClick={() => { if (!wearableConnecting) setWearableModal(null) }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-sm bg-surface rounded-card-lg p-6 shadow-elevated" onClick={e => e.stopPropagation()}>
            {wearableConnected ? (
              <div className="flex flex-col items-center py-4">
                <div className="w-14 h-14 rounded-full bg-accent-green/10 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-accent-green stroke-[2.5] fill-none"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div className="text-label font-bold text-ink mb-1">{wearableConnected} 연결 완료</div>
                <div className="text-caption text-ink-tertiary mb-3">운동 데이터가 자동으로 기록됩니다</div>
                <div className="w-full px-4 py-3 bg-accent-purple/5 border border-accent-purple/20 rounded-card mb-5">
                  <div className="flex items-center gap-2 text-caption text-accent-purple font-semibold">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-accent-purple stroke-2 fill-none flex-shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    {wearableConnected}에서 바디채널 앱을 실행해 주세요
                  </div>
                </div>
                <button
                  onClick={() => { setWearableConnected(null); setWearableModal(null); nav(`/workout/${wearableModal!.progId}/play`) }}
                  className="w-full py-3 bg-primary text-white font-semibold text-label rounded-card hover:bg-primary-dark transition-colors"
                >
                  운동 시작하기
                </button>
              </div>
            ) : wearableFailed ? (
              <div className="flex flex-col items-center py-4">
                <div className="w-14 h-14 rounded-full bg-semantic-like/10 flex items-center justify-center mb-3">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-semantic-like stroke-[2] fill-none">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <div className="text-label font-bold text-ink mb-1">연결에 실패했습니다</div>
                <div className="text-caption text-ink-tertiary mb-5">디바이스가 근처에 있는지 확인해 주세요</div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => { setWearableFailed(false) }}
                    className="flex-1 py-3 bg-primary text-white font-semibold text-label rounded-card hover:bg-primary-dark transition-colors"
                  >
                    다시 연결하기
                  </button>
                  <button
                    onClick={() => { setWearableFailed(false); setWearableModal(null); nav(`/workout/${wearableModal!.progId}/play`) }}
                    className="flex-1 py-3 bg-surface-muted text-ink font-semibold text-label rounded-card hover:bg-ink-disabled transition-colors"
                  >
                    건너뛰기
                  </button>
                </div>
              </div>
            ) : wearableConnecting ? (
              <div className="flex flex-col items-center py-4">
                <div className="relative w-14 h-14 mb-3">
                  <div className="absolute inset-0 rounded-full border-[3px] border-accent-purple/20" />
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent-purple animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-accent-purple stroke-[1.5] fill-none">
                      <rect x="6" y="2" width="12" height="20" rx="4" />
                      <path d="M12 18h.01" />
                      <path d="M9 6h6" />
                    </svg>
                  </div>
                </div>
                <div className="text-label font-bold text-ink mb-1">연결 중입니다...</div>
                <div className="text-caption text-ink-tertiary">디바이스를 검색하고 있습니다</div>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center mx-auto mb-3">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-accent-purple stroke-[1.5] fill-none">
                      <rect x="6" y="2" width="12" height="20" rx="4" />
                      <path d="M12 18h.01" />
                      <path d="M9 6h6" />
                    </svg>
                  </div>
                  <div className="text-body font-bold text-ink mb-1">웨어러블을 연결할까요?</div>
                  <p className="text-caption text-ink-tertiary">심박·칼로리 등 운동 데이터를 자동 기록합니다</p>
                </div>
                <div className="flex flex-col gap-2 mb-3">
                  {(['Apple Watch', 'Galaxy Watch', 'Garmin'] as const).map(device => (
                    <button
                      key={device}
                      onClick={() => {
                        setWearableConnecting(true)
                        wearableAttemptRef.current += 1
                        const attempt = wearableAttemptRef.current
                        setTimeout(() => {
                          setWearableConnecting(false)
                          if (attempt === 1) {
                            setWearableFailed(true)
                          } else {
                            setWearableConnected(device)
                            localStorage.setItem('connected-wearable', device)
                          }
                        }, 2000)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-card-lg text-left hover:border-accent-purple hover:bg-accent-purple/5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-[1.5] fill-none">
                          <rect x="6" y="2" width="12" height="20" rx="4" />
                          <path d="M12 18h.01" />
                          <path d="M9 6h6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-label font-semibold text-ink">{device}</div>
                        <div className="text-caption text-ink-placeholder">터치하여 연결</div>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-placeholder stroke-2 fill-none"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setWearableModal(null); nav(`/workout/${wearableModal.progId}/play`) }}
                  className="w-full py-3 text-label font-semibold text-ink-tertiary hover:text-ink transition-colors text-center"
                >
                  연결 없이 시작하기
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </PageLayout>
  )
}
