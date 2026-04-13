import { useParams, useNavigate } from 'react-router-dom'
import { SubPageHeader, PageLayout } from '../../components'
import { baItems } from './BeforeAfter'

export const GymBeforeAfterDetailPage = () => {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const idx = Number(itemId)
  const item = baItems[idx]

  if (!item) {
    return (
      <PageLayout header={<SubPageHeader title="Before & After" />}>
        <div className="py-16 text-center">
          <p className="text-body text-ink-tertiary">사례를 찾을 수 없습니다</p>
        </div>
      </PageLayout>
    )
  }

  const ib = item.inbody
  const rows = [
    { label: '체중', unit: 'kg', s: ib.start.weight, e: ib.end.weight },
    { label: '골격근량', unit: 'kg', s: ib.start.muscle, e: ib.end.muscle },
    { label: '체지방률', unit: '%', s: ib.start.fat, e: ib.end.fat },
    { label: 'BMI', unit: '', s: ib.start.bmi, e: ib.end.bmi },
  ]

  return (
    <PageLayout header={<SubPageHeader title="Before & After" />} noPadding>

      {/* ━━ 1. 제목 + 태그 + 기간 ━━ */}
      <div className="px-page py-section">
        <span className={`inline-block px-2.5 py-1 text-caption font-bold rounded-pill mb-3 ${
          item.tag === '다이어트' ? 'bg-primary-50 text-primary'
          : item.tag === '벌크업' ? 'bg-accent-purple/10 text-accent-purple'
          : 'bg-accent-green/10 text-semantic-online'
        }`}>{item.tag}</span>
        <h1 className="text-display font-bold text-ink mb-2">{item.title}</h1>
        <p className="text-body text-ink-secondary">{ib.startDate} ~ {ib.endDate}</p>
      </div>

      {/* ━━ 2. Before & After 사진 ━━ */}
      <div className="px-page pb-section">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-card-lg overflow-hidden">
            <img src={item.before} alt="Before" className="w-full aspect-[3/4] object-cover" />
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 text-white text-caption font-bold rounded">BEFORE</span>
            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/40 text-white text-caption rounded">{ib.startDate}</span>
          </div>
          <div className="relative rounded-card-lg overflow-hidden">
            <img src={item.after} alt="After" className="w-full aspect-[3/4] object-cover" />
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-white text-caption font-bold rounded">AFTER</span>
            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-primary/60 text-white text-caption rounded">{ib.endDate}</span>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ━━ 3. 인바디 변화량 ━━ */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-section">인바디 변화 기록</h2>
        <div className="grid grid-cols-2 gap-3">
          {rows.map((row, i) => {
            const diff = row.e - row.s
            const isGood = row.label === '골격근량' ? diff > 0 : diff < 0
            return (
              <div key={i} className="bg-surface-muted rounded-card p-card-lg">
                <p className="text-label text-ink-tertiary mb-2">{row.label}</p>
                <div className="flex items-end justify-between mb-2">
                  <p className="text-heading font-bold text-ink">{row.e}{row.unit}</p>
                  <p className={`text-body font-bold ${isGood ? 'text-semantic-online' : diff === 0 ? 'text-ink-tertiary' : 'text-primary'}`}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}{row.unit}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="text-label text-ink-placeholder">{row.s}{row.unit}</p>
                  <svg viewBox="0 0 16 16" className="w-3 h-3 text-ink-disabled"><path d="M3 8h10M10 5l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                  <p className="text-label font-bold text-ink-secondary">{row.e}{row.unit}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ━━ 4. 참여 프로그램 (레슨 + 강사) ━━ */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-section">참여 프로그램</h2>

        {/* 레슨권 */}
        <div className="flex items-center gap-3 p-card-lg bg-surface-muted rounded-card mb-3">
          <div className="w-10 h-10 bg-primary-50 rounded-card flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label text-ink-tertiary">이용 레슨권</p>
            <p className="text-body font-bold text-ink mt-0.5">{item.lesson}</p>
          </div>
        </div>

        {/* 담당 강사 */}
        <div
          className="flex items-center gap-3 p-card-lg bg-surface-muted rounded-card cursor-pointer hover:bg-border transition-colors"
          onClick={() => navigate(`/trainer/${item.trainer.id}`)}
        >
          <img src={item.trainer.avatar} alt={item.trainer.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-label text-ink-tertiary">담당 강사</p>
            <p className="text-body font-bold text-ink mt-0.5">{item.trainer.name} 강사 · {item.trainer.specialty}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-semantic-star" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-body font-bold text-ink">{item.trainer.rating}</span>
          </div>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink-tertiary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ━━ 5. 회원 후기 ━━ */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-section">회원 후기</h2>
        <div className="bg-surface-muted rounded-card p-card-lg">
          <div className="flex gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
            </svg>
            <p className="text-body text-ink-secondary italic leading-relaxed">{item.quote}</p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ━━ 6. CTA ━━ */}
      <div className="px-page py-section">
        <div className="bg-primary-50 rounded-card-lg p-card-lg">
          <p className="text-body font-bold text-primary mb-1">나도 변화하고 싶다면?</p>
          <p className="text-label text-ink-secondary">바디채널에서 전문 트레이너와 함께 목표를 달성해 보세요.</p>
        </div>
      </div>

    </PageLayout>
  )
}
