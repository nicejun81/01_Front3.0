import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch, IconShield, IconX } from '../../components/Icons'

type BlockedUser = {
  name: string
  handle: string
  avatarUrl: string
  blockedAt: string
  context?: string
}

const MOCK_BLOCKED: BlockedUser[] = [
  { name: '김지훈', handle: '@jihoon_k', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face', blockedAt: '2026.04.18', context: '부적절한 댓글' },
  { name: '이선영', handle: '@seonyoung_lee', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face', blockedAt: '2026.04.10', context: '피드 신고 후 차단' },
  { name: '박준호', handle: '@junho_p', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face', blockedAt: '2026.03.28' },
  { name: '최유진', handle: '@yujin_choi', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face', blockedAt: '2026.02.12', context: '반복적인 스팸 메시지' },
  { name: '정민수', handle: '@minsoo_j', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face', blockedAt: '2026.01.30' },
]

const STORAGE_KEY = 'blockedUsers'

const loadBlocked = (): BlockedUser[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Array.isArray(stored) && stored.length > 0 && typeof stored[0] === 'object') {
      return stored as BlockedUser[]
    }
  } catch { /* noop */ }
  return MOCK_BLOCKED
}

interface BlockedRowProps {
  user: BlockedUser
  onUnblock: (user: BlockedUser) => void
}

const BlockedRow = memo(({ user: u, onUnblock }: BlockedRowProps) => (
  <li className="flex items-center gap-3 py-3">
    <img
      src={u.avatarUrl}
      alt={u.name}
      loading="lazy"
      decoding="async"
      className="w-10 h-10 rounded-full object-cover bg-surface-muted flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-body font-bold text-ink truncate">{u.name}</span>
        <span className="text-caption text-ink-placeholder truncate">{u.handle}</span>
      </div>
      <div className="flex items-center gap-1.5 text-caption text-ink-tertiary mt-0.5">
        <span className="tabular-nums">{u.blockedAt}</span>
        {u.context && (
          <>
            <span className="w-0.5 h-0.5 rounded-full bg-ink-placeholder flex-shrink-0" />
            <span className="truncate">{u.context}</span>
          </>
        )}
      </div>
    </div>
    <button
      onClick={() => onUnblock(u)}
      className="flex-shrink-0 px-3 py-1.5 text-label font-bold text-primary border border-primary/30 bg-primary-50 rounded-pill hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all"
    >
      해제
    </button>
  </li>
))
BlockedRow.displayName = 'BlockedRow'

export const BlockedPage = () => {
  const [list, setList] = useState<BlockedUser[]>(loadBlocked)
  const [query, setQuery] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<BlockedUser | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // 검색어 디바운스: 타이핑 150ms 동안 필터링 지연
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 150)
    return () => clearTimeout(id)
  }, [query])

  const filtered = useMemo(() => {
    if (!debouncedQuery) return list
    return list.filter(u =>
      u.name.toLowerCase().includes(debouncedQuery) ||
      u.handle.toLowerCase().includes(debouncedQuery),
    )
  }, [list, debouncedQuery])

  // 토스트 자동 닫힘
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(id)
  }, [toast])

  const unblock = useCallback((user: BlockedUser) => {
    setList(prev => {
      const next = prev.filter(u => u.handle !== user.handle)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    setConfirmTarget(null)
    setToast(`${user.name}님 차단을 해제했어요`)
  }, [])

  const openConfirm = useCallback((user: BlockedUser) => setConfirmTarget(user), [])
  const closeConfirm = useCallback(() => setConfirmTarget(null), [])

  const isEmpty = list.length === 0

  return (
    <PageLayout
      header={<SubPageHeader title="차단한 사용자" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 요약 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-5 pb-4 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-baseline justify-between">
            <h1 className="text-title font-extrabold text-ink">차단한 사용자</h1>
            <span className="text-label text-ink-tertiary tabular-nums">
              총 <span className="font-extrabold text-primary tabular-nums">{list.length}</span>명
            </span>
          </div>
          <p className="text-label text-ink-tertiary mt-1">
            차단한 사용자는 피드·댓글·메시지에서 보이지 않아요
          </p>
        </div>
      </div>

      {/* 검색 */}
      {!isEmpty && (
        <div className="px-page pt-3 pb-2">
          <label className="flex items-center gap-2 px-3.5 py-2.5 bg-surface-muted rounded-pill focus-within:bg-primary-50 focus-within:ring-1 focus-within:ring-primary/30 transition-colors">
            <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="이름 또는 아이디 검색"
              className="flex-1 min-w-0 bg-transparent text-label text-ink placeholder:text-ink-placeholder outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                aria-label="검색어 지우기"
              >
                <IconX className="w-3 h-3 stroke-white stroke-[3]" />
              </button>
            )}
          </label>
        </div>
      )}

      {/* 리스트 */}
      <div className="px-page pb-3">
        {isEmpty ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center">
              <IconShield className="w-7 h-7 stroke-primary stroke-[1.5]" />
            </div>
            <p className="text-body text-ink-tertiary">차단한 사용자가 없어요</p>
            <p className="text-caption text-ink-placeholder mt-1">
              다른 사용자의 프로필에서 차단할 수 있어요
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-body text-ink-tertiary">검색 결과가 없어요</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border-light">
            {filtered.map(u => (
              <BlockedRow key={u.handle} user={u} onUnblock={openConfirm} />
            ))}
          </ul>
        )}
      </div>

      {/* 안내 */}
      <div className="px-page pb-4">
        <div className="bg-surface-muted rounded-card-lg p-4">
          <h4 className="text-label font-extrabold text-ink mb-1.5 tracking-wider">차단에 대해</h4>
          <ul className="text-label text-ink-tertiary leading-relaxed">
            <li>— 차단된 사용자의 피드·댓글·메시지가 숨김 처리돼요</li>
            <li>— 해제 후에도 상대는 차단 사실을 알 수 없어요</li>
            <li>— 단체 채팅방에서는 일부 보일 수 있어요</li>
          </ul>
        </div>
      </div>

      {/* 차단 해제 모달 */}
      {confirmTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-page"
          onClick={closeConfirm}
        >
          <div
            className="w-full max-w-[360px] bg-surface rounded-card-lg p-5 shadow-elevated animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={confirmTarget.avatarUrl}
                alt={confirmTarget.name}
                className="w-12 h-12 rounded-full object-cover bg-surface-muted flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-title font-extrabold text-ink truncate">{confirmTarget.name}</div>
                <div className="text-caption text-ink-placeholder truncate">{confirmTarget.handle}</div>
              </div>
            </div>
            <p className="text-label text-ink-secondary leading-relaxed mb-4">
              차단을 해제하면 <span className="font-bold text-ink">{confirmTarget.name}</span>님의
              피드·댓글·메시지를 다시 볼 수 있어요
            </p>
            <div className="flex gap-2">
              <button
                onClick={closeConfirm}
                className="flex-1 py-3 bg-surface-muted text-ink text-label font-bold rounded-card hover:bg-border-light transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => unblock(confirmTarget)}
                className="flex-1 py-3 bg-primary text-white text-label font-bold rounded-card hover:bg-primary-dark transition-colors"
              >
                차단 해제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </PageLayout>
  )
}
