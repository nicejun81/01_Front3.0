import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, ProfileHeader } from '../../components'

type Profile = {
  name: string
  imageUrl: string
  bio: string
  link?: string
  posts: number
  followers: number
  following: number
  highlights?: { label: string; imageUrl: string }[]
  postImages: string[]
}

const profilesData: Record<string, Profile> = {
  김트레이너: {
    name: '김트레이너',
    imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    bio: '바디채널 강남점 트레이너 · PT/식단 상담 DM\n주 5회 운동, 함께해요 💪',
    link: 'bodychannel.com/kim',
    posts: 124,
    followers: 3820,
    following: 286,
    highlights: [
      { label: '루틴', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
      { label: '식단', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop' },
      { label: '대회', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' },
      { label: 'B&A', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop' },
    ],
    postImages: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=300&h=300&fit=crop',
    ],
  },
  헬스왕: {
    name: '헬스왕',
    imageUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=200&h=200&fit=crop&crop=face',
    bio: '벌크업 3년차 · 일상 운동 기록\n바디채널 역삼점',
    posts: 86,
    followers: 1240,
    following: 198,
    highlights: [
      { label: '벌크업', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop' },
      { label: '루틴', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop' },
    ],
    postImages: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    ],
  },
  운동하는직장인: {
    name: '운동하는직장인',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face',
    bio: '퇴근 후 헬스 · 직장인의 운동 일기 🏋️‍♂️\n매일 1% 성장 중',
    posts: 58,
    followers: 942,
    following: 312,
    highlights: [
      { label: '오운완', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop' },
      { label: '식단', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop' },
    ],
    postImages: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    ],
  },
  바레톤요정: {
    name: '바레톤요정',
    imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop&crop=face',
    bio: '바레톤 강사 · 우아한 운동을 전합니다 🩰',
    posts: 142,
    followers: 5210,
    following: 156,
    highlights: [
      { label: '수업', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop' },
    ],
    postImages: [
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    ],
  },
  크로스핏러: {
    name: '크로스핏러',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: 'CrossFit Lv.2 · WOD 매일 기록',
    posts: 73,
    followers: 1820,
    following: 245,
    postImages: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
    ],
  },
  러닝매니아: {
    name: '러닝매니아',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    bio: '한강 러닝크루 · 풀코스 4시간대',
    posts: 95,
    followers: 2310,
    following: 198,
    postImages: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=300&fit=crop',
    ],
  },
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
]

const lookupProfile = (raw: string): Profile => {
  const cleaned = raw.replace(/\.+$/, '')
  if (profilesData[cleaned]) return profilesData[cleaned]
  // prefix match for truncated names ("운동하는직..")
  const prefix = cleaned.replace(/\.+$/, '')
  const found = Object.keys(profilesData).find((k) => k.startsWith(prefix))
  if (found) return profilesData[found]
  return {
    name: cleaned || '사용자',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    bio: '바디채널과 함께 건강한 하루를 보내요 💪',
    posts: 12,
    followers: 184,
    following: 96,
    postImages: fallbackImages,
  }
}

type BlockedUserStored = {
  name: string
  handle: string
  avatarUrl: string
  blockedAt: string
  context?: string
}

const formatToday = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

export const UserProfilePage = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const profile = lookupProfile(decodeURIComponent(name || ''))
  const [following, setFollowing] = useState(false)
  const [tab, setTab] = useState<'grid' | 'tagged'>('grid')
  const [moreMenu, setMoreMenu] = useState(false)
  const [blockConfirm, setBlockConfirm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const doBlock = () => {
    try {
      const raw = JSON.parse(localStorage.getItem('blockedUsers') || '[]')
      const current: BlockedUserStored[] = Array.isArray(raw) && typeof raw[0] === 'object' ? raw : []
      if (!current.some(u => u.name === profile.name)) {
        current.unshift({
          name: profile.name,
          handle: `@${profile.name}`,
          avatarUrl: profile.imageUrl,
          blockedAt: formatToday(),
          context: '프로필에서 차단',
        })
        localStorage.setItem('blockedUsers', JSON.stringify(current))
      }
    } catch { /* noop */ }
    setBlockConfirm(false)
    setToast(`${profile.name}님을 차단했어요`)
    setTimeout(() => {
      setToast(null)
      navigate('/blocked')
    }, 1200)
  }

  return (
    <PageLayout header={<SubPageHeader title={profile.name} />} className="!px-0">
      <ProfileHeader
        imageUrl={profile.imageUrl}
        name={profile.name}
        bio={profile.bio}
        link={profile.link}
        stats={[
          { value: profile.posts, label: '게시물', onClick: () => navigate(`/profile/${encodeURIComponent(profile.name)}/posts`) },
          { value: profile.followers.toLocaleString(), label: '팔로워', onClick: () => navigate(`/profile/${encodeURIComponent(profile.name)}/followers`) },
          { value: profile.following, label: '팔로잉', onClick: () => navigate(`/profile/${encodeURIComponent(profile.name)}/following`) },
        ]}
        actions={<>
          <button
            onClick={() => setFollowing((v) => !v)}
            className={`flex-1 py-2 rounded-card text-label font-semibold transition-colors ${
              following
                ? 'bg-surface-muted text-ink border border-border'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {following ? '팔로잉' : '팔로우'}
          </button>
          <button
            onClick={() => navigate('/chat/1')}
            className="flex-1 py-2 rounded-card bg-surface-muted text-ink text-label font-semibold border border-border hover:bg-surface-subtle transition-colors"
          >
            메시지
          </button>
          <button
            onClick={() => setMoreMenu(true)}
            className="px-3 py-2 rounded-card bg-surface-muted text-ink border border-border hover:bg-surface-subtle transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink stroke-2 fill-none">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>}
      />

      {/* Tabs */}
      <div className="flex border-t border-border">
        {([{ k: 'grid', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
          { k: 'tagged', icon: 'M12 2l4 4-4 4-4-4 4-4zM12 22a10 10 0 100-20 10 10 0 000 20z' }] as const).map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`flex-1 flex justify-center py-3 border-b-2 ${
              tab === t.k ? 'border-ink' : 'border-transparent'
            }`}
          >
            <svg viewBox="0 0 24 24" className={`w-5 h-5 stroke-2 fill-none ${tab === t.k ? 'stroke-ink' : 'stroke-ink-placeholder'}`}>
              <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div>
        {profile.postImages.length === 0 ? (
          <div className="py-16 text-center text-ink-tertiary text-body">아직 게시물이 없어요</div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {profile.postImages.map((url, i) => (
              <button key={i} onClick={() => navigate('/activity')} className="aspect-square overflow-hidden bg-surface-muted">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* More Menu */}
      {moreMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMoreMenu(false)} />
          <div className="relative w-full max-w-screen-sm bg-surface rounded-t-3xl animate-slide-up pb-8">
            <div className="flex justify-center pt-3 pb-4">
              <span className="w-10 h-1 rounded-full bg-ink-disabled" />
            </div>
            <div className="flex flex-col">
              {[
                { label: '프로필 공유', icon: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13', action: () => {
                  const url = `${window.location.origin}/profile/${encodeURIComponent(profile.name)}`
                  if (navigator.share) navigator.share({ title: `${profile.name} 프로필`, url }).catch(() => {})
                  else { navigator.clipboard?.writeText(url); alert('프로필 링크가 복사되었어요!') }
                  setMoreMenu(false)
                }},
                { label: '신고하기', icon: 'M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2zM12 8v4M12 16h.01', danger: true, action: () => { setMoreMenu(false); navigate('/report') } },
                { label: '차단하기', icon: 'M18.36 5.64a9 9 0 11-12.73 0 9 9 0 0112.73 0zM5.64 5.64l12.73 12.73', danger: true, action: () => { setMoreMenu(false); setBlockConfirm(true) } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`flex items-center gap-4 px-page py-4 hover:bg-surface-muted transition-colors ${
                    item.danger ? 'text-semantic-like' : 'text-ink'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-none stroke-2 ${item.danger ? 'stroke-semantic-like' : 'stroke-ink'}`}>
                    <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-body font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 차단 확인 모달 */}
      {blockConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-page"
          onClick={() => setBlockConfirm(false)}
        >
          <div
            className="w-full max-w-[360px] bg-surface rounded-card-lg p-5 shadow-elevated animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover bg-surface-muted flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-title font-extrabold text-ink truncate">{profile.name}</div>
                <div className="text-caption text-ink-placeholder truncate">@{profile.name}</div>
              </div>
            </div>
            <p className="text-label text-ink-secondary leading-relaxed mb-4">
              <span className="font-bold text-ink">{profile.name}</span>님을 차단하면
              피드·댓글·메시지가 더 이상 보이지 않아요
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setBlockConfirm(false)}
                className="flex-1 py-3 bg-surface-muted text-ink text-label font-bold rounded-card hover:bg-border-light transition-colors"
              >
                취소
              </button>
              <button
                onClick={doBlock}
                className="flex-1 py-3 bg-primary text-white text-label font-bold rounded-card hover:bg-primary-dark transition-colors"
              >
                차단하기
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
