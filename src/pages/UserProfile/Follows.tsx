import { memo, useCallback, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

type User = {
  name: string
  handle: string
  imageUrl: string
  bio?: string
}

const mockFollowers: User[] = [
  { name: '김트레이너', handle: 'kim_trainer', imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', bio: '바디채널 강남점 트레이너' },
  { name: '헬스왕', handle: 'healthking', imageUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=200&h=200&fit=crop&crop=face', bio: '벌크업 3년차' },
  { name: '운동하는직장인', handle: 'work_out', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', bio: '퇴근 후 헬스' },
  { name: '바레톤요정', handle: 'bareton_fairy', imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop&crop=face', bio: '바레톤 강사' },
  { name: '크로스핏러', handle: 'crossfit_er', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', bio: 'CrossFit Lv.2' },
  { name: '러닝매니아', handle: 'running_mania', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', bio: '한강 러닝크루' },
  { name: '요가하는소녀', handle: 'yoga_girl', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', bio: '매일 요가' },
  { name: '필라테스러버', handle: 'pilates_love', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face', bio: '필라테스 강사' },
]

const mockFollowing: User[] = [
  { name: '김트레이너', handle: 'kim_trainer', imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', bio: '바디채널 강남점 트레이너' },
  { name: '바레톤요정', handle: 'bareton_fairy', imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop&crop=face', bio: '바레톤 강사' },
  { name: '요가하는소녀', handle: 'yoga_girl', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', bio: '매일 요가' },
]

const TABS = [
  { key: 'followers', label: '팔로워' },
  { key: 'following', label: '팔로잉' },
] as const

type UserRowProps = {
  user: User
  isFollowing: boolean
  onToggle: (handle: string) => void
  onOpen: (name: string) => void
}

const UserRow = memo(({ user, isFollowing, onToggle, onOpen }: UserRowProps) => {
  const handleOpen = useCallback(() => onOpen(user.name), [onOpen, user.name])
  const handleToggle = useCallback(() => onToggle(user.handle), [onToggle, user.handle])

  return (
    <div className="flex items-center gap-3 py-2">
      <button
        onClick={handleOpen}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <img
          src={user.imageUrl}
          alt={user.name}
          loading="lazy"
          decoding="async"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="text-body font-semibold text-ink truncate">{user.name}</div>
          {user.bio && (
            <div className="text-label text-ink-secondary truncate">{user.bio}</div>
          )}
        </div>
      </button>
      <button
        onClick={handleToggle}
        className={`px-4 py-1.5 rounded-card text-label font-semibold transition-colors flex-shrink-0 ${
          isFollowing
            ? 'bg-surface-muted text-ink border border-border'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        {isFollowing ? '팔로잉' : '팔로우'}
      </button>
    </div>
  )
})
UserRow.displayName = 'UserRow'

type Props = { mode: 'followers' | 'following' }

export const UserFollowsPage = ({ mode }: Props) => {
  const { name } = useParams()
  const navigate = useNavigate()
  const displayName = useMemo(() => decodeURIComponent(name || '사용자'), [name])

  const users = mode === 'followers' ? mockFollowers : mockFollowing
  const [query, setQuery] = useState('')
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q),
    )
  }, [users, query])

  const toggleFollow = useCallback((handle: string) => {
    setFollowingMap((m) => ({ ...m, [handle]: !(m[handle] ?? false) }))
  }, [])

  const openProfile = useCallback(
    (targetName: string) => {
      navigate(`/profile/${encodeURIComponent(targetName)}`)
    },
    [navigate],
  )

  const switchTab = useCallback(
    (next: 'followers' | 'following') => {
      if (next === mode) return
      navigate(`/profile/${encodeURIComponent(displayName)}/${next}`, { replace: true })
    },
    [navigate, displayName, mode],
  )

  const defaultFollowing = mode === 'following'

  return (
    <PageLayout header={<SubPageHeader title={displayName} />} className="!px-0">
      {/* 탭 */}
      <div className="flex border-b border-border sticky top-[56px] bg-surface z-10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`flex-1 py-3 text-body font-semibold transition-colors ${
              mode === t.key ? 'text-ink border-b-2 border-ink' : 'text-ink-tertiary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="px-page py-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색"
          className="w-full bg-surface-muted rounded-card px-4 py-2 text-body text-ink placeholder:text-ink-placeholder focus:outline-none"
        />
      </div>

      {/* 유저 목록 */}
      <div className="px-page">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-ink-tertiary text-body">검색 결과가 없습니다</div>
        ) : (
          filtered.map((u) => (
            <UserRow
              key={u.handle}
              user={u}
              isFollowing={followingMap[u.handle] ?? defaultFollowing}
              onToggle={toggleFollow}
              onOpen={openProfile}
            />
          ))
        )}
      </div>
    </PageLayout>
  )
}

export const UserFollowersPage = () => <UserFollowsPage mode="followers" />
export const UserFollowingPage = () => <UserFollowsPage mode="following" />
