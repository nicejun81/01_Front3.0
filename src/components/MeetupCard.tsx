import { IconUsers } from './Icons'

interface MeetupCardProps {
  imageUrl: string
  category: string
  title: string
  schedule: string
  memberCount: number
  onClick?: () => void
}

export const MeetupCard = ({
  imageUrl,
  category,
  title,
  schedule,
  memberCount,
  onClick,
}: MeetupCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[160px] bg-surface border border-border rounded-card overflow-hidden
                 hover:border-ink-disabled transition-colors text-left"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[120px] object-cover"
      />
      <div className="p-card">
        <span className="badge bg-primary text-white mb-1.5">{category}</span>
        <h3 className="text-body font-bold text-ink mb-0.5 leading-tight truncate">{title}</h3>
        <p className="text-caption text-ink-secondary mb-2">{schedule}</p>
        <div className="flex items-center gap-1.5 text-caption text-ink-placeholder">
          <IconUsers className="w-3.5 h-3.5 stroke-current stroke-2" />
          <span>멤버 {memberCount}명</span>
        </div>
      </div>
    </button>
  )
}
