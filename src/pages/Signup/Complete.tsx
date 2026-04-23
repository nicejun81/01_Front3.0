import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout } from '../../components'

const CONFETTI = [
  { left: '8%',  top: '12%', bg: 'bg-primary',        size: 'w-2 h-2',   rotate: '' },
  { left: '22%', top: '4%',  bg: 'bg-[#FFCE3D]',      size: 'w-1.5 h-1.5', rotate: '' },
  { left: '78%', top: '8%',  bg: 'bg-[#5AB8FF]',      size: 'w-2 h-2',   rotate: '' },
  { left: '92%', top: '20%', bg: 'bg-primary/70',     size: 'w-1.5 h-1.5', rotate: '' },
  { left: '14%', top: '34%', bg: 'bg-[#FFCE3D]',      size: 'w-1.5 h-1.5', rotate: '' },
  { left: '85%', top: '40%', bg: 'bg-primary',        size: 'w-1 h-1',   rotate: '' },
  { left: '50%', top: '2%',  bg: 'bg-[#5AB8FF]/80',   size: 'w-1.5 h-1.5', rotate: '' },
  { left: '36%', top: '22%', bg: 'bg-primary/50',     size: 'w-1 h-1',   rotate: '' },
]

const NEXT_STEPS = [
  { emoji: '🏋️', title: '첫 운동 기록하기', desc: '오늘의 운동을 손쉽게 남겨보세요', to: '/workout' },
  { emoji: '📍', title: '가까운 지점 찾기', desc: '방문할 지점을 내 정보로 저장', to: '/branch' },
  { emoji: '👥', title: '운동 모임 참여하기', desc: '취향 맞는 크루와 함께해요', to: '/activity' },
] as const

export const SignupCompletePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name')?.trim() || '회원'

  return (
    <PageLayout hideBottomNav noPadding>
      <div className="min-h-dvh flex flex-col bg-surface">
        {/* 히어로 */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface to-surface pt-14 pb-8 px-page">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-8 top-24 w-28 h-28 rounded-full bg-[#FFCE3D]/20 blur-2xl pointer-events-none" />

          {/* 컨페티 점들 */}
          <div className="absolute inset-0 pointer-events-none">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className={`absolute rounded-full ${c.bg} ${c.size}`}
                style={{ left: c.left, top: c.top }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-110 animate-pulse" />
              <div className="relative w-[88px] h-[88px] rounded-full bg-primary flex items-center justify-center shadow-elevated ring-8 ring-primary/10">
                <svg viewBox="0 0 24 24" className="w-11 h-11 stroke-white stroke-[3] fill-none">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h1 className="text-display font-extrabold text-ink mt-6 leading-tight">
              가입을 축하해요 🎉
            </h1>
            <p className="text-body text-ink-secondary mt-2 leading-snug">
              <span className="font-bold text-ink">{name}</span>님, 바디채널과 함께<br />
              오늘의 운동을 기록해 볼까요?
            </p>
          </div>
        </div>

        {/* 가입 축하 혜택 카드 */}
        <div className="px-page -mt-2">
          <div className="relative overflow-hidden rounded-card-lg bg-ink text-white p-5 shadow-elevated">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/30 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-card bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-[22px]" role="img" aria-label="gift">🎁</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption text-white/60">신규 회원 축하 혜택</p>
                <p className="text-title font-extrabold mt-0.5 truncate">
                  웰컴 쿠폰 <span className="text-primary">10,000원</span> 지급
                </p>
              </div>
              <button
                onClick={() => navigate('/coupon')}
                className="flex-shrink-0 px-3 py-1.5 rounded-pill bg-white/15 hover:bg-white/25 text-caption font-bold transition-colors"
              >
                받기
              </button>
            </div>
          </div>
        </div>

        {/* 다음 할 일 */}
        <div className="px-page mt-6">
          <p className="text-label font-bold text-ink-tertiary mb-2.5">지금 해볼 수 있어요</p>
          <ul className="flex flex-col gap-2">
            {NEXT_STEPS.map(step => (
              <li key={step.title}>
                <button
                  onClick={() => navigate(step.to)}
                  className="w-full flex items-center gap-3.5 p-4 bg-surface border border-border-light rounded-card-lg hover:border-primary/40 hover:shadow-elevated active:scale-[0.99] transition-all text-left"
                >
                  <div className="w-11 h-11 rounded-card bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[20px]" role="img">{step.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-bold text-ink truncate">{step.title}</p>
                    <p className="text-caption text-ink-tertiary mt-0.5 truncate">{step.desc}</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-placeholder stroke-[1.5] fill-none flex-shrink-0">
                    <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 하단 CTA */}
        <div className="flex-1" />
        <div className="px-page pt-4 pb-8 sticky bottom-0 bg-gradient-to-t from-surface via-surface to-transparent pt-6">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all shadow-elevated"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
