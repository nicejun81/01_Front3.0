import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader, ProfileHeader } from '../../components'
import {
  IconChevronRight,
  IconCalendarCheck,
  IconShield,
  IconMessage,
  IconInfo,
  IconUser,
  IconUserPlus,
  IconStar,
} from '../../components/Icons'

/* ── 프로필 탭 데이터 (인스타그램 스타일) ── */
const profileStats = [
  { value: '24', label: '게시물' },
  { value: '1,283', label: '팔로워' },
  { value: '486', label: '팔로잉' },
]

const profilePosts = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=300&h=300&fit=crop',
]

/* ── 마이 탭 데이터 ── */
/* walletStats → 각 페이지로 이동 (/wallet/cash, /wallet/point, /wallet/coupon) */

const MEMBERSHIP_TABS = ['이용중', '미사용', '사용완료'] as const

const memberships = [
  {
    id: 1, status: 'active', statusLabel: '이용중', tab: '이용중' as const,
    name: '3개월 멤버십', gym: '바디채널 강남점',
    info: [{ label: '잔여일', value: '67일' }, { label: '유효기간', value: '2025.03.15' }],
  },
  {
    id: 2, status: 'expiring', statusLabel: '만료임박', tab: '이용중' as const,
    name: 'PT 20회 패키지', gym: '바디채널 강남점',
    info: [{ label: '잔여횟수', value: '3회' }, { label: '유효기간', value: '2025.01.20' }],
  },
  {
    id: 3, status: 'paused', statusLabel: '일시정지', tab: '미사용' as const,
    name: 'GX 무제한 회원권', gym: '바디채널 강남점',
    info: [{ label: '정지기간', value: '14일' }, { label: '재개일', value: '2025.01.20' }],
  },
  {
    id: 5, status: 'active', statusLabel: '미사용', tab: '미사용' as const,
    name: '바레톤 10회 패키지', gym: '바디채널 강남점',
    info: [{ label: '잔여횟수', value: '10회' }, { label: '유효기간', value: '2025.06.30' }],
  },
  {
    id: 4, status: 'expired', statusLabel: '만료됨', tab: '사용완료' as const,
    name: '1개월 멤버십', gym: '바디채널 강남점',
    info: [{ label: '만료일', value: '2024.12.01' }],
  },
  {
    id: 6, status: 'expired', statusLabel: '사용완료', tab: '사용완료' as const,
    name: 'PT 10회 패키지', gym: '바디채널 강남점',
    info: [{ label: '완료일', value: '2024.11.15' }],
  },
]

const myMeetups = [
  {
    id: 1,
    title: '강남 러닝크루',
    category: '러닝',
    schedule: '매주 토요일 오전 7시',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    role: '멤버',
  },
  {
    id: 2,
    title: '모닝 바레톤 클럽',
    category: '바레톤',
    schedule: '매주 수/금 오전 6시',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    role: '모임장',
  },
]


const statusStyles: Record<string, string> = {
  active: 'bg-ink text-white',
  expiring: 'bg-surface border-2 border-primary text-ink',
  paused: 'bg-surface border-2 border-ink-placeholder text-ink',
  expired: 'bg-surface-muted text-ink-secondary',
}

const statusBadgeStyles: Record<string, string> = {
  active: 'bg-primary text-white',
  expiring: 'bg-primary text-white',
  paused: 'bg-ink-secondary text-white',
  expired: 'bg-ink-placeholder text-white',
}

export const MyPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'profile' | 'my'>(searchParams.get('tab') === 'profile' ? 'profile' : 'my')
  const [membershipTab, setMembershipTab] = useState<typeof MEMBERSHIP_TABS[number]>('이용중')
  const switchTab = (tab: 'profile' | 'my') => {
    setActiveTab(tab)
    setSearchParams(tab === 'my' ? {} : { tab }, { replace: true })
  }
  const [reservations, setReservations] = useState<{ id: number; trainer: string; lesson: string; time: string; date: string; dateKey?: string; gym: string }[]>(() => {
    const saved: { id: number; trainer: string; lesson: string; time: string; date: string; gym: string }[] = JSON.parse(localStorage.getItem('reservations') || '[]')
    // mock 데이터가 아닌 실제 예약이 여러 날짜에 걸쳐 있으면 그대로 사용
    const uniqueDates = new Set(saved.map(r => r.date))
    if (uniqueDates.size > 1) return saved
    const dn = ['일','월','화','수','목','금','토']
    const mock = [
      { offset: -5, trainer: '한동훈 강사', lesson: '히트35', time: '18:00', gym: '바디채널 강남점' },
      { offset: -3, trainer: '최강민 강사', lesson: 'PT', time: '09:00', gym: '바디채널 강남점' },
      { offset: -1, trainer: '박지영 강사', lesson: '바레톤', time: '14:00', gym: '바디채널 강남점' },
      { offset: 0, trainer: '최강민 강사', lesson: 'PT', time: '15:00', gym: '바디채널 강남점' },
      { offset: 0, trainer: '박지영 강사', lesson: '바레톤', time: '19:30', gym: '바디채널 강남점' },
      { offset: 1, trainer: '이준혁 강사', lesson: '짐그라운드', time: '11:00', gym: '바디채널 강남점' },
      { offset: 2, trainer: '한동훈 강사', lesson: '히트35', time: '18:00', gym: '바디채널 역삼점' },
      { offset: 3, trainer: '최강민 강사', lesson: 'PT', time: '09:00', gym: '바디채널 강남점' },
      { offset: 5, trainer: '박지영 강사', lesson: '바레톤', time: '14:00', gym: '바디채널 강남점' },
      { offset: 7, trainer: '정서연 강사', lesson: 'PT', time: '13:00', gym: '바디채널 서초점' },
      { offset: 10, trainer: '이준혁 강사', lesson: '짐그라운드', time: '20:00', gym: '바디채널 강남점' },
    ].map((m, i) => {
      const d = new Date(); d.setDate(d.getDate() + m.offset)
      return { id: Date.now() + i, trainer: m.trainer, lesson: m.lesson, time: m.time, gym: m.gym, date: `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일(${dn[d.getDay()]})` }
    })
    localStorage.setItem('reservations', JSON.stringify(mock))
    return mock
  })
  const [reserveDateIdx, setReserveDateIdx] = useState(-1) // -1 = 아직 초기화 안됨, 오늘로 자동 설정
  const selectedDateRef = useRef<HTMLButtonElement | null>(null)

  // 선택된 날짜 탭을 가운데로 자동 스크롤 (오늘이 끝에 있어도 보이게)
  useEffect(() => {
    if (selectedDateRef.current) {
      selectedDateRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' })
    }
  }, [reserveDateIdx, activeTab])

  const header = (
    <SubPageHeader
      title="마이페이지"
      showChat
    >
      <div className="flex">
        {([{ key: 'my', label: '마이' }, { key: 'profile', label: '프로필' }] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`flex-1 py-3 text-body font-semibold text-center border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'text-ink border-ink'
                : 'text-ink-placeholder border-transparent hover:text-ink-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </SubPageHeader>
  )

  return (
    <PageLayout header={header} noPadding>
      {activeTab === 'profile' ? (
        <>
          <ProfileHeader
            imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face"
            name="김피트"
            verified
            bio={`바디채널 강남점 💪 3개월째 운동중\n매일 아침 6시 기상 | PT + 바레톤 | 체중 -8kg 달성`}
            stats={profileStats.map(s => ({
              ...s,
              onClick: s.label === '게시물' ? () => navigate('/profile/김피트/posts')
                : s.label === '팔로워' ? () => navigate('/profile/김피트/followers')
                : () => navigate('/profile/김피트/following'),
            }))}
            actions={<>
              <button
                onClick={() => navigate('/mypage/edit')}
                className="flex-1 py-2 rounded-card bg-surface-muted text-ink text-label font-semibold border border-border hover:bg-surface-subtle transition-colors"
              >
                프로필 편집
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/profile/${encodeURIComponent('김피트')}`
                  if (navigator.share) {
                    navigator.share({ title: '김피트 프로필', url }).catch(() => {})
                  } else {
                    navigator.clipboard?.writeText(url)
                    alert('프로필 링크가 복사되었어요!')
                  }
                }}
                className="flex-1 py-2 rounded-card bg-surface-muted text-ink text-label font-semibold border border-border hover:bg-surface-subtle transition-colors"
              >
                프로필 공유
              </button>
            </>}
          />

          {/* 게시물 그리드 */}
          <div className="border-t border-border">
            <div className="grid grid-cols-3 gap-0.5">
              {profilePosts.map((url, i) => (
                <button key={i} onClick={() => navigate('/activity')} className="aspect-square overflow-hidden hover:opacity-80 transition-opacity">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ── 마이 탭 ── */
        <div>
          {/* 프로필 + 자산 */}
          <div className="px-page pt-5 pb-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-surface-muted rounded-full flex items-center justify-center flex-shrink-0">
                <IconUser className="w-7 h-7 stroke-ink-placeholder stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h2 className="text-body font-bold text-ink">김피트</h2>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-label="인증됨">
                    <circle cx="12" cy="12" r="11" fill="#3B82F6" />
                    <path d="M7.5 12.5l3 3 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <p className="text-caption text-ink-tertiary">fitkim@email.com</p>
              </div>
              <button onClick={() => navigate('/mypage/edit')} className="px-3.5 py-1.5 text-caption font-semibold text-ink-secondary border border-border rounded-pill hover:bg-surface-muted transition-colors">
                편집
              </button>
            </div>
            <div className="flex items-center bg-surface-muted rounded-card-lg divide-x divide-border">
              {[
                {
                  value: '15,000', label: '캐시', href: '/wallet/cash',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2.5" />
                      <path d="M6 10v.01M18 10v.01M6 14v.01M18 14v.01" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  value: '2,500', label: '포인트', href: '/wallet/point',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-primary">
                      <path d="M12 2l2.6 6.5h6.9l-5.6 4 2.1 6.5L12 15l-6 4 2.1-6.5-5.6-4h6.9L12 2z" />
                    </svg>
                  ),
                },
                {
                  value: '3', label: '쿠폰', href: '/wallet/coupon',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
                      <path d="M9 7v10" strokeDasharray="2 2" />
                    </svg>
                  ),
                },
              ].map((stat) => (
                <button key={stat.label} onClick={() => navigate(stat.href)} className="flex-1 py-3.5 text-center hover:bg-border-light transition-colors first:rounded-l-card-lg last:rounded-r-card-lg">
                  <div className="text-body font-bold text-ink tabular-nums">{stat.value}</div>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    {stat.icon}
                    <div className="text-caption text-ink-tertiary">{stat.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[6px] bg-surface-muted" />

          {/* 내 회원권 */}
          <div className="px-page py-section">
            <h3 className="text-body font-bold text-ink mb-3">내 회원권</h3>

            {/* 탭 필터 */}
            <div className="flex bg-surface-muted rounded-card p-1 mb-4">
              {MEMBERSHIP_TABS.map((tab) => {
                const count = memberships.filter(m => m.tab === tab).length
                return (
                  <button
                    key={tab}
                    onClick={() => setMembershipTab(tab)}
                    className={`flex-1 py-2 text-label font-semibold rounded-card transition-all ${
                      membershipTab === tab
                        ? 'bg-surface text-ink shadow-card'
                        : 'text-ink-placeholder'
                    }`}
                  >
                    {tab} <span className={`ml-0.5 ${membershipTab === tab ? 'text-primary' : ''}`}>{count}</span>
                  </button>
                )
              })}
            </div>

            {/* 회원권 리스트 */}
            <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
              {memberships.filter(m => m.tab === membershipTab).map((membership) => {
                const isDark = membership.status === 'active'
                return (
                  <div
                    key={membership.id}
                    onClick={() => navigate(`/membership/${membership.id}`)}
                    className={`min-w-[240px] flex-shrink-0 rounded-card p-card-lg cursor-pointer transition-transform hover:-translate-y-0.5 flex flex-col ${statusStyles[membership.status]}`}
                  >
                    <span className={`self-start mb-2 px-1.5 py-px rounded text-[11px] font-extrabold ${statusBadgeStyles[membership.status]}`}>
                      {membership.statusLabel}
                    </span>
                    <div className="text-body font-bold mb-0.5">{membership.name}</div>
                    <div className={`text-caption mb-3 ${isDark ? 'opacity-60' : 'text-ink-placeholder'}`}>
                      {membership.gym}
                    </div>
                    <div className="flex gap-4 mb-3">
                      {membership.info.map((item) => (
                        <div key={item.label} className="flex flex-col">
                          <span className={`text-caption mb-0.5 ${isDark ? 'opacity-60' : 'text-ink-placeholder'}`}>
                            {item.label}
                          </span>
                          <span className={`text-label font-bold ${membership.status === 'expired' ? 'text-ink-secondary' : ''}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/membership/${membership.id}`)
                      }}
                      className={`mt-auto flex items-center justify-center gap-1 py-2 rounded-pill text-caption font-bold transition-colors ${
                        isDark
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-surface-muted hover:bg-border-light text-ink'
                      }`}
                    >
                      자세히 보기
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )
              })}
              {memberships.filter(m => m.tab === membershipTab).length === 0 && (
                <div className="py-8 text-center text-label text-ink-placeholder">
                  해당하는 회원권이 없습니다
                </div>
              )}
            </div>
          </div>

          <div className="h-[6px] bg-surface-muted" />

          {/* 내 예약 */}
          <div className="px-page">
          {(() => {
            const dayNames = ['일', '월', '화', '수', '목', '금', '토']
            const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0)
            const todayKey = `${todayDate.getFullYear()}년 ${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일(${dayNames[todayDate.getDay()]})`
            // 예약에서 고유 날짜 추출 + 오늘 항상 포함
            const uniqueDates = [...new Set([todayKey, ...reservations.map(r => r.date)])]
            // 날짜 파싱해서 정렬
            const dateTabs = uniqueDates.map(dateStr => {
              const match = dateStr.match(/(\d+)년 (\d+)월 (\d+)일/)
              const y = match ? +match[1] : 2026
              const m = match ? +match[2] - 1 : 0
              const d = match ? +match[3] : 1
              const dateObj = new Date(y, m, d)
              dateObj.setHours(0, 0, 0, 0)
              const isToday = dateObj.getTime() === todayDate.getTime()
              const isPast = dateObj.getTime() < todayDate.getTime()
              return {
                label: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
                day: dayNames[dateObj.getDay()],
                key: dateStr,
                isToday,
                isPast,
                sortKey: dateObj.getTime(),
              }
            }).sort((a, b) => a.sortKey - b.sortKey)

            // 기본 선택: 오늘
            const todayIdx = dateTabs.findIndex(d => d.isToday)
            const safeIdx = reserveDateIdx === -1 ? (todayIdx >= 0 ? todayIdx : 0) : Math.min(reserveDateIdx, dateTabs.length - 1)
            const selectedDateKey = dateTabs[safeIdx >= 0 ? safeIdx : 0].key
            const filtered = reservations.filter(r => r.date === selectedDateKey)
            const selectedTab = dateTabs[safeIdx >= 0 ? safeIdx : 0]

            return (
              <div className="py-section">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-body font-bold text-ink">내 예약</h3>
                  {todayIdx >= 0 && safeIdx !== todayIdx && (
                    <button
                      onClick={() => setReserveDateIdx(todayIdx)}
                      className="flex items-center gap-1 px-2.5 py-1 text-caption font-bold text-primary border border-primary rounded-pill hover:bg-primary-50 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-primary stroke-[1.5] fill-none"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                      오늘
                    </button>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
                  {dateTabs.map((d, i) => (
                    <button
                      key={d.key}
                      ref={safeIdx === i ? selectedDateRef : null}
                      onClick={() => setReserveDateIdx(i)}
                      className={`flex-shrink-0 w-[52px] py-2 rounded-xl text-center transition-colors relative ${
                        safeIdx === i
                          ? 'bg-primary text-white'
                          : d.isPast
                          ? 'bg-surface-muted text-ink-disabled'
                          : 'bg-surface-muted text-ink-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      <span className="text-label block">{d.isToday ? '오늘' : d.label}</span>
                      <span className="text-label font-bold block">{d.day}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {filtered.length === 0 && (
                    <div className="py-8 text-center rounded-card bg-surface-subtle">
                      <p className="text-caption text-ink-placeholder">
                        {selectedTab.isToday ? '오늘 예약 내역이 없습니다' : '이 날의 예약 내역이 없습니다'}
                      </p>
                    </div>
                  )}
                  {filtered.map((r) => {
                    const isPast = selectedTab.isPast
                    return (
                      <button
                        key={r.id}
                        onClick={() => navigate(`/reservation?trainer=${encodeURIComponent(r.trainer)}&lesson=${encodeURIComponent(r.lesson)}&time=${encodeURIComponent(r.time)}&date=${encodeURIComponent(r.date)}&id=${r.id}`)}
                        className={`w-full text-left flex items-center gap-3 p-card-lg rounded-card transition-colors ${isPast ? 'bg-surface-subtle hover:bg-surface-muted' : 'bg-surface-muted hover:bg-primary-50'}`}
                      >
                        <div className={`w-10 h-10 rounded-card flex items-center justify-center flex-shrink-0 ${isPast ? 'bg-surface-muted' : 'bg-primary-50'}`}>
                          <span className={`text-caption font-bold ${isPast ? 'text-ink-placeholder' : 'text-primary'}`}>{r.lesson}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-label font-bold ${isPast ? 'text-ink-tertiary' : 'text-ink'}`}>{r.trainer}</span>
                            <span className="text-caption text-ink-placeholder">· {r.gym}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 stroke-[1.5] fill-none flex-shrink-0 ${isPast ? 'stroke-ink-placeholder' : 'stroke-primary'}`}>
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            <span className={`text-caption font-medium ${isPast ? 'text-ink-placeholder' : 'text-primary'}`}>{r.time}</span>
                          </div>
                        </div>
                        {isPast ? (
                          <span className="px-2.5 py-1 text-caption font-bold text-ink-disabled">완료</span>
                        ) : (
                          <span
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const updated = reservations.filter(x => x.id !== r.id)
                              localStorage.setItem('reservations', JSON.stringify(updated))
                              setReservations(updated)
                            }}
                            className="px-2.5 py-1 text-caption font-bold text-ink-placeholder border border-border rounded-pill hover:text-semantic-like hover:border-semantic-like transition-colors flex-shrink-0"
                          >
                            취소
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}
          </div>

          <div className="h-[6px] bg-surface-muted" />

          {/* 내 활동 */}
          {(() => {
            const workoutHistory: { date: string; elapsed: number; totalVolume: number; focus: string; exercises: { name: string; category: string; sets: { weight: string; reps: string }[] }[] }[] = JSON.parse(localStorage.getItem('workout-history') || '[]')
            const classHistory: { id: string; title: string; instructor: string; level: string; imageUrl: string; progress: number }[] = JSON.parse(localStorage.getItem('class-history') || '[]')
            const classes = classHistory.length > 0 ? classHistory : [
              { id: '1', title: '홈트레이닝 기초', instructor: '김민수', level: '초급', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop', progress: 75 },
              { id: '2', title: '바레톤 입문 클래스', instructor: '박지영', level: '초급', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop', progress: 30 },
            ]
            const now = new Date()
            const thisMonth = workoutHistory.filter(r => { const d = new Date(r.date); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() })

            const activityItems = [
              { icon: <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5] fill-none"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>, label: '운동 기록', sub: `이번 달 ${thisMonth.length}회`, onClick: () => navigate('/mypage/workout-history') },
              { icon: <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5] fill-none"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label: '온라인 강의', sub: `${classes.length}강의 수강 중`, onClick: () => navigate('/online-class/my') },
              { icon: <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5] fill-none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, label: '내가 참여한 모임', sub: `${myMeetups.length}개 참여중`, onClick: () => navigate('/activity/my-meetups') },
              { icon: <IconCalendarCheck className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5]" />, label: '챌린지', sub: '', onClick: () => navigate('/challenge') },
            ]

            return (
              <div className="px-page py-section">
                <h3 className="text-body font-bold text-ink mb-1">내 활동</h3>
                {activityItems.map((item, i) => (
                  <button key={i} onClick={item.onClick} className="w-full flex items-center justify-between py-3.5 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-body text-ink">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.sub && <span className="text-label text-ink-tertiary">{item.sub}</span>}
                      <IconChevronRight className="w-4 h-4 stroke-ink-disabled stroke-[1.5]" />
                    </div>
                  </button>
                ))}
              </div>
            )
          })()}

          <div className="h-[6px] bg-surface-muted" />

          {/* 혜택 */}
          <div className="px-page py-section">
            <h3 className="text-body font-bold text-ink mb-1">혜택</h3>
            {[
              { icon: <IconUserPlus className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5]" />, label: '친구 초대', sub: '3명 초대 · 15,000P', onClick: () => navigate('/invite') },
              { icon: <IconStar className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5] fill-none" />, label: '리뷰 이벤트', sub: '네이버 · 인스타그램', onClick: () => navigate('/review-event') },
            ].map((item, i) => (
              <button key={i} onClick={item.onClick} className="w-full flex items-center justify-between py-3.5 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-body text-ink">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-label text-ink-tertiary">{item.sub}</span>
                  <IconChevronRight className="w-4 h-4 stroke-ink-disabled stroke-[1.5]" />
                </div>
              </button>
            ))}
          </div>

          <div className="h-[6px] bg-surface-muted" />

          {/* 내 정보 */}
          <div className="px-page py-section">
            <h3 className="text-body font-bold text-ink mb-1">내 정보</h3>
            {[
              { icon: <IconShield className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5]" />, label: '차단한 사용자', sub: '', highlight: false, onClick: () => navigate('/blocked') },
              { icon: <IconShield className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5]" />, label: '개인정보 보호', sub: '', highlight: false, onClick: () => navigate('/privacy') },
            ].map((item, i) => (
              <button key={i} onClick={item.onClick} className="w-full flex justify-between items-center py-3.5 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-body text-ink">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.sub && <span className={`text-caption font-bold ${item.highlight ? 'text-primary' : 'text-ink-tertiary'}`}>{item.sub}</span>}
                  <IconChevronRight className="w-4 h-4 stroke-ink-disabled stroke-[1.5]" />
                </div>
              </button>
            ))}
          </div>

          <div className="h-[6px] bg-surface-muted" />

          {/* 고객지원 */}
          <div className="px-page py-section">
            <h3 className="text-body font-bold text-ink mb-1">고객지원</h3>
            {[
              { icon: IconMessage, label: '고객센터', href: '/support' },
              { icon: IconInfo, label: '앱 정보', href: '/about' },
            ].map((item) => (
              <Link key={item.label} to={item.href} className="flex justify-between items-center py-3.5 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon className="w-[20px] h-[20px] stroke-ink-secondary stroke-[1.5]" />
                  <span className="text-body text-ink">{item.label}</span>
                </div>
                <IconChevronRight className="w-4 h-4 stroke-ink-disabled stroke-[1.5]" />
              </Link>
            ))}
          </div>

          <div className="px-page">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full py-3 text-label text-ink-placeholder hover:text-ink-secondary transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
