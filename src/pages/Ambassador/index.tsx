import { PageLayout, SubPageHeader } from '../../components'
import { IconBarChart } from '../../components/Icons'

const benefits = [
  { title: '월 정산 수익', description: '추천인 결제 금액의 5% 수익' },
  { title: '전용 할인', description: '모든 상품 20% 할인' },
  { title: '우선 예약', description: '인기 클래스 우선 예약권' },
  { title: '전용 굿즈', description: '앰버서더 전용 운동 용품' },
]

export const AmbassadorPage = () => {
  const header = <SubPageHeader title="앰버서더" />

  return (
    <PageLayout header={header}>
      <div className="bg-gradient-to-br from-ink to-[#333] rounded-card-lg p-card-lg mb-section text-white text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <IconBarChart className="w-8 h-8 stroke-white stroke-[1.5]" />
        </div>
        <h2 className="text-display font-bold mb-2">BODYCHANNEL 앰버서더</h2>
        <p className="text-body text-ink-disabled mb-4">운동을 사랑하는 당신을 위한 특별한 기회</p>
        <button className="px-6 py-3 bg-primary text-white font-semibold rounded-card hover:opacity-90 transition-opacity">
          앰버서더 신청하기
        </button>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      <h3 className="text-heading mb-4">앰버서더 혜택</h3>
      <div className="grid grid-cols-2 gap-3 mb-section">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-surface-muted rounded-card p-card">
            <h4 className="text-title text-ink mb-1">{benefit.title}</h4>
            <p className="text-label text-ink-tertiary">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      <h3 className="text-heading mb-4">신청 자격</h3>
      <ul className="space-y-3 text-body text-ink-secondary">
        <li className="flex items-start gap-2">
          <span className="w-5 h-5 bg-primary text-white text-label font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
          <span>SNS 팔로워 1,000명 이상</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-5 h-5 bg-primary text-white text-label font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
          <span>바디채널 3개월 이상 이용 회원</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-5 h-5 bg-primary text-white text-label font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
          <span>운동 관련 콘텐츠 제작 가능자</span>
        </li>
      </ul>
    </PageLayout>
  )
}
