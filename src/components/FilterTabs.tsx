import type { ReactNode } from 'react'

interface Tab {
  key: string
  label: string
  icon?: ReactNode
}

interface FilterTabsProps {
  tabs: Tab[]
  active: string | string[]
  onSelect: (key: string) => void
  scrollable?: boolean
  className?: string
}

export const FilterTabs = ({
  tabs,
  active,
  onSelect,
  scrollable = false,
  className = '',
}: FilterTabsProps) => {
  const isActive = (key: string) =>
    Array.isArray(active) ? active.includes(key) : active === key

  return (
    <div
      className={`flex gap-2 px-page py-3 ${
        scrollable ? 'overflow-x-auto hide-scrollbar' : ''
      } ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onSelect(tab.key)}
          className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-pill text-body font-medium whitespace-nowrap transition-colors ${
            isActive(tab.key)
              ? 'bg-ink border-ink text-white'
              : 'bg-surface border-border text-ink hover:border-ink-placeholder'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
