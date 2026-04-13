import type { ReactNode } from 'react'
import { IconStarFilled } from './Icons'

interface PTTrainerCardProps {
  imageUrl: string
  name: string
  category?: string
  categoryColor?: 'bareton' | 'hit35' | 'gymground' | 'pt' | 'group-pt'
  description: string
  todayTime?: string
  rating: number
  reviewCount: number
  trialInfo?: string
  action?: ReactNode
  onClick?: () => void
  fluid?: boolean
}

const categoryStyles: Record<string, string> = {
  bareton: 'bg-category-bareton-bg text-category-bareton-text',
  hit35: 'bg-category-hit35-bg text-category-hit35-text',
  gymground: 'bg-category-gymground-bg text-category-gymground-text',
  pt: 'bg-primary-50 text-primary',
  'group-pt': 'bg-accent-purple/10 text-accent-purple',
}

export const PTTrainerCard = ({
  imageUrl,
  name,
  category,
  categoryColor = 'pt',
  description,
  todayTime,
  rating,
  reviewCount: _reviewCount,
  trialInfo,
  action,
  onClick,
  fluid = false,
}: PTTrainerCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 border border-border rounded-card overflow-hidden
                 hover:border-ink-disabled transition-colors text-left ${fluid ? 'w-full' : 'w-[160px]'}`}
    >
      <img src={imageUrl} alt={name} className="w-full h-[120px] object-cover" />
      <div className="p-card">
        {/* Name + Rating */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-body font-bold text-ink truncate">{name}</p>
          {rating > 0 && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <IconStarFilled className="w-3 h-3 text-semantic-star" />
              <span className="text-caption font-semibold text-ink-secondary">{rating}</span>
            </div>
          )}
        </div>

        {/* Category badge + Description */}
        <div className="flex items-center gap-1.5 mb-2">
          {category && (
            <span className={`badge whitespace-nowrap flex-shrink-0 ${categoryStyles[categoryColor] || categoryStyles.pt}`}>
              {category}
            </span>
          )}
          <p className="text-caption text-ink-secondary truncate">{description}</p>
        </div>

        {/* Today time */}
        {todayTime && (
          <div className="flex items-center gap-1.5 mb-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary stroke-[1.5] fill-none flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-label font-medium text-primary truncate">{todayTime}</span>
          </div>
        )}

        {/* Price fallback (if no todayTime) */}
        {!todayTime && trialInfo && (
          <span className="text-label font-bold text-primary mb-2 block">{trialInfo}</span>
        )}

        {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
      </div>
    </button>
  )
}
