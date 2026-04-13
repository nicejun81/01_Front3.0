import type { ReactNode } from 'react'

interface InfoRowProps {
  icon: ReactNode
  children: ReactNode
  onClick?: () => void
  href?: string
}

export const InfoRow = ({ icon, children, onClick, href }: InfoRowProps) => {
  const className = "flex items-center gap-2 text-body text-ink-secondary"

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} hover:text-primary transition-colors`}>
        <span className="flex-shrink-0">{icon}</span>
        <span className="underline underline-offset-2">{children}</span>
      </a>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={`${className} w-full`}>
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1 text-left">{children}</span>
      </button>
    )
  }

  return (
    <div className={className}>
      <span className="flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  )
}
