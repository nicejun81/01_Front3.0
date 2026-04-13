import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { SubPageHeader, PageLayout, RatingSummary, ReviewItem, ReviewSort } from '../../components'
import { gymsData, defaultGym } from './index'

const allReviews = [
  { name: '헬스왕', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.20', text: '시설이 깔끔하고 장비가 최신이라 좋습니다. 특히 프리웨이트 구역이 넓어서 쾌적해요.', photos: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop'], membershipType: '12개월권' },
  { name: '운동초보', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.05', text: '트레이너분들이 친절하고 운동 방법 잘 알려주세요. 초보자한테 추천합니다!', membershipType: 'PT 20회' },
  { name: '직장인B', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.11.18', text: '24시간이라 퇴근 후 늦게 가도 운동할 수 있어서 최고입니다.', photos: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop'], membershipType: '6개월권' },
  { name: '근육맨', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.11.10', text: '머신 종류가 다양하고 관리가 잘 되어 있어요. 벌크업 하기에 최적의 환경입니다.', photos: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop'], membershipType: 'PT 50회' },
  { name: '요가러버', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.10.25', text: 'GX 수업 종류가 다양해서 좋아요. 바레톤 수업 특히 추천합니다!', membershipType: '바레톤 3개월' },
  { name: '다이어터', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.10.15', text: '3개월 다니면서 10kg 감량 성공했습니다. 트레이너님 식단 관리까지 해주셔서 감사해요.', photos: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop'], membershipType: 'PT 30회' },
  { name: '바레톤초보', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.10.08', text: '바레톤 수업 처음 들었는데 강사님이 차근차근 알려주셔서 좋았어요.', membershipType: '바레톤 1개월' },
  { name: '새벽러너', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.09.28', text: '새벽 6시에 와도 깨끗하고 장비 상태가 좋아요. 무인 운영이라 편합니다.', membershipType: '12개월권' },
  { name: '헬린이', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', rating: 3, date: '2025.09.15', text: '시설은 좋은데 저녁 시간대 사람이 좀 많아요. 오전에 오시면 여유롭습니다.', membershipType: '3개월권' },
  { name: '운동매니아', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.09.01', text: '여러 헬스장 다녀봤는데 여기가 시설 대비 가격이 가장 합리적이에요. 강추합니다!', photos: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop'], membershipType: '12개월권' },
]

export const GymReviewsPage = () => {
  const { id } = useParams()
  const data = gymsData[`gym${id}`] || defaultGym
  const [sort, setSort] = useState('latest')

  const sorted = [...allReviews].sort((a, b) => {
    if (sort === 'high') return b.rating - a.rating
    if (sort === 'low') return a.rating - b.rating
    return 0
  })

  const header = <SubPageHeader title="방문자 후기" />

  return (
    <PageLayout header={header} noPadding>
      {/* 평점 요약 */}
      <div className="px-page py-section">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-display font-bold text-ink">{data.name}</h1>
          <span className="text-label text-ink-tertiary">{allReviews.length}개 후기</span>
        </div>
        <RatingSummary rating={data.rating} reviewCount={allReviews.length} />
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 정렬 + 리스트 */}
      <div className="px-page py-section">
        <ReviewSort value={sort} onChange={setSort} />
        <div className="space-y-6">
          {sorted.map((review, i) => (
            <ReviewItem
              key={i}
              avatar={review.avatar}
              name={review.name}
              rating={review.rating}
              date={review.date}
              text={review.text}
              badge={review.membershipType}
              photos={review.photos}
              isMine={review.name === '헬스왕'}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
