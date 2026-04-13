interface OnlineClassCardProps {
  imageUrl: string
  title: string
  lessonCount: number
  level: string
  onClick?: () => void
}

export const OnlineClassCard = ({
  imageUrl,
  title,
  lessonCount,
  level,
  onClick,
}: OnlineClassCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[140px] text-left hover:-translate-y-1 active:scale-[0.98] transition-all"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[100px] rounded-card object-cover mb-2 bg-surface-muted"
      />
      <h3 className="text-label font-semibold text-ink mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </h3>
      <p className="text-label text-ink-placeholder">
        {lessonCount}강 · {level}
      </p>
    </button>
  )
}
