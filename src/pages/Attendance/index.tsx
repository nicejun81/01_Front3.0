import { useState } from 'react'
import { PageLayout, SubPageHeader } from '../../components'
import { IconCheck, IconCalendarCheck } from '../../components/Icons'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const DAYS_IN_MONTH = 30
const TODAY = 18

// 회원권 출석 데이터
const MEMBERSHIP_DATA = {
  label: '회원권',
  title: '4월 회원권 출석 챌린지',
  checkedDays: [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17],
  rewards: [
    { day: 7, reward: '500P', claimed: true, imageUrl: '' },
    { day: 10, reward: '프로틴 바', claimed: true, imageUrl: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=100&h=100&fit=crop' },
    { day: 14, reward: '1,000P', claimed: true, imageUrl: '' },
    { day: 20, reward: '쉐이커 보틀', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop' },
    { day: 21, reward: '2,000P', claimed: false, imageUrl: '' },
    { day: 25, reward: '운동 타월', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=100&h=100&fit=crop' },
    { day: 30, reward: '5,000P + 짐백', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' },
  ],
}

// 레슨권 서브탭 데이터
const LESSON_SUBS = [
  {
    label: '바레톤',
    title: '4월 바레톤 출석 챌린지',
    checkedDays: [1, 3, 5, 8, 10, 12, 15, 17],
    rewards: [
      { day: 4, reward: '300P', claimed: true, imageUrl: '' },
      { day: 8, reward: '필라테스 양말', claimed: true, imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=100&h=100&fit=crop' },
      { day: 12, reward: '1,000P', claimed: false, imageUrl: '' },
      { day: 16, reward: '폼롤러', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=100&h=100&fit=crop' },
      { day: 20, reward: '2,000P', claimed: false, imageUrl: '' },
    ],
  },
  {
    label: '히트35',
    title: '4월 히트35 출석 챌린지',
    checkedDays: [2, 4, 7, 9, 14, 16],
    rewards: [
      { day: 5, reward: '300P', claimed: true, imageUrl: '' },
      { day: 10, reward: '스포츠 타월', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=100&h=100&fit=crop' },
      { day: 15, reward: '1,500P', claimed: false, imageUrl: '' },
      { day: 20, reward: '프로틴 쉐이크', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=100&h=100&fit=crop' },
    ],
  },
  {
    label: '짐그라운드',
    title: '4월 짐그라운드 출석 챌린지',
    checkedDays: [1, 2, 4, 7, 8, 10, 11, 14, 15, 17],
    rewards: [
      { day: 5, reward: '500P', claimed: true, imageUrl: '' },
      { day: 10, reward: '운동 장갑', claimed: true, imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop' },
      { day: 15, reward: '1,500P', claimed: false, imageUrl: '' },
      { day: 20, reward: '짐백', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' },
      { day: 25, reward: '3,000P', claimed: false, imageUrl: '' },
    ],
  },
  {
    label: '트리온',
    title: '4월 트리온 출석 챌린지',
    checkedDays: [3, 5, 10, 12, 17],
    rewards: [
      { day: 4, reward: '200P', claimed: true, imageUrl: '' },
      { day: 8, reward: '스트레칭 밴드', claimed: false, imageUrl: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=100&h=100&fit=crop' },
      { day: 12, reward: '1,000P', claimed: false, imageUrl: '' },
      { day: 18, reward: '레슨 1회 추가', claimed: false, imageUrl: '' },
    ],
  },
]

const LESSON_DATA = {
  label: '레슨권',
  subs: LESSON_SUBS,
}

const TABS = [LESSON_DATA, MEMBERSHIP_DATA] as const

export const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [lessonSubTab, setLessonSubTab] = useState(0)

  const isLesson = activeTab === 0
  const data = isLesson ? LESSON_SUBS[lessonSubTab] : MEMBERSHIP_DATA
  const actualCount = data.checkedDays.length

  return (
    <PageLayout
      header={<SubPageHeader title="출석 챌린지" showChat />}
    >
      {/* 탭 */}
      <div className="flex bg-surface-muted rounded-card p-1 mb-6">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 text-label font-semibold rounded-card transition-all ${
              activeTab === i
                ? 'bg-surface text-ink shadow-card'
                : 'text-ink-placeholder'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 레슨권 서브탭 */}
      {isLesson && (
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {LESSON_SUBS.map((sub, i) => (
            <button
              key={sub.label}
              onClick={() => setLessonSubTab(i)}
              className={`px-4 py-2 rounded-pill text-label font-semibold whitespace-nowrap transition-all ${
                lessonSubTab === i
                  ? 'bg-primary text-white shadow-card'
                  : 'bg-surface-muted text-ink-tertiary'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* 상단 요약 카드 */}
      <div className={`rounded-card-lg p-5 text-white mb-6 ${
        isLesson
          ? 'bg-gradient-to-br from-accent-purple to-primary'
          : 'bg-gradient-to-br from-primary to-accent-purple'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <IconCalendarCheck className="w-5 h-5 stroke-white stroke-[1.5]" />
          <span className="text-label font-bold opacity-90">{data.title}</span>
        </div>
        <p className="text-display leading-tight mb-4">
          {actualCount}일<span className="text-body font-normal opacity-80"> / {DAYS_IN_MONTH}일</span>
        </p>

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
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className={`text-center text-caption font-semibold ${day === '일' ? 'text-semantic-like' : day === '토' ? 'text-accent-purple' : 'text-ink-tertiary'}`}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1.5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map((day) => {
              const isChecked = data.checkedDays.includes(day)
              const isToday = day === TODAY
              const isFuture = day > TODAY
              const accentColor = isLesson ? 'bg-accent-purple' : 'bg-primary'
              const todayBorder = isLesson ? 'border-primary text-primary' : 'border-accent-purple text-accent-purple'

              return (
                <div key={day} className="flex justify-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-label transition-all ${
                      isChecked
                        ? `${accentColor} text-white`
                        : isToday
                          ? `border-2 ${todayBorder} font-bold`
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
          {/* 수령 완료 */}
          {data.rewards.filter(m => m.claimed).length > 0 && (
            <div className="mb-2">
              <p className="text-caption font-semibold text-ink-placeholder mb-2">수령 완료</p>
              <div className="flex flex-col gap-2">
                {data.rewards.filter(m => m.claimed).map((milestone) => {
                  const isMembership = !isLesson
                  return (
                    <div
                      key={milestone.day}
                      className="flex items-center gap-4 p-3.5 rounded-card-lg bg-surface-muted/60"
                    >
                      {milestone.imageUrl ? (
                        <div className="w-10 h-10 rounded-card flex-shrink-0 overflow-hidden opacity-50">
                          <img src={milestone.imageUrl} alt={milestone.reward} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-caption bg-ink-disabled/30 text-ink-placeholder">
                          {milestone.day}일
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-label font-semibold text-ink-tertiary line-through">{milestone.reward}</p>
                        <p className="text-caption text-ink-placeholder">{milestone.day}일 출석 달성</p>
                      </div>
                      <span className={`text-caption font-semibold flex items-center gap-1 ${isMembership ? 'text-accent-purple' : 'text-primary'}`}>
                        <IconCheck className="w-3.5 h-3.5 stroke-current stroke-2" />
                        완료
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 수령 가능 */}
          {data.rewards.filter(m => !m.claimed && actualCount >= m.day).length > 0 && (
            <div className="mb-2">
              <p className={`text-caption font-semibold mb-2 ${isLesson ? 'text-accent-purple' : 'text-primary'}`}>수령 가능</p>
              <div className="flex flex-col gap-2">
                {data.rewards.filter(m => !m.claimed && actualCount >= m.day).map((milestone) => {
                  const isMembership = !isLesson
                  return (
                    <div
                      key={milestone.day}
                      className={`flex items-center gap-4 p-4 rounded-card-lg border-2 transition-all ${
                        isMembership
                          ? 'border-accent-purple bg-accent-purple/5'
                          : 'border-primary bg-primary-50'
                      }`}
                    >
                      {milestone.imageUrl ? (
                        <div className={`w-12 h-12 rounded-card flex-shrink-0 overflow-hidden border-2 ${isMembership ? 'border-accent-purple' : 'border-primary'}`}>
                          <img src={milestone.imageUrl} alt={milestone.reward} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-label text-white ${isMembership ? 'bg-accent-purple' : 'bg-primary'}`}>
                          {milestone.day}일
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-label font-semibold text-ink">{milestone.reward}</p>
                        <p className="text-caption text-ink-placeholder">{milestone.day}일 출석 달성</p>
                      </div>
                      <button className={`px-3 py-1.5 text-white text-caption font-bold rounded-pill ${isMembership ? 'bg-accent-purple' : 'bg-primary'}`}>
                        받기
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 미달성 */}
          {data.rewards.filter(m => !m.claimed && actualCount < m.day).length > 0 && (
            <div>
              <p className="text-caption font-semibold text-ink-placeholder mb-2">다음 리워드</p>
              <div className="flex flex-col gap-2">
                {data.rewards.filter(m => !m.claimed && actualCount < m.day).map((milestone) => (
                  <div
                    key={milestone.day}
                    className="flex items-center gap-4 p-4 rounded-card-lg border border-border bg-surface"
                  >
                    {milestone.imageUrl ? (
                      <div className="w-12 h-12 rounded-card flex-shrink-0 overflow-hidden border-2 border-border opacity-50">
                        <img src={milestone.imageUrl} alt={milestone.reward} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-label bg-surface-muted text-ink-placeholder">
                        {milestone.day}일
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-label font-semibold text-ink-tertiary">{milestone.reward}</p>
                      <p className="text-caption text-ink-placeholder">{milestone.day}일 출석 달성</p>
                    </div>
                    <span className="text-caption text-ink-disabled">
                      {milestone.day - actualCount}일 남음
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
