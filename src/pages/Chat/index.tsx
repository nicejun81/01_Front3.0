import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch } from '../../components/Icons'

const chatRooms = [
  {
    id: 1,
    type: 'trainer' as const,
    name: '김민수 트레이너',
    avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face',
    lastMessage: '내일 PT 수업 시간 변경 가능할까요?',
    time: '오후 2:30',
    unreadCount: 1,
    isOnline: true,
    pinned: true,
    gym: '바디채널 강남점',
  },
  {
    id: 2,
    type: 'trainer' as const,
    name: '정서연 트레이너',
    avatarUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=100&h=100&fit=crop&crop=face',
    lastMessage: '오늘 운동 루틴 보내드릴게요 💪',
    time: '오전 11:20',
    unreadCount: 0,
    isOnline: true,
    gym: '바디채널 서초점',
  },
  {
    id: 3,
    type: 'friend' as const,
    name: '이준혁',
    avatarUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=100&h=100&fit=crop&crop=face',
    lastMessage: '내일 같이 운동하자!',
    time: '오전 9:45',
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: 4,
    type: 'trainer' as const,
    name: '한동훈 트레이너',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: '식단 체크 완료했습니다. 잘 하고 계세요!',
    time: '어제',
    unreadCount: 0,
    isOnline: false,
    gym: '바디채널 역삼점',
  },
  {
    id: 5,
    type: 'friend' as const,
    name: '박지영',
    avatarUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
    lastMessage: '바레톤 수업 같이 들을래?',
    time: '어제',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 6,
    type: 'friend' as const,
    name: '윤미래',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: '다이어트 챌린지 같이 하자 🔥',
    time: '월요일',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 7,
    type: 'group' as const,
    name: '강남 러닝크루',
    avatarUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop&crop=face',
    lastMessage: '이번 토요일 한강 코스로 달릴게요!',
    time: '월요일',
    unreadCount: 12,
    isOnline: false,
  },
]

const friends = [
  { id: 'f1', name: '최강민', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', isOnline: true, status: '오늘 운동 완료 💪' },
  { id: 'f2', name: '한동훈', avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face', isOnline: true, status: '바디채널 강남점' },
  { id: 'f3', name: '서지수', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', isOnline: false, status: '주 5회 운동 중' },
  { id: 'f4', name: '장하은', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face', isOnline: false, status: '바레톤 입문' },
  { id: 'f5', name: '오태준', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face', isOnline: true, status: '러닝 300km 달성!' },
  { id: 'f6', name: '김다은', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', isOnline: false, status: '' },
]

const tabs = [
  { key: 'chats', label: '채팅' },
  { key: 'friends', label: '친구' },
] as const

export const ChatPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('chats')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = chatRooms.filter((room) =>
    searchQuery ? room.name.includes(searchQuery) || room.lastMessage.includes(searchQuery) : true
  )
  const filteredFriends = friends.filter((f) => !searchQuery || f.name.includes(searchQuery))

  const totalUnread = chatRooms.reduce((s, r) => s + r.unreadCount, 0)
  const onlineFriends = chatRooms.filter((r) => r.isOnline)
  const pinned = filtered.filter((r) => r.pinned)
  const unpinned = filtered.filter((r) => !r.pinned)

  const header = (
    <SubPageHeader
      title={`채팅${totalUnread > 0 ? ` ${totalUnread}` : ''}`}
      right={
        <button className="icon-btn" onClick={() => navigate('/chat/new')}>
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-ink stroke-2 fill-none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding>
      {/* Search bar */}
      <div className="px-page py-3">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-muted rounded-pill">
          <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름 또는 메시지 검색"
            className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-placeholder focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none">
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Online friends row */}
      {onlineFriends.length > 0 && !searchQuery && (
        <div className="px-page pb-3">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {onlineFriends.map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/chat/${f.id}`)}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div className="relative">
                  <img src={f.avatarUrl} alt={f.name} className="w-14 h-14 rounded-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-semantic-online border-2 border-white rounded-full" />
                </div>
                <span className="text-caption text-ink-secondary w-14 text-center truncate">{f.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-page pb-2 border-b border-border-light">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-pill text-label font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-ink text-white'
                : 'bg-surface-muted text-ink-secondary hover:bg-surface-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col">
        {activeTab === 'chats' ? (
          filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-ink-tertiary">
              <svg viewBox="0 0 24 24" className="w-14 h-14 stroke-ink-disabled stroke-[1.5] fill-none mb-3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-body">대화 중인 채팅이 없어요</p>
            </div>
          ) : (
            <>
              {pinned.length > 0 && (
                <div className="px-page pt-3 pb-1 text-caption font-bold text-ink-tertiary uppercase tracking-wide">
                  고정됨
                </div>
              )}
              {pinned.map((room) => (
                <ChatRow key={room.id} room={room} pinned onClick={() => navigate(`/chat/${room.id}`)} />
              ))}
              {pinned.length > 0 && unpinned.length > 0 && <div className="h-px bg-border-light my-1" />}
              {unpinned.map((room) => (
                <ChatRow key={room.id} room={room} onClick={() => navigate(`/chat/${room.id}`)} />
              ))}
            </>
          )
        ) : filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink-tertiary">
            <p className="text-body">친구가 없어요</p>
          </div>
        ) : (
          <>
            <div className="px-page pt-3 pb-1 text-caption font-bold text-ink-tertiary uppercase tracking-wide">
              친구 {filteredFriends.length}
            </div>
            {filteredFriends.map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/profile/${encodeURIComponent(f.name)}`)}
                className="flex items-center gap-3 px-page py-3 text-left hover:bg-surface-subtle transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <img src={f.avatarUrl} alt={f.name} className="w-[52px] h-[52px] rounded-full object-cover" />
                  {f.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-semantic-online border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body font-semibold text-ink truncate">{f.name}</div>
                  {f.status && <div className="text-label text-ink-secondary truncate">{f.status}</div>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/chat/${f.id}`) }}
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-primary stroke-2 fill-none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" />
                  </svg>
                </button>
              </button>
            ))}
          </>
        )}
      </div>
    </PageLayout>
  )
}

const ChatRow = ({
  room,
  pinned,
  onClick,
}: {
  room: typeof chatRooms[number]
  pinned?: boolean
  onClick: () => void
}) => {
  const unread = room.unreadCount > 0
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-page py-3 text-left hover:bg-surface-subtle transition-colors"
    >
      <div className="relative flex-shrink-0">
        <img src={room.avatarUrl} alt={room.name} className="w-[52px] h-[52px] rounded-full object-cover" />
        {room.isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-semantic-online border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-body truncate ${unread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}>
            {room.name}
          </span>
          {room.type === 'trainer' && (
            <span className="text-caption font-semibold text-primary bg-primary-50 px-1.5 py-0.5 rounded flex-shrink-0">
              트레이너
            </span>
          )}
          {room.type === 'group' && (
            <span className="text-caption font-semibold text-accent-purple bg-surface-muted px-1.5 py-0.5 rounded flex-shrink-0">
              모임
            </span>
          )}
          {pinned && (
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-ink-tertiary flex-shrink-0">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          )}
        </div>
        <p className={`text-label truncate ${unread ? 'text-ink font-semibold' : 'text-ink-secondary'}`}>
          {room.lastMessage}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`text-caption ${unread ? 'text-primary font-bold' : 'text-ink-tertiary'}`}>
          {room.time}
        </span>
        {unread ? (
          <span className="min-w-[20px] h-5 bg-primary text-white text-caption font-bold rounded-full flex items-center justify-center px-1.5">
            {room.unreadCount > 99 ? '99+' : room.unreadCount}
          </span>
        ) : (
          <span className="h-5" />
        )}
      </div>
    </button>
  )
}
