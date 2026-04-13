import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA, Badge, InfoRow } from '../../components'
import { IconHeart, IconShare, IconUsers, IconMapPin, IconCalendar } from '../../components/Icons'

const meetupsData: Record<string, {
  title: string
  category: string
  schedule: string
  location: string
  memberCount: number
  maxMembers: number
  imageUrl: string
  description: string
  host: { name: string; imageUrl: string }
  members: { imageUrl: string }[]
}> = {
  '1': {
    title: '강남 러닝크루',
    category: '러닝',
    schedule: '매주 토요일 오전 7시',
    location: '강남역 11번 출구',
    memberCount: 24,
    maxMembers: 30,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop',
    description: '함께 달리는 즐거움! 강남에서 매주 토요일 아침 러닝을 함께해요. 초보자도 환영합니다.',
    host: { name: '김러너', imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face' },
    members: [
      { imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face' },
      { imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face' },
      { imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=100&h=100&fit=crop&crop=face' },
    ],
  },
  '2': {
    title: '모닝 바레톤 클럽',
    category: '바레톤',
    schedule: '매주 수/금 오전 6시',
    location: '바디채널 강남점',
    memberCount: 18,
    maxMembers: 20,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop',
    description: '아침을 여는 상쾌한 바레톤! 하루를 활기차게 시작해보세요.',
    host: { name: '박요기', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face' },
    members: [
      { imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face' },
      { imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=100&h=100&fit=crop&crop=face' },
    ],
  },
}

const defaultMeetup = {
  title: '모임',
  category: '운동',
  schedule: '매주',
  location: '바디채널',
  memberCount: 10,
  maxMembers: 20,
  imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop',
  description: '함께 운동해요!',
  host: { name: '호스트', imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face' },
  members: [],
}

export const MeetupDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const meetup = meetupsData[id || ''] || defaultMeetup
  const [liked, setLiked] = useState(false)
  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: meetup.title, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url)
      alert('링크가 복사되었어요')
    }
  }
  const fillRate = Math.min(100, Math.round((meetup.memberCount / meetup.maxMembers) * 100))
  const remaining = Math.max(0, meetup.maxMembers - meetup.memberCount)
  const isFull = remaining === 0

  const header = (
    <SubPageHeader
      title={meetup.title}
      right={
        <div className="flex gap-2">
          <button className="icon-btn" onClick={handleShare}>
            <IconShare className="w-5 h-5 stroke-ink stroke-2" />
          </button>
          <button className="icon-btn" onClick={() => setLiked(v => !v)}>
            <IconHeart className={`w-5 h-5 stroke-2 ${liked ? 'fill-semantic-like stroke-semantic-like' : 'stroke-ink fill-none'}`} />
          </button>
        </div>
      }
    />
  )

  return (
    <PageLayout header={header} className="!px-0 !py-0 !pb-[180px]">
      {/* Hero Image */}
      <div className="relative h-[280px]">
        <img src={meetup.imageUrl} alt={meetup.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm">{meetup.category}</Badge>
            {isFull ? (
              <Badge variant="muted" size="sm">모집마감</Badge>
            ) : (
              <Badge variant="success" size="sm">모집중</Badge>
            )}
          </div>
          <h1 className="text-display font-bold leading-tight">{meetup.title}</h1>
        </div>
      </div>

      {/* Info */}
      <div className="px-page py-section">
        <div className="space-y-3">
          <InfoRow icon={<IconCalendar className="w-5 h-5 stroke-ink-tertiary stroke-2" />}>
            {meetup.schedule}
          </InfoRow>
          <InfoRow icon={<IconMapPin className="w-5 h-5 stroke-ink-tertiary stroke-2" />}>
            {meetup.location}
          </InfoRow>
          <InfoRow icon={<IconUsers className="w-5 h-5 stroke-ink-tertiary stroke-2" />}>
            <span>
              {meetup.memberCount}/{meetup.maxMembers}명
              <span className="ml-2 text-ink-tertiary text-label">· {remaining > 0 ? `${remaining}자리 남음` : '마감'}</span>
            </span>
          </InfoRow>
        </div>

        {/* Capacity bar */}
        <div className="mt-4">
          <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${fillRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* Host */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-3">모임장</h2>
        <div className="flex items-center gap-3 p-4 bg-surface-subtle rounded-xl">
          <img src={meetup.host.imageUrl} alt={meetup.host.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold">{meetup.host.name}</p>
            <p className="text-label text-ink-secondary">모임장</p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* Description */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-3">모임 소개</h2>
        <p className="text-ink-secondary text-body leading-relaxed">{meetup.description}</p>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* Members */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-3">참여 멤버</h2>
        <div className="flex -space-x-2">
          {meetup.members.map((member, i) => (
            <img
              key={i}
              src={member.imageUrl}
              alt="멤버"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ))}
          {meetup.memberCount > meetup.members.length && (
            <div className="w-10 h-10 rounded-full bg-ink-disabled border-2 border-white flex items-center justify-center text-label font-semibold text-ink-secondary">
              +{meetup.memberCount - meetup.members.length}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <BottomCTA>
        <button
          disabled={isFull}
          onClick={() => navigate(`/meetup/${id}/join`)}
          className="w-full py-4 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
        >
          {isFull ? '모집이 마감되었어요' : '모임 참여하기'}
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
