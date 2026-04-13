import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconMessage } from './Icons'

// mock 읽지 않은 메시지 수
const UNREAD_COUNT = 4

export const ChatButton = () => {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate('/chat')} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-ink/5 transition-colors relative" title="채팅">
      <IconMessage className="w-5 h-5 stroke-ink stroke-[1.5] fill-none" />
      {UNREAD_COUNT > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-white text-caption font-bold rounded-full flex items-center justify-center px-1">
          {UNREAD_COUNT > 99 ? '99+' : UNREAD_COUNT}
        </span>
      )}
    </button>
  )
}

interface SubPageHeaderProps {
  title: string
  onBack?: () => void
  right?: ReactNode
  showChat?: boolean
  children?: ReactNode
}

export const SubPageHeader = ({
  title,
  onBack = () => window.history.back(),
  right,
  showChat = false,
  children,
}: SubPageHeaderProps) => {
  const rightContent = (showChat || right) ? (
    <div className="flex items-center gap-1">
      {right}
      {showChat && <ChatButton />}
    </div>
  ) : <div className="w-10" />

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-page py-2.5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-ink/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 text-center text-title">{title}</div>
        {rightContent}
      </div>
      {children}
    </header>
  )
}
