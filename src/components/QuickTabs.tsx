import { useNavigate } from 'react-router-dom'
import { IconTicket, IconZap, IconClock } from './Icons'

interface QuickTab {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
}

const tabs: QuickTab[] = [
  { id: 'coupon', label: '쿠폰', icon: <IconTicket className="w-5 h-5 stroke-ink stroke-[1.5]" />, href: '/coupon' },
  { id: 'flash', label: '체험특가', icon: <IconZap className="w-5 h-5 stroke-ink stroke-[1.5]" />, href: '/flash-sale' },
  { id: 'event', label: '이벤트', icon: <IconClock className="w-5 h-5 stroke-ink stroke-[1.5]" />, href: '/event' },
]

export const QuickTabs = () => {
  const navigate = useNavigate()
  return (
    <div className="flex gap-3 mb-section">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => tab.href && navigate(tab.href)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 px-3 bg-surface-muted rounded-card hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          <span className="w-5 h-5">{tab.icon}</span>
          <span className="text-label font-semibold text-ink">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
