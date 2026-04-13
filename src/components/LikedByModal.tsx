import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IconHeart } from './Icons'

interface LikedUser {
  id: number
  name: string
  imageUrl: string
}

interface LikedByModalProps {
  open: boolean
  onClose: () => void
  users: LikedUser[]
}

const DUMMY_USERS: LikedUser[] = [
  { id: 1, name: '이서연', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: '박준혁', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: '최유진', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: '정민호', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: 5, name: '한소희', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 6, name: '오태민', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 7, name: '김하늘', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  { id: 8, name: '장우석', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
]

export const LikedByModal = ({ open, onClose, users = DUMMY_USERS }: LikedByModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const displayUsers = users.length > 0 ? users : DUMMY_USERS

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-[430px] bg-surface rounded-t-[20px] animate-slide-up max-h-[70vh] flex flex-col">
        {/* handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-ink-disabled" />
        </div>

        {/* header */}
        <div className="flex items-center justify-center px-page py-3 border-b border-border">
          <h2 className="text-body font-bold text-ink">좋아요</h2>
        </div>

        {/* user list */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {displayUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 px-page py-3 hover:bg-surface-muted transition-colors"
            >
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              />
              <span className="text-label font-semibold text-ink flex-1">{user.name}</span>
              <IconHeart className="w-4 h-4 fill-semantic-like stroke-semantic-like stroke-2" />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
