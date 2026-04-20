import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

type PurchaseStatus = '이용중' | '사용완료' | '환불'
type Purchase = {
  id: number
  category: 'membership' | 'pt' | 'lesson' | 'product'
  name: string
  price: string
  gym: string
  method: string
  order: string
  date: string  // "2026.03.26 17:38"
  status: PurchaseStatus
}

const purchaseHistory: Purchase[] = [
  { id: 1, category: 'membership', name: '헬스 이용권 · 월 구독권 + 개인 락커 + 운동복 대여', price: '129,000', gym: '바디채널 강남점', method: '카카오페이', order: 'BC20260326999', date: '2026.04.18 17:38', status: '이용중' },
  { id: 2, category: 'pt', name: 'PT · 10회', price: '700,000', gym: '바디채널 강남점', method: '신용/체크카드', order: 'BC20260320412', date: '2026.04.10 11:20', status: '이용중' },
  { id: 3, category: 'lesson', name: '바레톤 · 1회 체험', price: '30,000', gym: '바디채널 강남점', method: '네이버페이', order: 'BC20260315087', date: '2026.03.28 09:45', status: '사용완료' },
  { id: 4, category: 'product', name: '바디채널 짐백', price: '25,000', gym: '바디채널 강남점', method: '카카오페이', order: 'BC20260301045', date: '2026.03.05 14:22', status: '사용완료' },
  { id: 5, category: 'lesson', name: 'HIIT 그룹수업 · 4회 패키지', price: '120,000', gym: '바디채널 역삼점', method: '신용/체크카드', order: 'BC20260201777', date: '2026.02.10 19:50', status: '사용완료' },
]

type Tab = '전체' | '이용중' | '사용완료' | '환불'
const TABS: Tab[] = ['전체', '이용중', '사용완료', '환불']

type Period = '1개월' | '3개월' | '6개월' | '1년' | '전체'
const PERIODS: Period[] = ['1개월', '3개월', '6개월', '1년', '전체']

const statusStyles: Record<PurchaseStatus, string> = {
  '이용중': 'bg-primary/10 text-primary',
  '사용완료': 'bg-surface-muted text-ink-tertiary',
  '환불': 'bg-semantic-like/10 text-semantic-like',
}

const categoryMeta: Record<Purchase['category'], { label: string; icon: string; bg: string }> = {
  membership: { label: '회원권', icon: '🎫', bg: 'bg-primary-50' },
  pt: { label: 'PT', icon: '💪', bg: 'bg-accent-purple/10' },
  lesson: { label: '레슨', icon: '🧘', bg: 'bg-category-bareton-bg' },
  product: { label: '상품', icon: '🛍️', bg: 'bg-surface-muted' },
}

const parseAmt = (s: string) => Number(s.replace(/[^0-9]/g, '')) || 0
const parseDate = (s: string) => {
  const m = s.match(/(\d+)\.(\d+)\.(\d+)/)
  if (!m) return new Date(0)
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}
const monthKey = (s: string) => s.slice(0, 7)
const monthLabel = (key: string) => {
  const [y, m] = key.split('.')
  return `${y}년 ${Number(m)}월`
}

export const PurchaseListPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('전체')
  const [period, setPeriod] = useState<Period>('3개월')

  // 기간 필터
  const dateRange = useMemo(() => {
    const today = new Date(); today.setHours(23, 59, 59, 999)
    if (period === '전체') return { start: new Date(0), end: today }
    const start = new Date(today)
    if (period === '1개월') start.setMonth(start.getMonth() - 1)
    else if (period === '3개월') start.setMonth(start.getMonth() - 3)
    else if (period === '6개월') start.setMonth(start.getMonth() - 6)
    else start.setFullYear(start.getFullYear() - 1)
    return { start, end: today }
  }, [period])

  const periodFiltered = useMemo(() =>
    purchaseHistory.filter(p => {
      const d = parseDate(p.date)
      return d >= dateRange.start && d <= dateRange.end
    }),
    [dateRange],
  )

  const counts = useMemo(() => ({
    전체: periodFiltered.length,
    이용중: periodFiltered.filter(p => p.status === '이용중').length,
    사용완료: periodFiltered.filter(p => p.status === '사용완료').length,
    환불: periodFiltered.filter(p => p.status === '환불').length,
  }), [periodFiltered])

  const filtered = useMemo(() => {
    if (tab === '전체') return periodFiltered
    return periodFiltered.filter(p => p.status === tab)
  }, [periodFiltered, tab])

  // 월별 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<string, Purchase[]>()
    filtered.forEach(p => {
      const key = monthKey(p.date)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    })
    return Array.from(map.entries())
  }, [filtered])

  const totalSpent = periodFiltered.reduce((s, p) => s + parseAmt(p.price), 0)
  const thisMonthSpent = useMemo(() => {
    const now = new Date()
    const key = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`
    return periodFiltered.filter(p => monthKey(p.date) === key).reduce((s, p) => s + parseAmt(p.price), 0)
  }, [periodFiltered])

  const header = <SubPageHeader title="구매 내역" />

  return (
    <PageLayout header={header} hideBottomNav noPadding>
      {/* 결제 통계 */}
      <div className="px-page pt-4 pb-3 grid grid-cols-2 gap-2">
        <div className="bg-surface-muted rounded-card-lg p-3.5">
          <div className="text-caption text-ink-tertiary mb-1">기간 내 결제</div>
          <div className="text-title font-bold text-ink tabular-nums leading-none">
            {totalSpent.toLocaleString()}<span className="text-caption font-semibold text-ink-tertiary ml-0.5">원</span>
          </div>
          <div className="text-caption text-ink-tertiary mt-1 tabular-nums">{periodFiltered.length}건</div>
        </div>
        <div className="bg-primary-50 rounded-card-lg p-3.5">
          <div className="text-caption text-primary mb-1">이번 달</div>
          <div className="text-title font-bold text-primary tabular-nums leading-none">
            {thisMonthSpent.toLocaleString()}<span className="text-caption font-semibold text-primary/70 ml-0.5">원</span>
          </div>
          <div className="text-caption text-primary/70 mt-1 tabular-nums">{periodFiltered.filter(p => {
            const now = new Date(); const key = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`
            return monthKey(p.date) === key
          }).length}건</div>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="px-page pb-3">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-pill text-caption font-semibold transition-colors ${
                period === p ? 'bg-ink text-white' : 'bg-surface-muted text-ink-secondary hover:bg-border-light'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 (sticky) */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="flex px-page overflow-x-auto hide-scrollbar">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 min-w-[68px] py-3 text-label font-semibold relative whitespace-nowrap transition-colors ${
                tab === t ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
              }`}
            >
              {t} <span className="tabular-nums text-caption">{counts[t]}</span>
              {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-t" />}
            </button>
          ))}
        </div>
      </div>

      {/* 리스트 — 월별 그룹 */}
      {grouped.length > 0 ? (
        <div className="px-page py-3 pb-8">
          {grouped.map(([key, items]) => {
            const monthTotal = items.reduce((s, p) => s + parseAmt(p.price), 0)
            return (
              <div key={key} className="mb-4 last:mb-0">
                {/* 월 헤더 */}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-label font-bold text-ink">{monthLabel(key)}</span>
                  <span className="text-caption text-ink-tertiary tabular-nums">
                    <span className="font-bold text-ink">{items.length}건</span> · {monthTotal.toLocaleString()}원
                  </span>
                </div>

                {/* 항목 */}
                <ul className="flex flex-col gap-2">
                  {items.map(p => {
                    const cat = categoryMeta[p.category]
                    return (
                      <li key={p.id}>
                        <button
                          onClick={() => navigate(`/purchase/docs?name=${encodeURIComponent(p.name)}&price=${encodeURIComponent(p.price)}&gym=${encodeURIComponent(p.gym)}&method=${encodeURIComponent(p.method)}&order=${encodeURIComponent(p.order)}&date=${encodeURIComponent(p.date)}`)}
                          className="w-full flex gap-3 p-3 bg-surface border border-border rounded-card-lg text-left hover:border-ink-placeholder transition-colors"
                        >
                          {/* 카테고리 아이콘 */}
                          <div className={`w-12 h-12 rounded-card flex items-center justify-center flex-shrink-0 ${cat.bg}`}>
                            <span className="text-[22px]">{cat.icon}</span>
                          </div>

                          {/* 정보 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-px text-caption font-medium rounded bg-surface-muted text-ink-secondary">{cat.label}</span>
                              <span className={`px-1.5 py-px text-caption font-bold rounded ${statusStyles[p.status]}`}>{p.status}</span>
                              <span className="ml-auto text-caption text-ink-placeholder tabular-nums">{p.date.slice(0, 10)}</span>
                            </div>
                            <h3 className="text-label font-semibold text-ink line-clamp-1 mb-1">{p.name}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-caption text-ink-tertiary truncate">{p.gym} · {p.method}</span>
                              <span className="text-body font-bold text-ink tabular-nums flex-shrink-0 ml-2">
                                {p.price}<span className="text-caption font-normal text-ink-tertiary ml-0.5">원</span>
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-ink-placeholder">
          <span className="text-body mb-2">{tab !== '전체' ? tab : period} 기간 구매 내역이 없습니다</span>
        </div>
      )}
    </PageLayout>
  )
}
