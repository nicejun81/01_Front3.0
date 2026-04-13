import { IconStarFilled } from './Icons'

interface RatingSummaryProps {
  rating: number
  reviewCount: number
  distribution?: number[]
}

export const RatingSummary = ({ rating, reviewCount, distribution = [75, 18, 5, 1, 1] }: RatingSummaryProps) => {
  return (
    <div className="flex items-center gap-4 p-card-lg bg-surface-subtle rounded-card">
      <div className="text-center">
        <p className="text-[28px] font-extrabold text-ink">{rating}</p>
        <div className="flex gap-0.5 justify-center mb-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <IconStarFilled key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-semantic-star' : 'text-ink-disabled'}`} />
          ))}
        </div>
        <p className="text-label text-ink-tertiary">{reviewCount}개 평가</p>
      </div>
      <div className="flex-1 space-y-1">
        {[5, 4, 3, 2, 1].map((star, idx) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-label text-ink-tertiary w-3">{star}</span>
            <div className="flex-1 h-[6px] bg-ink-disabled rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${distribution[idx]}%`, backgroundColor: '#FF6B35' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
