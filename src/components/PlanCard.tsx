interface PlanCardProps {
  name: string
  duration?: string
  price: string
  original?: string
  tag?: string
  installment?: string
  perSession?: string
  highlighted?: boolean
  onClick?: () => void
}

export const PlanCard = ({ name, duration, price, original, tag, installment, perSession, highlighted = false, onClick }: PlanCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-card-lg rounded-card border text-left transition-colors hover:border-primary ${highlighted ? 'border-primary bg-primary-50' : 'border-border'}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-body font-bold text-ink">{name}</span>
          {tag && <span className="px-1.5 py-0.5 bg-primary text-white text-caption font-bold rounded">{tag}</span>}
        </div>
        {duration && <span className="text-label text-ink-tertiary">{duration}</span>}
        {perSession && <span className="text-label text-ink-tertiary">1회 {perSession}원</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-heading font-bold text-ink">{price}<span className="text-body font-normal">원</span></span>
        {original && <span className="text-body text-ink-tertiary line-through">{original}원</span>}
      </div>
      {installment && <p className="text-label text-primary mt-1.5">{installment}</p>}
    </button>
  )
}
