import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface PageLayoutProps {
  children: ReactNode
  header?: ReactNode
  hideBottomNav?: boolean
  noPadding?: boolean
  className?: string
}

export const PageLayout = ({
  children,
  header,
  hideBottomNav = false,
  noPadding = false,
  className = '',
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-surface">
      {header}
      <main className={`${noPadding ? 'pb-28' : 'px-page py-4 pb-28'} ${className}`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
