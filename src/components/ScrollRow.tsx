import type { ReactNode } from 'react'

interface ScrollRowProps {
  children: ReactNode
  className?: string
}

export const ScrollRow = ({ children, className = '' }: ScrollRowProps) => {
  return (
    <div className={`scroll-row ${className}`}>
      {children}
    </div>
  )
}
