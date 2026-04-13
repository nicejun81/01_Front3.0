import { PageLayout, SubPageHeader } from '../../components'
import { IconStar } from '../../components/Icons'

const events = [
  {
    id: 1,
    title: '이달의 베스트 리뷰어',
    description: '가장 많은 좋아요를 받은 리뷰어에게 1개월 무료 회원권!',
    reward: '1개월 무료 회원권',
    endDate: '2025.01.31',
    status: 'active',
  },
  {
    id: 2,
    title: '첫 리뷰 이벤트',
    description: '첫 리뷰 작성 시 5,000포인트 즉시 지급',
    reward: '5,000P',
    endDate: '상시',
    status: 'active',
  },
  {
    id: 3,
    title: '사진 리뷰 보너스',
    description: '사진과 함께 리뷰 작성 시 추가 포인트!',
    reward: '+2,000P',
    endDate: '상시',
    status: 'active',
  },
]

export const ReviewEventPage = () => {
  const header = <SubPageHeader title="리뷰 이벤트" />

  return (
    <PageLayout header={header}>
      <div className="bg-gradient-to-br from-primary to-[#ff8f6a] rounded-card-lg p-card-lg mb-section text-white">
        <div className="flex items-center gap-2 mb-2">
          <IconStar className="w-6 h-6 fill-white stroke-white" />
          <span className="font-bold">내 리뷰 현황</span>
        </div>
        <div className="flex justify-around mt-4">
          <div className="text-center">
            <p className="text-display font-bold">12</p>
            <p className="text-body opacity-80">작성한 리뷰</p>
          </div>
          <div className="text-center">
            <p className="text-display font-bold">89</p>
            <p className="text-body opacity-80">받은 좋아요</p>
          </div>
          <div className="text-center">
            <p className="text-display font-bold">24,000P</p>
            <p className="text-body opacity-80">적립 포인트</p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      <h2 className="text-heading mb-4">진행중인 이벤트</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-border rounded-card-lg p-card-lg hover:border-ink transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-title text-ink">{event.title}</h3>
              <span className="badge bg-primary text-white">
                진행중
              </span>
            </div>
            <p className="text-body text-ink-tertiary mb-3">{event.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-primary font-bold">{event.reward}</span>
              <span className="text-label text-ink-placeholder">~{event.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
