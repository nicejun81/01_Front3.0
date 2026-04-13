import { useState } from 'react'
import { IconHeart, IconMessage } from './Icons'
import { LikedByModal } from './LikedByModal'

interface FeedCardProps {
  imageUrl: string
  authorImageUrl: string
  authorName: string
  text: string
  likeCount: number
  commentCount: number
  isLiked?: boolean
  onClick?: () => void
}

export const FeedCard = ({
  imageUrl,
  authorImageUrl,
  authorName,
  text,
  likeCount,
  commentCount,
  isLiked = false,
  onClick,
}: FeedCardProps) => {
  const [showLikedBy, setShowLikedBy] = useState(false)

  return (
    <>
      <div
        className="flex flex-col rounded-card overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-left bg-surface h-full cursor-pointer"
      >
        <div onClick={onClick}>
          <img
            src={imageUrl}
            alt="피드"
            className="w-full aspect-square object-cover"
          />
          <div className="flex flex-col flex-1 p-card">
            <div className="flex items-center gap-2 mb-1.5">
              <img
                src={authorImageUrl}
                alt={authorName}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-body font-bold text-ink">{authorName}</span>
            </div>
            <p className="text-label text-ink-secondary leading-snug line-clamp-2 flex-1">{text}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-caption text-ink-placeholder px-card pb-card">
          <button
            type="button"
            className={`flex items-center gap-1 py-1 px-1 ${isLiked ? 'text-semantic-like' : ''} hover:opacity-70 transition-opacity`}
            onClick={() => setShowLikedBy(true)}
          >
            <IconHeart className={`w-3.5 h-3.5 ${isLiked ? 'fill-semantic-like stroke-semantic-like' : 'stroke-current'} stroke-2`} />
            {likeCount}
          </button>
          <span className="flex items-center gap-1">
            <IconMessage className="w-3.5 h-3.5 stroke-current stroke-2" />
            {commentCount}
          </span>
        </div>
      </div>

      <LikedByModal
        open={showLikedBy}
        onClose={() => setShowLikedBy(false)}
        users={[]}
      />
    </>
  )
}
