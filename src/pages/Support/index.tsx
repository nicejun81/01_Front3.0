import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { PageLayout, SubPageHeader, FilterTabs } from '../../components'
import { IconSearch, IconChevronRight, IconX, IconClock } from '../../components/Icons'

type Category = '전체' | '결제·환불' | '예약·이용' | '회원권' | '앱 사용' | '이벤트'
const CATEGORIES: Category[] = ['전체', '결제·환불', '예약·이용', '회원권', '앱 사용', '이벤트']

type Faq = {
  id: string
  category: Exclude<Category, '전체'>
  question: string
  answer: string
}

const FAQS: Faq[] = [
  { id: 'f1', category: '결제·환불', question: '결제 취소 후 환불은 언제 받을 수 있나요?',
    answer: '카드 결제의 경우 영업일 기준 3~5일, 간편결제는 1~2일 내에 환불 처리됩니다. 환불 금액은 이용일수 기준으로 일할 계산됩니다.' },
  { id: 'f2', category: '결제·환불', question: '쿠폰과 포인트는 중복 사용 가능한가요?',
    answer: '포인트는 대부분의 결제에 쿠폰과 함께 사용할 수 있지만, 일부 할인 상품이나 체험특가는 중복 적용되지 않습니다. 결제 화면에서 안내드립니다.' },
  { id: 'f3', category: '예약·이용', question: '예약 변경·취소는 어떻게 하나요?',
    answer: '예약 상세 페이지에서 예약 시간 3시간 전까지 변경 또는 취소할 수 있습니다. 3시간 이내 취소 시에는 이용 횟수가 차감됩니다.' },
  { id: 'f4', category: '예약·이용', question: '노쇼(No-show) 시에도 횟수가 차감되나요?',
    answer: '네, 예약 후 방문하지 않으면 1회 차감됩니다. 부득이한 경우 3시간 전까지 취소해 주세요.' },
  { id: 'f5', category: '회원권', question: '회원권을 일시 정지할 수 있나요?',
    answer: '멤버십 종류에 따라 다르지만, 대부분 최대 30일까지 일시 정지가 가능합니다. 이용권 상세 페이지에서 신청하거나 고객센터로 문의해 주세요.' },
  { id: 'f6', category: '회원권', question: '회원권을 다른 사람에게 양도할 수 있나요?',
    answer: '개인 식별이 필요한 상품 특성상 원칙적으로 양도가 불가합니다. 단, 장기 출장·이사 등 사유가 있다면 고객센터로 문의해 주세요.' },
  { id: 'f7', category: '앱 사용', question: '비밀번호를 잊어버렸어요.',
    answer: '로그인 화면의 "비밀번호 찾기"를 통해 가입 시 등록한 이메일이나 휴대전화 번호로 재설정할 수 있습니다.' },
  { id: 'f8', category: '앱 사용', question: '푸시 알림이 오지 않아요.',
    answer: '기기의 설정 → 알림 → 바디채널에서 알림이 허용돼 있는지 확인해 주세요. 앱 내 마이페이지 → 알림 설정에서 세부 항목을 조정할 수 있습니다.' },
  { id: 'f9', category: '이벤트', question: '친구 초대 보상은 언제 지급되나요?',
    answer: '초대한 친구가 가입 후 첫 결제를 완료한 시점부터 영업일 기준 1~3일 내에 쿠폰·포인트가 지급됩니다.' },
  { id: 'f10', category: '이벤트', question: '체험특가 쿠폰은 어디서 사용하나요?',
    answer: '결제 시 "쿠폰 적용" 화면에서 자동으로 사용 가능한 쿠폰이 추천됩니다. 체험특가 쿠폰은 해당 체험권에만 사용할 수 있어요.' },
]

type Channel = {
  id: 'chat' | 'phone'
  label: string
  desc: string
  icon: React.ReactNode
  accent: string
}

const ICON_CHAT = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current stroke-2" fill="none">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ICON_PHONE = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current stroke-2" fill="none">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CHANNELS: Channel[] = [
  { id: 'chat',  label: '1:1 문의',    desc: '앱에서 바로 상담',    accent: 'bg-primary text-white', icon: ICON_CHAT },
  { id: 'phone', label: '전화 상담',   desc: '1588-0000',           accent: 'bg-ink text-white',     icon: ICON_PHONE },
]

const CHANNEL_ACTION: Record<Channel['id'], { type: 'href'; value: string } | { type: 'modal' } | { type: 'toast'; value: string }> = {
  chat:  { type: 'modal' },
  phone: { type: 'href',  value: 'tel:1588-0000' },
}

const INQUIRY_CATEGORIES = ['결제·환불', '예약·이용', '회원권', '앱 사용', '이벤트', '기타'] as const
type InquiryCategory = typeof INQUIRY_CATEGORIES[number]

interface FaqItemProps {
  faq: Faq
  open: boolean
  onToggle: (id: string) => void
}

const FaqItem = memo(({ faq, open, onToggle }: FaqItemProps) => (
  <div className="border-b border-border-light last:border-0">
    <button
      onClick={() => onToggle(faq.id)}
      className="w-full flex items-center justify-between gap-3 py-3.5 text-left hover:bg-surface-subtle transition-colors"
      aria-expanded={open}
    >
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <span className="text-caption font-extrabold text-primary mt-0.5 flex-shrink-0">Q.</span>
        <span className="text-label font-semibold text-ink leading-snug">{faq.question}</span>
      </div>
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 stroke-ink-tertiary stroke-[2] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        fill="none"
        aria-hidden
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    {open && (
      <div className="pl-6 pr-4 pb-3.5">
        <p className="text-label text-ink-secondary leading-relaxed whitespace-pre-line">{faq.answer}</p>
      </div>
    )}
  </div>
))
FaqItem.displayName = 'FaqItem'

interface ChannelButtonProps {
  channel: Channel
  onClick: (id: Channel['id']) => void
}

const ChannelButton = memo(({ channel, onClick }: ChannelButtonProps) => (
  <button
    onClick={() => onClick(channel.id)}
    className={`flex items-center gap-3 p-3.5 rounded-card-lg ${channel.accent} hover:opacity-90 active:scale-[0.98] transition-all text-left`}
  >
    <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
      {channel.icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-label font-extrabold">{channel.label}</div>
      <div className="text-caption opacity-80 truncate">{channel.desc}</div>
    </div>
  </button>
))
ChannelButton.displayName = 'ChannelButton'

export const SupportPage = () => {
  const [category, setCategory] = useState<Category>('전체')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inqCategory, setInqCategory] = useState<InquiryCategory>('결제·환불')
  const [inqTitle, setInqTitle] = useState('')
  const [inqContent, setInqContent] = useState('')
  const [inqEmail, setInqEmail] = useState('')

  // 검색 디바운스
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 150)
    return () => clearTimeout(id)
  }, [query])

  // 토스트 자동 닫힘
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const showToast = useCallback((m: string) => setToast(m), [])

  const handleToggle = useCallback((id: string) => {
    setOpenId(prev => prev === id ? null : id)
  }, [])

  const handleChannel = useCallback((id: Channel['id']) => {
    const action = CHANNEL_ACTION[id]
    if (action.type === 'href') {
      window.location.href = action.value
    } else if (action.type === 'modal') {
      setInquiryOpen(true)
    } else {
      showToast(action.value)
    }
  }, [showToast])

  const closeInquiry = useCallback(() => setInquiryOpen(false), [])

  const submitInquiry = useCallback(() => {
    if (!inqTitle.trim() || !inqContent.trim()) {
      showToast('제목과 내용을 입력해 주세요')
      return
    }
    setInquiryOpen(false)
    setInqTitle('')
    setInqContent('')
    setInqEmail('')
    setInqCategory('결제·환불')
    showToast('문의가 접수되었어요. 24시간 내 답변드릴게요')
  }, [inqTitle, inqContent, showToast])

  const clearQuery = useCallback(() => setQuery(''), [])

  const filtered = useMemo(() => {
    const q = debouncedQuery
    return FAQS.filter(f => {
      if (category !== '전체' && f.category !== category) return false
      if (!q) return true
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    })
  }, [category, debouncedQuery])

  const handleCategory = useCallback((k: string) => {
    setCategory(k as Category)
    setOpenId(null)
  }, [])

  return (
    <PageLayout
      header={<SubPageHeader title="고객센터" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 + 검색 + 상담시간 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-5 pb-4 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-baseline justify-between mb-1">
            <h1 className="text-title font-extrabold text-ink">무엇을 도와드릴까요?</h1>
            <span className="inline-flex items-center gap-1 text-caption text-ink-tertiary">
              <IconClock className="w-3 h-3 stroke-ink-tertiary stroke-2" />
              평일 09–18시
            </span>
          </div>
          <p className="text-label text-ink-tertiary">
            자주 묻는 질문을 검색하거나 상담사에게 바로 문의할 수 있어요
          </p>

          {/* 검색바 */}
          <label className="mt-3 flex items-center gap-2 px-3.5 py-3 bg-surface rounded-pill border border-border focus-within:border-primary/50 transition-colors">
            <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="궁금한 내용을 검색해 주세요"
              className="flex-1 min-w-0 bg-transparent text-label text-ink placeholder:text-ink-placeholder outline-none"
            />
            {query && (
              <button
                onClick={clearQuery}
                className="w-5 h-5 rounded-full bg-ink-placeholder/40 flex items-center justify-center flex-shrink-0"
                aria-label="검색어 지우기"
              >
                <IconX className="w-3 h-3 stroke-white stroke-[3]" />
              </button>
            )}
          </label>
        </div>
      </div>

      {/* 상담 채널 */}
      <div className="px-page pt-4">
        <h2 className="text-label font-extrabold text-ink mb-2 tracking-wider">상담 채널</h2>
        <div className="grid grid-cols-2 gap-2">
          {CHANNELS.map(ch => (
            <ChannelButton key={ch.id} channel={ch} onClick={handleChannel} />
          ))}
        </div>
      </div>

      {/* FAQ 카테고리 */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border mt-4">
        <FilterTabs
          tabs={CATEGORIES.map(c => ({ key: c, label: c }))}
          active={category}
          onSelect={handleCategory}
          scrollable
          className="border-t border-border-light"
        />
      </div>

      {/* FAQ 리스트 */}
      <div className="px-page pt-3">
        <div className="flex items-baseline justify-between py-1">
          <h2 className="text-title font-extrabold text-ink">자주 묻는 질문</h2>
          <span className="text-label text-ink-tertiary tabular-nums">{filtered.length}건</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center">
              <IconSearch className="w-5 h-5 stroke-ink-placeholder stroke-2" />
            </div>
            <p className="text-body text-ink-tertiary">해당 질문을 찾을 수 없어요</p>
            <p className="text-caption text-ink-placeholder mt-1">다른 키워드로 검색해 보세요</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(f => (
              <FaqItem key={f.id} faq={f} open={openId === f.id} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>

      {/* 기타 링크 */}
      <div className="px-page">
        <div className="bg-surface-muted rounded-card-lg p-4">
          <h4 className="text-label font-extrabold text-ink mb-1.5 tracking-wider">더 알아보기</h4>
          <ul className="flex flex-col">
            {['공지사항', '이용약관', '개인정보 처리방침'].map(l => (
              <li key={l}>
                <button className="w-full flex items-center justify-between py-2 text-left hover:underline">
                  <span className="text-label text-ink-secondary">{l}</span>
                  <IconChevronRight className="w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5]" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 1:1 문의 등록 모달 */}
      {inquiryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={closeInquiry}
        >
          <div
            className="w-full max-w-[480px] bg-surface rounded-t-card-lg pt-3 pb-5 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
            <div className="px-page">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-title font-extrabold text-ink">1:1 문의 남기기</h3>
                <button
                  onClick={closeInquiry}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
                  aria-label="닫기"
                >
                  <IconX className="w-4 h-4 stroke-ink stroke-2" />
                </button>
              </div>
              <p className="text-caption text-ink-tertiary mb-4">
                평일 09–18시 접수 기준 24시간 이내 답변드려요
              </p>

              {/* 카테고리 */}
              <label className="block text-caption font-bold text-ink-secondary mb-1.5">문의 유형</label>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {INQUIRY_CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setInqCategory(c)}
                    className={`px-3 py-1.5 rounded-pill text-caption font-bold border transition-colors ${
                      inqCategory === c
                        ? 'bg-ink border-ink text-white'
                        : 'bg-surface border-border text-ink hover:border-ink-placeholder'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* 제목 */}
              <label className="block text-caption font-bold text-ink-secondary mb-1.5">제목</label>
              <input
                value={inqTitle}
                onChange={e => setInqTitle(e.target.value)}
                placeholder="문의 제목을 입력해 주세요"
                maxLength={50}
                className="w-full px-3.5 py-2.5 mb-4 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40"
              />

              {/* 내용 */}
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-caption font-bold text-ink-secondary">문의 내용</label>
                <span className="text-caption text-ink-placeholder tabular-nums">{inqContent.length}/500</span>
              </div>
              <textarea
                value={inqContent}
                onChange={e => setInqContent(e.target.value.slice(0, 500))}
                placeholder="궁금한 내용을 자세히 적어주세요"
                rows={5}
                className="w-full px-3.5 py-2.5 mb-4 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
              />

              {/* 이메일 */}
              <label className="block text-caption font-bold text-ink-secondary mb-1.5">답변받을 이메일 (선택)</label>
              <input
                type="email"
                value={inqEmail}
                onChange={e => setInqEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 mb-5 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40"
              />

              {/* 제출 */}
              <button
                onClick={submitInquiry}
                className="w-full py-3 bg-primary text-white text-body font-extrabold rounded-card hover:bg-primary-dark active:scale-[0.99] transition-all"
              >
                문의 등록
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </PageLayout>
  )
}
