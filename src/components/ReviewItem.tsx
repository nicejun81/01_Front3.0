import { useState } from 'react'
import { IconStarFilled } from './Icons'

interface ReviewItemProps {
  avatar: string
  name: string
  rating: number
  date: string
  text: string
  badge?: string
  photos?: string[]
  isMine?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export const ReviewItem = ({ avatar, name, rating, date, text, badge, photos, isMine, onEdit, onDelete }: ReviewItemProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="pb-4 border-b border-border-light last:border-0 last:pb-0">
      <div className="flex items-center gap-2.5 mb-2">
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-body font-semibold text-ink">{name}</span>
            {isMine && <span className="px-1.5 py-0.5 bg-primary-50 text-caption text-primary font-bold rounded">내 후기</span>}
            {badge && <span className="px-1.5 py-0.5 bg-surface-muted text-label text-ink-secondary rounded">{badge}</span>}
            <span className="text-label text-ink-tertiary ml-auto flex-shrink-0">{date}</span>
            {isMine && (
              <div className="relative flex-shrink-0">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 -mr-1">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink-tertiary" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-7 z-50 w-28 bg-surface rounded-card shadow-elevated border border-border overflow-hidden">
                      <button
                        onClick={() => { setShowMenu(false); onEdit?.() }}
                        className="w-full px-4 py-2.5 text-left text-body text-ink hover:bg-surface-muted transition-colors"
                      >
                        수정
                      </button>
                      <div className="h-px bg-border" />
                      <button
                        onClick={() => { setShowMenu(false); setShowDeleteConfirm(true) }}
                        className="w-full px-4 py-2.5 text-left text-body text-primary hover:bg-surface-muted transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <IconStarFilled key={s} className={`w-2.5 h-2.5 ${s <= rating ? 'text-semantic-star' : 'text-ink-disabled'}`} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-body text-ink-secondary leading-relaxed">{text}</p>
      {photos && photos.length > 0 && (
        <div className="flex gap-1.5 mt-2">
          {photos.map((photo, i) => (
            <img key={i} src={photo} alt="리뷰 사진" className="w-[72px] h-[72px] rounded-lg object-cover" />
          ))}
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-surface rounded-card-lg p-card-lg w-[280px] text-center">
            <p className="text-title font-bold text-ink mb-2">후기를 삭제할까요?</p>
            <p className="text-body text-ink-secondary mb-6">삭제된 후기는 복구할 수 없습니다.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 border border-border rounded-xl text-body font-bold text-ink hover:bg-surface-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); onDelete?.() }}
                className="flex-1 py-2.5 bg-primary rounded-xl text-body font-bold text-white hover:bg-primary-dark transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
