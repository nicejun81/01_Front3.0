import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'

export const MeetupJoinPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)

  const canSubmit = message.trim().length > 0 && agreed

  const handleSubmit = () => {
    if (!canSubmit) return
    // mock submit
    alert('모임 신청이 완료되었어요!')
    navigate(`/meetup/${id}`)
  }

  return (
    <PageLayout header={<SubPageHeader title="모임 신청" />} className="!pb-[120px]">
      <div className="py-section space-y-section">
        <div>
          <h2 className="text-heading font-bold text-ink mb-2">모임장에게 인사 남기기</h2>
          <p className="text-label text-ink-secondary mb-3">
            간단한 자기소개와 참여 동기를 적어주세요. 모임장이 확인 후 승인해드려요.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="예) 안녕하세요! 바레톤 입문자인데 함께 배우고 싶어요."
            rows={6}
            className="w-full p-card-lg bg-surface-subtle border border-border rounded-card text-body text-ink placeholder:text-ink-placeholder focus:outline-none focus:border-primary resize-none"
          />
          <p className="text-caption text-ink-tertiary mt-1 text-right">{message.length}/300</p>
        </div>

        <div className="bg-surface-subtle rounded-card p-card-lg">
          <h3 className="text-title font-bold text-ink mb-2">참여 전 확인사항</h3>
          <ul className="text-label text-ink-secondary space-y-1 list-disc pl-4">
            <li>승인 후 모임 일정을 반드시 확인해주세요.</li>
            <li>무단 불참 시 다른 모임 참여가 제한될 수 있어요.</li>
            <li>모임 내 사진/영상은 모임장 동의 후 촬영해주세요.</li>
          </ul>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 accent-primary"
          />
          <span className="text-body text-ink">위 내용을 확인했으며 동의합니다</span>
        </label>
      </div>

      <BottomCTA>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
        >
          신청하기
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
