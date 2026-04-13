import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SubPageHeader, PageLayout } from '../../components'

export const baItems = [
  { before: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop', tag: '다이어트', title: '3개월 -12kg 감량 성공', quote: '3개월 만에 인생이 바뀌었어요. 매일 거울 보는 게 즐거워졌습니다!', lesson: 'PT 30회권', trainer: { id: 1, name: '최강민', specialty: 'PT · 체형교정', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop&crop=face', rating: 4.9 }, inbody: { startDate: '2025.09.01', endDate: '2025.12.03', start: { weight: 82, muscle: 28.5, fat: 32.1, bmi: 28.4 }, end: { weight: 70, muscle: 30.2, fat: 20.5, bmi: 24.2 } } },
  { before: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop', tag: '벌크업', title: '4개월 근육량 +5kg 달성', quote: '마른 체형이 콤플렉스였는데 드디어 자신감이 생겼어요!', lesson: 'PT 50회권', trainer: { id: 3, name: '한동훈', specialty: 'PT · 다이어트', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', rating: 4.9 }, inbody: { startDate: '2025.08.15', endDate: '2025.12.18', start: { weight: 62, muscle: 25.0, fat: 18.2, bmi: 21.1 }, end: { weight: 67, muscle: 30.0, fat: 15.8, bmi: 22.8 } } },
  { before: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop', tag: '체형교정', title: '거북목·라운드숄더 교정', quote: '거북목과 라운드숄더가 눈에 띄게 개선되었습니다.', lesson: '바레톤 3개월권', trainer: { id: 4, name: '정서연', specialty: '바레톤', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', rating: 4.8 }, inbody: { startDate: '2025.06.10', endDate: '2025.12.12', start: { weight: 58, muscle: 22.0, fat: 26.5, bmi: 23.1 }, end: { weight: 56, muscle: 23.8, fat: 22.0, bmi: 22.3 } } },
  { before: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=500&fit=crop', tag: '다이어트', title: '2개월 단기 -8kg 감량', quote: '단기간에 이렇게 변할 수 있다니, 트레이너님 감사합니다!', lesson: 'PT 20회권', trainer: { id: 1, name: '최강민', specialty: 'PT · 체형교정', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop&crop=face', rating: 4.9 }, inbody: { startDate: '2025.10.05', endDate: '2025.12.08', start: { weight: 75, muscle: 27.0, fat: 29.8, bmi: 26.9 }, end: { weight: 67, muscle: 28.5, fat: 21.2, bmi: 24.0 } } },
  { before: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=500&fit=crop', tag: '벌크업', title: '5개월 체계적 벌크업 +8kg', quote: '벌크업이 이렇게 체계적으로 가능한 줄 몰랐어요.', lesson: 'PT 50회권 + 히트35 3개월권', trainer: { id: 3, name: '한동훈', specialty: 'PT · 다이어트', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', rating: 4.9 }, inbody: { startDate: '2025.07.20', endDate: '2025.12.22', start: { weight: 68, muscle: 27.5, fat: 20.0, bmi: 22.5 }, end: { weight: 76, muscle: 35.5, fat: 16.2, bmi: 25.1 } } },
  { before: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=500&fit=crop', tag: '체형교정', title: '바레톤으로 유연성 대폭 향상', quote: '바레톤와 함께하니 몸이 정말 가벼워졌어요!', lesson: '바레톤 6개월권', trainer: { id: 4, name: '정서연', specialty: '바레톤', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', rating: 4.8 }, inbody: { startDate: '2025.08.01', endDate: '2025.12.05', start: { weight: 55, muscle: 20.5, fat: 28.0, bmi: 22.0 }, end: { weight: 53, muscle: 22.8, fat: 23.5, bmi: 21.2 } } },
  { before: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop', tag: '체형교정', title: '코어 강화로 허리 통증 해결', quote: '만성 허리 통증이 바레톤 3개월 만에 사라졌어요!', lesson: '바레톤 3개월권', trainer: { id: 5, name: '박지영', specialty: '바레톤', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face', rating: 4.7 }, inbody: { startDate: '2025.09.10', endDate: '2025.12.15', start: { weight: 60, muscle: 21.0, fat: 27.5, bmi: 23.5 }, end: { weight: 57, muscle: 23.2, fat: 23.0, bmi: 22.3 } } },
  { before: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=500&fit=crop', tag: '다이어트', title: '바레톤으로 건강한 -6kg 감량', quote: '박지영 선생님 덕분에 요요 없이 건강하게 뺐어요!', lesson: '바레톤 6개월권', trainer: { id: 5, name: '박지영', specialty: '바레톤', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=face', rating: 4.7 }, inbody: { startDate: '2025.07.01', endDate: '2025.12.20', start: { weight: 65, muscle: 22.5, fat: 30.0, bmi: 25.0 }, end: { weight: 59, muscle: 24.0, fat: 24.2, bmi: 22.7 } } },
  { before: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=500&fit=crop', tag: '체형교정', title: '바레톤으로 라운드숄더 개선', quote: '이수진 선생님 바레톤 수업 덕분에 어깨가 펴졌어요!', lesson: '바레톤 3개월권', trainer: { id: 6, name: '이수진', specialty: '바레톤 · 체형교정', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&h=80&fit=crop&crop=face', rating: 4.8 }, inbody: { startDate: '2025.09.15', endDate: '2025.12.18', start: { weight: 57, muscle: 21.0, fat: 26.0, bmi: 22.5 }, end: { weight: 55, muscle: 22.5, fat: 22.8, bmi: 21.7 } } },
  { before: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=500&fit=crop', tag: '다이어트', title: '모닝 바레톤으로 -4kg 감량', quote: '아침 바레톤 꾸준히 했더니 자연스럽게 살이 빠졌어요!', lesson: '바레톤 6개월권', trainer: { id: 6, name: '이수진', specialty: '바레톤 · 체형교정', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&h=80&fit=crop&crop=face', rating: 4.8 }, inbody: { startDate: '2025.06.20', endDate: '2025.12.22', start: { weight: 62, muscle: 20.8, fat: 29.5, bmi: 24.2 }, end: { weight: 58, muscle: 22.0, fat: 25.0, bmi: 22.6 } } },
]

const tags = ['전체', '다이어트', '벌크업', '체형교정']

const gymNames: Record<string, string> = { '1': '강남점', '2': '역삼점', '3': '서초점', '4': '판교점' }

/* ── 슬라이더 비교 카드 ── */
const CompareSlider = ({ before, after }: { before: string; after: string }) => {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPos((x / rect.width) * 100)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] overflow-hidden rounded-card-lg select-none touch-none"
      onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX) }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After (배경) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (클리핑) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw' }} />
      </div>
      {/* 구분선 + 핸들 */}
      <div className="absolute top-0 bottom-0 z-10" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-elevated flex items-center justify-center cursor-ew-resize">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink-secondary" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" />
          </svg>
        </div>
      </div>
      {/* 라벨 */}
      <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 text-white text-caption font-bold rounded-pill z-20">BEFORE</span>
      <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-white text-caption font-bold rounded-pill z-20">AFTER</span>
    </div>
  )
}

export const GymBeforeAfterPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTag, setActiveTag] = useState('전체')

  const filtered = activeTag === '전체' ? baItems : baItems.filter(i => i.tag === activeTag)
  const header = <SubPageHeader title="Before & After" />

  return (
    <PageLayout header={header} noPadding>
      {/* ── 히어로 배너 ── */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=440&fit=crop"
          alt="Before & After"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 px-page pb-8">
          <p className="text-label text-white/70 mb-1">바디채널 {gymNames[id || '1'] || '강남점'}</p>
          <p className="text-display text-white">회원들의 놀라운 변화</p>
        </div>
      </div>

      {/* ── 통계 카드 ── */}
      <div className="px-page -mt-5 relative z-10 mb-4">
        <div className="flex gap-2.5 bg-surface rounded-card-lg shadow-elevated p-3">
          {[
            { label: '변화 사례', value: '128+', icon: '🔥' },
            { label: '평균 달성기간', value: '3.5개월', icon: '⏱' },
            { label: '만족도', value: '98%', icon: '💯' },
          ].map((s, i) => (
            <div key={i} className="flex-1 text-center py-1.5">
              <p className="text-caption mb-0.5">{s.icon}</p>
              <p className="text-title text-ink font-bold">{s.value}</p>
              <p className="text-caption text-ink-tertiary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 필터 탭 ── */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="flex gap-2 px-page py-3 overflow-x-auto hide-scrollbar">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-pill text-label font-bold whitespace-nowrap transition-all ${
                activeTag === tag
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-ink-secondary'
              }`}
            >
              {tag}
              {tag !== '전체' && (
                <span className="ml-1 text-caption opacity-70">
                  {baItems.filter(i => i.tag === tag).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 카드 리스트 ── */}
      <div className="px-page py-section flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-heading font-bold text-ink">변화 사례</h2>
          <p className="text-label text-ink-tertiary">{filtered.length}건</p>
        </div>
        {filtered.map((item, i) => {
          const itemIdx = baItems.indexOf(item)
          return (
            <div key={i} className="bg-surface rounded-card-lg shadow-card overflow-hidden cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all" onClick={() => navigate(`/gym/${id}/before-after/${itemIdx}`)}>
              {/* 슬라이더 비교 */}
              <CompareSlider before={item.before} after={item.after} />

              {/* 정보 영역 */}
              <div className="px-card-lg py-4">
                <p className="text-title font-bold text-ink mb-3">{item.title}</p>
                {/* 후기 한마디 */}
                <div className="flex gap-2.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary flex-shrink-0 mt-1" fill="currentColor">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  <p className="text-body text-ink-secondary italic leading-relaxed">{item.quote}</p>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-body text-ink-tertiary">해당 카테고리의 사례가 없습니다</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
