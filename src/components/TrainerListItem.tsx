import type { ReactNode } from 'react'
import { IconStarFilled } from './Icons'

interface TrainerListItemProps {
  imageUrl: string
  name: string
  category: string
  categoryColor: 'bareton' | 'hit35' | 'gymground' | 'pt' | 'group-pt'
  description: string
  todayTime?: string
  rating: number
  reviewCount: number
  trialInfo?: string
  rightAction?: ReactNode
  onClick?: () => void
}

const categoryStyles: Record<string, string> = {
  bareton: 'bg-category-bareton-bg text-category-bareton-text',
  hit35: 'bg-category-hit35-bg text-category-hit35-text',
  gymground: 'bg-category-gymground-bg text-category-gymground-text',
  pt: 'bg-primary-50 text-primary',
  'group-pt': 'bg-accent-purple/10 text-accent-purple',
}

export const TrainerListItem = ({
  imageUrl,
  name,
  category,
  categoryColor,
  description,
  todayTime,
  rating,
  reviewCount,
  trialInfo,
  rightAction,
  onClick,
}: TrainerListItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex gap-4 py-4 border-b border-border-light last:border-b-0 hover:bg-surface-subtle transition-colors text-left"
    >
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-card overflow-hidden">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-body font-bold text-ink leading-tight">{name}</span>
              {rating > 0 && (
                <div className="flex items-center gap-0.5">
                  <IconStarFilled className="w-3 h-3 text-semantic-star" />
                  <span className="text-caption font-semibold text-ink-secondary">{rating}</span>
                  <span className="text-caption text-ink-placeholder">({reviewCount})</span>
                </div>
              )}
            </div>
            {rightAction}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`badge whitespace-nowrap ${categoryStyles[categoryColor] || categoryStyles.pt}`}>{category}</span>
            <p className="text-caption text-ink-secondary truncate">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary stroke-[1.5] fill-none">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-label font-medium text-primary">{todayTime}</span>
          </div>
          {trialInfo && <span className="text-label font-bold text-ink">{trialInfo}</span>}
        </div>
      </div>
    </button>
  )
}
