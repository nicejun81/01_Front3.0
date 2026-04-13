import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'

const reasons = [
  '스팸/광고',
  '음란성/선정적 콘텐츠',
  '폭력/혐오 발언',
  '거짓 정보',
  '사기/사칭',
  '저작권 침해',
  '기타',
]

export const ReportPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const target = params.get('target') || '게시물'
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState('')

  const canSubmit = selected !== null

  const handleSubmit = () => {
    if (!canSubmit) return
    alert('신고가 접수되었어요. 검토 후 조치해드릴게요.')
    navigate(-1)
  }

  return (
    <PageLayout header={<SubPageHeader title="신고하기" />} className="!pb-[120px]">
      <div className="py-section space-y-section">
        <div>
          <h2 className="text-heading font-bold text-ink mb-1">신고 사유를 선택해주세요</h2>
          <p className="text-label text-ink-secondary">
            신고하신 {target}은(는) 운영팀 검토 후 처리됩니다. 허위 신고 시 이용이 제한될 수 있어요.
          </p>
        </div>

        <div className="space-y-2">
          {reasons.map((r) => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-card border transition-colors ${
                selected === r
                  ? 'border-primary bg-primary-50'
                  : 'border-border bg-surface hover:bg-surface-subtle'
              }`}
            >
              <span className={`text-body ${selected === r ? 'text-primary font-semibold' : 'text-ink'}`}>{r}</span>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === r ? 'border-primary' : 'border-border'
                }`}
              >
                {selected === r && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-title font-bold text-ink mb-2">상세 내용 (선택)</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={5}
            placeholder="신고와 관련된 추가 내용을 자유롭게 적어주세요."
            className="w-full p-card-lg bg-surface-subtle border border-border rounded-card text-body text-ink placeholder:text-ink-placeholder focus:outline-none focus:border-primary resize-none"
          />
          <p className="text-caption text-ink-tertiary mt-1 text-right">{detail.length}/500</p>
        </div>
      </div>

      <BottomCTA>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
        >
          신고 제출
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
