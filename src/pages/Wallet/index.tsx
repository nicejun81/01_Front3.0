import { useParams } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'

const walletData: Record<string, { title: string; balance: string; unit: string; history: { date: string; desc: string; amount: string; type: 'plus' | 'minus' }[] }> = {
  cash: {
    title: '캐시', balance: '15,000', unit: '원',
    history: [
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
    history: [
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
    title: '쿠폰', balance: '3', unit: '장',
    history: [
      { date: '만료 2026.04.30', desc: '첫 달 80% OFF', amount: '첫 결제 시', type: 'plus' },
      { date: '만료 2026.04.15', desc: '5,000원 할인', amount: '3만원 이상', type: 'plus' },
      { date: '만료 2026.05.31', desc: '10% 할인', amount: '레슨권 전용', type: 'plus' },
    ],
  },
}

export const WalletPage = () => {
  const { type } = useParams()
  const data = walletData[type || 'cash']

  if (!data) return null

  const header = <SubPageHeader title={data.title} />
  const isCoupon = type === 'coupon'

  return (
    <PageLayout header={header} hideBottomNav>
      {/* 잔액 카드 */}
      <div className="bg-ink rounded-card-lg p-card-lg mb-section text-center">
        <p className="text-label text-white/60 mb-1">보유 {data.title}</p>
        <p className="text-display font-bold text-white">{data.balance}<span className="text-body font-normal text-white/60 ml-1">{data.unit}</span></p>
        {!isCoupon && (
          <button className="mt-3 px-6 py-2 bg-primary rounded-pill text-label font-bold text-white hover:bg-primary-dark transition-colors">
            {type === 'cash' ? '충전하기' : '사용하기'}
          </button>
        )}
      </div>

      {/* 내역 */}
      <div>
        <h3 className="text-body font-bold text-ink mb-3">{isCoupon ? '보유 쿠폰' : '이용 내역'}</h3>
        <div className="flex flex-col">
          {data.history.map((item, i) => (
            isCoupon ? (
              <div key={i} className="flex items-center gap-3 py-4 border-b border-border-light last:border-0">
                <div className="w-10 h-10 bg-primary-50 rounded-card flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-primary"><path d="M15 5H5a2 2 0 00-2 2v1a2 2 0 010 4v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 010-4V7a2 2 0 00-2-2zm-5 8a3 3 0 110-6 3 3 0 010 6z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-bold text-ink">{item.desc}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-label text-ink-tertiary">{item.amount}</span>
                    <span className="text-label text-ink-placeholder">· {item.date}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-primary text-white text-label font-bold rounded-lg hover:bg-primary-dark transition-colors flex-shrink-0">
                  사용
                </button>
              </div>
            ) : (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-border-light last:border-0">
                <div>
                  <p className="text-body text-ink">{item.desc}</p>
                  <span className="text-label text-ink-placeholder">{item.date}</span>
                </div>
                <span className={`text-body font-bold ${item.type === 'plus' ? 'text-primary' : 'text-ink-secondary'}`}>
                  {item.amount}{type === 'point' ? 'P' : '원'}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
