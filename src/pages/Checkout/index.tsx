import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'

type PaymentMethod = 'kakao' | 'naver' | 'toss' | 'payco' | 'card' | 'transfer'

const PAYMENTS: { key: PaymentMethod; label: string; sub?: string }[] = [
  { key: 'kakao', label: '카카오페이' },
  { key: 'naver', label: '네이버페이' },
  { key: 'toss', label: '토스페이' },
  { key: 'payco', label: '페이코' },
  { key: 'card', label: '신용/체크카드' },
  { key: 'transfer', label: '계좌이체' },
]

/* ── SVG micro-icons (inline, no dep) ── */
const KakaoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#3C1E1E" d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.31 4.64 6.7-.15.54-.97 3.48-1 3.63 0 .1.04.2.13.26.09.05.2.05.29 0 .38-.23 4.42-2.9 4.94-3.24.33.03.66.05 1 .05 5.52 0 10-3.58 10-8s-4.48-8-10-8z" /></svg>
)
const NaverLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#fff" d="M16.27 12.85L7.38 3H3v18h4.73V11.15L16.62 21H21V3h-4.73z" /></svg>
)
const CardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-[1.5] fill-none"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
)
const BankIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-[1.5] fill-none"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>
)
const TossLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#fff" d="M12 4c-1.66 0-3 1.34-3 3v2H7v8h10v-8h-2V7c0-1.66-1.34-3-3-3zm-1 3c0-.55.45-1 1-1s1 .45 1 1v2h-2V7zm-2 4h6v4H9v-4z" /></svg>
)
const PaycoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2c2.21 0 4 1.79 4 4s-1.79 4-4 4zm0-6v4c1.1 0 2-.9 2-2s-.9-2-2-2z" /></svg>
)

const PaymentIcon = ({ method }: { method: PaymentMethod }) => {
  const map: Record<PaymentMethod, { bg: string; icon: React.ReactNode }> = {
    kakao: { bg: 'bg-semantic-kakao', icon: <KakaoLogo /> },
    naver: { bg: 'bg-semantic-online', icon: <NaverLogo /> },
    toss: { bg: 'bg-[#0064FF]', icon: <TossLogo /> },
    payco: { bg: 'bg-[#FA2828]', icon: <PaycoLogo /> },
    card: { bg: 'bg-surface-muted', icon: <CardIcon /> },
    transfer: { bg: 'bg-surface-muted', icon: <BankIcon /> },
  }
  const { bg, icon } = map[method]
  return <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${bg}`}>{icon}</div>
}

const _Check = ({ on }: { on: boolean }) => (
  <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0 transition-all ${on ? 'bg-primary' : 'border-2 border-ink-disabled'}`}>
    {on && <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-white"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" /></svg>}
  </div>
)
void _Check

const SectionTitle = ({ children }: { children: string }) => (
  <h3 className="text-title text-ink mb-3">{children}</h3>
)

const Divider = () => <div className="h-2 bg-surface-muted" />

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productName = searchParams.get('name') || 'PT 20회 패키지'
  const productPrice = searchParams.get('price') || '990,000'
  const gymName = searchParams.get('gym') || '바디채널 강남점'
  const priceNum = parseInt(productPrice.replace(/[^0-9]/g, ''))

  const [payment, setPayment] = useState<PaymentMethod>('kakao')
  const [agreed, setAgreed] = useState(false)
  const [allAgreed, setAllAgreed] = useState(false)

  // 할인 상태
  const coupons = [
    { id: 1, name: '첫 달 80% OFF', discount: Math.floor(priceNum * 0.8), condition: '첫 결제 시' },
    { id: 2, name: '5,000원 할인', discount: 5000, condition: '3만원 이상 구매 시' },
    { id: 3, name: '10% 할인', discount: Math.floor(priceNum * 0.1), condition: '레슨권 전용' },
  ]
  const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null)
  const [showCouponSheet, setShowCouponSheet] = useState(false)
  const [pointInput, setPointInput] = useState(0)
  const [cashInput, setCashInput] = useState(0)

  const CASH_BALANCE = 15000
  const POINT_BALANCE = 2500
  const couponDiscount = selectedCoupon !== null ? coupons.find(c => c.id === selectedCoupon)?.discount || 0 : 0
  const maxCash = Math.min(CASH_BALANCE, priceNum - couponDiscount)
  const cashUsed = Math.min(cashInput, maxCash)
  const maxPoint = Math.min(POINT_BALANCE, priceNum - couponDiscount - cashUsed)
  const pointUsed = Math.min(pointInput, maxPoint)
  const totalDiscount = couponDiscount + cashUsed + pointUsed
  const finalPrice = Math.max(0, priceNum - totalDiscount)

  const toggleAll = () => {
    const next = !allAgreed
    setAllAgreed(next)
    setAgreed(next)
  }

  const header = <SubPageHeader title="주문/결제" />
  const selectedMethod = PAYMENTS.find(p => p.key === payment)

  return (
    <PageLayout header={header} hideBottomNav>
      <div className="-mx-page -mt-4 bg-surface-muted pb-[130px]">

        {/* ━━ 상품 정보 ━━ */}
        <div className="bg-surface px-page pt-5 pb-4">
          <div className="flex gap-3">
            <div className="w-[64px] h-[64px] bg-primary-50 rounded-card flex items-center justify-center flex-shrink-0 border border-primary/10">
              <span className="text-[26px]">🏋️</span>
            </div>
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-caption text-ink-tertiary">{gymName}</p>
              <p className="text-body font-bold text-ink mt-1 leading-snug">{productName}</p>
            </div>
          </div>
          {/* 가격 요약 바 */}
          <div className="mt-3 bg-surface-muted rounded-card px-card py-3 flex items-center justify-between">
            <span className="text-body text-ink-secondary">결제 예정 금액</span>
            <span className="text-title text-primary">{finalPrice.toLocaleString()}원</span>
          </div>
        </div>

        <Divider />

        {/* ━━ 구매자 정보 ━━ */}
        <div className="bg-surface px-page pt-4 pb-3">
          <div className="flex items-center justify-between mb-2.5">
            <SectionTitle>구매자 정보</SectionTitle>
            <button className="text-label text-primary font-bold">변경</button>
          </div>
          {[
            ['이름', '김피트'],
            ['연락처', '010-1234-5678'],
            ['이메일', 'fitkim@email.com'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2.5">
              <span className="text-body text-ink-tertiary">{label}</span>
              <span className="text-body font-semibold text-ink">{value}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* ━━ 할인 ━━ */}
        <div className="bg-surface px-page pt-4 pb-3">
          <SectionTitle>할인</SectionTitle>
          {/* 캐시 */}
          <div className="py-3 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] fill-primary flex-shrink-0"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-3H9V6h2v4z" /></svg>
                <div>
                  <span className="text-body font-semibold text-ink">캐시</span>
                  <span className="text-label text-ink-tertiary ml-1.5">{CASH_BALANCE.toLocaleString()}원 보유</span>
                </div>
              </div>
              <button
                onClick={() => setCashInput(cashInput > 0 ? 0 : maxCash)}
                className={`text-label font-bold px-3.5 py-2 rounded-pill transition-colors ${
                  cashUsed > 0 ? 'bg-primary text-white' : 'bg-surface-muted text-ink-secondary hover:bg-ink hover:text-surface'
                }`}
              >
                {cashUsed > 0 ? '취소' : '전액 사용'}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={cashInput || ''}
                  onChange={e => setCashInput(Math.min(maxCash, Math.max(0, parseInt(e.target.value) || 0)))}
                  placeholder="사용할 캐시 입력"
                  className="w-full border border-border rounded-card px-3.5 py-2.5 text-body text-ink text-right pr-9 focus:outline-none focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-body text-ink-tertiary">원</span>
              </div>
            </div>
            {cashUsed > 0 && (
              <p className="text-label text-primary font-semibold mt-1.5 text-right">-{cashUsed.toLocaleString()}원 적용</p>
            )}
          </div>
          {/* 쿠폰 */}
          <div className="py-3 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] fill-primary flex-shrink-0"><path d="M15 5H5a2 2 0 00-2 2v1a2 2 0 010 4v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 010-4V7a2 2 0 00-2-2zm-5 8a3 3 0 110-6 3 3 0 010 6z" /></svg>
                <div>
                  <span className="text-body font-semibold text-ink">쿠폰</span>
                  <span className="text-label text-primary font-bold ml-1.5">{coupons.length}장 보유</span>
                </div>
              </div>
              {selectedCoupon !== null ? (
                <button onClick={() => setSelectedCoupon(null)} className="text-body font-bold text-primary">취소</button>
              ) : (
                <button onClick={() => setShowCouponSheet(true)} className="text-body font-bold text-ink-secondary bg-surface-muted px-3 py-1.5 rounded-pill hover:bg-ink hover:text-surface transition-colors">선택</button>
              )}
            </div>
            {selectedCoupon !== null && (
              <div className="mt-2 bg-primary-50 rounded-card px-card py-2 flex items-center justify-between">
                <span className="text-label font-bold text-primary">{coupons.find(c => c.id === selectedCoupon)?.name}</span>
                <span className="text-body font-bold text-primary">-{couponDiscount.toLocaleString()}원</span>
              </div>
            )}
          </div>
          {/* 포인트 */}
          <div className="py-3 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] fill-primary flex-shrink-0"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.37.65l2.5 1.5a.75.75 0 10.76-1.3L10.75 9.6V6.75z" /></svg>
                <div>
                  <span className="text-body font-semibold text-ink">포인트</span>
                  <span className="text-label text-ink-tertiary ml-1.5">{POINT_BALANCE.toLocaleString()}P 보유</span>
                </div>
              </div>
              <button
                onClick={() => setPointInput(pointInput > 0 ? 0 : maxPoint)}
                className={`text-label font-bold px-3.5 py-2 rounded-pill transition-colors ${
                  pointUsed > 0 ? 'bg-primary text-white' : 'bg-surface-muted text-ink-secondary hover:bg-ink hover:text-surface'
                }`}
              >
                {pointUsed > 0 ? '취소' : '전액 사용'}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={pointInput || ''}
                  onChange={e => setPointInput(Math.min(maxPoint, Math.max(0, parseInt(e.target.value) || 0)))}
                  placeholder="사용할 포인트 입력"
                  className="w-full border border-border rounded-card px-3.5 py-2.5 text-body text-ink text-right pr-9 focus:outline-none focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-body text-ink-tertiary">P</span>
              </div>
            </div>
            {pointUsed > 0 && (
              <p className="text-label text-primary font-semibold mt-1.5 text-right">-{pointUsed.toLocaleString()}P 적용</p>
            )}
          </div>
        </div>

        <Divider />

        {/* ━━ 결제 수단 ━━ */}
        <div className="bg-surface px-page pt-4 pb-4">
          <SectionTitle>결제 수단</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENTS.map(m => {
              const active = payment === m.key
              return (
                <button
                  key={m.key}
                  onClick={() => setPayment(m.key)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-card border-2 transition-all ${
                    active
                      ? 'border-primary bg-primary-50/60'
                      : 'border-border bg-surface hover:border-ink-disabled'
                  }`}
                >
                  <PaymentIcon method={m.key} />
                  <span className={`text-label font-bold ${active ? 'text-primary' : 'text-ink-secondary'}`}>{m.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 쿠폰 선택 바텀시트 */}
        {showCouponSheet && (
          <div className="fixed inset-0 z-[60] flex items-end" onClick={() => setShowCouponSheet(false)}>
            <div className="absolute inset-0 bg-ink/40" />
            <div className="relative w-full bg-surface rounded-t-[20px] px-page pt-5 pb-8 animate-sheet-up" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-ink-disabled rounded-pill mx-auto mb-4" />
              <p className="text-title mb-4">쿠폰 선택</p>
              <div className="flex flex-col gap-2.5">
                {coupons.map(c => {
                  const isSelected = selectedCoupon === c.id
                  const applicable = c.discount <= priceNum
                  return (
                    <button
                      key={c.id}
                      disabled={!applicable}
                      onClick={() => { setSelectedCoupon(c.id); setShowCouponSheet(false) }}
                      className={`w-full text-left rounded-card-lg border-2 px-card-lg py-3.5 transition-all ${
                        !applicable
                          ? 'border-border bg-surface-muted opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'border-primary bg-primary-50'
                            : 'border-border bg-surface hover:border-ink-disabled'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-body font-bold text-ink">{c.name}</p>
                          <p className="text-caption text-ink-tertiary mt-0.5">{c.condition}</p>
                        </div>
                        <span className="text-body font-bold text-primary">-{c.discount.toLocaleString()}원</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => { setSelectedCoupon(null); setShowCouponSheet(false) }}
                className="w-full mt-3 py-3 text-label font-bold text-ink-tertiary text-center"
              >
                적용 안 함
              </button>
            </div>
          </div>
        )}

        <Divider />

        {/* ━━ 결제 금액 ━━ */}
        <div className="bg-surface px-page pt-4 pb-4">
          <SectionTitle>결제 금액</SectionTitle>
          <div className="flex justify-between py-1.5">
            <span className="text-body text-ink-tertiary">상품 금액</span>
            <span className="text-body text-ink">{priceNum.toLocaleString()}원</span>
          </div>
          {cashUsed > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-body text-ink-tertiary">캐시 사용</span>
              <span className="text-body text-primary font-semibold">-{cashUsed.toLocaleString()}원</span>
            </div>
          )}
          {couponDiscount > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-body text-ink-tertiary">쿠폰 할인</span>
              <span className="text-body text-primary font-semibold">-{couponDiscount.toLocaleString()}원</span>
            </div>
          )}
          {pointUsed > 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-body text-ink-tertiary">포인트 사용</span>
              <span className="text-body text-primary font-semibold">-{pointUsed.toLocaleString()}원</span>
            </div>
          )}
          {totalDiscount === 0 && (
            <div className="flex justify-between py-1.5">
              <span className="text-body text-ink-tertiary">할인</span>
              <span className="text-body text-ink-disabled">없음</span>
            </div>
          )}
          <div className="border-t border-border mt-3 pt-4 flex justify-between items-baseline">
            <span className="text-title text-ink">총 결제 금액</span>
            <div className="text-right">
              <span className="text-heading text-primary">{finalPrice.toLocaleString()}</span>
              <span className="text-body text-primary font-semibold">원</span>
            </div>
          </div>
        </div>

        <Divider />

        {/* ━━ 약관 동의 ━━ */}
        <div className="bg-surface px-page pt-4 pb-5">
          {/* 전체 동의 */}
          <button onClick={toggleAll} className="w-full flex items-center gap-2.5 pb-3 border-b border-border mb-2">
            <div className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0 transition-colors ${allAgreed ? 'bg-primary' : 'border-2 border-ink-disabled'}`}>
              {allAgreed && <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" /></svg>}
            </div>
            <span className="text-body font-bold text-ink">전체 동의하기</span>
          </button>
          {/* 개별 항목 */}
          {[
            { label: '(필수) 구매 조건 확인 및 결제 진행 동의', required: true },
            { label: '(필수) 개인정보 제3자 제공 동의', required: true },
            { label: '(선택) 마케팅 정보 수신 동의', required: false },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => { if (item.required) { setAgreed(!agreed); setAllAgreed(false) } }}
              className="w-full flex items-center gap-2.5 py-2"
            >
              <div className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors ${
                (item.required ? agreed : allAgreed) ? 'bg-ink' : 'border border-ink-disabled'
              }`}>
                {(item.required ? agreed : allAgreed) && <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-white"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" /></svg>}
              </div>
              <span className="text-label text-ink-secondary">{item.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ━━ Bottom CTA ━━ */}
      <BottomCTA hideBottomNav>
        <div className="flex-1 min-w-0">
          <p className="text-label text-ink-tertiary">{selectedMethod?.label}</p>
          <p className="text-title text-ink">{finalPrice.toLocaleString()}원</p>
        </div>
        <button
          onClick={() => navigate(`/complete?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(finalPrice.toLocaleString())}&gym=${encodeURIComponent(gymName)}&method=${encodeURIComponent(selectedMethod?.label || '')}`)}
          disabled={!agreed}
          className={`flex-shrink-0 px-8 py-3.5 rounded-card text-body font-bold transition-colors ${
            agreed
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-ink-disabled text-ink-placeholder cursor-not-allowed'
          }`}
        >
          {finalPrice.toLocaleString()}원 결제하기
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
