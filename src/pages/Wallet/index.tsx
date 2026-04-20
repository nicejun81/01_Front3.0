import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

type WalletType = 'cash' | 'point' | 'coupon'

type HistoryItem = {
  date: string
  desc: string
  amount: string
  type: 'plus' | 'minus'
}

type CouponItem = HistoryItem & {
  expireDate?: string  // 만료일 (ISO 형식)
  minAmount?: string   // 최소 결제 금액
}

type WalletData = {
  title: string
  balance: string
  unit: string
  history: HistoryItem[] | CouponItem[]
}

const walletData: Record<WalletType, WalletData> = {
  cash: {
    title: '캐시', balance: '15,000', unit: '원',
    // 시간순 누적: +5,000 → -3,000(2,000) → +10,000(12,000) → -5,000(7,000) → +2,000(9,000)
    // → +3,000(12,000) → -5,000(7,000) → +20,000(27,000) → -10,000(17,000) → -2,000(15,000)
    history: [
      { date: '2026.04.18', desc: '레슨권 결제', amount: '-2,000', type: 'minus' },
      { date: '2026.04.10', desc: '헬스 이용권 결제', amount: '-10,000', type: 'minus' },
      { date: '2026.03.28', desc: '캐시 충전', amount: '+20,000', type: 'plus' },
      { date: '2026.03.26', desc: '헬스 이용권 결제', amount: '-5,000', type: 'minus' },
      { date: '2026.03.15', desc: '친구 초대 보상', amount: '+3,000', type: 'plus' },
      { date: '2026.03.01', desc: '이벤트 참여 보상', amount: '+2,000', type: 'plus' },
      { date: '2026.02.20', desc: 'PT 결제', amount: '-5,000', type: 'minus' },
      { date: '2026.02.10', desc: '캐시 충전', amount: '+10,000', type: 'plus' },
      { date: '2026.01.25', desc: '바레톤 결제', amount: '-3,000', type: 'minus' },
      { date: '2026.01.15', desc: '신규 가입 보상', amount: '+5,000', type: 'plus' },
    ],
  },
  point: {
    title: '포인트', balance: '2,500', unit: 'P',
    // 시간순 누적: +100 → +150(250) → -250(0) → +210(210) → +300(510)
    // → +700(1,210) → +1,290(2,500) → -1,000(1,500) → +1,000(2,500)
    history: [
      { date: '2026.04.15', desc: '리뷰 작성 보상', amount: '+1,000', type: 'plus' },
      { date: '2026.04.10', desc: '포인트 사용 (결제 차감)', amount: '-1,000', type: 'minus' },
      { date: '2026.03.26', desc: '헬스 이용권 결제 적립', amount: '+1,290', type: 'plus' },
      { date: '2026.03.20', desc: 'PT 결제 적립', amount: '+700', type: 'plus' },
      { date: '2026.03.15', desc: '리뷰 작성 보상', amount: '+300', type: 'plus' },
      { date: '2026.03.01', desc: '출석 체크 보상 (7일 연속)', amount: '+210', type: 'plus' },
      { date: '2026.02.15', desc: '바레톤 체험 적립', amount: '+150', type: 'plus' },
      { date: '2026.02.01', desc: '출석 체크 보상 (5일 연속)', amount: '+100', type: 'plus' },
      { date: '2026.01.20', desc: '포인트 사용 (결제 차감)', amount: '-250', type: 'minus' },
    ],
  },
  coupon: {
    title: '쿠폰', balance: '5', unit: '장',
    history: [
      { date: '발급 2026.04.01', expireDate: '2026.04.30', desc: '첫 달 80% OFF', amount: '첫 결제 시', minAmount: '제한 없음', type: 'plus' },
      { date: '발급 2026.04.10', expireDate: '2026.04.25', desc: '5,000원 할인', amount: '3만원 이상', minAmount: '최소 결제 30,000원', type: 'plus' },
      { date: '발급 2026.04.15', expireDate: '2026.05.31', desc: '10% 할인', amount: '레슨권 전용', minAmount: '레슨권 카테고리', type: 'plus' },
      { date: '발급 2026.04.18', expireDate: '2026.06.30', desc: '15,000원 할인', amount: '10만원 이상', minAmount: '최소 결제 100,000원', type: 'plus' },
      { date: '발급 2026.04.20', expireDate: '2026.05.10', desc: 'PT 1회 무료', amount: 'PT 패키지 결제 시', minAmount: 'PT 패키지 카테고리', type: 'plus' },
      { date: '발급 2026.03.01', expireDate: '2026.03.31', desc: '3,000원 할인', amount: '2만원 이상', minAmount: '최소 결제 20,000원', type: 'plus' },
    ],
  },
}

// "+20,000" / "-5,000" → 20000 (절대값)
const parseAmount = (a: string) => Math.abs(Number(a.replace(/[+\-,]/g, '')) || 0)

// "2026.03.28" → "2026.03"
const monthKey = (date: string) => date.slice(0, 7)
const monthLabel = (key: string) => {
  const [y, m] = key.split('.')
  return `${y}년 ${Number(m)}월`
}

const isToday = (now: Date) => (date: string) => {
  const [y, m, d] = date.split('.').map(Number)
  return now.getFullYear() === y && now.getMonth() + 1 === m && now.getDate() === d
}

// 만료까지 남은 일수
const daysUntil = (iso: string) => {
  const target = new Date(iso.replaceAll('.', '-'))
  const now = new Date(); now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

type Tab = '전체' | '적립' | '사용'
const TABS: Tab[] = ['전체', '적립', '사용']

type CouponTab = '사용가능' | '만료임박' | '만료'
const COUPON_TABS: CouponTab[] = ['사용가능', '만료임박', '만료']

type CouponSort = '만료임박순' | '할인순' | '최신순'
const COUPON_SORTS: CouponSort[] = ['만료임박순', '할인순', '최신순']

type Period = '1주' | '1개월' | '3개월' | '6개월' | '직접'
const PERIODS: Period[] = ['1주', '1개월', '3개월', '6개월', '직접']

// "2026.04.18" → Date
const parseDate = (s: string) => {
  const m = s.match(/(\d{4})\.(\d{2})\.(\d{2})/)
  if (!m) return new Date(0)
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

// Date → "2026-04-18" (input[type=date] 형식)
const toInputDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const IconWallet = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 7h18a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h14" />
    <path d="M16 12h4" />
  </svg>
)
const IconArrowDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
)
const IconArrowUp = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)
const IconReceipt = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16l3-3 3 3 3-3 3 3 3-3V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h4" />
  </svg>
)
const IconCash = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 10v.01M18 10v.01M6 14v.01M18 14v.01" strokeLinecap="round" />
  </svg>
)
const IconStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2l2.6 6.5h6.9l-5.6 4 2.1 6.5L12 15l-6 4 2.1-6.5-5.6-4h6.9L12 2z" />
  </svg>
)
const IconTicket = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
    <path d="M9 7v10" strokeDasharray="2 2" />
  </svg>
)

const CHARGE_PRESETS = [10000, 30000, 50000, 100000, 200000]

export const WalletPage = () => {
  const navigate = useNavigate()
  const { type } = useParams<{ type: WalletType }>()
  const data = walletData[(type || 'cash') as WalletType]
  const [tab, setTab] = useState<Tab>('전체')
  const [period, setPeriod] = useState<Period>('3개월')
  const todayDate = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const [customStart, setCustomStart] = useState(toInputDate(new Date(todayDate.getTime() - 30 * 24 * 60 * 60 * 1000)))
  const [customEnd, setCustomEnd] = useState(toInputDate(todayDate))
  const [chargeOpen, setChargeOpen] = useState(false)
  const [chargeAmount, setChargeAmount] = useState<number>(30000)
  const [customAmount, setCustomAmount] = useState('')
  const [couponTab, setCouponTab] = useState<CouponTab>('사용가능')
  const [couponSort, setCouponSort] = useState<CouponSort>('만료임박순')

  if (!data) return null

  const header = <SubPageHeader title={data.title} />
  const isCoupon = type === 'coupon'

  // 기간 필터: [시작, 종료] 날짜 범위 계산
  const dateRange = useMemo(() => {
    if (period === '직접') {
      return { start: new Date(customStart), end: new Date(customEnd + 'T23:59:59') }
    }
    const end = new Date(todayDate); end.setHours(23, 59, 59, 999)
    const start = new Date(todayDate)
    if (period === '1주') start.setDate(start.getDate() - 7)
    else if (period === '1개월') start.setMonth(start.getMonth() - 1)
    else if (period === '3개월') start.setMonth(start.getMonth() - 3)
    else if (period === '6개월') start.setMonth(start.getMonth() - 6)
    return { start, end }
  }, [period, customStart, customEnd, todayDate])

  // 이번 달 적립/사용 통계
  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthlyStats = useMemo(() => {
    if (isCoupon) return { plus: 0, minus: 0 }
    let plus = 0, minus = 0
    ;(data.history as HistoryItem[]).forEach(h => {
      if (monthKey(h.date) === thisMonthKey) {
        if (h.type === 'plus') plus += parseAmount(h.amount)
        else minus += parseAmount(h.amount)
      }
    })
    return { plus, minus }
  }, [data.history, isCoupon, thisMonthKey])

  // 잔액(현재) 기준 각 거래 후 잔액(running balance) 계산
  // 내역은 최신순(DESC) → 가장 최신 항목 후 잔액 = 현재 잔액
  const historyWithBalance = useMemo(() => {
    if (isCoupon) return null
    const currentBalance = parseAmount(data.balance)
    let running = currentBalance
    return (data.history as HistoryItem[]).map(h => {
      const after = running
      // 이 거래 전 잔액 = 거래 후 잔액에서 거래 효과 역산
      running = h.type === 'plus'
        ? running - parseAmount(h.amount)
        : running + parseAmount(h.amount)
      return { ...h, balanceAfter: after }
    })
  }, [data, isCoupon])

  // 필터링된 내역 (기간 + 타입)
  const filteredHistory = useMemo(() => {
    if (isCoupon) return data.history as CouponItem[]
    let list = historyWithBalance!.filter(h => {
      const d = parseDate(h.date)
      return d >= dateRange.start && d <= dateRange.end
    })
    if (tab === '적립') list = list.filter(h => h.type === 'plus')
    else if (tab === '사용') list = list.filter(h => h.type === 'minus')
    return list
  }, [tab, historyWithBalance, isCoupon, data.history, dateRange])

  // 월별 그룹핑
  const groupedHistory = useMemo(() => {
    if (isCoupon) return null
    const map = new Map<string, (HistoryItem & { balanceAfter: number })[]>()
    ;(filteredHistory as (HistoryItem & { balanceAfter: number })[]).forEach(h => {
      const key = monthKey(h.date)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(h)
    })
    return Array.from(map.entries())
  }, [filteredHistory, isCoupon])

  // 쿠폰: 카테고리 + 정렬
  const couponCounts = useMemo(() => {
    if (!isCoupon) return { 사용가능: 0, 만료임박: 0, 만료: 0 }
    const list = data.history as CouponItem[]
    return {
      사용가능: list.filter(c => c.expireDate && daysUntil(c.expireDate) >= 0).length,
      만료임박: list.filter(c => c.expireDate && daysUntil(c.expireDate) <= 7 && daysUntil(c.expireDate) >= 0).length,
      만료: list.filter(c => c.expireDate && daysUntil(c.expireDate) < 0).length,
    }
  }, [data.history, isCoupon])

  // 쿠폰 할인 금액 추출 (정렬용)
  const extractDiscount = (desc: string) => {
    const m = desc.match(/(\d+(?:,\d+)?)\s*원/)
    if (m) return Number(m[1].replace(/,/g, ''))
    const pct = desc.match(/(\d+)\s*%/)
    if (pct) return Number(pct[1]) * 1000 // % 할인은 천원 단위 가중치
    return 0
  }

  const sortedCoupons = useMemo(() => {
    if (!isCoupon) return []
    let list = (data.history as CouponItem[]).slice()
    // 탭 필터
    if (couponTab === '사용가능') {
      list = list.filter(c => c.expireDate && daysUntil(c.expireDate) >= 0)
    } else if (couponTab === '만료임박') {
      list = list.filter(c => c.expireDate && daysUntil(c.expireDate) <= 7 && daysUntil(c.expireDate) >= 0)
    } else {
      list = list.filter(c => c.expireDate && daysUntil(c.expireDate) < 0)
    }
    // 정렬
    if (couponSort === '만료임박순') {
      list.sort((a, b) => (a.expireDate ? daysUntil(a.expireDate) : 999) - (b.expireDate ? daysUntil(b.expireDate) : 999))
    } else if (couponSort === '할인순') {
      list.sort((a, b) => extractDiscount(b.desc) - extractDiscount(a.desc))
    } else {
      list.sort((a, b) => (b.date.localeCompare(a.date)))
    }
    return list
  }, [data.history, isCoupon, couponTab, couponSort])

  return (
    <PageLayout header={header} hideBottomNav noPadding>
      {/* 잔액 카드 */}
      <div className="px-page pt-4 pb-3">
        <div className="bg-gradient-to-br from-ink to-ink/85 rounded-card-lg p-5 text-white relative overflow-hidden">
          {/* 헤더 (아이콘 + 라벨) */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              {type === 'cash' && <IconCash className="w-4 h-4 stroke-white" />}
              {type === 'point' && <IconStar className="w-4 h-4 fill-white" />}
              {type === 'coupon' && <IconTicket className="w-4 h-4 stroke-white" />}
            </div>
            <p className="text-label text-white/70">보유 {data.title}</p>
          </div>

          <p className="text-display font-bold tabular-nums">
            {data.balance}<span className="text-body font-normal text-white/60 ml-1">{data.unit}</span>
          </p>

          {type === 'cash' && (
            <button
              onClick={() => setChargeOpen(true)}
              className="w-full mt-4 py-2.5 bg-primary rounded-pill text-label font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
            >
              <IconArrowUp className="w-3.5 h-3.5 stroke-white" />
              충전하기
            </button>
          )}
        </div>

        {/* 이번 달 통계 */}
        {!isCoupon && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-surface-muted rounded-card p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <IconArrowDown className="w-3.5 h-3.5 stroke-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-caption text-ink-tertiary">이번 달 적립</div>
                <div className="text-label font-bold text-ink tabular-nums">
                  +{monthlyStats.plus.toLocaleString()}<span className="text-caption text-ink-tertiary ml-0.5">{data.unit}</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-muted rounded-card p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center">
                <IconArrowUp className="w-3.5 h-3.5 stroke-ink" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-caption text-ink-tertiary">이번 달 사용</div>
                <div className="text-label font-bold text-ink tabular-nums">
                  -{monthlyStats.minus.toLocaleString()}<span className="text-caption text-ink-tertiary ml-0.5">{data.unit}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 기간 선택 (캐시/포인트만) */}
      {!isCoupon && (
        <>
          <div className="px-page pb-3">
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-pill text-caption font-semibold transition-colors ${
                    period === p
                      ? 'bg-ink text-white'
                      : 'bg-surface-muted text-ink-secondary hover:bg-border-light'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {period === '직접' && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="date"
                  value={customStart}
                  max={customEnd}
                  onChange={e => setCustomStart(e.target.value)}
                  className="flex-1 px-3 py-2 text-label text-ink bg-surface-muted rounded-card outline-none focus:ring-1 focus:ring-ink tabular-nums"
                />
                <span className="text-ink-placeholder">~</span>
                <input
                  type="date"
                  value={customEnd}
                  min={customStart}
                  max={toInputDate(todayDate)}
                  onChange={e => setCustomEnd(e.target.value)}
                  className="flex-1 px-3 py-2 text-label text-ink bg-surface-muted rounded-card outline-none focus:ring-1 focus:ring-ink tabular-nums"
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* 필터 탭 (캐시/포인트만) */}
      {!isCoupon && (
        <div className="sticky top-0 z-10 bg-surface border-b border-border">
          <div className="flex px-page">
            {TABS.map(t => {
              const periodFiltered = historyWithBalance!.filter(h => {
                const d = parseDate(h.date)
                return d >= dateRange.start && d <= dateRange.end
              })
              const count = t === '전체'
                ? periodFiltered.length
                : periodFiltered.filter(h => (t === '적립' ? h.type === 'plus' : h.type === 'minus')).length
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-label font-semibold relative transition-colors ${
                    tab === t ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
                  }`}
                >
                  {t} <span className="tabular-nums text-caption">{count}</span>
                  {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-t" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 쿠폰 탭 */}
      {isCoupon && (
        <div className="sticky top-0 z-10 bg-surface border-b border-border">
          <div className="flex px-page">
            {COUPON_TABS.map(t => (
              <button
                key={t}
                onClick={() => setCouponTab(t)}
                className={`flex-1 py-3 text-label font-semibold relative transition-colors ${
                  couponTab === t ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
                }`}
              >
                {t} <span className="tabular-nums text-caption">{couponCounts[t]}</span>
                {couponTab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-t" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 쿠폰 정렬 */}
      {isCoupon && (
        <div className="flex items-center justify-between px-page py-2.5">
          <span className="text-caption text-ink-tertiary">
            <span className="font-bold text-ink tabular-nums">{sortedCoupons.length}</span>개 쿠폰
          </span>
          <div className="flex items-center gap-0.5">
            {COUPON_SORTS.map(s => (
              <button
                key={s}
                onClick={() => setCouponSort(s)}
                className={`px-2 py-1 text-caption font-semibold rounded transition-colors ${
                  couponSort === s ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 내역 */}
      <div className="px-page py-3 pb-8">
        {isCoupon ? (
          /* 쿠폰 리스트 */
          sortedCoupons.length > 0 ? (
            <div className="flex flex-col gap-4">
              {sortedCoupons.map((c, i) => {
                const days = c.expireDate ? daysUntil(c.expireDate) : null
                const isUrgent = days !== null && days <= 7 && days >= 0
                const isExpired = days !== null && days < 0

                return (
                  <div
                    key={i}
                    className={`relative flex bg-surface rounded-card-lg shadow-card border overflow-hidden ${
                      isExpired
                        ? 'opacity-50 border-border-light'
                        : isUrgent
                        ? 'border-semantic-like/20 hover:shadow-card-hover transition-shadow'
                        : 'border-border hover:shadow-card-hover transition-shadow'
                    }`}
                  >
                    {/* 좌측 컬러 스트립 + 아이콘 */}
                    <div className={`relative flex items-center justify-center w-16 ${
                      isExpired ? 'bg-surface-muted' : isUrgent ? 'bg-semantic-like/10' : 'bg-primary-50'
                    }`}>
                      {/* 점선 톱니 효과 (오른쪽 가장자리) */}
                      <div className="absolute top-0 right-0 h-full w-px"
                        style={{
                          backgroundImage: 'radial-gradient(circle at 0 4px, white 2px, transparent 2.5px)',
                          backgroundSize: '6px 8px',
                          backgroundRepeat: 'repeat-y',
                        }}
                      />
                      <svg viewBox="0 0 24 24" className={`w-7 h-7 fill-none ${
                        isExpired ? 'stroke-ink-placeholder' : isUrgent ? 'stroke-semantic-like' : 'stroke-primary'
                      }`} strokeWidth="1.6">
                        <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
                        <path d="M9 7v10" strokeDasharray="2 2" />
                      </svg>
                    </div>

                    {/* 우측 정보 */}
                    <div className="flex-1 min-w-0 p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h4 className={`text-body font-bold ${isExpired ? 'text-ink-tertiary' : 'text-ink'}`}>{c.desc}</h4>
                        {isUrgent && !isExpired && (
                          <span className="flex-shrink-0 px-1.5 py-px text-[10px] font-bold rounded text-white bg-semantic-like tabular-nums">
                            D-{days}
                          </span>
                        )}
                        {isExpired && (
                          <span className="flex-shrink-0 px-1.5 py-px text-[10px] font-bold rounded text-ink-tertiary bg-surface-muted">
                            만료
                          </span>
                        )}
                      </div>
                      {(c.minAmount || c.amount) && (
                        <div className="text-caption text-ink-tertiary mb-0.5 truncate">
                          {c.minAmount || c.amount}
                        </div>
                      )}
                      {c.expireDate && (
                        <div className={`text-caption tabular-nums ${
                          isExpired
                            ? 'text-ink-placeholder'
                            : isUrgent
                            ? 'text-semantic-like font-semibold'
                            : 'text-ink-placeholder'
                        }`}>
                          ~{c.expireDate.replaceAll('-', '.')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center">
                <IconWallet className="w-6 h-6 stroke-ink-placeholder" />
              </div>
              <p className="text-body text-ink-tertiary">{couponTab} 쿠폰이 없습니다</p>
            </div>
          )
        ) : groupedHistory && groupedHistory.length > 0 ? (
          /* 캐시/포인트 — 월별 그룹 */
          <div className="flex flex-col">
            {groupedHistory.map(([key, items]) => {
              const monthPlus = items.filter(h => h.type === 'plus').reduce((s, h) => s + parseAmount(h.amount), 0)
              const monthMinus = items.filter(h => h.type === 'minus').reduce((s, h) => s + parseAmount(h.amount), 0)
              return (
                <div key={key} className="mb-4 last:mb-0">
                  {/* 월 헤더 */}
                  <div className="flex items-baseline justify-between mb-2 sticky top-[49px] bg-surface py-2 -mx-page px-page">
                    <span className="text-label font-bold text-ink">{monthLabel(key)}</span>
                    <div className="flex items-center gap-2 text-caption tabular-nums">
                      {monthPlus > 0 && <span className="text-primary">+{monthPlus.toLocaleString()}</span>}
                      {monthMinus > 0 && <span className="text-ink-secondary">-{monthMinus.toLocaleString()}</span>}
                    </div>
                  </div>
                  {/* 항목 */}
                  <div className="flex flex-col">
                    {items.map((item, i) => {
                      const todayCheck = isToday(now)
                      const unit = type === 'point' ? 'P' : '원'
                      return (
                        <div key={i} className="flex items-center gap-3 py-3 border-b border-border-light last:border-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.type === 'plus' ? 'bg-primary/10' : 'bg-surface-muted'
                          }`}>
                            {item.type === 'plus'
                              ? <IconArrowDown className="w-3.5 h-3.5 stroke-primary" />
                              : <IconArrowUp className="w-3.5 h-3.5 stroke-ink-tertiary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-label font-semibold text-ink truncate">{item.desc}</p>
                            <span className="text-caption text-ink-placeholder tabular-nums">
                              {todayCheck(item.date) ? '오늘' : item.date}
                            </span>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className={`text-body font-bold tabular-nums ${
                              item.type === 'plus' ? 'text-primary' : 'text-ink'
                            }`}>
                              {item.amount}<span className="text-caption ml-0.5 text-ink-tertiary">{unit}</span>
                            </span>
                            <span className="text-caption text-ink-placeholder tabular-nums mt-0.5">
                              잔액 {item.balanceAfter.toLocaleString()}{unit}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* 빈 상태 */
          <div className="py-16 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-muted flex items-center justify-center">
              <IconReceipt className="w-6 h-6 stroke-ink-placeholder" />
            </div>
            <p className="text-body text-ink-tertiary">{tab} 내역이 없습니다</p>
          </div>
        )}
      </div>

      {/* 충전 금액 선택 모달 */}
      {chargeOpen && type === 'cash' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setChargeOpen(false)}>
          <div
            className="w-full max-w-[480px] bg-surface rounded-t-card-lg pt-3 pb-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* 핸들 */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

            <div className="px-page">
              <h3 className="text-title font-bold text-ink mb-1">캐시 충전</h3>
              <p className="text-caption text-ink-tertiary mb-4">충전할 금액을 선택해주세요</p>

              {/* 금액 프리셋 */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {CHARGE_PRESETS.map(amt => (
                  <button
                    key={amt}
                    onClick={() => { setChargeAmount(amt); setCustomAmount('') }}
                    className={`py-3 rounded-card text-label font-bold tabular-nums transition-colors ${
                      chargeAmount === amt && !customAmount
                        ? 'bg-ink text-white'
                        : 'bg-surface-muted text-ink hover:bg-border-light'
                    }`}
                  >
                    {amt.toLocaleString()}원
                  </button>
                ))}
              </div>

              {/* 직접 입력 */}
              <div className="relative mb-4">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="직접 입력 (1,000원 단위)"
                  value={customAmount ? Number(customAmount).toLocaleString() : ''}
                  onChange={e => {
                    const v = e.target.value.replace(/[^0-9]/g, '')
                    setCustomAmount(v)
                    if (v) setChargeAmount(Number(v))
                  }}
                  className="w-full px-4 py-3 bg-surface-muted rounded-card text-body text-ink tabular-nums outline-none focus:ring-2 focus:ring-primary"
                />
                {customAmount && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body text-ink-tertiary">원</span>
                )}
              </div>

              {/* 결제 후 잔액 미리보기 */}
              <div className="flex items-center justify-between px-4 py-3 mb-4 rounded-card bg-primary-50">
                <span className="text-label text-ink-secondary">충전 후 잔액</span>
                <span className="text-body font-bold text-primary tabular-nums">
                  {(parseAmount(data.balance) + chargeAmount).toLocaleString()}원
                </span>
              </div>

              {/* 결제 버튼 */}
              <button
                onClick={() => {
                  setChargeOpen(false)
                  navigate(`/checkout?mode=charge&name=${encodeURIComponent(`캐시 ${chargeAmount.toLocaleString()}원 충전`)}&price=${chargeAmount.toLocaleString()}&gym=${encodeURIComponent('캐시 충전')}`)
                }}
                disabled={chargeAmount < 1000}
                className="w-full py-4 bg-primary text-white text-body font-bold rounded-card hover:bg-primary-dark disabled:bg-ink-disabled disabled:cursor-not-allowed transition-colors"
              >
                {chargeAmount.toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      )}

    </PageLayout>
  )
}
