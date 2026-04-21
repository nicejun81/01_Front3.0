import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import { PageLayout, SubPageHeader } from '../../components'
import { IconCheck, IconClock, IconInfo, IconShare, IconChevronRight } from '../../components/Icons'

type Status = 'active' | 'expiring' | 'paused' | 'expired'

type HistoryItem = {
  date: string // 2026.04.18 14:30
  type: 'visit' | 'use' | 'pause' | 'resume' | 'purchase'
  title: string
  sub?: string
}

type Membership = {
  id: string
  name: string
  gym: string
  status: Status
  statusLabel: string
  purchaseDate: string
  startDate: string
  endDate: string
  price: number
  method: string
  orderId: string
  stats: { label: string; value: string }[]
  originalCount?: number
  remainingCount?: number
  history: HistoryItem[]
  contract: {
    signedAt: string
    terms: { label: string; value: string }[]
  }
}

const MEMBERSHIPS: Record<string, Membership> = {
  '1': {
    id: '1',
    name: '3개월 멤버십',
    gym: '바디채널 강남점',
    status: 'active',
    statusLabel: '이용중',
    purchaseDate: '2025.12.15',
    startDate: '2025.12.15',
    endDate: '2026.03.15',
    price: 249000,
    method: '신용카드 · 신한 1234',
    orderId: 'BC20251215-A8291',
    stats: [
      { label: '잔여일', value: '67일' },
      { label: '유효기간', value: '~ 2026.03.15' },
    ],
    history: [
      { date: '2026.04.18 07:30', type: 'visit', title: '지점 방문', sub: '출입 QR 인증' },
      { date: '2026.04.16 19:12', type: 'visit', title: '지점 방문' },
      { date: '2026.04.14 18:40', type: 'visit', title: '지점 방문' },
      { date: '2026.04.12 08:05', type: 'visit', title: '지점 방문' },
      { date: '2025.12.15 14:20', type: 'purchase', title: '구매 완료', sub: '3개월 멤버십 · 249,000원' },
    ],
    contract: {
      signedAt: '2025.12.15 14:22',
      terms: [
        { label: '계약 종류', value: '체육시설 이용 계약' },
        { label: '이용 기간', value: '2025.12.15 ~ 2026.03.15 (90일)' },
        { label: '이용 시설', value: '바디채널 강남점 전 시설' },
        { label: '환불 규정', value: '이용일수 비례 차감 후 환불' },
        { label: '양도 가능 여부', value: '불가' },
        { label: '일시정지', value: '최대 14일 (1회)' },
      ],
    },
  },
  '2': {
    id: '2',
    name: 'PT 20회 패키지',
    gym: '바디채널 강남점',
    status: 'expiring',
    statusLabel: '만료임박',
    purchaseDate: '2025.07.20',
    startDate: '2025.07.22',
    endDate: '2026.01.20',
    price: 1290000,
    method: '카카오페이',
    orderId: 'BC20250720-B7155',
    originalCount: 20,
    remainingCount: 3,
    stats: [
      { label: '잔여횟수', value: '3 / 20회' },
      { label: '유효기간', value: '~ 2026.01.20' },
    ],
    history: [
      { date: '2026.04.15 19:00', type: 'use', title: 'PT 17회차', sub: '김민수 트레이너 · 60분' },
      { date: '2026.04.08 19:00', type: 'use', title: 'PT 16회차', sub: '김민수 트레이너 · 60분' },
      { date: '2026.04.01 18:30', type: 'use', title: 'PT 15회차', sub: '김민수 트레이너 · 60분' },
      { date: '2026.03.25 18:30', type: 'use', title: 'PT 14회차', sub: '김민수 트레이너 · 60분' },
      { date: '2025.07.20 11:08', type: 'purchase', title: '구매 완료', sub: 'PT 20회 패키지 · 1,290,000원' },
    ],
    contract: {
      signedAt: '2025.07.20 11:10',
      terms: [
        { label: '계약 종류', value: 'PT(퍼스널 트레이닝) 이용 계약' },
        { label: '이용 횟수', value: '총 20회 (1회 60분)' },
        { label: '이용 기간', value: '2025.07.22 ~ 2026.01.20 (6개월)' },
        { label: '담당 트레이너', value: '김민수' },
        { label: '환불 규정', value: '사용 회차 차감 후 환불' },
        { label: '양도 가능 여부', value: '불가' },
      ],
    },
  },
  '3': {
    id: '3',
    name: 'GX 무제한 회원권',
    gym: '바디채널 강남점',
    status: 'paused',
    statusLabel: '일시정지',
    purchaseDate: '2025.10.01',
    startDate: '2025.10.01',
    endDate: '2026.04.01',
    price: 399000,
    method: '신용카드 · 현대 5678',
    orderId: 'BC20251001-C9802',
    stats: [
      { label: '정지기간', value: '14일' },
      { label: '재개일', value: '2026.05.04' },
    ],
    history: [
      { date: '2026.04.20 10:00', type: 'pause', title: '일시정지 신청', sub: '14일 · 해외 출장' },
      { date: '2026.04.18 07:30', type: 'visit', title: '지점 방문' },
      { date: '2025.10.01 13:15', type: 'purchase', title: '구매 완료', sub: 'GX 무제한 회원권 · 399,000원' },
    ],
    contract: {
      signedAt: '2025.10.01 13:18',
      terms: [
        { label: '계약 종류', value: 'GX 무제한 이용 계약' },
        { label: '이용 기간', value: '2025.10.01 ~ 2026.04.01 (6개월)' },
        { label: '이용 프로그램', value: 'GX 전 클래스 무제한' },
        { label: '환불 규정', value: '이용일수 비례 차감 후 환불' },
        { label: '일시정지', value: '최대 30일 (2회 분할 가능)' },
      ],
    },
  },
  '5': {
    id: '5',
    name: '바레톤 10회 패키지',
    gym: '바디채널 강남점',
    status: 'active',
    statusLabel: '미사용',
    purchaseDate: '2026.04.01',
    startDate: '2026.04.01',
    endDate: '2026.06.30',
    price: 390000,
    method: '네이버페이',
    orderId: 'BC20260401-D1023',
    originalCount: 10,
    remainingCount: 10,
    stats: [
      { label: '잔여횟수', value: '10 / 10회' },
      { label: '유효기간', value: '~ 2026.06.30' },
    ],
    history: [
      { date: '2026.04.01 16:45', type: 'purchase', title: '구매 완료', sub: '바레톤 10회 패키지 · 390,000원' },
    ],
    contract: {
      signedAt: '2026.04.01 16:46',
      terms: [
        { label: '계약 종류', value: '바레톤 클래스 이용 계약' },
        { label: '이용 횟수', value: '총 10회 (1회 50분)' },
        { label: '이용 기간', value: '2026.04.01 ~ 2026.06.30 (3개월)' },
        { label: '환불 규정', value: '사용 회차 차감 후 환불' },
        { label: '양도 가능 여부', value: '불가' },
      ],
    },
  },
  '4': {
    id: '4',
    name: '1개월 멤버십',
    gym: '바디채널 강남점',
    status: 'expired',
    statusLabel: '만료됨',
    purchaseDate: '2024.11.01',
    startDate: '2024.11.01',
    endDate: '2024.12.01',
    price: 99000,
    method: '신용카드 · 신한 1234',
    orderId: 'BC20241101-E4532',
    stats: [
      { label: '이용일', value: '22일' },
      { label: '만료일', value: '2024.12.01' },
    ],
    history: [
      { date: '2024.11.30 18:10', type: 'visit', title: '마지막 방문' },
      { date: '2024.11.01 11:00', type: 'purchase', title: '구매 완료', sub: '1개월 멤버십 · 99,000원' },
    ],
    contract: {
      signedAt: '2024.11.01 11:03',
      terms: [
        { label: '계약 종류', value: '체육시설 이용 계약' },
        { label: '이용 기간', value: '2024.11.01 ~ 2024.12.01 (31일)' },
        { label: '환불 규정', value: '이용일수 비례 차감 후 환불' },
      ],
    },
  },
  '6': {
    id: '6',
    name: 'PT 10회 패키지',
    gym: '바디채널 강남점',
    status: 'expired',
    statusLabel: '사용완료',
    purchaseDate: '2024.08.15',
    startDate: '2024.08.16',
    endDate: '2024.11.15',
    price: 700000,
    method: '카카오페이',
    orderId: 'BC20240815-F6788',
    originalCount: 10,
    remainingCount: 0,
    stats: [
      { label: '이용 횟수', value: '10 / 10회' },
      { label: '완료일', value: '2024.11.15' },
    ],
    history: [
      { date: '2024.11.15 19:00', type: 'use', title: 'PT 10회차 (완료)', sub: '박지영 트레이너 · 60분' },
      { date: '2024.08.15 15:30', type: 'purchase', title: '구매 완료', sub: 'PT 10회 패키지 · 700,000원' },
    ],
    contract: {
      signedAt: '2024.08.15 15:33',
      terms: [
        { label: '계약 종류', value: 'PT 이용 계약' },
        { label: '이용 횟수', value: '총 10회 (1회 60분)' },
        { label: '이용 기간', value: '2024.08.16 ~ 2024.11.15 (3개월)' },
        { label: '담당 트레이너', value: '박지영' },
      ],
    },
  },
}

const STATUS_STYLE: Record<Status, { chip: string; hero: string }> = {
  active:   { chip: 'bg-primary text-white', hero: 'bg-gradient-to-br from-ink via-ink to-ink/85 text-white' },
  expiring: { chip: 'bg-semantic-like text-white', hero: 'bg-gradient-to-br from-primary via-primary to-primary-dark text-white' },
  paused:   { chip: 'bg-white/20 text-white backdrop-blur', hero: 'bg-gradient-to-br from-ink-secondary to-ink text-white' },
  expired:  { chip: 'bg-ink-placeholder text-white', hero: 'bg-gradient-to-br from-ink-tertiary to-ink-secondary text-white' },
}

const HISTORY_ICON: Record<HistoryItem['type'], React.ReactNode> = {
  visit:    <IconCheck className="w-4 h-4 stroke-white stroke-[2.5]" />,
  use:      <IconCheck className="w-4 h-4 stroke-white stroke-[2.5]" />,
  pause:    <IconClock className="w-4 h-4 stroke-white stroke-[2]" />,
  resume:   <IconClock className="w-4 h-4 stroke-white stroke-[2]" />,
  purchase: <IconInfo className="w-4 h-4 stroke-white stroke-[2]" />,
}

const HISTORY_BG: Record<HistoryItem['type'], string> = {
  visit: 'bg-primary',
  use: 'bg-primary',
  pause: 'bg-ink-tertiary',
  resume: 'bg-ink-tertiary',
  purchase: 'bg-ink',
}

type Tab = '구매정보' | '이용내역' | '전자계약서'
const TABS: Tab[] = ['구매정보', '이용내역', '전자계약서']

export const MembershipDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const membership = id ? MEMBERSHIPS[id] : undefined
  const [tab, setTab] = useState<Tab>('구매정보')
  const [toast, setToast] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  // 토스트 자동 닫힘 (언마운트 시 leak 방지)
  useEffect(() => {
    if (!toast) return
    const tid = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(tid)
  }, [toast])

  const showToast = useCallback((m: string) => setToast(m), [])
  const onPrint = useCallback(() => window.print(), [])
  const onDownloadPdf = useCallback(async () => {
    if (!pdfRef.current || !membership || isGenerating) return
    setIsGenerating(true)
    showToast('PDF를 생성중이에요')
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 24
      const contentW = pageW - margin * 2
      const scaledH = (canvas.height * contentW) / canvas.width

      // 페이지 넘김 처리 — 긴 이미지를 여러 페이지에 나눠 담기
      let remaining = scaledH
      let yOffset = 0
      while (remaining > 0) {
        const pageContentH = pageH - margin * 2
        pdf.addImage(imgData, 'PNG', margin, margin - yOffset, contentW, scaledH)
        remaining -= pageContentH
        if (remaining > 0) {
          pdf.addPage()
          yOffset += pageContentH
        }
      }

      const filename = `${membership.name.replace(/\s+/g, '_')}_${membership.orderId}.pdf`
      pdf.save(filename)
      showToast('PDF 다운로드가 완료됐어요')
    } catch (err) {
      console.error(err)
      showToast('PDF 생성에 실패했어요')
    } finally {
      setIsGenerating(false)
    }
  }, [membership, isGenerating, showToast])
  const onShare = useCallback(() => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: membership?.name, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url)
      showToast('링크를 복사했어요')
    }
  }, [membership?.name, showToast])
  const onCopyOrder = useCallback(() => showToast('주문번호를 복사했어요'), [showToast])

  const usagePercent = useMemo(() => {
    if (!membership) return null
    // 횟수 기반 이용권
    if (membership.originalCount) {
      const used = membership.originalCount - (membership.remainingCount ?? 0)
      return Math.round((used / membership.originalCount) * 100)
    }
    // 기간 기반 이용권: startDate/endDate 경과율
    const parse = (s: string) => {
      const m = s.match(/(\d{4})\.(\d{2})\.(\d{2})/)
      if (!m) return null
      return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    }
    const start = parse(membership.startDate)
    const end = parse(membership.endDate)
    if (!start || !end) return null
    const total = end.getTime() - start.getTime()
    if (total <= 0) return null
    const elapsed = Date.now() - start.getTime()
    const pct = Math.round((elapsed / total) * 100)
    return Math.min(100, Math.max(0, pct))
  }, [membership])

  if (!membership) {
    return (
      <PageLayout header={<SubPageHeader title="이용권 상세" />} hideBottomNav>
        <div className="py-16 text-center">
          <p className="text-body text-ink-tertiary">이용권을 찾을 수 없어요</p>
          <button
            onClick={() => navigate('/mypage')}
            className="mt-4 px-5 py-2.5 rounded-pill bg-ink text-white text-label font-bold"
          >
            마이페이지로
          </button>
        </div>
      </PageLayout>
    )
  }

  const style = STATUS_STYLE[membership.status]

  return (
    <PageLayout
      header={<SubPageHeader title="이용권 상세" right={
        <button onClick={onShare} aria-label="공유" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-ink/5 transition-colors">
          <IconShare className="w-5 h-5 stroke-ink stroke-[1.5]" />
        </button>
      } />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 카드 */}
      <div className={`relative overflow-hidden ${style.hero} px-page pt-5 pb-5`}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-24 h-24 rounded-full bg-black/20 blur-xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-pill text-[11px] font-extrabold ${style.chip}`}>
              {membership.statusLabel}
            </span>
            <span className="text-caption text-white/80">{membership.gym}</span>
          </div>
          <h1 className="text-heading font-extrabold leading-tight">{membership.name}</h1>

          {/* 스탯 */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {membership.stats.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-card-lg px-3 py-2">
                <div className="text-caption text-white/70">{s.label}</div>
                <div className="text-title font-extrabold tabular-nums mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>

          {/* 사용률 게이지 */}
          {usagePercent !== null && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1 text-caption text-white/70">
                <span>사용률</span>
                <span className="tabular-nums font-bold text-white">{usagePercent}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="flex px-page">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-label font-semibold relative transition-colors ${
                tab === t ? 'text-ink' : 'text-ink-placeholder hover:text-ink-secondary'
              }`}
            >
              {t}
              {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-t" />}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="px-page pt-4 pb-5">
        {tab === '구매정보' && (
          <div className="flex flex-col divide-y divide-border-light">
            <InfoRow label="상품명" value={membership.name} />
            <InfoRow label="판매점" value={membership.gym} />
            <InfoRow label="주문번호" value={membership.orderId} copyable onCopy={onCopyOrder} />
            <InfoRow label="구매일" value={membership.purchaseDate} />
            <InfoRow label="결제수단" value={membership.method} />
            <InfoRow label="결제금액" value={`${membership.price.toLocaleString()}원`} strong />
            <InfoRow label="이용 시작일" value={membership.startDate} />
            <InfoRow label="이용 종료일" value={membership.endDate} />

            {/* 환불 문의 */}
            <div className="pt-3 mt-1">
              <button className="w-full flex items-center justify-between py-3 px-4 bg-surface-muted rounded-card hover:bg-border-light transition-colors">
                <span className="text-label font-semibold text-ink">환불·변경 문의</span>
                <IconChevronRight className="w-4 h-4 stroke-ink-tertiary stroke-[1.5]" />
              </button>
            </div>
          </div>
        )}

        {tab === '이용내역' && (
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-body font-extrabold text-ink">이용 히스토리</h3>
              <span className="text-caption text-ink-tertiary tabular-nums">
                총 {membership.history.length}건
              </span>
            </div>
            {/* 타임라인 */}
            <div className="relative">
              <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border-light" aria-hidden />
              <ul className="flex flex-col gap-3.5">
                {membership.history.map((h, i) => (
                  <HistoryNode key={i} item={h} />
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === '전자계약서' && (
          <div>
            <div className="flex items-start gap-3 p-4 bg-primary-50 border border-primary/20 rounded-card-lg mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <IconCheck className="w-4 h-4 stroke-white stroke-[2.5]" />
              </div>
              <div>
                <div className="text-label font-bold text-ink">전자 서명 완료</div>
                <div className="text-caption text-ink-tertiary tabular-nums mt-0.5">
                  {membership.contract.signedAt}
                </div>
              </div>
            </div>

            <h3 className="text-body font-extrabold text-ink mb-3">주요 계약 조건</h3>
            <div className="flex flex-col divide-y divide-border-light">
              {membership.contract.terms.map(t => (
                <InfoRow key={t.label} label={t.label} value={t.value} />
              ))}
            </div>

            <button className="w-full mt-5 flex items-center justify-between px-4 py-3.5 border border-border rounded-card-lg hover:border-ink/30 transition-colors">
              <div>
                <div className="text-label font-bold text-ink">계약서 전문 보기</div>
                <div className="text-caption text-ink-tertiary mt-0.5">PDF · 전자서명 포함</div>
              </div>
              <IconChevronRight className="w-4 h-4 stroke-ink-tertiary stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>

      {/* 고정 액션 바 */}
      <div className="sticky bottom-0 bg-surface/95 backdrop-blur-sm border-t border-border px-page py-2.5 flex gap-2 print:hidden">
        <button
          onClick={onPrint}
          aria-label="프린트"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-surface-muted text-ink text-label font-bold rounded-card hover:bg-border-light transition-colors"
        >
          <IconPrint className="w-4 h-4 stroke-ink stroke-[1.8]" />
          프린트
        </button>
        <button
          onClick={onDownloadPdf}
          disabled={isGenerating}
          aria-label="PDF 다운로드"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white text-label font-bold rounded-card hover:bg-primary-dark disabled:opacity-60 disabled:cursor-wait transition-colors"
        >
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              생성중…
            </>
          ) : (
            <>
              <IconDownload className="w-4 h-4 stroke-white stroke-[1.8]" />
              PDF 다운로드
            </>
          )}
        </button>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}

      {/* 오프스크린 PDF 전용 레이아웃 (캡처 대상) */}
      <div
        ref={pdfRef}
        aria-hidden
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          width: '720px',
          background: '#ffffff',
          padding: '32px',
          fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
          color: '#0a0a0a',
        }}
      >
        <div style={{ borderBottom: '2px solid #0a0a0a', paddingBottom: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#FF6B35', marginBottom: 4 }}>
            BODYCHANNEL · 이용권 증서
          </div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{membership.name}</div>
          <div style={{ fontSize: 13, color: '#525252', marginTop: 4 }}>
            {membership.gym} · {membership.statusLabel}
          </div>
        </div>

        <PdfSection title="구매 정보">
          <PdfRow label="상품명" value={membership.name} />
          <PdfRow label="판매점" value={membership.gym} />
          <PdfRow label="주문번호" value={membership.orderId} />
          <PdfRow label="구매일" value={membership.purchaseDate} />
          <PdfRow label="결제수단" value={membership.method} />
          <PdfRow label="결제금액" value={`${membership.price.toLocaleString()}원`} strong />
          <PdfRow label="이용 기간" value={`${membership.startDate} ~ ${membership.endDate}`} />
        </PdfSection>

        <PdfSection title="이용 히스토리">
          {membership.history.map((h, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: i < membership.history.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{h.title}</div>
              {h.sub && <div style={{ fontSize: 12, color: '#737373', marginTop: 2 }}>{h.sub}</div>}
              <div style={{ fontSize: 11, color: '#a3a3a3', marginTop: 2 }}>{h.date}</div>
            </div>
          ))}
        </PdfSection>

        <PdfSection title="전자계약서">
          <div style={{ fontSize: 12, color: '#737373', marginBottom: 12 }}>
            전자 서명 완료 · {membership.contract.signedAt}
          </div>
          {membership.contract.terms.map(t => (
            <PdfRow key={t.label} label={t.label} value={t.value} />
          ))}
        </PdfSection>

        <div style={{ fontSize: 10, color: '#a3a3a3', textAlign: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #f5f5f5' }}>
          본 증서는 바디채널 전자 계약 시스템에서 생성된 정식 문서입니다.
        </div>
      </div>
    </PageLayout>
  )
}

const PdfSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontSize: 14, fontWeight: 800, color: '#0a0a0a', paddingBottom: 6, borderBottom: '1px solid #e5e5e5', marginBottom: 8 }}>
      {title}
    </div>
    {children}
  </div>
)

const PdfRow = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid #f5f5f5', gap: 16 }}>
    <span style={{ fontSize: 12, color: '#737373' }}>{label}</span>
    <span style={{ fontSize: strong ? 15 : 13, fontWeight: strong ? 800 : 600, color: '#0a0a0a' }}>{value}</span>
  </div>
)

interface InfoRowProps {
  label: string
  value: string
  strong?: boolean
  copyable?: boolean
  onCopy?: () => void
}

const InfoRow = memo(({ label, value, strong, copyable, onCopy }: InfoRowProps) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <span className="text-label text-ink-tertiary flex-shrink-0">{label}</span>
    <div className="flex items-center gap-2 min-w-0">
      <span className={`text-label tabular-nums truncate ${strong ? 'font-extrabold text-ink text-body' : 'font-semibold text-ink'}`}>
        {value}
      </span>
      {copyable && (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(value)
            onCopy?.()
          }}
          className="text-caption font-bold text-primary hover:text-primary-dark flex-shrink-0"
        >
          복사
        </button>
      )}
    </div>
  </div>
))
InfoRow.displayName = 'InfoRow'

const HistoryNode = memo(({ item: h }: { item: HistoryItem }) => (
  <li className="relative pl-8">
    <span className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ${HISTORY_BG[h.type]}`}>
      {HISTORY_ICON[h.type]}
    </span>
    <div className="text-label font-bold text-ink leading-snug">{h.title}</div>
    {h.sub && (
      <div className="text-caption text-ink-tertiary mt-0.5">{h.sub}</div>
    )}
    <div className="text-caption text-ink-placeholder tabular-nums mt-0.5">{h.date}</div>
  </li>
))
HistoryNode.displayName = 'HistoryNode'

const IconPrint = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconDownload = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
