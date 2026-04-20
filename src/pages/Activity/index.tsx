import { useState, useMemo, useCallback, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageLayout, SubPageHeader, FilterTabs } from '../../components'
import { IconSearch, IconHeart, IconMessage, IconCalendar, IconMapPin, IconShare } from '../../components/Icons'

const Stat = memo(({ label, value, unit, divider }: { label: string; value: string; unit?: string; divider?: boolean }) => (
  <div className={`flex flex-col items-center justify-center text-center ${divider ? 'border-x border-white/10 px-3' : ''}`}>
    <div className="text-heading font-extrabold leading-none tabular-nums">
      {value}
      {unit && <span className="text-label font-semibold text-white/50 ml-1">{unit}</span>}
    </div>
    <div className="text-caption text-white/50 mt-1.5">{label}</div>
  </div>
))
const SectionLabel = memo(({ children }: { children: React.ReactNode }) => (
  <div className="text-caption uppercase tracking-widest text-white/50 mb-3">{children}</div>
))

/* ── GPS Route Map ── */
const RouteMap = memo(({ route, location: loc }: { route: number[][]; location: string }) => {
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
    return { key: `${col}-${row}`, url: `https://basemaps.cartocdn.com/dark_all/${zoom}/${originX + col}/${originY + row}@2x.png` }
  })

  return (
    <div className="rounded-card-lg overflow-hidden border border-white/10">
      {/* 지도 영역 */}
      <div className="relative" style={{ aspectRatio: `${COLS}/${ROWS}` }}>
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {tiles.map(t => <img key={t.key} src={t.url} alt="" className="w-full h-full object-cover" draggable={false} loading="lazy" />)}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={startPt.x} cy={startPt.y} r="8" fill="#10b981" />
          <circle cx={startPt.x} cy={startPt.y} r="4" fill="white" />
          <circle cx={endPt.x} cy={endPt.y} r="8" fill="#ef4444" />
          <circle cx={endPt.x} cy={endPt.y} r="4" fill="white" />
        </svg>
      </div>
      {/* 라벨 영역 (지도 아래 분리) */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a2e]">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white/60 stroke-[1.5] fill-none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="text-caption text-white/60">{loc}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-accent-green" />
          <span className="text-caption text-white/50">출발</span>
          <span className="w-2 h-2 rounded-full bg-semantic-like ml-1.5" />
          <span className="text-caption text-white/50">도착</span>
        </div>
      </div>
    </div>
  )
})

/* ── Stories ── */
const stories = [
  { id: 0, name: '내 피드', imageUrl: '', isAdd: true },
  { id: 1, name: '김트레이너', imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: '헬스왕', imageUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: '운동하는직..', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: '바레톤요정', imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=100&h=100&fit=crop&crop=face' },
  { id: 5, name: '크로스핏러', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 6, name: '러닝매니아', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
]

/* ── Feed Posts ── */
const feeds = [
  {
    id: 1,
    imageUrls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop',
    ],
    authorImageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face',
    authorName: '김트레이너',
    location: '바디채널 강남점',
    text: '오늘도 열심히 운동 완료! 💪 꾸준히 하니까 확실히 달라지는 게 느껴져요. 여러분도 함께해요!',
    likeCount: 128,
    commentCount: 24,
    isLiked: true,
    timeAgo: '2시간 전',
    isMine: true,
    workout: {
      title: '가슴 · 삼두',
      duration: '1시간 20분',
      totalVolume: 8420, // kg
      totalSets: 18,
      exercises: [
        { name: '벤치프레스', sets: [{ weight: 60, reps: 12 }, { weight: 80, reps: 10 }, { weight: 80, reps: 10 }, { weight: 80, reps: 8 }] },
        { name: '인클라인 덤벨프레스', sets: [{ weight: 22, reps: 12 }, { weight: 22, reps: 12 }, { weight: 24, reps: 10 }, { weight: 24, reps: 10 }] },
        { name: '체스트 플라이 머신', sets: [{ weight: 45, reps: 15 }, { weight: 45, reps: 15 }, { weight: 50, reps: 12 }] },
        { name: '딥스', sets: [{ weight: 0, reps: 15 }, { weight: 0, reps: 12 }, { weight: 10, reps: 10 }, { weight: 10, reps: 8 }] },
        { name: '케이블 푸시다운', sets: [{ weight: 25, reps: 15 }, { weight: 30, reps: 12 }, { weight: 30, reps: 12 }] },
      ],
      wearable: {
        device: 'Apple Watch',
        activeKcal: 412,
        avgHr: 132,
        maxHr: 168,
        zoneMinutes: { warmup: 12, fatBurn: 28, cardio: 32, peak: 8 },
      },
    },
  },
  {
    id: 2,
    imageUrls: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop'],
    authorImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
    authorName: '헬스왕',
    location: '바디채널 서초점',
    text: '바레톤 수업 후기 🧘‍♀️ 정말 시원하네요. 코어가 단단해지는 느낌!',
    likeCount: 89,
    commentCount: 12,
    isLiked: false,
    timeAgo: '4시간 전',
    workout: {
      title: '바레톤 그룹수업',
      duration: '55분',
      totalVolume: 0,
      totalSets: 12,
      exercises: [
        { name: '플리에 스쿼트', sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 20 }, { weight: 0, reps: 16 }] },
        { name: '레그 리프트', sets: [{ weight: 0, reps: 15 }, { weight: 0, reps: 15 }, { weight: 0, reps: 12 }] },
        { name: '플랭크 홀드', sets: [{ weight: 0, reps: 60 }, { weight: 0, reps: 45 }] },
        { name: '바 워크', sets: [{ weight: 0, reps: 24 }, { weight: 0, reps: 24 }] },
        { name: '브릿지', sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 20 }] },
      ],
      wearable: {
        device: 'Galaxy Watch',
        activeKcal: 285,
        avgHr: 118,
        maxHr: 152,
        zoneMinutes: { warmup: 8, fatBurn: 30, cardio: 15, peak: 2 },
      },
    },
  },
  {
    id: 3,
    imageUrls: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=800&fit=crop',
    ],
    authorImageUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=100&h=100&fit=crop&crop=face',
    authorName: '운동하는직장인',
    location: '바디채널 역삼점',
    text: '3개월 벌크업 결과! 드디어 목표 달성 🎉',
    likeCount: 256,
    commentCount: 48,
    isLiked: true,
    timeAgo: '6시간 전',
    workout: {
      title: '하체 · 등',
      duration: '1시간 45분',
      totalVolume: 12680,
      totalSets: 22,
      exercises: [
        { name: '바벨 스쿼트', sets: [{ weight: 60, reps: 12 }, { weight: 100, reps: 8 }, { weight: 120, reps: 6 }, { weight: 120, reps: 6 }, { weight: 100, reps: 8 }] },
        { name: '루마니안 데드리프트', sets: [{ weight: 80, reps: 10 }, { weight: 100, reps: 8 }, { weight: 100, reps: 8 }, { weight: 100, reps: 8 }] },
        { name: '레그프레스', sets: [{ weight: 160, reps: 12 }, { weight: 180, reps: 10 }, { weight: 200, reps: 8 }] },
        { name: '랫 풀다운', sets: [{ weight: 55, reps: 12 }, { weight: 65, reps: 10 }, { weight: 70, reps: 8 }, { weight: 70, reps: 8 }] },
        { name: '시티드 로우', sets: [{ weight: 50, reps: 12 }, { weight: 60, reps: 10 }, { weight: 60, reps: 10 }] },
        { name: '레그 컬', sets: [{ weight: 40, reps: 15 }, { weight: 45, reps: 12 }, { weight: 45, reps: 12 }] },
      ],
      wearable: {
        device: 'Garmin Forerunner',
        activeKcal: 612,
        avgHr: 142,
        maxHr: 178,
        zoneMinutes: { warmup: 10, fatBurn: 32, cardio: 48, peak: 15 },
      },
    },
  },
  {
    id: 4,
    imageUrls: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=800&fit=crop'],
    authorImageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=100&h=100&fit=crop&crop=face',
    authorName: '바레톤요정',
    location: '바디채널 판교점',
    text: '오늘의 운동 루틴 공유해요 ✨ 상체 + 코어 조합 최고예요',
    likeCount: 67,
    commentCount: 8,
    isLiked: false,
    timeAgo: '8시간 전',
    workout: {
      title: '어깨 · 코어',
      duration: '50분',
      totalVolume: 3240,
      totalSets: 14,
      exercises: [
        { name: '오버헤드 프레스', sets: [{ weight: 30, reps: 12 }, { weight: 35, reps: 10 }, { weight: 35, reps: 10 }] },
        { name: '사이드 레터럴 레이즈', sets: [{ weight: 8, reps: 15 }, { weight: 10, reps: 12 }, { weight: 10, reps: 12 }] },
        { name: '페이스 풀', sets: [{ weight: 20, reps: 15 }, { weight: 25, reps: 12 }, { weight: 25, reps: 12 }] },
        { name: '행잉 레그레이즈', sets: [{ weight: 0, reps: 15 }, { weight: 0, reps: 12 }, { weight: 0, reps: 10 }] },
        { name: '러시안 트위스트', sets: [{ weight: 5, reps: 30 }, { weight: 5, reps: 30 }] },
      ],
      wearable: {
        device: 'Apple Watch',
        activeKcal: 320,
        avgHr: 124,
        maxHr: 158,
        zoneMinutes: { warmup: 8, fatBurn: 22, cardio: 16, peak: 4 },
      },
    },
  },
  {
    id: 5,
    imageUrls: [
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=800&fit=crop',
    ],
    authorImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    authorName: '러닝매니아',
    location: '여의도 한강공원',
    text: '오늘 한강 러닝 10km 완주! 🏃‍♀️ 날씨도 좋고 페이스도 잘 나왔어요. 러닝 크루 분들 덕분에 끝까지 달릴 수 있었습니다!',
    likeCount: 184,
    commentCount: 32,
    isLiked: false,
    timeAgo: '1시간 전',
    running: {
      distance: 10.2,
      duration: '52:34',
      avgPace: '5\'09"',
      elevation: { gain: 42, loss: 38 },
      avgCadence: 174,
      route: [
        [37.5283,126.9346],[37.5290,126.9360],[37.5298,126.9378],[37.5305,126.9395],
        [37.5310,126.9415],[37.5308,126.9438],[37.5300,126.9455],[37.5288,126.9468],
        [37.5275,126.9475],[37.5260,126.9478],[37.5245,126.9472],[37.5232,126.9460],
        [37.5225,126.9442],[37.5222,126.9420],[37.5228,126.9400],[37.5238,126.9382],
        [37.5250,126.9368],[37.5262,126.9355],[37.5275,126.9348],[37.5283,126.9346],
      ],
      splits: [
        { km: 1, pace: '5\'22"' },
        { km: 2, pace: '5\'18"' },
        { km: 3, pace: '5\'12"' },
        { km: 4, pace: '5\'08"' },
        { km: 5, pace: '5\'05"' },
        { km: 6, pace: '5\'02"' },
        { km: 7, pace: '5\'10"' },
        { km: 8, pace: '5\'06"' },
        { km: 9, pace: '4\'58"' },
        { km: 10, pace: '4\'53"' },
      ],
      wearable: {
        device: 'Garmin Forerunner',
        activeKcal: 520,
        avgHr: 156,
        maxHr: 178,
        zoneMinutes: { warmup: 5, fatBurn: 12, cardio: 28, peak: 8 },
      },
    },
  },
  {
    id: 6,
    imageUrls: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=800&fit=crop'],
    authorImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    authorName: '크로스핏러',
    location: '남산 둘레길',
    text: '남산 트레일 러닝 도전 🏔️ 경사가 좀 있지만 풍경이 최고였어요. 다음엔 북악산도 가볼 예정!',
    likeCount: 95,
    commentCount: 16,
    isLiked: true,
    timeAgo: '3시간 전',
    running: {
      distance: 6.8,
      duration: '42:18',
      avgPace: '6\'13"',
      elevation: { gain: 186, loss: 182 },
      avgCadence: 162,
      route: [
        [37.5512,126.9882],[37.5520,126.9895],[37.5530,126.9910],[37.5538,126.9928],
        [37.5542,126.9948],[37.5540,126.9968],[37.5532,126.9982],[37.5520,126.9990],
        [37.5508,126.9985],[37.5500,126.9970],[37.5495,126.9950],[37.5498,126.9930],
        [37.5505,126.9912],[37.5512,126.9898],[37.5512,126.9882],
      ],
      splits: [
        { km: 1, pace: '5\'45"' },
        { km: 2, pace: '6\'20"' },
        { km: 3, pace: '6\'38"' },
        { km: 4, pace: '6\'42"' },
        { km: 5, pace: '6\'15"' },
        { km: 6, pace: '5\'58"' },
      ],
      wearable: {
        device: 'Apple Watch',
        activeKcal: 385,
        avgHr: 148,
        maxHr: 172,
        zoneMinutes: { warmup: 4, fatBurn: 10, cardio: 22, peak: 6 },
      },
    },
  },
  {
    id: 7,
    imageUrls: [
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1530143584546-02191bc84eb5?w=800&h=800&fit=crop',
    ],
    authorImageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face',
    authorName: '김트레이너',
    location: '잠실 올림픽공원',
    text: '새벽 5km 러닝으로 하루 시작 ☀️ 아침 공기가 진짜 상쾌하네요. 러닝 후 스트레칭까지 꼼꼼하게!',
    likeCount: 142,
    commentCount: 21,
    isLiked: false,
    timeAgo: '5시간 전',
    running: {
      distance: 5.0,
      duration: '24:15',
      avgPace: '4\'51"',
      elevation: { gain: 18, loss: 15 },
      avgCadence: 182,
      route: [
        [37.5202,127.1158],[37.5215,127.1172],[37.5228,127.1188],[37.5240,127.1205],
        [37.5248,127.1225],[37.5250,127.1248],[37.5245,127.1268],[37.5235,127.1280],
        [37.5220,127.1285],[37.5205,127.1278],[37.5195,127.1260],[37.5192,127.1240],
        [37.5195,127.1218],[37.5200,127.1195],[37.5202,127.1175],[37.5202,127.1158],
      ],
      splits: [
        { km: 1, pace: '5\'02"' },
        { km: 2, pace: '4\'55"' },
        { km: 3, pace: '4\'48"' },
        { km: 4, pace: '4\'45"' },
        { km: 5, pace: '4\'45"' },
      ],
      wearable: {
        device: 'Garmin Forerunner',
        activeKcal: 280,
        avgHr: 162,
        maxHr: 182,
        zoneMinutes: { warmup: 3, fatBurn: 5, cardio: 12, peak: 5 },
      },
    },
  },
]

/* ── Meetup Categories ── */
const meetupCategories = ['전체', '러닝', '헬스', '크로스핏', '바레톤', '등산', '자전거']


/* ── Meetup Data ── */
const meetups = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop',
    badge: 'HOT' as const,
    category: '러닝',
    title: '한강 러닝 크루 🏃 매주 토요일 아침 달리기',
    description: '함께 뛰면 더 즐거워요! 초보부터 중급까지 누구나 환영하는 러닝 크루입니다.',
    schedule: '매주 토요일 07:00',
    location: '여의도 한강공원 물빛광장',
    host: { name: '김트레이너', imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=50&h=50&fit=crop&crop=face' },
    memberCount: 15,
    maxMembers: 20,
    memberAvatars: [
      'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=50&h=50&fit=crop&crop=face',
    ],
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
    badge: 'NEW' as const,
    category: '헬스',
    title: '강남 벌크업 챌린지 💪 30일 함께 도전',
    description: '30일간 함께하는 벌크업 프로그램. 식단 관리부터 운동 루틴까지 공유해요.',
    schedule: '매일 저녁 20:00',
    location: '바디채널 강남점',
    host: { name: '헬스왕', imageUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=50&h=50&fit=crop&crop=face' },
    memberCount: 28,
    maxMembers: 40,
    memberAvatars: [
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    ],
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop',
    badge: '' as const,
    category: '바레톤',
    title: '모닝 바레톤 클럽 🧘 아침을 여는 습관',
    description: '아침 6시, 상쾌한 바레톤으로 하루를 시작하세요. 소수정예 클래스로 진행됩니다.',
    schedule: '매주 수/금 06:00',
    location: '바디채널 서초점',
    host: { name: '바레톤요정', imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=50&h=50&fit=crop&crop=face' },
    memberCount: 18,
    maxMembers: 20,
    memberAvatars: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=50&h=50&fit=crop&crop=face',
    ],
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=400&fit=crop',
    badge: 'HOT' as const,
    category: '크로스핏',
    title: '크로스핏 초보 모임 🔥 함께 시작해요',
    description: '크로스핏이 처음이라도 괜찮아요! 기초부터 차근차근 함께 성장하는 모임입니다.',
    schedule: '매주 화/목 19:00',
    location: '바디채널 역삼점',
    host: { name: '운동하는직장인', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop&crop=face' },
    memberCount: 32,
    maxMembers: 30,
    memberAvatars: [
      'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    ],
  },
]

export const ActivityPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = location.hash === '#meetup' ? 'meetup' : 'feed'
  const setActiveTab = (tab: 'feed' | 'meetup') => {
    navigate(tab === 'meetup' ? '#meetup' : '#feed', { replace: true })
  }
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [menuFeedId, setMenuFeedId] = useState<number | null>(null)
  const [blockTarget, setBlockTarget] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [commentFeedId, setCommentFeedId] = useState<number | null>(null)
  const [commentInput, setCommentInput] = useState('')
  const [imageIdxMap, setImageIdxMap] = useState<Record<number, number>>({})
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null)
  const [feedTypeModal, setFeedTypeModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [commentsMap, setCommentsMap] = useState<Record<number, { author: string; text: string }[]>>({
    1: [
      { author: '박지영', text: '대단해요! 저도 열심히 해야겠어요 👏' },
      { author: '이준혁', text: '꾸준함이 최고죠!' },
    ],
    2: [{ author: '김민수', text: '저도 들어보고 싶어요!' }],
    3: [],
    4: [],
    5: [{ author: '헬스왕', text: '페이스 잘 나왔네요! 🔥' }],
    6: [],
    7: [{ author: '러닝매니아', text: '새벽 러닝 최고죠!' }],
  })
  const submitComment = useCallback(() => {
    if (!commentInput.trim() || commentFeedId === null) return
    setCommentsMap(m => ({
      ...m,
      [commentFeedId]: [...(m[commentFeedId] || []), { author: '나', text: commentInput.trim() }],
    }))
    setCommentInput('')
  }, [commentInput, commentFeedId])
  const [likedMap, setLikedMap] = useState<Record<number, { liked: boolean; count: number }>>(
    () => Object.fromEntries(feeds.map(f => [f.id, { liked: f.isLiked, count: f.likeCount }]))
  )
  const toggleLike = useCallback((id: number) => setLikedMap(m => {
    const cur = m[id]
    return { ...m, [id]: { liked: !cur.liked, count: cur.liked ? cur.count - 1 : cur.count + 1 } }
  }), [])
  const shareFeed = useCallback((id: number) => {
    const url = `${window.location.origin}/feed/${id}`
    if (navigator.share) {
      navigator.share({ title: '바디채널 피드', url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url)
      alert('링크가 복사되었어요')
    }
  }, [])

  const filteredMeetups = useMemo(() =>
    selectedCategory === '전체' ? meetups : meetups.filter(m => m.category === selectedCategory),
    [selectedCategory]
  )

  const header = (
    <SubPageHeader
      title="피드"
      right={
        <div className="flex items-center gap-1">
          <button className="icon-btn" onClick={() => setShowCalendar(true)}>
            <IconCalendar className="w-5 h-5 stroke-ink stroke-2 fill-none" />
          </button>
          <button className="icon-btn">
            <IconSearch className="w-5 h-5 stroke-ink stroke-2 fill-none" />
          </button>
        </div>
      }
    >
      <div className="flex">
        {(['feed', 'meetup'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-body font-semibold text-center border-b-2 transition-colors ${
              activeTab === tab
                ? 'text-ink border-ink'
                : 'text-ink-placeholder border-transparent hover:text-ink-secondary'
            }`}
          >
            {tab === 'feed' ? '피드' : '모임'}
          </button>
        ))}
      </div>
    </SubPageHeader>
  )

  return (
    <PageLayout header={header} noPadding>
      {activeTab === 'feed' ? (
        <>
          {/* Stories Row */}
          <div className="px-page py-4 border-b border-border-light">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => navigate(story.isAdd ? '/feed/new' : `/profile/${encodeURIComponent(story.name)}`)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  {story.isAdd ? (
                    <div className="relative w-[72px] h-[72px]">
                      <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop&crop=face"
                        alt="내 피드"
                        className="w-full h-full rounded-full object-cover border-2 border-ink-placeholder"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white stroke-2 fill-none">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-full p-[2px] bg-gradient-to-br from-primary to-[#FF9F1C]">
                      <img
                        src={story.imageUrl}
                        alt={story.name}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    </div>
                  )}
                  <span className="text-label text-ink-secondary w-[60px] text-center truncate">{story.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feed Posts */}
          <div className="flex flex-col">
            {feeds.map((feed) => (
              <div key={feed.id} className="border-b border-border-light">
                {/* Author Row */}
                <div className="flex items-center justify-between px-page py-3">
                  <button
                    onClick={() => navigate(feed.isMine ? '/mypage?tab=profile' : `/profile/${encodeURIComponent(feed.authorName)}`)}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={feed.authorImageUrl}
                      alt={feed.authorName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="text-body font-semibold text-ink leading-tight">{feed.authorName}</div>
                      <div className="text-label text-ink-placeholder">{feed.location}</div>
                    </div>
                  </button>
                  <button className="p-2" onClick={() => setMenuFeedId(feed.id)}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-ink">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </button>
                </div>

                {/* Post Images */}
                <div className="relative">
                  <div
                    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                    onScroll={(e) => {
                      const el = e.currentTarget
                      const idx = Math.round(el.scrollLeft / el.clientWidth)
                      setImageIdxMap(m => (m[feed.id] === idx ? m : { ...m, [feed.id]: idx }))
                    }}
                  >
                    {feed.imageUrls.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => (feed.workout || feed.running) && setExpandedWorkout(feed.id)}
                        className="w-full flex-shrink-0 snap-center"
                      >
                        <img src={url} alt="피드" className="w-full aspect-square object-cover" />
                      </button>
                    ))}
                  </div>
                  {feed.running && (
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-3 px-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-pill bg-accent-green text-white text-caption font-bold">러닝기록</span>
                      </div>
                      <div className="flex items-end gap-4 text-white">
                        <div>
                          <div className="text-caption text-white/70 leading-none mb-0.5">거리</div>
                          <div className="text-body font-extrabold leading-none">{feed.running.distance}<span className="text-caption font-semibold ml-0.5">km</span></div>
                        </div>
                        <div className="w-px h-6 bg-white/30" />
                        <div>
                          <div className="text-caption text-white/70 leading-none mb-0.5">페이스</div>
                          <div className="text-body font-extrabold leading-none">{feed.running.avgPace}</div>
                        </div>
                        <div className="w-px h-6 bg-white/30" />
                        <div>
                          <div className="text-caption text-white/70 leading-none mb-0.5">평균 심박</div>
                          <div className="text-body font-extrabold leading-none">{feed.running.wearable.avgHr}<span className="text-caption font-semibold ml-0.5">bpm</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {feed.workout && (
                    <div className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-3 px-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-pill bg-primary text-white text-caption font-bold">운동기록</span>
                      </div>
                      <div className="flex items-end gap-4 text-white">
                        <div>
                          <div className="text-caption text-white/70 leading-none mb-0.5">시간</div>
                          <div className="text-body font-extrabold leading-none">{feed.workout.duration}</div>
                        </div>
                        <div className="w-px h-6 bg-white/30" />
                        <div>
                          <div className="text-caption text-white/70 leading-none mb-0.5">볼륨</div>
                          <div className="text-body font-extrabold leading-none">{feed.workout.totalVolume.toLocaleString()}<span className="text-caption font-semibold ml-0.5">kg</span></div>
                        </div>
                        <div className="w-px h-6 bg-white/30" />
                        <div>
                          <div className="text-caption text-white/70 leading-none mb-0.5">평균 심박</div>
                          <div className="text-body font-extrabold leading-none">{feed.workout.wearable.avgHr}<span className="text-caption font-semibold ml-0.5">bpm</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {feed.imageUrls.length > 1 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-pill bg-black/60 text-white text-label font-semibold tabular-nums pointer-events-none">
                      {(imageIdxMap[feed.id] ?? 0) + 1}/{feed.imageUrls.length}
                    </div>
                  )}
                </div>

                {/* Actions + Text */}
                <div className="px-page py-3">
                  <div className="flex items-center gap-4 mb-2.5">
                    <button onClick={() => toggleLike(feed.id)} className="flex items-center gap-1.5">
                      <IconHeart className={`w-[22px] h-[22px] ${likedMap[feed.id].liked ? 'fill-semantic-like stroke-semantic-like' : 'fill-none stroke-ink'} stroke-2`} />
                      <span className="text-label font-semibold text-ink">{likedMap[feed.id].count}</span>
                    </button>
                    <button onClick={() => setCommentFeedId(feed.id)} className="flex items-center gap-1.5">
                      <IconMessage className="w-[22px] h-[22px] fill-none stroke-ink stroke-2" />
                      <span className="text-label font-semibold text-ink">{(commentsMap[feed.id] || []).length || feed.commentCount}</span>
                    </button>
                    <button onClick={() => shareFeed(feed.id)} className="flex items-center gap-1.5">
                      <IconShare className="w-[22px] h-[22px] fill-none stroke-ink stroke-2" />
                      <span className="text-label font-semibold text-ink">공유</span>
                    </button>
                  </div>
                  <div className="text-body text-ink leading-relaxed mb-1">
                    <span className="font-semibold">{feed.authorName}</span>{' '}
                    <span className="text-ink-secondary">{feed.text}</span>
                  </div>
                  <div className="text-label text-ink-placeholder mt-1">{feed.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAB Button (피드 등록) */}
          <button onClick={() => setFeedTypeModal(true)} className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center hover:bg-primary-dark transition-colors z-50">
            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white stroke-2 fill-none">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </>
      ) : (
        <>
          {/* Category Filter Pills */}
          <FilterTabs
            tabs={meetupCategories.map(cat => ({ key: cat, label: cat }))}
            active={selectedCategory}
            onSelect={setSelectedCategory}
            scrollable
            className="border-b border-border-light"
          />

          {/* Meetup Cards */}
          <div className="px-page py-5 flex flex-col gap-4">
            {filteredMeetups.map((meetup) => {
              const isFull = meetup.memberCount >= meetup.maxMembers
              const progress = Math.min((meetup.memberCount / meetup.maxMembers) * 100, 100)

              return (
                <button
                  key={meetup.id}
                  onClick={() => navigate(`/meetup/${meetup.id}`)}
                  className="text-left bg-surface rounded-card-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={meetup.imageUrl}
                      alt={meetup.title}
                      className="w-full h-[160px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {meetup.badge && (
                      <span className={`absolute top-3 left-3 text-caption font-bold text-white px-2 py-0.5 rounded-md ${
                        meetup.badge === 'HOT' ? 'bg-primary' : 'bg-semantic-online'
                      }`}>
                        {meetup.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="text-caption text-white/90 bg-black/40 px-2 py-0.5 rounded-pill font-medium">
                        {meetup.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-card-lg">
                    {/* Title */}
                    <h3 className="text-title font-bold text-ink mb-1.5 leading-snug line-clamp-1">{meetup.title}</h3>
                    <p className="text-label text-ink-secondary leading-relaxed mb-3 line-clamp-2">{meetup.description}</p>

                    {/* Schedule & Location */}
                    <div className="flex flex-col gap-1.5 mb-3">
                      <div className="flex items-center gap-2 text-label text-ink-secondary">
                        <IconCalendar className="w-3.5 h-3.5 stroke-ink-tertiary stroke-[1.5] fill-none flex-shrink-0" />
                        {meetup.schedule}
                      </div>
                      <div className="flex items-center gap-2 text-label text-ink-secondary">
                        <IconMapPin className="w-3.5 h-3.5 stroke-ink-tertiary stroke-[1.5] fill-none flex-shrink-0" />
                        {meetup.location}
                      </div>
                    </div>

                    {/* Host */}
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border-light">
                      <img src={meetup.host.imageUrl} alt={meetup.host.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-label text-ink-secondary">{meetup.host.name}</span>
                      <span className="text-caption text-ink-placeholder">· 모임장</span>
                    </div>

                    {/* Members Progress */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {meetup.memberAvatars.map((avatar, j) => (
                            <img
                              key={j}
                              src={avatar}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover border-[1.5px] border-white"
                            />
                          ))}
                        </div>
                        <span className="text-label text-ink-placeholder">
                          <span className="font-semibold text-primary">{meetup.memberCount}</span>/{meetup.maxMembers}명
                        </span>
                      </div>
                      <div className={`text-label font-semibold px-4 py-1.5 rounded-pill ${
                        isFull
                          ? 'bg-surface-muted text-ink-placeholder'
                          : 'bg-ink text-white'
                      }`}>
                        {isFull ? '마감' : '참여하기'}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-surface-muted rounded-pill overflow-hidden">
                      <div
                        className={`h-full rounded-pill transition-all ${isFull ? 'bg-ink-placeholder' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* FAB Button */}
          <button onClick={() => navigate('/meetup/new')} className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center hover:bg-primary-dark transition-colors z-50">
            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white stroke-2 fill-none">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </>
      )}

      {/* More menu bottom sheet (shared across tabs) */}
      {menuFeedId !== null && (() => {
        const menuFeed = feeds.find(f => f.id === menuFeedId)
        const isMine = menuFeed?.isMine === true
        const iconCls = "w-5 h-5 stroke-ink stroke-2 fill-none"
        const items = isMine
          ? [
              {
                label: '수정하기',
                icon: (
                  <svg viewBox="0 0 24 24" className={iconCls}>
                    <path d="M12 20h9" strokeLinecap="round" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinejoin="round" />
                  </svg>
                ),
                action: () => navigate(`/feed/${menuFeedId}/edit`),
              },
              {
                label: '삭제하기',
                icon: (
                  <svg viewBox="0 0 24 24" className={iconCls}>
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                action: () => setDeleteTarget(menuFeedId),
              },
            ]
          : [
              {
                label: '신고하기',
                icon: (
                  <svg viewBox="0 0 24 24" className={iconCls}>
                    <path d="M4 21V4M4 4h13l-2 5 2 5H4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                action: () => navigate('/report?target=피드'),
              },
              {
                label: '차단하기',
                icon: (
                  <svg viewBox="0 0 24 24" className={iconCls}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M5.6 5.6l12.8 12.8" strokeLinecap="round" />
                  </svg>
                ),
                action: () => setBlockTarget(menuFeed?.authorName || '사용자'),
              },
            ]
        return (
        <div className="fixed inset-0 z-[60] flex items-end" onClick={() => setMenuFeedId(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full bg-surface rounded-t-2xl pb-6 pt-2 animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-ink-disabled rounded-full mx-auto mb-2" />
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.action(); setMenuFeedId(null) }}
                className="w-full px-page py-4 flex items-center gap-3 text-body text-ink hover:bg-surface-subtle"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setMenuFeedId(null)}
              className="w-full px-page py-4 text-center text-body text-ink-secondary border-t border-border-light"
            >
              취소
            </button>
          </div>
        </div>
        )
      })()}

      {/* Comment bottom sheet */}
      {commentFeedId !== null && (
        <div className="fixed inset-0 z-[65] flex items-end" onClick={() => setCommentFeedId(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full bg-surface rounded-t-2xl max-h-[80vh] flex flex-col animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-ink-disabled rounded-full mx-auto mt-2" />
            <h3 className="text-title font-bold text-ink text-center py-3 border-b border-border-light">댓글</h3>
            <div className="flex-1 overflow-y-auto px-page py-3 space-y-4">
              {(commentsMap[commentFeedId] || []).length === 0 ? (
                <div className="text-center py-12 text-ink-tertiary text-body">아직 댓글이 없어요</div>
              ) : (
                (commentsMap[commentFeedId] || []).map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink-disabled flex-shrink-0 flex items-center justify-center text-ink-secondary font-semibold">
                      {c.author.slice(0, 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-body text-ink leading-relaxed">
                        <span className="font-semibold">{c.author}</span> <span>{c.text}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-3 px-page py-3 border-t border-border-light bg-surface">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitComment() }}
                placeholder="댓글 달기..."
                autoFocus
                className="flex-1 text-body text-ink placeholder:text-ink-placeholder bg-transparent focus:outline-none"
              />
              {commentInput.trim().length > 0 && (
                <button onClick={submitComment} className="text-label font-bold text-primary">게시</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-page" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-sm bg-surface rounded-card-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-heading font-bold text-ink mb-2">게시물을 삭제할까요?</h3>
            <p className="text-body text-ink-secondary leading-relaxed mb-5">
              삭제한 게시물은 복구할 수 없으며, 게시물에 달린 좋아요와 댓글도 함께 사라져요.
              정말 삭제하시겠어요?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 bg-surface-muted text-ink font-semibold rounded-card hover:bg-surface-subtle transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert('게시물이 삭제되었어요')
                  setDeleteTarget(null)
                }}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block confirmation modal */}
      {blockTarget !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-page" onClick={() => setBlockTarget(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-sm bg-surface rounded-card-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-heading font-bold text-ink mb-2">{blockTarget}님을 차단할까요?</h3>
            <p className="text-body text-ink-secondary leading-relaxed mb-5">
              차단하면 이 사용자의 피드와 모임이 더 이상 보이지 않으며, 서로 메시지를 주고받을 수 없어요.
              차단은 마이페이지 &gt; 설정에서 언제든 해제할 수 있습니다.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setBlockTarget(null)}
                className="flex-1 py-3 bg-surface-muted text-ink font-semibold rounded-card hover:bg-surface-subtle transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const list: string[] = JSON.parse(localStorage.getItem('blockedUsers') || '[]')
                  if (!list.includes(blockTarget)) list.push(blockTarget)
                  localStorage.setItem('blockedUsers', JSON.stringify(list))
                  alert(`${blockTarget}님을 차단했어요`)
                  setBlockTarget(null)
                }}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors"
              >
                차단하기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Workout Calendar */}
      {showCalendar && (() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const today = now.getDate()
        // mock: 운동한 날짜 (이번 달)
        const workoutDays = new Set([1, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 22, 24, 26, 28])
        const workoutDetails: Record<number, { exercises: number; duration: string; volume: string }> = {
          1: { exercises: 5, duration: '1시간 20분', volume: '8,420kg' },
          3: { exercises: 4, duration: '55분', volume: '맨몸' },
          5: { exercises: 6, duration: '1시간 45분', volume: '12,680kg' },
          7: { exercises: 5, duration: '50분', volume: '3,240kg' },
          8: { exercises: 3, duration: '40분', volume: '맨몸' },
          10: { exercises: 5, duration: '1시간 10분', volume: '7,200kg' },
          12: { exercises: 4, duration: '1시간', volume: '5,600kg' },
          14: { exercises: 6, duration: '1시간 30분', volume: '10,400kg' },
          15: { exercises: 3, duration: '45분', volume: '맨몸' },
          17: { exercises: 5, duration: '1시간 15분', volume: '9,100kg' },
          19: { exercises: 4, duration: '55분', volume: '4,800kg' },
          21: { exercises: 5, duration: '1시간 20분', volume: '8,200kg' },
          22: { exercises: 3, duration: '40분', volume: '맨몸' },
          24: { exercises: 6, duration: '1시간 40분', volume: '11,600kg' },
          26: { exercises: 4, duration: '1시간', volume: '6,400kg' },
          28: { exercises: 5, duration: '1시간 10분', volume: '7,800kg' },
        }
        const weekdays = ['일', '월', '화', '수', '목', '금', '토']
        const cells: (number | null)[] = Array(firstDay).fill(null)
        for (let d = 1; d <= daysInMonth; d++) cells.push(d)
        while (cells.length % 7 !== 0) cells.push(null)
        const totalWorkouts = workoutDays.size
        const streak = (() => { let s = 0; for (let d = today; d >= 1; d--) { if (workoutDays.has(d)) s++; else break } return s })()

        return (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCalendar(false)} />
            <div className="relative w-full max-w-screen-sm max-h-[85vh] bg-surface rounded-t-3xl animate-slide-up overflow-y-auto">
              <div className="sticky top-0 bg-surface z-10 px-page pt-4 pb-2">
                <div className="flex justify-center mb-3">
                  <span className="w-10 h-1 rounded-full bg-ink-disabled" />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-heading font-bold text-ink">
                    {year}년 {month + 1}월
                  </div>
                  <button onClick={() => setShowCalendar(false)} className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink stroke-2 fill-none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-primary-50 rounded-card-lg mb-4">
                  <div className="text-center">
                    <div className="text-title font-extrabold text-primary tabular-nums">{totalWorkouts}</div>
                    <div className="text-caption text-ink-tertiary">이번 달 운동</div>
                  </div>
                  <div className="text-center border-x border-primary/20">
                    <div className="text-title font-extrabold text-primary tabular-nums">{streak}</div>
                    <div className="text-caption text-ink-tertiary">연속 일수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-title font-extrabold text-primary tabular-nums">{Math.round(totalWorkouts / today * 100)}%</div>
                    <div className="text-caption text-ink-tertiary">출석률</div>
                  </div>
                </div>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {weekdays.map(w => (
                    <div key={w} className={`text-center text-caption font-semibold ${w === '일' ? 'text-semantic-like' : w === '토' ? 'text-accent-purple' : 'text-ink-tertiary'}`}>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-page pb-6">
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />
                    const isToday = day === today
                    const worked = workoutDays.has(day)
                    const isFuture = day > today
                    const dayOfWeek = new Date(year, month, day).getDay()
                    return (
                      <div
                        key={i}
                        className={`relative flex flex-col items-center justify-center py-2 rounded-card ${
                          isToday ? 'bg-primary text-white' : worked ? 'bg-primary-50' : ''
                        }`}
                      >
                        <span className={`text-label font-semibold tabular-nums ${
                          isToday ? 'text-white' :
                          isFuture ? 'text-ink-disabled' :
                          dayOfWeek === 0 ? 'text-semantic-like' :
                          dayOfWeek === 6 ? 'text-accent-purple' :
                          'text-ink'
                        }`}>{day}</span>
                        {worked && !isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                        )}
                        {worked && isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5" />
                        )}
                      </div>
                    )
                  })}
                </div>
                {/* Today's detail or recent */}
                <div className="mt-5">
                  <div className="text-label font-bold text-ink mb-2">최근 운동기록</div>
                  <div className="flex flex-col gap-2">
                    {[...workoutDays].filter(d => d <= today).sort((a, b) => b - a).slice(0, 5).map(d => {
                      const detail = workoutDetails[d]
                      if (!detail) return null
                      return (
                        <div key={d} className="flex items-center justify-between p-3 bg-surface-muted rounded-card">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${d === today ? 'bg-primary text-white' : 'bg-primary-50 text-primary'}`}>
                              <span className="text-label font-bold tabular-nums">{d}</span>
                            </div>
                            <div>
                              <div className="text-body font-semibold text-ink">{detail.exercises}종목 · {detail.duration}</div>
                              <div className="text-caption text-ink-tertiary">{detail.volume}</div>
                            </div>
                          </div>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none shrink-0"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Feed Type Selection */}
      {feedTypeModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFeedTypeModal(false)} />
          <div className="relative w-full max-w-screen-sm bg-surface rounded-t-3xl animate-slide-up px-page py-6 pb-10">
            <div className="flex justify-center mb-4">
              <span className="w-10 h-1 rounded-full bg-ink-disabled" />
            </div>
            <div className="text-title font-bold text-ink text-center mb-5">어떤 피드를 작성할까요?</div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setFeedTypeModal(false); navigate('/workout') }}
                className="flex items-center gap-4 p-4 rounded-card-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-primary stroke-2 fill-none">
                    <path d="M6.5 6.5 17.5 17.5M2 12l3-3 3 3-3 3-3-3zM16 22l3-3-3-3-3 3 3 3zM8 8l8 8M22 12l-3 3-3-3 3-3 3 3zM12 2l3 3-3 3-3-3 3-3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-body font-bold text-ink">운동 피드</div>
                  <div className="text-caption text-ink-tertiary">운동기록 · 종목 · 웨어러블 데이터 포함</div>
                </div>
              </button>
              <button
                onClick={() => { setFeedTypeModal(false); navigate('/feed/new?type=running') }}
                className="flex items-center gap-4 p-4 rounded-card-lg border border-border hover:border-accent-green hover:bg-accent-green/5 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-accent-green stroke-2 fill-none">
                    <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM7 21l3-4 2 1 4-7 2 3h3" />
                    <path d="M16 9l-3 4-2-1-3 4" />
                  </svg>
                </div>
                <div>
                  <div className="text-body font-bold text-ink">러닝 피드</div>
                  <div className="text-caption text-ink-tertiary">거리 · 페이스 · 구간기록 · 웨어러블 데이터 포함</div>
                </div>
              </button>
              <button
                onClick={() => { setFeedTypeModal(false); navigate('/feed/new?type=general') }}
                className="flex items-center gap-4 p-4 rounded-card-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-ink-secondary stroke-2 fill-none">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
                <div>
                  <div className="text-body font-bold text-ink">일반 피드</div>
                  <div className="text-caption text-ink-tertiary">사진과 글만 간단하게 공유</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workout / Running Full-Screen Modal */}
      {expandedWorkout !== null && (() => {
        const feed = feeds.find(f => f.id === expandedWorkout)
        if (!feed) return null
        const isRunning = !!feed.running
        const wearable = isRunning ? feed.running!.wearable : feed.workout?.wearable
        if (!wearable) return null
        const zoneTotal = wearable.zoneMinutes.warmup + wearable.zoneMinutes.fatBurn + wearable.zoneMinutes.cardio + wearable.zoneMinutes.peak
        const zones = [
          { key: 'warmup', label: '워밍업', min: wearable.zoneMinutes.warmup, color: 'bg-ink-disabled' },
          { key: 'fatBurn', label: '지방연소', min: wearable.zoneMinutes.fatBurn, color: 'bg-accent-green' },
          { key: 'cardio', label: '유산소', min: wearable.zoneMinutes.cardio, color: 'bg-primary' },
          { key: 'peak', label: '최대', min: wearable.zoneMinutes.peak, color: 'bg-semantic-like' },
        ]
        return (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setExpandedWorkout(null)} />
            <div className="relative w-full max-w-screen-sm max-h-[90vh] bg-black/95 backdrop-blur-md text-white rounded-t-3xl overflow-y-auto animate-slide-up">
              <div className="sticky top-0 flex justify-center pt-3 pb-1 z-10">
                <span className="w-10 h-1 rounded-full bg-white/30" />
              </div>
              <button
                onClick={() => setExpandedWorkout(null)}
                aria-label="닫기"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-lg z-10"
              >
                ✕
              </button>
              <div className="px-5 pt-6 pb-8 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <span className={`inline-flex self-start px-2.5 py-1 rounded-pill text-white text-caption font-bold tracking-widest ${isRunning ? 'bg-accent-green' : 'bg-primary'}`}>
                    {isRunning ? 'RUNNING' : 'WORKOUT'}
                  </span>
                  <div className="flex items-center gap-2 text-body font-semibold text-white">
                    <span>{isRunning ? feed.running!.duration : feed.workout!.duration}</span>
                    <span className="text-white/40">·</span>
                    <span>{feed.authorName}</span>
                  </div>
                </div>

                {/* GPS Route Map (running only) */}
                {isRunning && feed.running!.route && (
                  <RouteMap route={feed.running!.route as number[][]} location={feed.location} />
                )}

                {/* Hero stats card */}
                {isRunning ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 p-5 rounded-card-lg bg-white/5 border border-white/10">
                      <Stat label="거리" value={String(feed.running!.distance)} unit="km" />
                      <Stat label="평균 페이스" value={feed.running!.avgPace} divider />
                      <Stat label="활동 칼로리" value={String(wearable.activeKcal)} unit="kcal" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-card-lg bg-white/5 border border-white/10">
                      {feed.running!.elevation && (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-accent-green stroke-[1.5] fill-none"><path d="m3 20 5-16 4 10 3-6 6 12"/></svg>
                            <span className="text-label font-bold text-white tabular-nums">{feed.running!.elevation.gain}m</span>
                          </div>
                          <div className="text-caption text-white/40">획득 고도</div>
                        </div>
                      )}
                      {feed.running!.avgCadence && (
                        <div className="text-center border-x border-white/10">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-accent-green stroke-[1.5] fill-none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            <span className="text-label font-bold text-white tabular-nums">{feed.running!.avgCadence}</span>
                          </div>
                          <div className="text-caption text-white/40">평균 케이던스</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-accent-green stroke-[1.5] fill-none"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          <span className="text-label font-bold text-white tabular-nums">{feed.running!.duration}</span>
                        </div>
                        <div className="text-caption text-white/40">운동 시간</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-3 gap-3 p-5 rounded-card-lg bg-white/5 border border-white/10">
                    <Stat label="총 볼륨" value={feed.workout!.totalVolume.toLocaleString()} unit="kg" />
                    <Stat label="세트" value={String(feed.workout!.totalSets)} divider />
                    <Stat label="활동 칼로리" value={String(wearable.activeKcal)} unit="kcal" />
                  </div>
                )}

                {/* Splits (running) or Exercises (workout) */}
                {isRunning ? (
                  <div className="rounded-card-lg bg-white/5 border border-white/10 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                      <span className="text-label font-semibold text-white">구간 기록</span>
                      <span className="text-caption text-white/50 tabular-nums">{feed.running!.splits.length}km</span>
                    </div>
                    <div className="p-3">
                      {(() => {
                        const allSec = feed.running!.splits.map(s => {
                          const m = s.pace.match(/(\d+)'(\d+)/); return m ? Number(m[1]) * 60 + Number(m[2]) : 0
                        })
                        const minSec = Math.min(...allSec), maxSec = Math.max(...allSec)
                        return feed.running!.splits.map(split => {
                          const cur = (() => { const m = split.pace.match(/(\d+)'(\d+)/); return m ? Number(m[1]) * 60 + Number(m[2]) : 0 })()
                          const ratio = maxSec === minSec ? 1 : (maxSec - cur) / (maxSec - minSec)
                          const width = 30 + ratio * 70
                          return (
                            <div key={split.km} className="grid grid-cols-[40px_1fr_60px] gap-3 items-center py-1.5">
                              <span className="text-caption text-white/60 tabular-nums">{split.km}km</span>
                              <div className="h-2.5 flex items-center bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-accent-green" style={{ width: `${width}%` }} />
                              </div>
                              <span className="text-caption font-bold text-white text-right tabular-nums">{split.pace}</span>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                ) : (
                  <div>
                    <SectionLabel>종목</SectionLabel>
                    <div className="flex flex-col gap-2">
                      {feed.workout!.exercises.map((ex, i) => (
                        <div key={i} className="p-4 rounded-card-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-primary text-white text-caption font-bold flex items-center justify-center shrink-0 tabular-nums">{i + 1}</span>
                              <div className="text-body font-semibold text-white truncate">{ex.name}</div>
                            </div>
                            <span className="text-caption text-white/50 tabular-nums shrink-0 ml-2">{ex.sets.length}세트</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {ex.sets.map((s, si) => (
                              <div key={si} className="grid grid-cols-[20px_1fr_1fr] gap-3 py-1.5 text-label tabular-nums border-t border-white/5 first:border-t-0">
                                <span className="text-white/40 text-center">{si + 1}</span>
                                <span className="text-white font-semibold">{s.weight === 0 ? '맨몸' : `${s.weight} kg`}</span>
                                <span className="text-white/70">{s.reps} 회</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wearable */}
                <div className="p-5 rounded-card-lg bg-gradient-to-br from-accent-purple/20 to-white/5 border border-accent-purple/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      <span className="text-label font-bold text-white">{wearable.device}</span>
                    </div>
                    <span className="text-caption text-white/50">실시간 동기화</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <div className="text-caption text-white/50 mb-1">평균 심박</div>
                      <div className="text-heading font-extrabold leading-none tabular-nums">
                        {wearable.avgHr}<span className="text-label font-semibold text-white/50 ml-1">bpm</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-caption text-white/50 mb-1">최대 심박</div>
                      <div className="text-heading font-extrabold leading-none text-semantic-like tabular-nums">
                        {wearable.maxHr}<span className="text-label font-semibold text-white/50 ml-1">bpm</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-caption text-white/50">심박존 분포</span>
                    <span className="text-caption text-white/40 tabular-nums">{zoneTotal}분</span>
                  </div>
                  <div className="flex h-2 rounded-pill overflow-hidden mb-2.5 bg-white/5">
                    {zones.map(z => (
                      <div key={z.key} className={z.color} style={{ width: `${(z.min / zoneTotal) * 100}%` }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-caption">
                    {zones.map(z => (
                      <div key={z.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${z.color}`} />
                          <span className="text-white/70">{z.label}</span>
                        </div>
                        <span className="text-white/50 tabular-nums">{z.min}분</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </PageLayout>
  )
}
