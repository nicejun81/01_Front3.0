interface ReviewSortProps {
  value: string
  onChange: (value: string) => void
  options?: { key: string; label: string }[]
  onWrite?: () => void
}

const defaultOptions = [
  { key: 'latest', label: '최신순' },
  { key: 'high', label: '평점 높은순' },
  { key: 'low', label: '평점 낮은순' },
]

export const ReviewSort = ({ value, onChange, options = defaultOptions, onWrite }: ReviewSortProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`px-2.5 py-1 rounded-full text-label font-medium transition-colors ${value === opt.key ? 'bg-ink text-white' : 'bg-surface-muted text-ink-secondary'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {onWrite && (
        <button onClick={onWrite} className="flex items-center gap-1 px-3 py-1.5 border border-primary rounded-full text-label font-semibold text-primary">
          <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-primary stroke-2" fill="none"><path d="M12 5v14M5 12h14" /></svg>
          후기 작성
        </button>
      )}
    </div>
  )
}
