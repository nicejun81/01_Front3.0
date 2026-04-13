interface RecentChatProps {
  avatarUrl: string
  name: string
  message: string
  time: string
  unreadCount?: number
  onClick?: () => void
}

export const RecentChat = ({
  avatarUrl,
  name,
  message,
  time,
  unreadCount = 0,
  onClick,
}: RecentChatProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-card-lg bg-surface-muted rounded-card mb-section hover:bg-gray-200 transition-colors text-left"
    >
      <img
        src={avatarUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-label font-semibold text-ink">{name}</span>
          <span className="text-label text-ink-placeholder">{time}</span>
        </div>
        <p className="text-label text-ink-secondary truncate">{message}</p>
      </div>
      {unreadCount > 0 && (
        <span className="w-5 h-5 bg-primary text-white text-caption font-semibold rounded-full flex items-center justify-center flex-shrink-0">
          {unreadCount}
        </span>
      )}
    </button>
  )
}
