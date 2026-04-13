import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

type DocType = 'receipt' | 'contract'

const PrintIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4 stroke-current stroke-[1.5] fill-none">
    <path d="M5 8V2h10v6M5 14H3a1 1 0 01-1-1V9a1 1 0 011-1h14a1 1 0 011 1v4a1 1 0 01-1 1h-2" />
    <rect x="5" y="12" width="10" height="6" />
  </svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4 stroke-current stroke-[1.5] fill-none">
    <path d="M10 3v10m0 0l-3-3m3 3l3-3M3 15v1a1 1 0 001 1h12a1 1 0 001-1v-1" />
  </svg>
)

export const PurchaseDocsPage = () => {
  const [searchParams] = useSearchParams()
  const productName = searchParams.get('name') || ''
  const productPrice = searchParams.get('price') || ''
  const gymName = searchParams.get('gym') || ''
  const paymentMethod = searchParams.get('method') || ''
  const orderNumber = searchParams.get('order') || ''
  const paymentDate = searchParams.get('date') || ''

  const [openDoc, setOpenDoc] = useState<DocType | null>(null)

  const handlePrint = () => window.print()

  const header = <SubPageHeader title="구매 문서" />

  return (
    <PageLayout header={header} hideBottomNav>
      <div className="-mx-page -mt-4 bg-surface-muted pb-10">

        {/* ── 주문 요약 ── */}
        <div className="bg-surface px-page pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-50 rounded-card flex items-center justify-center flex-shrink-0">
              <span className="text-[22px]">🏋️</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body font-bold text-ink">{productName}</p>
              <p className="text-caption text-ink-tertiary">{gymName} · {orderNumber}</p>
            </div>
          </div>
        </div>

        <div className="h-2 bg-surface-muted" />

        {/* ── 문서 목록 ── */}
        <div className="bg-surface px-page pt-4 pb-2">
          <h3 className="text-title text-ink mb-4">구매 문서</h3>

          {/* 전자영수증 */}
          <div className="border border-border rounded-card-lg overflow-hidden mb-3">
            <button
              onClick={() => setOpenDoc(openDoc === 'receipt' ? null : 'receipt')}
              className={`w-full flex items-center justify-between px-card-lg py-3.5 transition-colors ${openDoc === 'receipt' ? 'bg-primary-50' : 'hover:bg-surface-subtle'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-semantic-online/10 rounded-card flex items-center justify-center">
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-semantic-online"><path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2v1h8V6H6zm0 3v1h8V9H6zm0 3v1h5v-1H6z" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-body font-bold text-ink">전자영수증</p>
                  <p className="text-caption text-ink-tertiary">결제 내역 확인 및 출력</p>
                </div>
              </div>
              <svg viewBox="0 0 20 20" className={`w-5 h-5 transition-transform ${openDoc === 'receipt' ? 'text-primary rotate-180' : 'text-ink-tertiary'}`}>
                <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {openDoc === 'receipt' && (
              <div className="px-card-lg pb-4 border-t border-border">
                <div className="bg-surface-muted rounded-card p-card-lg mt-3">
                  <p className="text-label font-bold text-ink text-center mb-3">전 자 영 수 증</p>
                  <div className="border-t border-dashed border-ink-disabled pt-3 space-y-2">
                    <div className="flex justify-between"><span className="text-caption text-ink-tertiary">주문번호</span><span className="text-caption text-ink">{orderNumber}</span></div>
                    <div className="flex justify-between"><span className="text-caption text-ink-tertiary">상품명</span><span className="text-caption text-ink">{productName}</span></div>
                    <div className="flex justify-between"><span className="text-caption text-ink-tertiary">이용시설</span><span className="text-caption text-ink">{gymName}</span></div>
                    <div className="flex justify-between"><span className="text-caption text-ink-tertiary">결제수단</span><span className="text-caption text-ink">{paymentMethod}</span></div>
                    <div className="flex justify-between"><span className="text-caption text-ink-tertiary">결제일시</span><span className="text-caption text-ink">{paymentDate}</span></div>
                  </div>
                  <div className="border-t border-dashed border-ink-disabled mt-3 pt-3 flex justify-between items-baseline">
                    <span className="text-label font-bold text-ink">결제 금액</span>
                    <span className="text-title text-primary">{productPrice}원</span>
                  </div>
                  <div className="border-t border-dashed border-ink-disabled mt-3 pt-3">
                    <div className="flex justify-between"><span className="text-caption text-ink-tertiary">공급가액</span><span className="text-caption text-ink">{Math.round(parseInt(productPrice.replace(/[^0-9]/g, '')) / 1.1).toLocaleString()}원</span></div>
                    <div className="flex justify-between mt-1"><span className="text-caption text-ink-tertiary">부가세</span><span className="text-caption text-ink">{Math.round(parseInt(productPrice.replace(/[^0-9]/g, '')) - parseInt(productPrice.replace(/[^0-9]/g, '')) / 1.1).toLocaleString()}원</span></div>
                  </div>
                </div>
                <button onClick={handlePrint} className="w-full mt-3 py-3 bg-ink text-surface text-label font-bold rounded-card flex items-center justify-center gap-2 hover:bg-primary transition-colors">
                  <PrintIcon />인쇄하기
                </button>
              </div>
            )}
          </div>

          {/* 계약서 */}
          <div className="border border-border rounded-card-lg overflow-hidden mb-3">
            <button
              onClick={() => setOpenDoc(openDoc === 'contract' ? null : 'contract')}
              className={`w-full flex items-center justify-between px-card-lg py-3.5 transition-colors ${openDoc === 'contract' ? 'bg-primary-50' : 'hover:bg-surface-subtle'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-card flex items-center justify-center">
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-primary"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-body font-bold text-ink">이용 계약서</p>
                  <p className="text-caption text-ink-tertiary">서비스 이용 계약서 확인 및 출력</p>
                </div>
              </div>
              <svg viewBox="0 0 20 20" className={`w-5 h-5 transition-transform ${openDoc === 'contract' ? 'text-primary rotate-180' : 'text-ink-tertiary'}`}>
                <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {openDoc === 'contract' && (
              <div className="px-card-lg pb-4 border-t border-border">
                <div className="bg-surface-muted rounded-card p-card-lg mt-3">
                  <p className="text-label font-bold text-ink text-center mb-4">피트니스 이용 계약서</p>
                  <div className="text-caption text-ink-secondary leading-relaxed space-y-3">
                    <div className="border border-border rounded-card p-3 bg-surface">
                      <p className="text-caption font-bold text-ink mb-2">계약 정보</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between"><span className="text-ink-tertiary">계약번호</span><span className="text-ink">{orderNumber}</span></div>
                        <div className="flex justify-between"><span className="text-ink-tertiary">계약일</span><span className="text-ink">{paymentDate}</span></div>
                        <div className="flex justify-between"><span className="text-ink-tertiary">이용시설</span><span className="text-ink">{gymName}</span></div>
                      </div>
                    </div>
                    <div className="border border-border rounded-card p-3 bg-surface">
                      <p className="text-caption font-bold text-ink mb-2">이용 상품</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between"><span className="text-ink-tertiary">상품명</span><span className="text-ink">{productName}</span></div>
                        <div className="flex justify-between"><span className="text-ink-tertiary">결제금액</span><span className="text-ink font-bold">{productPrice}원</span></div>
                        <div className="flex justify-between"><span className="text-ink-tertiary">결제수단</span><span className="text-ink">{paymentMethod}</span></div>
                      </div>
                    </div>
                    <div className="border border-border rounded-card p-3 bg-surface">
                      <p className="text-caption font-bold text-ink mb-2">회원 정보</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between"><span className="text-ink-tertiary">이름</span><span className="text-ink">김피트</span></div>
                        <div className="flex justify-between"><span className="text-ink-tertiary">연락처</span><span className="text-ink">010-1234-5678</span></div>
                        <div className="flex justify-between"><span className="text-ink-tertiary">이메일</span><span className="text-ink">fitkim@email.com</span></div>
                      </div>
                    </div>
                    <p className="text-ink-tertiary pt-2">상기 내용으로 피트니스 이용 계약을 체결하며, 회원은 이용약관에 동의합니다.</p>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-ink-tertiary">갑: (주)바디채널</span>
                      <span className="text-ink-tertiary">을: 김피트</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handlePrint} className="flex-1 py-3 bg-ink text-surface text-label font-bold rounded-card flex items-center justify-center gap-2 hover:bg-primary transition-colors">
                    <PrintIcon />인쇄
                  </button>
                  <button onClick={handlePrint} className="flex-1 py-3 bg-surface border border-border text-ink text-label font-bold rounded-card flex items-center justify-center gap-2 hover:bg-surface-muted transition-colors">
                    <DownloadIcon />다운로드
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
