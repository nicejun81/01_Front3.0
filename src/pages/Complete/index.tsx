import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout } from '../../components'

export const CompletePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productName = searchParams.get('name') || 'PT 20회 패키지'
  const productPrice = searchParams.get('price') || '990,000'
  const gymName = searchParams.get('gym') || '바디채널 강남점'
  const paymentMethod = searchParams.get('method') || '카카오페이'

  const orderNumber = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const r = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    return `BC${y}${m}${d}${r}`
  }, [])

  const paymentDate = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const h = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    return `${y}.${m}.${d} ${h}:${min}`
  }, [])

  return (
    <PageLayout hideBottomNav>
      <div className="-mx-page -mt-4 min-h-screen bg-surface flex flex-col items-center pt-16 px-page pb-[100px]">

        {/* ── 체크 아이콘 ── */}
        <div className="w-[72px] h-[72px] rounded-full bg-semantic-online flex items-center justify-center mb-6">
          <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-white stroke-[2.5] fill-none">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* ── 타이틀 ── */}
        <h1 className="text-heading text-ink text-center">결제가 완료되었습니다!</h1>
        <p className="text-body text-ink-tertiary text-center mt-2">이용권이 마이페이지에 등록되었습니다</p>

        {/* ── 주문 정보 카드 ── */}
        <div className="w-full mt-8 bg-surface-muted rounded-card-lg p-card-lg">
          {/* 주문번호 */}
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-border">
            <span className="text-label text-ink-tertiary">주문번호</span>
            <span className="text-label font-bold text-ink">{orderNumber}</span>
          </div>
          {/* 상품 */}
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-border">
            <div className="w-12 h-12 bg-primary-50 rounded-card flex items-center justify-center flex-shrink-0">
              <span className="text-[22px]">🏋️</span>
            </div>
            <div className="min-w-0">
              <p className="text-body font-bold text-ink">{productName}</p>
              <p className="text-caption text-ink-tertiary mt-0.5">{gymName}</p>
            </div>
          </div>
          {/* 상세 */}
          <div className="flex justify-between py-2">
            <span className="text-label text-ink-tertiary">결제 수단</span>
            <span className="text-label font-semibold text-ink">{paymentMethod}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-label text-ink-tertiary">결제 일시</span>
            <span className="text-label font-semibold text-ink">{paymentDate}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-label text-ink-tertiary">결제 금액</span>
            <span className="text-title text-primary">{productPrice}원</span>
          </div>
        </div>

        {/* ── 이용 안내 ── */}
        <div className="w-full mt-4 bg-primary-50 rounded-card-lg px-card-lg py-4">
          <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] fill-primary flex-shrink-0">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm0 7.5a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V14.25z" />
            </svg>
            <span className="text-label font-bold text-primary">이용 안내</span>
          </div>
          <p className="text-caption text-ink-secondary leading-relaxed">
            구매하신 이용권은 마이페이지 &gt; 보유 이용권에서 확인하실 수 있습니다.
            이용권 사용은 헬스장 방문 시 앱을 통해 QR코드를 제시해 주세요.
          </p>
        </div>

        {/* ── 버튼 ── */}
        <div className="w-full mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate('/mypage?tab=purchase')}
            className="w-full py-4 bg-primary text-white text-body font-bold rounded-card hover:bg-primary-dark transition-colors"
          >
            이용권 확인하기
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-surface border border-border text-body font-bold text-ink rounded-card hover:bg-surface-muted transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
