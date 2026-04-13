import { memo, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

const fallbackPosts = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1549476464-37392f717541?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=600&h=600&fit=crop',
]

type PostTileProps = {
  url: string
  index: number
  onOpen: (index: number) => void
}

const PostTile = memo(({ url, index, onOpen }: PostTileProps) => {
  const handleClick = useCallback(() => onOpen(index), [onOpen, index])
  return (
    <button
      onClick={handleClick}
      className="aspect-square overflow-hidden bg-surface-muted hover:opacity-80 transition-opacity"
    >
      <img
        src={url}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    </button>
  )
})
PostTile.displayName = 'PostTile'

export const UserPostsPage = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const displayName = useMemo(() => decodeURIComponent(name || '사용자'), [name])

  const openPost = useCallback(
    () => navigate('/activity'),
    [navigate],
  )

  return (
    <PageLayout header={<SubPageHeader title={`${displayName}의 게시물`} />} className="!px-0">
      <div className="grid grid-cols-3 gap-0.5">
        {fallbackPosts.map((url, i) => (
          <PostTile key={url} url={url} index={i} onOpen={openPost} />
        ))}
      </div>
    </PageLayout>
  )
}
