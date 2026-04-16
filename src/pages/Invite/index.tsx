import { useState } from 'react'
import { PageLayout, SubPageHeader } from '../../components'
import { IconUserPlus } from '../../components/Icons'

const invitedFriends = [
  { name: '이**', date: '2026.04.10', status: '가입완료', point: 5000 },
  { name: '박**', date: '2026.03.22', status: '가입완료', point: 5000 },
  { name: '최**', date: '2026.03.15', status: '가입완료', point: 5000 },
]

const STEPS = [
  { icon: '🔗', title: '초대 코드 공유', desc: '카카오톡이나 링크로 친구에게 코드를 보내세요' },
  { icon: '📱', title: '친구가 가입', desc: '친구가 코드를 입력하고 회원가입을 완료하면' },
  { icon: '🎁', title: '포인트 적립', desc: '나와 친구 모두 5,000P가 즉시 적립됩니다' },
]

export const InvitePage = () => {
  const [copied, setCopied] = useState(false)
  const header = <SubPageHeader title="친구 소개" />

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageLayout header={header} noPadding>
      {/* 히어로 영역 */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-page pt-8 pb-6 text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <IconUserPlus className="w-8 h-8 stroke-white stroke-[1.5]" />
        </div>
        <h2 className="text-heading font-bold text-ink mb-1">친구를 초대하고 혜택 받으세요!</h2>
        <p className="text-body text-ink-tertiary">친구가 가입하면 서로 <span className="text-primary font-bold">5,000포인트</span>씩 적립</p>
      </div>

      {/* 초대 현황 카드 */}
      <div className="px-page mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary-50 rounded-card-lg p-4 text-center">
            <div className="text-heading font-extrabold text-primary tabular-nums">3<span className="text-body font-bold">명</span></div>
            <div className="text-caption text-ink-tertiary mt-0.5">초대한 친구</div>
          </div>
          <div className="bg-primary-50 rounded-card-lg p-4 text-center">
            <div className="text-heading font-extrabold text-primary tabular-nums">15,000<span className="text-body font-bold">P</span></div>
            <div className="text-caption text-ink-tertiary mt-0.5">받은 포인트</div>
          </div>
        </div>
      </div>

      {/* 내 초대 코드 */}
      <div className="px-page mb-5">
        <div className="text-label font-semibold text-ink-tertiary mb-2">내 초대 코드</div>
        <div className="flex items-center gap-3 bg-surface-muted rounded-card-lg p-4">
          <span className="flex-1 text-title font-extrabold text-ink tracking-widest tabular-nums">FITKIM2024</span>
          <button
            onClick={() => handleCopy('FITKIM2024')}
            className={`px-4 py-2 text-label font-bold rounded-card transition-all ${
              copied
                ? 'bg-accent-green text-white'
                : 'bg-ink text-white hover:bg-primary'
            }`}
          >
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
      </div>

      {/* 공유 버튼 */}
      <div className="px-page flex flex-col gap-2.5 mb-6">
        <button
          onClick={() => handleCopy(`${window.location.origin}/signup?ref=FITKIM2024`)}
          className="w-full py-3.5 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-card hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#3C1E1E]"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67l-.9 3.35c-.08.3.26.54.52.37l3.95-2.6c.57.08 1.16.12 1.77.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/></svg>
          카카오톡으로 공유하기
        </button>
        <button
          onClick={() => handleCopy(`${window.location.origin}/signup?ref=FITKIM2024`)}
          className="w-full py-3.5 bg-surface-muted text-ink font-bold rounded-card hover:bg-ink-disabled transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink stroke-2 fill-none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          링크 복사하기
        </button>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 초대 방법 */}
      <div className="px-page py-section">
        <h3 className="text-body font-bold text-ink mb-4">이렇게 초대하세요</h3>
        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 text-body">
                {step.icon}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-caption font-bold text-primary">STEP {i + 1}</span>
                  <span className="text-body font-semibold text-ink">{step.title}</span>
                </div>
                <p className="text-caption text-ink-tertiary mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 초대 내역 */}
      <div className="px-page py-section">
        <h3 className="text-body font-bold text-ink mb-3">초대 내역</h3>
        {invitedFriends.length > 0 ? (
          <div className="flex flex-col gap-2">
            {invitedFriends.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-muted rounded-card">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 stroke-primary stroke-[1.5] fill-none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div className="text-body font-semibold text-ink">{f.name}</div>
                    <div className="text-caption text-ink-placeholder">{f.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-label font-bold text-primary tabular-nums">+{f.point.toLocaleString()}P</div>
                  <div className="text-caption text-accent-green font-medium">{f.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-caption text-ink-placeholder">아직 초대한 친구가 없습니다</div>
        )}
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 유의사항 */}
      <div className="px-page py-section pb-8">
        <h3 className="text-label font-bold text-ink-tertiary mb-2">유의사항</h3>
        <ul className="flex flex-col gap-1.5 text-caption text-ink-placeholder">
          <li className="flex gap-1.5"><span className="shrink-0">·</span>초대 포인트는 친구가 회원가입을 완료한 시점에 적립됩니다</li>
          <li className="flex gap-1.5"><span className="shrink-0">·</span>적립된 포인트는 바디채널 모든 서비스에 사용 가능합니다</li>
          <li className="flex gap-1.5"><span className="shrink-0">·</span>부정한 방법으로 포인트를 획득한 경우 회수될 수 있습니다</li>
          <li className="flex gap-1.5"><span className="shrink-0">·</span>본 이벤트는 사전 공지 없이 변경 또는 종료될 수 있습니다</li>
        </ul>
      </div>
    </PageLayout>
  )
}
