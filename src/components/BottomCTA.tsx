import type { ReactNode } from 'react'

interface BottomCTAProps {
  children: ReactNode
  hideBottomNav?: boolean
}

export const BottomCTA = ({ children, hideBottomNav = false }: BottomCTAProps) => {
  return (
    <div className={`fixed ${hideBottomNav ? 'bottom-0' : 'bottom-[80px]'} left-0 right-0 z-50 bg-surface border-t border-border px-page py-3 flex items-center gap-3`}>
      {children}
    </div>
  )
}
