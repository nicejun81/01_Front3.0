import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconStarFilled } from '../../components/Icons'

/* 트레이너 정보 mock */
const trainerProfiles: Record<string, { avatar: string; rating: number; reviews: number; specialty: string; perSession: string }> = {
  '최강민 강사': { avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', rating: 4.9, reviews: 128, specialty: '체형교정 · 웨이트', perSession: '70,000' },
  '박지영 강사': { avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', rating: 4.8, reviews: 95, specialty: '바레톤 · 코어', perSession: '66,000' },
  '한동훈 강사': { avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', rating: 4.7, reviews: 82, specialty: 'HIIT · 다이어트', perSession: '65,000' },
  '정서연 강사': { avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', rating: 4.8, reviews: 67, specialty: '코어 강화 · 바디라인', perSession: '70,000' },
  '이준혁 강사': { avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', rating: 4.6, reviews: 54, specialty: '짐그라운드 · 서킷', perSession: '60,000' },
  '권재민 강사': { avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', rating: 4.6, reviews: 47, specialty: '그룹PT · 스트렝스', perSession: '55,000' },
  '김태현 강사': { avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', rating: 4.5, reviews: 36, specialty: '다이어트 · PT', perSession: '65,000' },
  '장하은 강사': { avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', rating: 4.4, reviews: 29, specialty: '점심PT · 익스프레스', perSession: '60,000' },
  '오지훈 강사': { avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', rating: 4.7, reviews: 41, specialty: '얼리버드 · PT', perSession: '65,000' },
}

const defaultProfile = { avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', rating: 4.5, reviews: 30, specialty: 'PT', perSession: '60,000' }

const lessonColors: Record<string, string> = {
  'PT': 'bg-primary-50 text-primary',
  '바레톤': 'bg-category-bareton-bg text-category-bareton-text',
  '히트35': 'bg-category-hit35-bg text-category-hit35-text',
  '짐그라운드': 'bg-category-gymground-bg text-category-gymground-text',
  '그룹 PT': 'bg-accent-purple/10 text-accent-purple',
}

const remainCount = (lesson: string) => lesson === 'PT' ? 7 : lesson === '바레톤' ? 4 : 9
const totalCount = (lesson: string) => lesson === 'PT' ? 20 : lesson === '바레톤' ? 10 : 15

export const ReservationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const trainerName = searchParams.get('trainer') || '최강민 강사'
  const lessonName = searchParams.get('lesson') || 'PT'
  const time = searchParams.get('time') || '14:00'
  const dateParam = searchParams.get('date') // "2026년 4월 13일(일)" 형식
  const reservationId = searchParams.get('id') // 기존 예약이면 id 존재
  const isExistingReservation = !!reservationId
  const [confirmed, setConfirmed] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const profile = trainerProfiles[trainerName] || defaultProfile

  // 예약 날짜 파싱 (없으면 오늘)
  const reservationDate = (() => {
    if (!dateParam) return new Date()
    const m = dateParam.match(/(\d+)년\s*(\d+)월\s*(\d+)일/)
    if (!m) return new Date()
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  })()
  reservationDate.setHours(0, 0, 0, 0)
  const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0)
  const isPast = reservationDate.getTime() < todayDate.getTime()
  const isToday = reservationDate.getTime() === todayDate.getTime()

  const weekday = '일월화수목금토'[reservationDate.getDay()]
  const dateLabel = `${reservationDate.getFullYear()}년 ${reservationDate.getMonth() + 1}월 ${reservationDate.getDate()}일(${weekday})`
  const shortDate = `${reservationDate.getMonth() + 1}월 ${reservationDate.getDate()}일 (${weekday})`
  const endTime = `${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:${time.split(':')[1]}`
  const remain = remainCount(lessonName)
  const total = totalCount(lessonName)
  const usePct = ((total - remain) / total) * 100

  const header = <SubPageHeader title={isPast ? '이용 내역' : isExistingReservation ? '예약 상세' : '예약 확인'} />

  if (confirmed || cancelled) {
    const success = confirmed
    return (
      <PageLayout header={header} hideBottomNav>
        <div className="flex flex-col items-center justify-center py-16">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${success ? 'bg-primary' : 'bg-ink-disabled'}`}>
            <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-white stroke-2 fill-none">
              {success ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
            </svg>
          </div>
          <h2 className="text-title font-bold text-ink mb-1">
            {success ? '예약이 완료되었습니다' : '예약이 취소되었습니다'}
          </h2>
          <p className="text-body text-ink-secondary mb-2 text-center">
            {trainerName} · {lessonName}
          </p>
          <p className="text-label text-ink-tertiary mb-8">
            {dateLabel} {time} - {endTime}
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3.5 bg-surface-muted rounded-card text-body font-bold text-ink hover:bg-border-light transition-colors"
            >
              홈으로
            </button>
            <button
              onClick={() => navigate('/mypage')}
              className="flex-1 py-3.5 bg-primary rounded-card text-body font-bold text-white hover:bg-primary-dark transition-colors"
            >
              마이페이지
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout header={header} hideBottomNav noPadding>
      {/* 히어로 — 핵심 정보 한눈에 */}
      <div className="px-page pt-4 pb-5">
        <div className={`rounded-card-lg p-5 text-white ${
          isPast ? 'bg-gradient-to-br from-ink to-ink/80' : 'bg-gradient-to-br from-primary to-primary-dark'
        }`}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`px-2 py-0.5 text-caption font-bold rounded-pill bg-white/95 ${lessonColors[lessonName]?.split(' ')[1] || 'text-primary'}`}>
              {lessonName}
            </span>
            <span className="text-caption text-white/80">
              {isPast ? '이용 완료' : isExistingReservation ? (isToday ? '오늘 예약' : '예약 완료') : '예약 확인 중'}
            </span>
          </div>
          <div className="text-title font-bold mb-1 tabular-nums">{shortDate}</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-display font-extrabold tabular-nums leading-none">{time}</span>
            <span className="text-body opacity-90">- {endTime}</span>
            <span className="text-caption opacity-70 ml-1">60분</span>
          </div>
        </div>
      </div>

      {/* 트레이너 카드 */}
      <div className="px-page pb-4">
        <button
          onClick={() => navigate(`/trainer/${encodeURIComponent(trainerName)}`)}
          className="w-full flex items-center gap-3 p-3 rounded-card-lg border border-border hover:border-ink-placeholder transition-colors text-left"
        >
          <img src={profile.avatar} alt={trainerName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-body font-bold text-ink truncate">{trainerName}</h3>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <IconStarFilled className="w-3 h-3 text-semantic-star" />
                <span className="text-caption font-bold text-ink tabular-nums">{profile.rating}</span>
                <span className="text-caption text-ink-placeholder">({profile.reviews})</span>
              </div>
            </div>
            <p className="text-caption text-ink-tertiary truncate">{profile.specialty}</p>
          </div>
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-disabled stroke-[1.5] flex-shrink-0" fill="none">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="h-1.5 bg-surface-muted" />

      {/* 예약 정보 */}
      <div className="px-page py-4">
        <h3 className="text-label font-bold text-ink-tertiary mb-3 uppercase tracking-wider">예약 정보</h3>
        <div className="rounded-card-lg border border-border bg-surface divide-y divide-border-light">
          {/* 지점 */}
          <div className="flex items-center gap-3 p-3.5">
            <div className="w-9 h-9 bg-surface-muted rounded-card flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-ink-secondary stroke-[1.5] fill-none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-caption text-ink-tertiary">지점</span>
              <p className="text-label font-bold text-ink mt-0.5">바디채널 강남점</p>
              <p className="text-caption text-ink-placeholder mt-0.5">서울 강남구 테헤란로 123, 4층</p>
            </div>
            <button className="flex-shrink-0 px-2.5 py-1 text-caption font-semibold text-ink-secondary bg-surface-muted rounded-pill hover:bg-border-light transition-colors">
              지도
            </button>
          </div>

          {/* 이용권 */}
          <div className="p-3.5">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 bg-surface-muted rounded-card flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-ink-secondary stroke-[1.5] fill-none">
                  <path d="M15 5H5a2 2 0 00-2 2v1a2 2 0 010 4v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 010-4V7a2 2 0 00-2-2z" />
                  <circle cx="10" cy="11" r="2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-caption text-ink-tertiary">이용권</span>
                <p className="text-label font-bold text-ink mt-0.5">{lessonName} 이용권 <span className="text-caption text-primary font-bold">· 1회 차감</span></p>
              </div>
            </div>
            {/* 잔여 횟수 시각화 */}
            <div className="pl-12">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-caption text-ink-tertiary">잔여 횟수</span>
                <span className="text-caption text-ink-secondary tabular-nums">
                  <span className="font-bold text-ink">{remain}회</span> / {total}회
                  <span className="ml-2 text-primary font-bold">→ {remain - 1}회</span>
                </span>
              </div>
              <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${usePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1.5 bg-surface-muted" />

      {/* 안내사항 */}
      <div className="px-page py-4 pb-28">
        <h3 className="text-label font-bold text-ink-tertiary mb-3 uppercase tracking-wider">예약 안내</h3>

        {/* 핵심 — 취소 정책 강조 */}
        <div className="flex items-start gap-2 px-3 py-2.5 mb-2.5 bg-primary-50 rounded-card">
          <svg viewBox="0 0 20 20" className="w-4 h-4 mt-0.5 fill-primary flex-shrink-0">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm0 7.5a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V14.25z" />
          </svg>
          <div>
            <p className="text-label font-bold text-ink leading-snug">취소는 수업 시작 2시간 전까지 가능</p>
            <p className="text-caption text-ink-tertiary mt-0.5">노쇼(무단 불참) 시 이용권 1회가 차감됩니다</p>
          </div>
        </div>

        {/* 일반 안내 */}
        <ul className="rounded-card-lg border border-border-light bg-surface divide-y divide-border-light">
          {[
            { icon: '⏰', text: '예약 시간 10분 전까지 도착해주세요' },
            { icon: '👟', text: '운동복 및 실내화를 착용해주세요' },
            { icon: '💧', text: '개인 물병을 지참해주세요 (정수기 이용 가능)' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 px-3.5 py-2.5">
              <span className="text-label flex-shrink-0">{item.icon}</span>
              <span className="text-caption text-ink-secondary leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 하단 액션 — 상태별 분기 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border max-w-[500px] mx-auto">
        <div className="flex items-center gap-3 px-page py-3">
          <div className="flex-1 min-w-0">
            <div className="text-caption text-ink-tertiary">{shortDate}</div>
            <div className="text-body font-bold text-ink tabular-nums">{time} - {endTime}</div>
          </div>
          {isPast ? (
            // 지난 예약 — 이용 완료 + 리뷰 작성
            <button
              onClick={() => navigate('/review-event')}
              className="flex-shrink-0 px-6 py-3.5 rounded-card text-body font-bold bg-ink text-white hover:opacity-90 transition-colors"
            >
              리뷰 작성
            </button>
          ) : isExistingReservation ? (
            // 예정된 예약 — 취소
            <button
              onClick={() => {
                const existing = JSON.parse(localStorage.getItem('reservations') || '[]')
                const updated = existing.filter((r: { id: number }) => String(r.id) !== reservationId)
                localStorage.setItem('reservations', JSON.stringify(updated))
                setCancelled(true)
              }}
              className="flex-shrink-0 px-6 py-3.5 rounded-card text-body font-bold border border-semantic-like text-semantic-like hover:bg-semantic-like/5 transition-colors"
            >
              예약 취소
            </button>
          ) : (
            // 신규 예약
            <button
              onClick={() => {
                const reservation = { trainer: trainerName, lesson: lessonName, time, date: dateLabel, gym: '바디채널 강남점', id: Date.now() }
                const existing = JSON.parse(localStorage.getItem('reservations') || '[]')
                localStorage.setItem('reservations', JSON.stringify([reservation, ...existing]))
                setConfirmed(true)
              }}
              className="flex-shrink-0 px-6 py-3.5 rounded-card text-body font-bold bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              예약하기
            </button>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
