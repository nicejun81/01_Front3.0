import { PageLayout, SubPageHeader } from '../../components'
import { IconCheck, IconCalendarCheck } from '../../components/Icons'

const DAYS_IN_MONTH = 30
const TODAY = 18 // 오늘이 18일차라고 가정
const CHECKED_DAYS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17] // 출석한 날들
const REWARD_MILESTONES = [
  { day: 7, reward: '500P', claimed: true, imageUrl: '' },
  { day: 10, reward: '프로틴 바', claimed: true, imageUrl: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=100&h=100&fit=crop' },
  { day: 14, reward: '1,000P', claimed: true, imageUrl: '' },
  { day: 20, reward: '쉐이커 보틀', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop' },
  { day: 21, reward: '2,000P', claimed: false, imageUrl: '' },
  { day: 25, reward: '운동 타월', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=100&h=100&fit=crop' },
  { day: 30, reward: '5,000P + 짐백', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' },
]

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export const AttendancePage = () => {
  const actualCount = CHECKED_DAYS.length

  return (
    <PageLayout
      header={<SubPageHeader title="출석 챌린지" showChat />}
    >
      {/* 상단 요약 카드 */}
      <div className="bg-gradient-to-br from-accent-purple to-primary rounded-card-lg p-5 text-white mb-6">
        <div className="flex items-center gap-2 mb-1">
          <IconCalendarCheck className="w-5 h-5 stroke-white stroke-[1.5]" />
          <span className="text-label font-bold opacity-90">4월 출석 챌린지</span>
        </div>
        <p className="text-display leading-tight mb-4">
          {actualCount}일<span className="text-body font-normal opacity-80"> / {DAYS_IN_MONTH}일</span>
        </p>

        {/* 프로그레스 바 */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(actualCount / DAYS_IN_MONTH) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-caption opacity-70">
          <span>시작</span>
          <span>목표 {DAYS_IN_MONTH}일</span>
        </div>
      </div>

      {/* QR 출석 스캔 */}
      <button
        onClick={() => window.dispatchEvent(new Event('open-qr-scanner'))}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-card-lg bg-primary text-white font-bold text-body mb-6 active:scale-[0.98] hover:bg-primary-dark shadow-elevated transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white stroke-2 fill-none">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="3" height="3" />
          <line x1="21" y1="14" x2="21" y2="21" />
          <line x1="14" y1="21" x2="21" y2="21" />
        </svg>
        QR 스캔으로 출석하기
      </button>

      {/* 캘린더 그리드 */}
      <div className="mb-6">
        <h2 className="text-title mb-3">출석 현황</h2>
        <div className="bg-surface rounded-card-lg border border-border p-4">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className={`text-center text-caption font-semibold ${day === '일' ? 'text-semantic-like' : day === '토' ? 'text-accent-purple' : 'text-ink-tertiary'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 - 1일이 화요일 시작 */}
          <div className="grid grid-cols-7 gap-y-1.5">
            {/* 빈 칸 (1일이 화요일이므로 2칸 비움) */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((day) => {
              const isChecked = CHECKED_DAYS.includes(day)
              const isToday = day === TODAY
              const isFuture = day > TODAY

              return (
                <div key={day} className="flex justify-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-label transition-all ${
                      isChecked
                        ? 'bg-accent-purple text-white'
                        : isToday
                          ? 'border-2 border-primary text-primary font-bold'
                          : isFuture
                            ? 'text-ink-disabled'
                            : 'text-ink-tertiary'
                    }`}
                  >
                    {isChecked ? (
                      <IconCheck className="w-4 h-4 stroke-white stroke-[2.5]" />
                    ) : (
                      day
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 리워드 마일스톤 */}
      <div className="mb-6">
        <h2 className="text-title mb-3">출석 리워드</h2>
        <div className="flex flex-col gap-3">
          {REWARD_MILESTONES.map((milestone) => {
            const isReached = actualCount >= milestone.day

            return (
              <div
                key={milestone.day}
                className={`flex items-center gap-4 p-4 rounded-card-lg border transition-all ${
                  isReached
                    ? 'border-accent-purple bg-accent-purple/5'
                    : 'border-border bg-surface'
                }`}
              >
                {/* 날짜 뱃지 / 상품 이미지 */}
                {milestone.imageUrl ? (
                  <div className={`w-12 h-12 rounded-card flex-shrink-0 overflow-hidden border-2 ${isReached ? 'border-accent-purple' : 'border-border opacity-60'}`}>
                    <img src={milestone.imageUrl} alt={milestone.reward} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-label ${
                      isReached
                        ? 'bg-accent-purple text-white'
                        : 'bg-surface-muted text-ink-placeholder'
                    }`}
                  >
                    {milestone.day}일
                  </div>
                )}

                {/* 리워드 정보 */}
                <div className="flex-1 min-w-0">
                  <p className={`text-label font-semibold ${isReached ? 'text-ink' : 'text-ink-tertiary'}`}>
                    {milestone.reward}
                  </p>
                  <p className="text-caption text-ink-placeholder">
                    {milestone.day}일 연속 출석 달성
                  </p>
                </div>

                {/* 상태 */}
                {milestone.claimed ? (
                  <span className="text-caption font-semibold text-accent-purple flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5 stroke-current stroke-2" />
                    수령완료
                  </span>
                ) : isReached ? (
                  <button className="px-3 py-1.5 bg-accent-purple text-white text-caption font-bold rounded-pill">
                    받기
                  </button>
                ) : (
                  <span className="text-caption text-ink-disabled">
                    {milestone.day - actualCount}일 남음
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 안내 */}
      <div className="bg-surface-muted rounded-card-lg p-4 text-caption text-ink-tertiary leading-relaxed">
        <p className="font-semibold text-ink-secondary mb-1">안내사항</p>
        <ul className="list-disc pl-4 flex flex-col gap-0.5">
          <li>매일 1회 출석 체크가 가능합니다.</li>
          <li>출석은 자정(00:00) 기준으로 초기화됩니다.</li>
          <li>리워드는 달성 후 30일 이내 수령해야 합니다.</li>
          <li>부정 출석 시 리워드가 회수될 수 있습니다.</li>
        </ul>
      </div>
    </PageLayout>
  )
}
