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

export const ReservationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const trainerName = searchParams.get('trainer') || '최강민 강사'
  const lessonName = searchParams.get('lesson') || 'PT'
  const time = searchParams.get('time') || '14:00'
  const [confirmed, setConfirmed] = useState(false)

  const profile = trainerProfiles[trainerName] || defaultProfile
  const today = new Date()
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일(${'일월화수목금토'[today.getDay()]})`
  const endTime = `${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:${time.split(':')[1]}`

  const header = <SubPageHeader title="예약 확인" />

  if (confirmed) {
    return (
      <PageLayout header={header} hideBottomNav>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-white stroke-2 fill-none"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="text-title font-bold text-ink mb-1">예약이 완료되었습니다</h2>
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
              예약 확인
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout header={header} hideBottomNav>
      {/* 트레이너 프로필 카드 */}
      <div className="flex items-center gap-4 mb-section">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <img src={profile.avatar} alt={trainerName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-body font-bold text-ink">{trainerName}</h3>
            <span className={`badge ${lessonColors[lessonName] || 'bg-primary-50 text-primary'}`}>{lessonName}</span>
          </div>
          <p className="text-label text-ink-tertiary mb-1">{profile.specialty}</p>
          <div className="flex items-center gap-1">
            <IconStarFilled className="w-3 h-3 text-semantic-star" />
            <span className="text-label font-bold text-ink-secondary">{profile.rating}</span>
            <span className="text-label text-ink-placeholder">({profile.reviews})</span>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      {/* 예약 상세 정보 */}
      <div className="py-section">
        <h3 className="text-body font-bold text-ink mb-4">예약 정보</h3>
        <div className="flex flex-col gap-0">
          {/* 날짜 */}
          <div className="flex items-center gap-3 py-3.5 border-b border-border-light">
            <div className="w-9 h-9 bg-surface-muted rounded-card flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-ink-secondary stroke-[1.5] fill-none">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-label text-ink-tertiary">날짜</span>
              <p className="text-body font-bold text-ink">{dateLabel}</p>
            </div>
          </div>
          {/* 시간 */}
          <div className="flex items-center gap-3 py-3.5 border-b border-border-light">
            <div className="w-9 h-9 bg-surface-muted rounded-card flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-ink-secondary stroke-[1.5] fill-none">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-label text-ink-tertiary">시간</span>
              <p className="text-body font-bold text-primary">{time} - {endTime} <span className="text-label text-ink-placeholder font-normal">(60분)</span></p>
            </div>
          </div>
          {/* 지점 */}
          <div className="flex items-center gap-3 py-3.5 border-b border-border-light">
            <div className="w-9 h-9 bg-surface-muted rounded-card flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-ink-secondary stroke-[1.5] fill-none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-label text-ink-tertiary">지점</span>
              <p className="text-body font-bold text-ink">바디채널 강남점</p>
              <p className="text-label text-ink-placeholder">서울 강남구 테헤란로 123 4층</p>
            </div>
          </div>
          {/* 이용권 */}
          <div className="flex items-center gap-3 py-3.5">
            <div className="w-9 h-9 bg-surface-muted rounded-card flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-ink-secondary stroke-[1.5] fill-none">
                <path d="M15 5H5a2 2 0 00-2 2v1a2 2 0 010 4v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 010-4V7a2 2 0 00-2-2z" />
                <circle cx="10" cy="11" r="2" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-label text-ink-tertiary">이용권</span>
              <p className="text-body font-bold text-ink">{lessonName} 이용권 <span className="text-label text-primary font-bold">· 1회 차감</span></p>
              <p className="text-label text-ink-placeholder">잔여 {lessonName === 'PT' ? '7' : lessonName === '바레톤' ? '4' : '9'}회 → 예약 후 {lessonName === 'PT' ? '6' : lessonName === '바레톤' ? '3' : '8'}회</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      {/* 안내사항 */}
      <div className="py-section pb-28">
        <h3 className="text-body font-bold text-ink mb-3">예약 안내</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { icon: '⏰', text: '예약 시간 10분 전까지 도착해주세요' },
            { icon: '🔄', text: '예약 취소는 수업 시작 2시간 전까지 가능합니다' },
            { icon: '⚠️', text: '노쇼(무단 불참) 시 이용권 1회가 차감됩니다' },
            { icon: '👟', text: '운동복 및 실내화를 착용해주세요' },
            { icon: '💧', text: '개인 물병을 지참해주세요 (정수기 이용 가능)' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-label flex-shrink-0">{item.icon}</span>
              <span className="text-label text-ink-secondary leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 예약 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border px-page py-3 max-w-[500px] mx-auto">
        <button
          onClick={() => {
            const reservation = { trainer: trainerName, lesson: lessonName, time, date: dateLabel, gym: '바디채널 강남점', id: Date.now() }
            const existing = JSON.parse(localStorage.getItem('reservations') || '[]')
            localStorage.setItem('reservations', JSON.stringify([reservation, ...existing]))
            setConfirmed(true)
          }}
          className="w-full py-3.5 rounded-card text-body font-bold bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          {time} 예약하기
        </button>
      </div>
    </PageLayout>
  )
}
