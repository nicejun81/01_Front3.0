import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const chatData: Record<string, {
  name: string
  avatarUrl: string
  isOnline: boolean
  type: string
  messages: { id: number; sender: 'me' | 'other'; text: string; time: string; date?: string }[]
}> = {
  '1': {
    name: '김민수 트레이너',
    avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    type: 'trainer',
    messages: [
      { id: 1, sender: 'other', text: '안녕하세요! 오늘 운동은 어떠셨어요?', time: '오후 1:00', date: '오늘' },
      { id: 2, sender: 'me', text: '좋았어요! 덕분에 폼이 많이 좋아진 것 같아요 💪', time: '오후 1:05' },
      { id: 3, sender: 'other', text: '잘하고 계세요! 다음 시간에는 데드리프트 중량 올려볼게요', time: '오후 1:10' },
      { id: 4, sender: 'me', text: '넵! 그리고 내일 PT 수업 시간 변경 가능할까요?', time: '오후 2:30' },
    ],
  },
  '2': {
    name: '정서연 트레이너',
    avatarUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    type: 'trainer',
    messages: [
      { id: 1, sender: 'other', text: '오늘 운동 루틴 보내드릴게요 💪', time: '오전 11:00', date: '오늘' },
      { id: 2, sender: 'other', text: '스쿼트 4세트 x 12회\n런지 3세트 x 15회\n레그프레스 4세트 x 10회\n레그컬 3세트 x 12회', time: '오전 11:05' },
      { id: 3, sender: 'me', text: '감사합니다! 오늘 이거 따라해볼게요', time: '오전 11:20' },
    ],
  },
  '3': {
    name: '이준혁',
    avatarUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'friend',
    messages: [
      { id: 1, sender: 'other', text: '요즘 운동 어떻게 해?', time: '오전 9:00', date: '오늘' },
      { id: 2, sender: 'me', text: '나 요즘 주 5일 가고 있어', time: '오전 9:10' },
      { id: 3, sender: 'other', text: '대박 ㅋㅋ 나도 다시 시작해야 하는데', time: '오전 9:30' },
      { id: 4, sender: 'other', text: '내일 같이 운동하자!', time: '오전 9:45' },
    ],
  },
  '4': {
    name: '한동훈 트레이너',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'trainer',
    messages: [
      { id: 1, sender: 'me', text: '트레이너님 오늘 식단 기록 보내드려요', time: '오후 7:00', date: '어제' },
      { id: 2, sender: 'me', text: '아침: 계란 3개 + 통밀빵\n점심: 닭가슴살 샐러드\n저녁: 고구마 + 연어', time: '오후 7:01' },
      { id: 3, sender: 'other', text: '식단 체크 완료했습니다. 잘 하고 계세요!', time: '오후 9:30' },
      { id: 4, sender: 'other', text: '저녁에 단백질을 좀 더 추가하시면 좋겠어요 🥩', time: '오후 9:31' },
    ],
  },
  '5': {
    name: '박지영',
    avatarUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    type: 'friend',
    messages: [
      { id: 1, sender: 'other', text: '바레톤 수업 같이 들을래?', time: '오후 3:00', date: '어제' },
      { id: 2, sender: 'me', text: '오 좋아! 몇시 수업?', time: '오후 3:15' },
      { id: 3, sender: 'other', text: '화요일 저녁 7시! 바디채널 서초점이야', time: '오후 3:20' },
    ],
  },
  '6': {
    name: '윤미래',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'friend',
    messages: [
      { id: 1, sender: 'other', text: '다이어트 챌린지 같이 하자 🔥', time: '오전 10:00', date: '월요일' },
      { id: 2, sender: 'me', text: '어떤 챌린지?', time: '오전 10:30' },
      { id: 3, sender: 'other', text: '30일 식단 + 운동 챌린지! 매일 인증하는 거야', time: '오전 10:35' },
    ],
  },
  '7': {
    name: '강남 러닝크루',
    avatarUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    type: 'group',
    messages: [
      { id: 1, sender: 'other', text: '이번 토요일 한강 코스로 달릴게요!', time: '오후 8:00', date: '월요일' },
      { id: 2, sender: 'other', text: '집결 장소: 여의도 한강공원 물빛광장', time: '오후 8:01' },
      { id: 3, sender: 'me', text: '넵 참가합니다! 🏃‍♂️', time: '오후 8:30' },
    ],
  },
}

export const ChatRoomPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const room = chatData[id || '1']
  const [messages, setMessages] = useState(room?.messages || [])
  const [inputText, setInputText] = useState('')
  const [showAttach, setShowAttach] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [muted, setMuted] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const [showDateModal, setShowDateModal] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordSec, setRecordSec] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recordTimerRef = useRef<number | null>(null)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      rec.ondataavailable = (e) => chunks.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const sec = recordSec
        stream.getTracks().forEach((t) => t.stop())
        if (blob.size > 0) {
          sendMessage(`🎤 음성 메시지 (${sec}초)`)
        }
        setRecording(false)
        setRecordSec(0)
        if (recordTimerRef.current) window.clearInterval(recordTimerRef.current)
      }
      recorderRef.current = rec
      rec.start()
      setRecording(true)
      setRecordSec(0)
      recordTimerRef.current = window.setInterval(() => setRecordSec((s) => s + 1), 1000)
    } catch (err) {
      alert('마이크 권한이 필요해요: ' + (err as Error).message)
    }
  }
  const stopRecording = () => {
    recorderRef.current?.stop()
  }
  const [pickedDate, setPickedDate] = useState(today)
  const [pickedTime, setPickedTime] = useState('12:00')
  const sendMessage = (text: string) => {
    const now = new Date()
    const h = now.getHours()
    const timeStr = `${h >= 12 ? '오후' : '오전'} ${h > 12 ? h - 12 : h || 12}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages((prev) => [...prev, { id: prev.length + 1, sender: 'me', text, time: timeStr }])
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen text-ink-placeholder">
        채팅방을 찾을 수 없습니다
      </div>
    )
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    const now = new Date()
    const h = now.getHours()
    const timeStr = `${h >= 12 ? '오후' : '오전'} ${h > 12 ? h - 12 : h || 12}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages(prev => [
      ...prev,
      { id: prev.length + 1, sender: 'me', text: inputText, time: timeStr },
    ])
    setInputText('')
  }

  return (
    <div className="flex flex-col h-screen bg-surface-subtle">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-page py-3 bg-surface border-b border-border-light">
        <button onClick={() => navigate(-1)} className="-ml-2 p-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => navigate(`/profile/${encodeURIComponent(room.name)}`)}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="relative flex-shrink-0">
            <img src={room.avatarUrl} alt={room.name} className="w-10 h-10 rounded-full object-cover" />
            {room.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-semantic-online border-2 border-white rounded-full" />
            )}
          </div>
          <div className="text-left min-w-0">
            <div className="text-body font-bold text-ink leading-tight truncate">{room.name}</div>
            <div className="text-label text-ink-tertiary">{room.isOnline ? '온라인' : '오프라인'}</div>
          </div>
        </button>
        <button className="p-2" onClick={() => setShowMenu(true)}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </header>

      {/* More menu bottom sheet */}
      {showMenu && (
        <div className="fixed inset-0 z-[60] flex items-end" onClick={() => setShowMenu(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full bg-surface rounded-t-2xl pb-6 pt-2 animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-ink-disabled rounded-full mx-auto mb-2" />
            {[
              {
                label: muted ? '알림 켜기' : '알림 끄기',
                icon: muted
                  ? 'M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3M9 17H4l1.4-1.4A2 2 0 006 14.2V11a6 6 0 011-3.3M1 1l22 22M13.7 21a2 2 0 01-3.4 0'
                  : 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
                action: () => setMuted((v) => !v),
              },
              {
                label: '대화 검색',
                icon: 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z',
                action: () => setShowSearch(true),
              },
              {
                label: '사진/파일 모아보기',
                icon: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM21 15l-5-5L5 21',
                action: () => setShowGallery(true),
              },
              {
                label: '신고하기',
                icon: 'M4 21V4M4 4h13l-2 5 2 5H4',
                action: () => navigate('/report?target=대화'),
              },
              {
                label: '대화방 나가기',
                icon: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
                action: () => {
                  if (confirm('대화방을 나가시겠어요? 모든 대화 내용이 삭제됩니다.')) {
                    navigate('/chat')
                  }
                },
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { item.action(); setShowMenu(false) }}
                className="w-full px-page py-4 flex items-center gap-3 text-body text-ink hover:bg-surface-subtle"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none">
                  <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowMenu(false)}
              className="w-full px-page py-4 text-center text-body text-ink-secondary border-t border-border-light"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Search bar */}
      {showSearch && (
        <div className="flex-shrink-0 flex items-center gap-2 px-page py-2 bg-surface border-b border-border-light">
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-surface-muted rounded-pill">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2 fill-none">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="대화 내용 검색"
              className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-placeholder focus:outline-none"
            />
            {searchQuery && (
              <span className="text-caption text-ink-tertiary">
                {messages.filter((m) => m.text.includes(searchQuery)).length}건
              </span>
            )}
          </div>
          <button
            onClick={() => { setShowSearch(false); setSearchQuery('') }}
            className="text-label font-semibold text-ink-secondary px-2"
          >
            취소
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-page py-4"
        onClick={() => {
          if (showEmoji) setShowEmoji(false)
          if (showAttach) setShowAttach(false)
        }}
      >
        <div className="flex flex-col gap-1">
          {messages.filter((m) => !searchQuery || m.text.includes(searchQuery)).map((msg, i, arr) => {
            const _ = arr // keep filter scope
            void _
            const prev = messages[i - 1]
            const next = messages[i + 1]
            const showDate = !!msg.date
            const isFirstOfGroup = !prev || prev.sender !== msg.sender || prev.time !== msg.time
            const isLastOfGroup = !next || next.sender !== msg.sender || next.time !== msg.time
            const isMe = msg.sender === 'me'

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 bg-surface-muted text-caption text-ink-tertiary rounded-full">
                      {msg.date}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isLastOfGroup ? 'mb-2' : ''}`}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                    {!isMe && (
                      <div className="w-8 flex-shrink-0">
                        {isLastOfGroup && (
                          <img src={room.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        )}
                      </div>
                    )}
                    <div className="flex flex-col">
                      {!isMe && isFirstOfGroup && (
                        <div className="text-label text-ink-tertiary mb-0.5 ml-1">{room.name}</div>
                      )}
                      <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <div
                          className={`px-4 py-2.5 text-body leading-relaxed whitespace-pre-wrap ${
                            isMe
                              ? 'bg-primary text-white'
                              : 'bg-surface text-ink border border-border-light'
                          }`}
                          style={{
                            borderRadius: isMe
                              ? `18px ${isFirstOfGroup ? '18px' : '6px'} ${isLastOfGroup ? '6px' : '18px'} 18px`
                              : `${isFirstOfGroup ? '18px' : '6px'} 18px 18px ${isLastOfGroup ? '6px' : '18px'}`,
                          }}
                        >
                          {msg.text}
                        </div>
                        {isLastOfGroup && (
                          <div className="text-caption text-ink-tertiary flex flex-col items-end gap-0.5 pb-0.5">
                            {isMe && <span className="text-primary font-semibold">읽음</span>}
                            <span>{msg.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Media gallery modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[70] flex items-end" onClick={() => setShowGallery(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full bg-surface rounded-t-2xl pb-6 pt-2 max-h-[80vh] flex flex-col animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-ink-disabled rounded-full mx-auto mb-2" />
            <h3 className="text-title font-bold text-ink text-center pb-3 border-b border-border-light">사진/파일</h3>
            <div className="flex-1 overflow-y-auto p-3">
              {(() => {
                const items = messages.filter((m) => /📷|📎|🎤|📅/.test(m.text))
                if (items.length === 0) {
                  return <div className="text-center py-12 text-ink-tertiary text-body">공유된 사진이나 파일이 없어요</div>
                }
                return (
                  <ul className="space-y-2">
                    {items.map((m) => (
                      <li key={m.id} className="px-card-lg py-3 bg-surface-subtle rounded-card">
                        <div className="text-body text-ink">{m.text}</div>
                        <div className="text-caption text-ink-tertiary mt-1">{m.time}</div>
                      </li>
                    ))}
                  </ul>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Date + time picker modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-page" onClick={() => setShowDateModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-sm bg-surface rounded-card-lg p-6 animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-heading font-bold text-ink mb-4">날짜와 시간 선택</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-label text-ink-secondary mb-1.5">날짜</label>
                <input
                  type="date"
                  value={pickedDate}
                  onChange={(e) => setPickedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-subtle border border-border rounded-card text-body text-ink focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-label text-ink-secondary mb-1.5">시간</label>
                <input
                  type="time"
                  value={pickedTime}
                  onChange={(e) => setPickedTime(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-subtle border border-border rounded-card text-body text-ink focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDateModal(false)}
                className="flex-1 py-3 bg-surface-muted text-ink font-semibold rounded-card hover:bg-surface-subtle transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (!pickedDate || !pickedTime) return
                  const [y, m, d] = pickedDate.split('-')
                  const [hh, mm] = pickedTime.split(':')
                  const hourNum = parseInt(hh)
                  const ampm = hourNum >= 12 ? '오후' : '오전'
                  const hour12 = hourNum > 12 ? hourNum - 12 : hourNum || 12
                  sendMessage(`📅 ${y}년 ${parseInt(m)}월 ${parseInt(d)}일 ${ampm} ${hour12}:${mm}`)
                  setShowDateModal(false)
                }}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach options */}
      {showAttach && (
        <div className="flex-shrink-0 grid grid-cols-4 gap-2 px-page py-3 bg-surface border-t border-border-light">
          {[
            {
              label: '사진',
              icon: 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 8.5l3 3 5-5M3 17l6-6 11 11',
              accept: 'image/*',
            },
            {
              label: '카메라',
              icon: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
              accept: 'image/*',
              capture: 'environment',
            },
            {
              label: '파일',
              icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
              accept: '*/*',
            },
            {
              label: '달력',
              icon: 'M21 10H3M16 2v4M8 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
              onClick: () => setShowDateModal(true),
            },
          ].map((a) => (
            <label
              key={a.label}
              className="flex flex-col items-center gap-1.5 py-2 cursor-pointer"
              onClick={() => {
                if (a.onClick) {
                  a.onClick()
                  setShowAttach(false)
                }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-primary stroke-2 fill-none">
                  <path d={a.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-caption text-ink-secondary">{a.label}</span>
              {a.accept && (
                <input
                  type="file"
                  accept={a.accept}
                  {...(a.capture ? { capture: a.capture as 'environment' } : {})}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const isImage = file.type.startsWith('image/')
                    sendMessage(isImage ? `📷 사진을 보냈습니다 (${file.name})` : `📎 ${file.name}`)
                    setShowAttach(false)
                  }}
                />
              )}
            </label>
          ))}
        </div>
      )}

      {/* Emoji panel */}
      {showEmoji && (
        <div className="flex-shrink-0 px-page py-3 bg-surface border-t border-border-light max-h-[200px] overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {['😀','😂','🥰','😎','🤔','😴','😭','🥳','👍','👏','🙏','💪','🔥','✨','💯','❤️','🧡','💛','💚','💙','💜','🤍','🏃‍♂️','🏃‍♀️','🏋️','🧘','🚴','⚽','🏀','🎾','🥇','🏆'].map((e) => (
              <button
                key={e}
                onClick={() => {
                  setInputText((t) => t + e)
                }}
                className="text-2xl hover:bg-surface-subtle rounded p-1"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-border-light bg-surface px-page py-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAttach((v) => !v)}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className={`w-5 h-5 stroke-ink stroke-2 fill-none transition-transform ${showAttach ? 'rotate-45' : ''}`}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-surface-muted rounded-pill">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지 입력"
              className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-placeholder focus:outline-none"
            />
            <button className="flex-shrink-0" onClick={() => setShowEmoji((v) => !v)}>
              <svg viewBox="0 0 24 24" className={`w-5 h-5 stroke-2 fill-none ${showEmoji ? 'stroke-primary' : 'stroke-ink-secondary'}`}>
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {inputText.trim() ? (
            <button
              onClick={handleSend}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white stroke-2 fill-none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : recording ? (
            <button
              onClick={stopRecording}
              className="flex-shrink-0 h-9 px-3 rounded-full bg-semantic-like flex items-center gap-1.5 text-white"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-label font-bold">{recordSec}s</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
