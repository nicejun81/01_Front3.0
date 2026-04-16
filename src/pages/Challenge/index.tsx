import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconCalendarCheck, IconChevronRight } from '../../components/Icons'

const challenges = [
  {
    id: 'attendance-membership',
    category: '출석',
    title: '4월 회원권 출석 챌린지',
    description: '매일 출석하고 리워드를 받아보세요',
    progress: { current: 15, total: 30 },
    reward: '최대 5,000P + 짐백',
    gradient: 'from-primary to-accent-purple',
    href: '/attendance',
    status: 'active' as const,
  },
  {
    id: 'attendance-lesson',
    category: '출석',
    title: '4월 바레톤 출석 챌린지',
    description: '바레톤 수업 출석 도전',
    progress: { current: 8, total: 20 },
    reward: '최대 2,000P + 폼롤러',
    gradient: 'from-accent-purple to-primary-light',
    href: '/attendance',
    status: 'active' as const,
  },
  {
    id: 'bulk-up',
    category: '운동',
    title: '30일 벌크업 챌린지',
    description: '30일 동안 매일 근력 운동 완료하기',
    progress: { current: 12, total: 30 },
    reward: '10,000P + 프로틴 1통',
    gradient: 'from-[#F97316] to-[#fb923c]',
    href: '/challenge/bulk-up',
    status: 'active' as const,
  },
  {
    id: 'diet-30',
    category: '식단',
    title: '30일 다이어트 챌린지',
    description: '매일 식단 기록하고 목표 달성하기',
    progress: { current: 0, total: 30 },
    reward: '5,000P',
    gradient: 'from-[#10B981] to-[#4ade9f]',
    href: '/challenge/diet',
    status: 'upcoming' as const,
  },
  {
    id: 'morning-workout',
    category: '운동',
    title: '미라클 모닝 챌린지',
    description: '오전 7시 이전 운동 인증 20회',
    progress: { current: 20, total: 20 },
    reward: '3,000P',
    gradient: 'from-[#06B6D4] to-[#22d3ee]',
    href: '/challenge/morning',
    status: 'completed' as const,
  },
]

const STATUS_LABEL: Record<string, { text: string; style: string }> = {
  active: { text: '진행중', style: 'bg-primary text-white' },
  upcoming: { text: '시작전', style: 'bg-ink-placeholder text-white' },
  completed: { text: '완료', style: 'bg-ink-disabled text-ink-tertiary' },
}

export const ChallengePage = () => {
  const navigate = useNavigate()

  const active = challenges.filter(c => c.status === 'active')
  const upcoming = challenges.filter(c => c.status === 'upcoming')
  const completed = challenges.filter(c => c.status === 'completed')

  const ChallengeCard = ({ c }: { c: typeof challenges[0] }) => {
    const pct = c.progress.total > 0 ? Math.round((c.progress.current / c.progress.total) * 100) : 0
    const statusInfo = STATUS_LABEL[c.status]
    return (
      <button
        onClick={() => navigate(c.href)}
        className="w-full text-left bg-surface rounded-card-lg border border-border p-card-lg hover:border-ink-placeholder transition-colors"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-card flex items-center justify-center bg-gradient-to-br ${c.gradient}`}>
              <IconCalendarCheck className="w-4.5 h-4.5 stroke-white stroke-[1.5]" />
            </div>
            <div>
              <span className="text-caption text-ink-tertiary">{c.category}</span>
              <h3 className="text-body font-bold text-ink">{c.title}</h3>
            </div>
          </div>
          <span className={`px-2 py-0.5 text-caption font-bold rounded ${statusInfo.style}`}>{statusInfo.text}</span>
        </div>
        <p className="text-label text-ink-secondary mb-3">{c.description}</p>
        {c.status !== 'upcoming' && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-caption text-ink-tertiary">{c.progress.current}/{c.progress.total}일</span>
              <span className="text-caption font-bold text-primary">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${c.gradient}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-caption text-ink-placeholder">리워드: {c.reward}</span>
          <IconChevronRight className="w-4 h-4 stroke-ink-disabled stroke-[1.5]" />
        </div>
      </button>
    )
  }

  return (
    <PageLayout header={<SubPageHeader title="챌린지" showChat />} noPadding>
      {/* 진행중 */}
      {active.length > 0 && (
        <div className="px-page py-section">
          <h3 className="text-body font-bold text-ink mb-3">참여중인 챌린지 <span className="text-primary">{active.length}</span></h3>
          <div className="flex flex-col gap-3">
            {active.map(c => <ChallengeCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      <div className="h-[6px] bg-surface-muted" />

      {/* 시작전 */}
      {upcoming.length > 0 && (
        <div className="px-page py-section">
          <h3 className="text-body font-bold text-ink mb-3">신규 챌린지</h3>
          <div className="flex flex-col gap-3">
            {upcoming.map(c => <ChallengeCard key={c.id} c={c} />)}
          </div>
        </div>
      )}

      {upcoming.length > 0 && <div className="h-[6px] bg-surface-muted" />}

      {/* 완료 */}
      {completed.length > 0 && (
        <div className="px-page py-section">
          <h3 className="text-body font-bold text-ink mb-3">완료한 챌린지</h3>
          <div className="flex flex-col gap-3">
            {completed.map(c => <ChallengeCard key={c.id} c={c} />)}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
