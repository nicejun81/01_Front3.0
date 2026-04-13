import { PageLayout, SubPageHeader } from '../../components'
import { IconUserPlus } from '../../components/Icons'

export const InvitePage = () => {
  const header = <SubPageHeader title="친구 소개" />

  return (
    <PageLayout header={header} className="py-8">
      <div className="text-center mb-section">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <IconUserPlus className="w-10 h-10 stroke-white stroke-[1.5]" />
        </div>
        <h2 className="text-display font-bold mb-2">친구를 초대하고 혜택 받으세요!</h2>
        <p className="text-ink-tertiary text-body">친구가 가입하면 서로 5,000포인트씩 적립</p>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      <div className="bg-surface-muted rounded-card-lg p-card-lg mb-section">
        <p className="text-body text-ink-secondary mb-2">내 초대 코드</p>
        <div className="flex items-center justify-between bg-surface rounded-card p-card">
          <span className="text-display font-bold tracking-wider">FITKIM2024</span>
          <button className="px-4 py-2 bg-ink text-white text-body font-semibold rounded-card hover:bg-primary transition-colors">
            복사
          </button>
        </div>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      <div className="space-y-3">
        <button className="w-full py-4 bg-[#FEE500] text-[#3C1E1E] font-semibold rounded-card hover:opacity-90 transition-opacity">
          카카오톡으로 공유하기
        </button>
        <button className="w-full py-4 bg-ink text-white font-semibold rounded-card hover:bg-primary transition-colors">
          링크 복사하기
        </button>
      </div>

      <div className="h-2 bg-surface-muted -mx-page" />

      <div className="mt-8 p-card-lg bg-surface-muted rounded-card-lg">
        <h3 className="text-title mb-3">초대 현황</h3>
        <div className="flex justify-between text-center">
          <div>
            <p className="text-display font-bold text-primary">3명</p>
            <p className="text-label text-ink-tertiary">초대한 친구</p>
          </div>
          <div>
            <p className="text-display font-bold text-primary">15,000P</p>
            <p className="text-label text-ink-tertiary">받은 포인트</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
