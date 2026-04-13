import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { SubPageHeader, PageLayout, RatingSummary, ReviewItem, ReviewSort } from '../../components'
import { trainersData, defaultTrainer } from './index'

export const TrainerReviewsPage = () => {
  const { id } = useParams()
  const data = trainersData[id || ''] || defaultTrainer
  const [sort, setSort] = useState<'latest' | 'high' | 'low'>('latest')

  const sorted = [...data.reviews].sort((a, b) => {
    if (sort === 'high') return b.rating - a.rating
    if (sort === 'low') return a.rating - b.rating
    return 0
  })

  const header = <SubPageHeader title="수강 후기" />

  return (
    <PageLayout header={header} noPadding>
      {/* 평점 요약 */}
      <div className="px-page py-section">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-display font-bold text-ink">{data.name} 강사</h1>
          <span className="text-label text-ink-tertiary">{data.reviewCount}개 후기</span>
        </div>
        <RatingSummary rating={data.rating} reviewCount={data.reviewCount} />
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 정렬 + 리스트 */}
      <div className="px-page py-section">
        <ReviewSort value={sort} onChange={(v) => setSort(v as 'latest' | 'high' | 'low')} />
        <div className="space-y-6">
          {sorted.map((review, i) => (
            <ReviewItem
              key={i}
              avatar={review.avatar}
              name={review.name}
              rating={review.rating}
              date={review.date}
              text={review.text}
              photos={review.photos}
              badge={review.program}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
