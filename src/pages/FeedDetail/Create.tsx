import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'
import { IconMapPin, IconX } from '../../components/Icons'

type WorkoutSet = { weight: string; reps: string }
type WorkoutExercise = { name: string; sets: WorkoutSet[] }
const WORKOUT_STEPS = [
  { num: 1, label: '사진 · 내용' },
] as const

const RUNNING_STEPS = [
  { num: 1, label: '사진 · 내용' },
  { num: 2, label: '러닝기록' },
] as const

const SectionTitle = ({ label, required, trailing }: { label: string; required?: boolean; trailing?: string }) => (
  <div className="flex items-end justify-between mb-3">
    <h2 className="text-title font-bold text-ink">
      {label}
      {required && <span className="text-primary ml-1">*</span>}
    </h2>
    {trailing && <span className="text-caption text-ink-tertiary tabular-nums">{trailing}</span>}
  </div>
)

export const FeedCreatePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEdit = !!id
  const feedType = searchParams.get('type') || 'general'
  const isWorkout = feedType === 'workout'
  const isRunning = feedType === 'running'
  const hasStep2 = isRunning
  const STEPS = isRunning ? RUNNING_STEPS : WORKOUT_STEPS

  const [step, setStep] = useState<1 | 2>(1)

  // Step 1
  const [selected, setSelected] = useState<string[]>(
    isEdit ? ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop'] : []
  )
  const [text, setText] = useState(
    isEdit ? '오늘도 열심히 운동 완료! 💪 꾸준히 하니까 확실히 달라지는 게 느껴져요. 여러분도 함께해요!' : ''
  )
  // 내 지점 (mock - 실제로는 사용자 프로필에서 가져옴)
  const myBranch = '바디채널 강남점'
  const [location, setLocation] = useState(myBranch)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Step 2: workout
  const [wearable, setWearable] = useState<{
    device: string
    activeKcal: number
    avgHr: number
    maxHr: number
    zoneMinutes: { warmup: number; fatBurn: number; cardio: number; peak: number }
  } | null>(null)
  const [connecting, setConnecting] = useState(false)
  const connectWearable = (device: string) => {
    setConnecting(true)
    setTimeout(() => {
      setWearable({
        device,
        activeKcal: 280 + Math.floor(Math.random() * 250),
        avgHr: 115 + Math.floor(Math.random() * 30),
        maxHr: 150 + Math.floor(Math.random() * 30),
        zoneMinutes: {
          warmup: 5 + Math.floor(Math.random() * 10),
          fatBurn: 15 + Math.floor(Math.random() * 20),
          cardio: 10 + Math.floor(Math.random() * 25),
          peak: Math.floor(Math.random() * 10),
        },
      })
      setConnecting(false)
    }, 800)
  }
  const [workoutDuration, setWorkoutDuration] = useState('')
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    { name: '', sets: [{ weight: '', reps: '' }] },
  ])


  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => URL.createObjectURL(f))
    if (urls.length) setSelected((prev) => [...prev, ...urls])
  }
  const removeImage = (url: string) => {
    setSelected((prev) => prev.filter((u) => u !== url))
    if (url.startsWith('blob:')) URL.revokeObjectURL(url)
  }
  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '')
    if (!t || tags.includes(t)) return
    setTags([...tags, t])
    setTagInput('')
  }

  const addExercise = () =>
    setExercises((p) => [...p, { name: '', sets: [{ weight: '', reps: '' }] }])
  const removeExercise = (i: number) =>
    setExercises((p) => p.filter((_, idx) => idx !== i))
  const updateExerciseName = (i: number, name: string) =>
    setExercises((p) => p.map((ex, idx) => (idx === i ? { ...ex, name } : ex)))
  const addSet = (i: number) =>
    setExercises((p) =>
      p.map((ex, idx) =>
        idx === i ? { ...ex, sets: [...ex.sets, { weight: '', reps: '' }] } : ex
      )
    )
  const removeSet = (i: number, si: number) =>
    setExercises((p) =>
      p.map((ex, idx) =>
        idx === i ? { ...ex, sets: ex.sets.filter((_, j) => j !== si) } : ex
      )
    )
  const updateSet = (i: number, si: number, key: 'weight' | 'reps', val: string) => {
    // 최대값 제한: 무게 999kg, 횟수 999회
    const max = 999
    const cleaned = val.replace(/[^0-9.]/g, '').slice(0, 5)
    const num = Number(cleaned)
    const safe = !cleaned ? '' : Number.isFinite(num) && num <= max ? cleaned : String(max)
    setExercises((p) =>
      p.map((ex, idx) =>
        idx === i
          ? { ...ex, sets: ex.sets.map((s, j) => (j === si ? { ...s, [key]: safe } : s)) }
          : ex
      )
    )
  }

  const validExerciseCount = exercises.filter((e) => e.name.trim()).length

  const canStep1 = selected.length > 0 && text.trim().length > 0
  // 운동기록은 선택사항. 입력 시작했다면 부위·시간·종목이름 모두 채워야 함
  const anySetFilled = exercises.some((e) =>
    e.sets.some((s) => s.weight.trim() || s.reps.trim())
  )
  const workoutPartial =
    workoutDuration.trim().length > 0 ||
    validExerciseCount > 0 ||
    anySetFilled
  const missing: string[] = []
  if (isWorkout && workoutPartial) {
    if (!workoutDuration.trim()) missing.push('운동 시간')
    if (validExerciseCount === 0) missing.push('운동 이름')
  }
  const canStep2 = !workoutPartial || missing.length === 0 || isRunning

  const handleNext = () => {
    if (step === 1 && canStep1) {
      if (hasStep2) setStep(2)
      else {
        alert(isEdit ? '피드가 수정되었어요!' : '피드가 등록되었어요!')
        navigate('/activity')
      }
    } else if (step === 2 && canStep2) {
      alert(isEdit ? '피드가 수정되었어요!' : '피드가 등록되었어요!')
      navigate('/activity')
    }
  }
  const handlePrev = () => {
    if (step === 1) navigate(-1)
    else setStep(1)
  }

  const header = <SubPageHeader title={isEdit ? '게시물 수정' : '새 게시물'} />

  return (
    <PageLayout header={header} hideBottomNav className="!px-0 !pb-0 !bg-surface-muted flex flex-col min-h-[calc(100vh-56px)]">
      {/* Step Indicator */}
      {hasStep2 && <div className="px-page py-4 border-b border-border-light">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isActive = step === s.num
            const isDone = step > s.num
            return (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-caption font-bold transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : isDone
                        ? 'bg-primary text-white'
                        : 'bg-surface-muted text-ink-tertiary'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </div>
                  <div
                    className={`text-caption mt-1 ${
                      isActive ? 'text-primary font-bold' : 'text-ink-tertiary'
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-shrink-0 w-6 -mt-4 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>}

      {/* ─── STEP 1: 사진 + 캡션 + 메타 ─── */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          {/* 지점 */}
          <section className="bg-surface px-page py-4">
            <SectionTitle label="지점" />
            <label className="flex items-center gap-3 py-2 px-3 bg-surface-muted rounded-card">
              <IconMapPin className="w-5 h-5 stroke-ink-secondary stroke-2" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`flex-1 bg-transparent text-body focus:outline-none ${location ? 'text-ink' : 'text-ink-placeholder'}`}
              >
                <option value="">지점 선택</option>
                <option value="바디채널 강남점">바디채널 강남점</option>
                <option value="바디채널 역삼점">바디채널 역삼점</option>
                <option value="바디채널 서초점">바디채널 서초점</option>
                <option value="바디채널 판교점">바디채널 판교점</option>
                <option value="바디채널 선릉점">바디채널 선릉점</option>
              </select>
            </label>
          </section>

          <div className="h-2 bg-surface-muted" />

          {/* 사진 */}
          <section className="bg-surface px-page py-4">
            <SectionTitle label="사진" required trailing={`${selected.length}/10`} />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-page px-page pb-1">
              {selected.length === 0 && (
                <label className="relative w-28 h-28 shrink-0 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-card cursor-pointer hover:border-primary hover:bg-primary-50 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-ink-tertiary stroke-2 fill-none">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <span className="text-caption font-semibold text-ink-tertiary">사진 추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              )}
              {selected.length > 0 && (<>
                {selected.map((url, i) => (
                  <div key={url} className="relative w-28 h-28 shrink-0 rounded-card overflow-hidden bg-surface-muted">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      aria-label="삭제"
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/65 flex items-center justify-center"
                    >
                      <IconX className="w-2.5 h-2.5 stroke-white stroke-2 fill-none" />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 rounded-full bg-black/65 text-white text-caption font-bold tabular-nums">
                      {i + 1}
                    </span>
                  </div>
                ))}
                {selected.length < 10 && (
                  <label className="relative w-28 h-28 shrink-0 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-card cursor-pointer hover:border-primary hover:bg-primary-50 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink-tertiary stroke-2 fill-none">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="text-caption font-semibold text-ink-tertiary">추가</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                )}
              </>)}
            </div>
          </section>

          <div className="h-2 bg-surface-muted" />

          {/* 내용 */}
          <section className="bg-surface px-page py-4">
            <SectionTitle label="내용" required />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="오늘 운동은 어땠나요?"
              maxLength={2200}
              className="w-full text-body text-ink placeholder:text-ink-placeholder resize-none focus:outline-none bg-transparent"
            />
            <div className="text-caption text-ink-tertiary text-right tabular-nums">{text.length}/2,200</div>
          </section>

          <div className="h-2 bg-surface-muted" />

          {/* 태그 */}
          <section className="bg-surface px-page py-4 pb-28 flex-1">
            <SectionTitle label="태그" />
            <div className="flex items-center gap-2 py-2 px-3 bg-surface-muted rounded-card">
              <span className="text-body font-bold text-ink-secondary">#</span>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="태그 추가 (Enter)"
                className="flex-1 text-body text-ink placeholder:text-ink-placeholder bg-transparent focus:outline-none"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary text-label font-semibold rounded-pill">
                    #{t}
                    <button onClick={() => setTags(tags.filter((x) => x !== t))}>
                      <IconX className="w-3 h-3 stroke-primary stroke-2 fill-none" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3">
              <div className="text-caption text-ink-tertiary mb-1.5">추천 태그</div>
              <div className="flex flex-wrap gap-1.5">
                {['오운완', '헬스', 'PT', '바디프로필', '다이어트', '벌크업', '홈트', '바레톤', '크로스핏', '러닝'].map((t) => {
                  const on = tags.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTags((p) => (on ? p.filter((x) => x !== t) : [...p, t]))}
                      className={`px-2.5 py-1 rounded-pill text-label font-semibold transition-colors ${
                        on
                          ? 'bg-primary text-white'
                          : 'bg-surface-muted text-ink-secondary hover:bg-primary-50 hover:text-primary'
                      }`}
                    >
                      #{t}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ─── STEP 2: 운동기록 / 러닝기록 ─── */}
      {step === 2 && isRunning && (
        <div className="flex flex-col flex-1">
          {isWorkout && <section className="bg-surface px-page py-4">
            <SectionTitle label="종목" />
            <div className="flex flex-col gap-3">
              {exercises.map((ex, i) => (
                <div key={i} className="border border-border rounded-card-lg overflow-hidden">
                  {/* 종목 헤더 */}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-subtle border-b border-border-light">
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-caption font-bold flex items-center justify-center shrink-0 tabular-nums">{i + 1}</span>
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => updateExerciseName(i, e.target.value)}
                      placeholder="운동 이름 (벤치프레스)"
                      className="flex-1 min-w-0 text-body font-semibold text-ink placeholder:text-ink-placeholder bg-transparent focus:outline-none"
                    />
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(i)}
                        aria-label="종목 삭제"
                        className="w-7 h-7 rounded-full hover:bg-surface-muted flex items-center justify-center shrink-0"
                      >
                        <IconX className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none" />
                      </button>
                    )}
                  </div>
                  {/* 세트 헤더 */}
                  <div className="grid grid-cols-[24px_1fr_1fr_24px] gap-2 px-3 pt-2.5 pb-1 text-caption text-ink-tertiary">
                    <span className="text-center">#</span>
                    <span className="text-center">무게(kg)</span>
                    <span className="text-center">횟수</span>
                    <span></span>
                  </div>
                  {/* 세트 입력 */}
                  <div className="px-3 pb-3 flex flex-col gap-1.5">
                    {ex.sets.map((s, si) => (
                      <div key={si} className="grid grid-cols-[24px_1fr_1fr_24px] gap-2 items-center">
                        <span className="text-caption font-bold text-ink-tertiary text-center tabular-nums">{si + 1}</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={s.weight}
                          onChange={(e) => updateSet(i, si, 'weight', e.target.value)}
                          placeholder="0"
                          className="min-w-0 w-full px-2 py-2 bg-surface-muted rounded text-body text-ink placeholder:text-ink-placeholder focus:outline-none focus:bg-primary-50 tabular-nums text-center"
                        />
                        <input
                          type="number"
                          inputMode="numeric"
                          value={s.reps}
                          onChange={(e) => updateSet(i, si, 'reps', e.target.value)}
                          placeholder="0"
                          className="min-w-0 w-full px-2 py-2 bg-surface-muted rounded text-body text-ink placeholder:text-ink-placeholder focus:outline-none focus:bg-primary-50 tabular-nums text-center"
                        />
                        <button
                          type="button"
                          onClick={() => removeSet(i, si)}
                          disabled={ex.sets.length === 1}
                          aria-label="세트 삭제"
                          className="w-6 h-6 flex items-center justify-center disabled:opacity-20 justify-self-center"
                        >
                          <IconX className="w-3 h-3 stroke-ink-tertiary stroke-2 fill-none" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSet(i)}
                      className="text-caption text-primary font-semibold mt-1.5 self-start"
                    >
                      + 세트 추가
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExercise}
                className="py-3 border border-dashed border-border rounded-card-lg text-label font-semibold text-ink-secondary hover:bg-surface-subtle hover:border-primary hover:text-primary transition-colors"
              >
                + 종목 추가
              </button>
            </div>
          </section>}

          {isWorkout && <div className="h-2 bg-surface-muted" />}

          {/* 운동 시간 */}
          <section className="bg-surface px-page py-4">
            <SectionTitle label="운동 시간" />
            <div className="flex gap-2 flex-wrap">
              {['30분', '1시간', '1시간 30분', '2시간', '2시간 이상'].map((d) => {
                const on = workoutDuration === d
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setWorkoutDuration(on ? '' : d)}
                    className={`px-3 py-2 rounded-pill text-label font-semibold transition-colors ${
                      on ? 'bg-primary text-white' : 'bg-surface-muted text-ink-secondary hover:bg-primary-50'
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            <input
              type="text"
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(e.target.value)}
              placeholder="직접 입력 (예: 45분)"
              className="w-full mt-3 px-3 py-2.5 bg-surface-muted rounded-card text-body text-ink placeholder:text-ink-placeholder focus:outline-none"
            />
          </section>

          <div className="h-2 bg-surface-muted" />

          {/* 웨어러블 */}
          <section className="bg-surface px-page py-4 pb-28 flex-1">
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-title font-bold text-ink">웨어러블</h2>
              {wearable && (
                <button
                  type="button"
                  onClick={() => setWearable(null)}
                  className="text-caption text-ink-tertiary"
                >
                  연결 해제
                </button>
              )}
            </div>
            {wearable ? (
              <div className="bg-gradient-to-br from-accent-purple/15 to-accent-purple/5 border border-accent-purple/20 rounded-card-lg p-card-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                  <span className="text-label font-bold text-accent-purple">{wearable.device}</span>
                  <span className="text-caption text-ink-tertiary">동기화 완료</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-caption text-ink-tertiary mb-0.5">활동 칼로리</div>
                    <div className="text-body font-extrabold text-ink tabular-nums">
                      {wearable.activeKcal}<span className="text-caption font-semibold text-ink-tertiary ml-0.5">kcal</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-caption text-ink-tertiary mb-0.5">평균 심박</div>
                    <div className="text-body font-extrabold text-ink tabular-nums">
                      {wearable.avgHr}<span className="text-caption font-semibold text-ink-tertiary ml-0.5">bpm</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-caption text-ink-tertiary mb-0.5">최대 심박</div>
                    <div className="text-body font-extrabold text-semantic-like tabular-nums">
                      {wearable.maxHr}<span className="text-caption font-semibold text-ink-tertiary ml-0.5">bpm</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : connecting ? (
              <div className="p-6 rounded-card-lg border border-accent-purple/30 bg-accent-purple/5 flex flex-col items-center">
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
                <div className="text-caption text-ink-tertiary">디바이스에서 데이터를 불러오고 있습니다</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {['Apple Watch', 'Galaxy Watch', 'Garmin'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => connectWearable(d)}
                      className="py-3 border border-border rounded-card text-label font-semibold text-ink hover:border-accent-purple hover:text-accent-purple transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="text-caption text-ink-tertiary mt-2">
                  디바이스 선택 시 심박·칼로리·심박존이 자동 동기화됩니다.
                </div>
              </>
            )}
          </section>
        </div>
      )}



      <BottomCTA hideBottomNav>
        <div className="flex flex-col gap-1 w-full">
          {step === 2 && isWorkout && missing.length > 0 && (
            <div className="text-caption text-semantic-like text-center">
              입력이 필요합니다: {missing.join(', ')}
            </div>
          )}
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-4 bg-surface-muted text-ink font-semibold rounded-card hover:bg-ink-disabled transition-colors"
            >
              {step === 1 ? '취소' : '이전'}
            </button>
            <button
              type="button"
              disabled={step === 1 ? !canStep1 : !canStep2}
              onClick={handleNext}
              className="flex-1 py-4 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
            >
              {(step === 2 || !hasStep2) ? (isEdit ? '수정하기' : '등록하기') : '다음'}
            </button>
          </div>
        </div>
      </BottomCTA>
    </PageLayout>
  )
}
