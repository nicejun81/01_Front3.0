import { useState, useMemo, useCallback, memo, useEffect } from 'react'
import { PageLayout, SubPageHeader } from '../../components'

interface WorkoutSet { weight: string; reps: string }
interface Exercise { name: string; category: string; sets: WorkoutSet[] }
interface RunningSplit { km: number; pace: string }
interface HRZones { warmup: number; fatBurn: number; cardio: number; peak: number }
interface RunningWearable { device: string; avgHr: number; maxHr: number; zoneMinutes: HRZones }
interface RunningData {
  distance: number      // km
  pace: string          // e.g. "5'09\""
  cadence: number       // spm
  elevation: { gain: number; loss: number }
  splits: RunningSplit[]
  location: string
  route?: number[][]    // [lat, lng] points
  wearable?: RunningWearable
}
interface WorkoutRecord {
  date: string
  type?: 'workout' | 'running'
  programTitle?: string
  elapsed: number
  totalVolume: number
  totalSets: number
  estCalories: number
  focus: string
  exercises: Exercise[]
  running?: RunningData
  wearable?: RunningWearable
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
    wearable: { device: 'Apple Watch', avgHr: 132, maxHr: 168, zoneMinutes: { warmup: 12, fatBurn: 28, cardio: 32, peak: 8 } },
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
    wearable: { device: 'Apple Watch', avgHr: 140, maxHr: 178, zoneMinutes: { warmup: 10, fatBurn: 30, cardio: 50, peak: 15 } },
  },
  {
    date: createMockDate(3), programTitle: '어깨 · 코어 프로그램', elapsed: 3000, totalVolume: 3240, totalSets: 14, estCalories: 320, focus: '어깨 · 코어',
    exercises: [
      { name: '오버헤드 프레스', category: '어깨', sets: [{ weight: '30', reps: '12' }, { weight: '35', reps: '10' }, { weight: '35', reps: '10' }] },
      { name: '사이드 레터럴 레이즈', category: '어깨', sets: [{ weight: '8', reps: '15' }, { weight: '10', reps: '12' }, { weight: '10', reps: '12' }] },
      { name: '행잉 레그레이즈', category: '코어', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }, { weight: '0', reps: '10' }] },
      { name: '러시안 트위스트', category: '코어', sets: [{ weight: '5', reps: '30' }, { weight: '5', reps: '30' }] },
    ],
    wearable: { device: 'Apple Watch', avgHr: 124, maxHr: 154, zoneMinutes: { warmup: 15, fatBurn: 22, cardio: 10, peak: 3 } },
  },
  {
    date: createMockDate(5), programTitle: '전신 서킷', elapsed: 3600, totalVolume: 5400, totalSets: 16, estCalories: 480, focus: '전신',
    exercises: [
      { name: '버피', category: '전신', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }, { weight: '0', reps: '10' }] },
      { name: '케틀벨 스윙', category: '전신', sets: [{ weight: '16', reps: '20' }, { weight: '16', reps: '20' }, { weight: '20', reps: '15' }] },
      { name: '박스 점프', category: '전신', sets: [{ weight: '0', reps: '12' }, { weight: '0', reps: '12' }, { weight: '0', reps: '10' }] },
      { name: '마운틴 클라이머', category: '전신', sets: [{ weight: '0', reps: '40' }, { weight: '0', reps: '40' }, { weight: '0', reps: '30' }] },
    ],
    wearable: { device: 'Apple Watch', avgHr: 148, maxHr: 182, zoneMinutes: { warmup: 5, fatBurn: 18, cardio: 28, peak: 9 } },
  },
  {
    date: createMockDate(7), programTitle: '가슴 · 삼두 프로그램', elapsed: 4500, totalVolume: 7800, totalSets: 16, estCalories: 385, focus: '가슴 · 삼두',
    exercises: [
      { name: '벤치프레스', category: '가슴', sets: [{ weight: '60', reps: '12' }, { weight: '70', reps: '10' }, { weight: '70', reps: '10' }, { weight: '70', reps: '8' }] },
      { name: '체스트 플라이 머신', category: '가슴', sets: [{ weight: '45', reps: '15' }, { weight: '45', reps: '15' }, { weight: '50', reps: '12' }] },
      { name: '딥스', category: '삼두', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '12' }] },
      { name: '케이블 푸시다운', category: '삼두', sets: [{ weight: '25', reps: '15' }, { weight: '30', reps: '12' }, { weight: '30', reps: '12' }] },
    ],
    wearable: { device: 'Apple Watch', avgHr: 130, maxHr: 165, zoneMinutes: { warmup: 11, fatBurn: 26, cardio: 30, peak: 8 } },
  },
  {
    date: createMockDate(9), programTitle: '바레톤 그룹수업', elapsed: 3300, totalVolume: 0, totalSets: 12, estCalories: 285, focus: '바레톤',
    exercises: [
      { name: '플리에 스쿼트', category: '하체', sets: [{ weight: '0', reps: '20' }, { weight: '0', reps: '20' }, { weight: '0', reps: '16' }] },
      { name: '레그 리프트', category: '하체', sets: [{ weight: '0', reps: '15' }, { weight: '0', reps: '15' }, { weight: '0', reps: '12' }] },
      { name: '플랭크 홀드', category: '코어', sets: [{ weight: '0', reps: '60' }, { weight: '0', reps: '45' }] },
      { name: '브릿지', category: '하체', sets: [{ weight: '0', reps: '20' }, { weight: '0', reps: '20' }] },
    ],
    wearable: { device: 'Apple Watch', avgHr: 122, maxHr: 152, zoneMinutes: { warmup: 13, fatBurn: 25, cardio: 14, peak: 3 } },
  },
  // ── 러닝 기록 ──
  {
    date: createMockDate(2), type: 'running', elapsed: 3154, totalVolume: 0, totalSets: 0, estCalories: 520, focus: '한강 10km 러닝',
    exercises: [],
    running: {
      distance: 10.2, pace: "5'09\"", cadence: 174, elevation: { gain: 42, loss: 38 }, location: '여의도 한강공원',
      splits: [
        { km: 1, pace: "5'22\"" }, { km: 2, pace: "5'18\"" }, { km: 3, pace: "5'12\"" }, { km: 4, pace: "5'08\"" }, { km: 5, pace: "5'05\"" },
        { km: 6, pace: "5'02\"" }, { km: 7, pace: "5'10\"" }, { km: 8, pace: "5'06\"" }, { km: 9, pace: "4'58\"" }, { km: 10, pace: "4'53\"" },
      ],
      route: [
        [37.5283,126.9346],[37.5290,126.9360],[37.5298,126.9378],[37.5305,126.9395],
        [37.5310,126.9415],[37.5308,126.9438],[37.5300,126.9455],[37.5288,126.9468],
        [37.5275,126.9475],[37.5260,126.9478],[37.5245,126.9472],[37.5232,126.9460],
        [37.5225,126.9442],[37.5222,126.9420],[37.5228,126.9400],[37.5238,126.9382],
        [37.5250,126.9368],[37.5262,126.9355],[37.5275,126.9348],[37.5283,126.9346],
      ],
      wearable: { device: 'Garmin Forerunner', avgHr: 156, maxHr: 178, zoneMinutes: { warmup: 5, fatBurn: 12, cardio: 28, peak: 8 } },
    },
  },
  {
    date: createMockDate(4), type: 'running', elapsed: 2538, totalVolume: 0, totalSets: 0, estCalories: 385, focus: '남산 트레일 러닝',
    exercises: [],
    running: {
      distance: 6.8, pace: "6'13\"", cadence: 162, elevation: { gain: 186, loss: 182 }, location: '남산 둘레길',
      splits: [
        { km: 1, pace: "5'45\"" }, { km: 2, pace: "6'20\"" }, { km: 3, pace: "6'38\"" },
        { km: 4, pace: "6'42\"" }, { km: 5, pace: "6'15\"" }, { km: 6, pace: "5'58\"" },
      ],
      route: [
        [37.5512,126.9882],[37.5520,126.9895],[37.5530,126.9910],[37.5538,126.9928],
        [37.5542,126.9948],[37.5540,126.9968],[37.5532,126.9982],[37.5520,126.9990],
        [37.5508,126.9985],[37.5500,126.9970],[37.5495,126.9950],[37.5498,126.9930],
        [37.5505,126.9912],[37.5512,126.9898],[37.5512,126.9882],
      ],
      wearable: { device: 'Apple Watch', avgHr: 148, maxHr: 172, zoneMinutes: { warmup: 4, fatBurn: 10, cardio: 22, peak: 6 } },
    },
  },
  {
    date: createMockDate(8), type: 'running', elapsed: 1455, totalVolume: 0, totalSets: 0, estCalories: 295, focus: '잠실 새벽 5km',
    exercises: [],
    running: {
      distance: 5.0, pace: "4'51\"", cadence: 182, elevation: { gain: 18, loss: 15 }, location: '잠실 올림픽공원',
      splits: [
        { km: 1, pace: "5'02\"" }, { km: 2, pace: "4'56\"" }, { km: 3, pace: "4'48\"" },
        { km: 4, pace: "4'45\"" }, { km: 5, pace: "4'42\"" },
      ],
      route: [
        [37.5202,127.1158],[37.5215,127.1172],[37.5228,127.1188],[37.5240,127.1205],
        [37.5248,127.1225],[37.5250,127.1248],[37.5245,127.1268],[37.5235,127.1280],
        [37.5220,127.1285],[37.5205,127.1278],[37.5195,127.1260],[37.5192,127.1240],
        [37.5195,127.1218],[37.5200,127.1195],[37.5202,127.1175],[37.5202,127.1158],
      ],
      wearable: { device: 'Garmin Forerunner', avgHr: 162, maxHr: 182, zoneMinutes: { warmup: 3, fatBurn: 5, cardio: 12, peak: 5 } },
    },
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

const RunningIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current stroke-2 fill-none">
    <circle cx="13" cy="4" r="2" />
    <path d="m6.5 22 2.5-7L7 13l3-7 3 5 4 1m-7 1.5 2 1.5" />
  </svg>
))

const IconLocation = memo(() => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-ink-tertiary stroke-[1.5] fill-none flex-shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
))

const IconElevation = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m3 20 5-16 4 10 3-6 6 12" />
  </svg>
)
const IconCadence = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)
const IconClockSm = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

/* ── GPS Route Map (다크) ── */
const RouteMap = memo(({ route, location }: { route: number[][]; location: string }) => {
  const TILE = 256, COLS = 3, ROWS = 3
  const W = TILE * COLS, H = TILE * ROWS

  const lats = route.map(p => p[0]), lngs = route.map(p => p[1])
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
  const latSpan = Math.max(...lats) - Math.min(...lats)
  const lngSpan = Math.max(...lngs) - Math.min(...lngs)
  const zoom = latSpan > 0.02 || lngSpan > 0.025 ? 14 : latSpan > 0.01 || lngSpan > 0.015 ? 15 : 16

  const n = Math.pow(2, zoom)
  const centerLatRad = centerLat * Math.PI / 180
  const originX = Math.floor((centerLng + 180) / 360 * n) - Math.floor(COLS / 2)
  const originY = Math.floor((1 - Math.log(Math.tan(centerLatRad) + 1 / Math.cos(centerLatRad)) / Math.PI) / 2 * n) - Math.floor(ROWS / 2)

  const toPixel = (lat: number, lng: number) => {
    const tileX = (lng + 180) / 360 * n
    const latR = lat * Math.PI / 180
    const tileY = (1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2 * n
    return { x: (tileX - originX) * TILE, y: (tileY - originY) * TILE }
  }

  const pts = route.map(p => toPixel(p[0], p[1]))
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const startPt = pts[0], endPt = pts[pts.length - 1]

  const tiles = Array.from({ length: ROWS * COLS }, (_, i) => {
    const col = i % COLS, row = Math.floor(i / COLS)
    return { key: `${col}-${row}`, url: `https://basemaps.cartocdn.com/light_all/${zoom}/${originX + col}/${originY + row}@2x.png` }
  })

  return (
    <div className="rounded-card-lg overflow-hidden border border-border-light">
      <div className="relative" style={{ aspectRatio: `${COLS}/${ROWS}` }}>
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {tiles.map(t => <img key={t.key} src={t.url} alt="" className="w-full h-full object-cover" draggable={false} loading="lazy" />)}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={startPt.x} cy={startPt.y} r="8" fill="#10b981" />
          <circle cx={startPt.x} cy={startPt.y} r="4" fill="white" />
          <circle cx={endPt.x} cy={endPt.y} r="8" fill="#ef4444" />
          <circle cx={endPt.x} cy={endPt.y} r="4" fill="white" />
        </svg>
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-surface-muted border-t border-border-light">
        <div className="flex items-center gap-1.5">
          <IconLocation />
          <span className="text-caption text-ink-secondary">{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-accent-green" />
          <span className="text-caption text-ink-tertiary">출발</span>
          <span className="w-2 h-2 rounded-full bg-semantic-like ml-1.5" />
          <span className="text-caption text-ink-tertiary">도착</span>
        </div>
      </div>
    </div>
  )
})

/* ── 심박존 카드 (라이트) ── */
const HRZoneCard = memo(({ wearable }: { wearable: RunningWearable }) => {
  const { warmup, fatBurn, cardio, peak } = wearable.zoneMinutes
  const total = warmup + fatBurn + cardio + peak
  const pct = (n: number) => total === 0 ? 0 : (n / total) * 100
  return (
    <div className="p-4 rounded-card-lg bg-surface border border-border-light">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-label font-bold text-ink">{wearable.device}</span>
        </div>
        <span className="text-caption text-ink-tertiary">실시간 동기화</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-caption text-ink-tertiary mb-1">평균 심박</div>
          <div className="text-heading font-extrabold leading-none text-ink tabular-nums">
            {wearable.avgHr}<span className="text-label font-semibold text-ink-tertiary ml-1">bpm</span>
          </div>
        </div>
        <div>
          <div className="text-caption text-ink-tertiary mb-1">최대 심박</div>
          <div className="text-heading font-extrabold leading-none text-semantic-like tabular-nums">
            {wearable.maxHr}<span className="text-label font-semibold text-ink-tertiary ml-1">bpm</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-caption text-ink-tertiary">심박존 분포</span>
        <span className="text-caption text-ink-placeholder tabular-nums">{total}분</span>
      </div>
      <div className="flex h-2 rounded-pill overflow-hidden mb-2.5 bg-surface-muted">
        <div className="bg-ink-disabled" style={{ width: `${pct(warmup)}%` }} />
        <div className="bg-accent-green" style={{ width: `${pct(fatBurn)}%` }} />
        <div className="bg-primary" style={{ width: `${pct(cardio)}%` }} />
        <div className="bg-semantic-like" style={{ width: `${pct(peak)}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-caption">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-ink-disabled" /><span className="text-ink-secondary">워밍업</span></div>
          <span className="text-ink-tertiary tabular-nums">{warmup}분</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent-green" /><span className="text-ink-secondary">지방연소</span></div>
          <span className="text-ink-tertiary tabular-nums">{fatBurn}분</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary" /><span className="text-ink-secondary">유산소</span></div>
          <span className="text-ink-tertiary tabular-nums">{cardio}분</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-semantic-like" /><span className="text-ink-secondary">최대</span></div>
          <span className="text-ink-tertiary tabular-nums">{peak}분</span>
        </div>
      </div>
    </div>
  )
})

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
  const isRunning = record.type === 'running' && !!record.running

  return (
    <div className="rounded-card-lg border border-border-light overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-subtle transition-colors">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
          isRunning ? 'bg-accent-green/10 text-accent-green' : 'bg-primary-50 text-primary'
        }`}>
          {isRunning ? <RunningIcon /> : <DumbbellIcon />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isRunning && (
              <span className="px-1.5 py-px text-[10px] font-bold rounded text-white bg-accent-green tracking-wider">RUN</span>
            )}
            <div className="text-body font-semibold text-ink truncate">{record.focus || record.programTitle}</div>
          </div>
          <div className="flex items-center gap-1.5 text-caption text-ink-tertiary mt-0.5 tabular-nums">
            {showDate && <><span>{date.getMonth() + 1}/{date.getDate()} ({WEEKDAYS[date.getDay()]})</span><span>·</span></>}
            <span>{formatDuration(record.elapsed)}</span>
            <span>·</span>
            {isRunning ? (
              <>
                <span>{record.running!.distance}km</span>
                <span>·</span>
                <span>{record.running!.pace}/km</span>
              </>
            ) : (
              <>
                <span>{record.exercises.length}종목</span>
              </>
            )}
            <span>·</span>
            <span>{record.estCalories}kcal</span>
          </div>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className="border-t border-border-light bg-surface-subtle">
          <div className="px-4 py-4 flex flex-col gap-4">
            {isRunning ? (
              <>
                {/* 지도 + 위치 */}
                {record.running!.route && (
                  <RouteMap route={record.running!.route} location={record.running!.location} />
                )}

                {/* 메인 3-stat */}
                <div className="grid grid-cols-3 p-4 rounded-card-lg bg-surface border border-border-light divide-x divide-border-light">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-heading font-extrabold leading-none text-ink tabular-nums">
                      {record.running!.distance}<span className="text-label font-semibold text-ink-tertiary ml-1">km</span>
                    </div>
                    <div className="text-caption text-ink-tertiary mt-1.5">거리</div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-heading font-extrabold leading-none text-ink tabular-nums">{record.running!.pace}</div>
                    <div className="text-caption text-ink-tertiary mt-1.5">평균 페이스</div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-heading font-extrabold leading-none text-ink tabular-nums">
                      {record.estCalories}<span className="text-label font-semibold text-ink-tertiary ml-1">kcal</span>
                    </div>
                    <div className="text-caption text-ink-tertiary mt-1.5">활동 칼로리</div>
                  </div>
                </div>

                {/* 서브 3-stat */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-card-lg bg-surface border border-border-light">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <IconElevation className="w-3.5 h-3.5 stroke-accent-green" />
                      <span className="text-label font-bold text-ink tabular-nums">{record.running!.elevation.gain}m</span>
                    </div>
                    <div className="text-caption text-ink-placeholder">획득 고도</div>
                  </div>
                  <div className="text-center border-x border-border-light">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <IconCadence className="w-3.5 h-3.5 stroke-accent-green" />
                      <span className="text-label font-bold text-ink tabular-nums">{record.running!.cadence}</span>
                    </div>
                    <div className="text-caption text-ink-placeholder">평균 케이던스</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <IconClockSm className="w-3.5 h-3.5 stroke-accent-green" />
                      <span className="text-label font-bold text-ink tabular-nums">{formatDuration(record.elapsed)}</span>
                    </div>
                    <div className="text-caption text-ink-placeholder">운동 시간</div>
                  </div>
                </div>

                {/* 구간 기록 */}
                <div className="rounded-card-lg bg-surface border border-border-light overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border-light flex items-center justify-between">
                    <span className="text-label font-semibold text-ink">구간 기록</span>
                    <span className="text-caption text-ink-tertiary tabular-nums">{record.running!.splits.length}km</span>
                  </div>
                  <div className="p-3">
                    {(() => {
                      const allSec = record.running!.splits.map(x => {
                        const m = x.pace.match(/(\d+)'(\d+)/); return m ? Number(m[1]) * 60 + Number(m[2]) : 0
                      })
                      const minSec = Math.min(...allSec), maxSec = Math.max(...allSec)
                      return record.running!.splits.map(s => {
                        const cur = (() => { const m = s.pace.match(/(\d+)'(\d+)/); return m ? Number(m[1]) * 60 + Number(m[2]) : 0 })()
                        const ratio = maxSec === minSec ? 1 : (maxSec - cur) / (maxSec - minSec)
                        const width = 30 + ratio * 70
                        return (
                          <div key={s.km} className="grid grid-cols-[40px_1fr_60px] gap-3 items-center py-1.5">
                            <span className="text-caption text-ink-tertiary tabular-nums">{s.km}km</span>
                            <div className="h-2.5 flex items-center bg-surface-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-accent-green" style={{ width: `${width}%` }} />
                            </div>
                            <span className="text-caption font-bold text-ink text-right tabular-nums">{s.pace}</span>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>

                {/* 심박존 */}
                {record.running!.wearable && <HRZoneCard wearable={record.running!.wearable} />}
              </>
            ) : (
              <>
                {/* 3 stat 카드 */}
                <div className="grid grid-cols-3 p-4 rounded-card-lg bg-surface border border-border-light divide-x divide-border-light">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-heading font-extrabold leading-none text-ink tabular-nums">
                      {record.totalVolume > 0 ? record.totalVolume.toLocaleString() : '-'}
                      {record.totalVolume > 0 && <span className="text-label font-semibold text-ink-tertiary ml-1">kg</span>}
                    </div>
                    <div className="text-caption text-ink-tertiary mt-1.5">총 볼륨</div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-heading font-extrabold leading-none text-ink tabular-nums">{record.totalSets}</div>
                    <div className="text-caption text-ink-tertiary mt-1.5">세트</div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
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

                {/* 심박존 */}
                {record.wearable && <HRZoneCard wearable={record.wearable} />}
              </>
            )}
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
    const rawDates = new Set(raw.map(r => new Date(r.date).toDateString()))
    const merged = [...raw, ...mockHistory.filter(m => !rawDates.has(new Date(m.date).toDateString()))]
    // wearable 자동 보강 (실제 저장 기록 등 wearable 없을 때 기본값 채움)
    return merged.map(r => {
      if (r.wearable || r.type === 'running') return r
      const cal = r.estCalories || 0
      const ratio = cal > 0 ? Math.min(cal / 500, 1.4) : 0.6
      const totalMin = Math.max(Math.round(r.elapsed / 60), 1)
      const warmup = Math.round(totalMin * 0.15)
      const fatBurn = Math.round(totalMin * 0.35)
      const cardio = Math.round(totalMin * 0.4)
      const peak = Math.max(totalMin - warmup - fatBurn - cardio, 0)
      return {
        ...r,
        wearable: {
          device: 'Apple Watch',
          avgHr: Math.round(110 + ratio * 25),
          maxHr: Math.round(140 + ratio * 35),
          zoneMinutes: { warmup, fatBurn, cardio, peak },
        },
      }
    })
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
        <div className="grid grid-cols-4 p-3 bg-primary-50 rounded-card-lg divide-x divide-primary/20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{stats.totalWorkouts}</div>
            <div className="text-caption text-ink-tertiary mt-1">운동</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{stats.streak}</div>
            <div className="text-caption text-ink-tertiary mt-1">연속</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-heading font-extrabold text-primary tabular-nums leading-none">{formatDuration(stats.totalTime)}</div>
            <div className="text-caption text-ink-tertiary mt-1">시간</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
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
