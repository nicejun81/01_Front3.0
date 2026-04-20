import { useState } from 'react'
import { PageLayout, SubPageHeader } from '../../components'

type ReviewTab = 'naver' | 'instagram'

const MY_REVIEWS = {
  naver: { count: 8, likes: 54, points: 16000 },
  instagram: { count: 4, likes: 35, points: 8000 },
}

const NAVER_STEPS = [
  { step: 1, title: '네이버에서 바디채널 검색', desc: '네이버 지도 또는 네이버 플레이스에서 "바디채널 강남점" 검색' },
  { step: 2, title: '영수증 리뷰 작성', desc: '방문 후 영수증 인증과 함께 솔직한 리뷰를 남겨주세요' },
  { step: 3, title: '리뷰 캡처 후 제출', desc: '작성한 리뷰 화면을 캡처하여 아래에서 제출하면 완료!' },
]

const INSTA_STEPS = [
  { step: 1, title: '운동 사진/영상 촬영', desc: '바디채널에서 운동하는 모습이나 시설 사진을 촬영하세요' },
  { step: 2, title: '인스타그램에 업로드', desc: '@bodychannel_official 태그 + #바디채널 해시태그 포함' },
  { step: 3, title: '게시물 링크 제출', desc: '업로드한 게시물 링크를 아래에서 제출하면 완료!' },
]

const NAVER_REWARDS = [
  { label: '영수증 리뷰', reward: '3,000P', icon: '🧾', desc: '영수증 인증 텍스트 리뷰' },
  { label: '사진 리뷰', reward: '5,000P', icon: '📸', desc: '사진 포함 영수증 리뷰' },
  { label: '베스트 리뷰', reward: '10,000P', icon: '🏆', desc: '월간 좋아요 TOP 3 추가 보상' },
]

const INSTA_REWARDS = [
  { label: '피드 게시물', reward: '5,000P', icon: '📷', desc: '피드에 사진/영상 업로드' },
  { label: '릴스 게시물', reward: '8,000P', icon: '🎬', desc: '릴스 영상 업로드' },
  { label: '스토리 태그', reward: '2,000P', icon: '✨', desc: '스토리에 태그 후 캡처 제출' },
]

const RECENT_REVIEWS = [
  { name: '김**', type: 'naver', date: '2026.04.14', content: '시설이 깔끔하고 트레이너분들이 친절해요!', reward: '5,000P', hasPhoto: true, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: '이**', type: 'instagram', date: '2026.04.13', content: '릴스로 운동 브이로그 업로드 완료', reward: '8,000P', hasPhoto: false, imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face' },
  { name: '박**', type: 'naver', date: '2026.04.12', content: '체계적인 PT 프로그램 덕분에 3개월만에 -5kg 성공', reward: '5,000P', hasPhoto: true, imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { name: '최**', type: 'instagram', date: '2026.04.10', content: '오늘의 운동 기록! 바디채널 강남점 추천', reward: '5,000P', hasPhoto: false, imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
  { name: '정**', type: 'naver', date: '2026.04.08', content: '위치도 좋고 기구도 다양해서 만족합니다', reward: '3,000P', hasPhoto: false, imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop&crop=face' },
]

export const ReviewEventPage = () => {
  const [tab, setTab] = useState<ReviewTab>('naver')
  const header = <SubPageHeader title="리뷰 이벤트" />

  const stats = MY_REVIEWS[tab]
  const steps = tab === 'naver' ? NAVER_STEPS : INSTA_STEPS
  const rewards = tab === 'naver' ? NAVER_REWARDS : INSTA_REWARDS

  return (
    <PageLayout header={header} noPadding>
      {/* 탭 */}
      <div className="flex border-b border-border">
        {([
          { key: 'naver' as const, label: '네이버 영수증 리뷰', color: '#03C75A' },
          { key: 'instagram' as const, label: '인스타그램 리뷰', color: '#E4405F' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3.5 text-label font-semibold text-center border-b-2 transition-colors ${
              tab === t.key ? 'text-ink border-ink' : 'text-ink-placeholder border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 히어로 */}
      <div className={`px-page pt-6 pb-5 ${tab === 'naver' ? 'bg-[#03C75A]/10' : 'bg-gradient-to-br from-[#833AB4]/10 via-[#E4405F]/10 to-[#FCAF45]/10'}`}>
        <div className="flex items-center gap-3 mb-4">
          {tab === 'naver' ? (
            <div className="w-12 h-12 rounded-xl bg-[#03C75A] flex items-center justify-center">
              <span className="text-white font-extrabold text-body">N</span>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </div>
          )}
          <div>
            <h2 className="text-heading font-bold text-ink">
              {tab === 'naver' ? '네이버 영수증 리뷰' : '인스타그램 리뷰'}
            </h2>
            <p className="text-caption text-ink-tertiary">
              {tab === 'naver' ? '영수증 인증 리뷰 작성하고 포인트 받기' : '게시물 업로드하고 포인트 받기'}
            </p>
          </div>
        </div>

        {/* 내 현황 */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-surface/80 backdrop-blur-sm rounded-card-lg">
          <div className="text-center">
            <div className="text-title font-extrabold text-ink tabular-nums">{stats.count}</div>
            <div className="text-caption text-ink-tertiary">작성 리뷰</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-title font-extrabold text-ink tabular-nums">{stats.likes}</div>
            <div className="text-caption text-ink-tertiary">받은 좋아요</div>
          </div>
          <div className="text-center">
            <div className="text-title font-extrabold text-primary tabular-nums">{stats.points.toLocaleString()}P</div>
            <div className="text-caption text-ink-tertiary">적립 포인트</div>
          </div>
        </div>
      </div>

      {/* 보상 안내 */}
      <div className="px-page py-section">
        <h3 className="text-body font-bold text-ink mb-3">리뷰 보상</h3>
        <div className="flex flex-col gap-2">
          {rewards.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 bg-surface-muted rounded-card-lg">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-body shrink-0">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-body font-semibold text-ink">{r.label}</div>
                <div className="text-caption text-ink-tertiary">{r.desc}</div>
              </div>
              <div className="text-label font-bold text-primary tabular-nums shrink-0">{r.reward}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 참여 방법 */}
      <div className="px-page py-section">
        <h3 className="text-body font-bold text-ink mb-4">참여 방법</h3>
        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              {/* 타임라인 라인 */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-caption font-bold text-white ${
                  tab === 'naver' ? 'bg-[#03C75A]' : 'bg-[#E4405F]'
                }`}>
                  {s.step}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
              </div>
              <div className={`flex-1 ${i < steps.length - 1 ? 'pb-4' : 'pb-0'}`}>
                <div className="text-body font-semibold text-ink">{s.title}</div>
                <p className="text-caption text-ink-tertiary mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 리뷰 제출 버튼 */}
      <div className="px-page pb-6">
        <button
          onClick={() => alert(tab === 'naver' ? '네이버 리뷰 캡처를 업로드해주세요' : '인스타그램 게시물 링크를 입력해주세요')}
          className={`w-full py-3.5 text-white font-bold rounded-card flex items-center justify-center gap-2 transition-opacity hover:opacity-90 ${
            tab === 'naver' ? 'bg-[#03C75A]' : 'bg-gradient-to-r from-[#833AB4] via-[#E4405F] to-[#FCAF45]'
          }`}
        >
          {tab === 'naver' ? (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white stroke-2 fill-none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              리뷰 캡처 제출하기
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white stroke-2 fill-none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              게시물 링크 제출하기
            </>
          )}
        </button>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 최근 리뷰 */}
      <div className="px-page py-section">
        <h3 className="text-body font-bold text-ink mb-3">최근 참여 현황</h3>
        <div className="flex flex-col gap-2">
          {RECENT_REVIEWS.filter(r => r.type === tab).map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-surface-muted rounded-card">
              <div className="relative shrink-0">
                <img src={r.imageUrl} alt={r.name} className="w-8 h-8 rounded-full object-cover bg-surface-muted" loading="lazy" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-surface-muted ${
                  r.type === 'naver' ? 'bg-[#03C75A]' : 'bg-[#E4405F]'
                }`}>
                  {r.type === 'naver' ? 'N' : 'i'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-body font-semibold text-ink">{r.name}</span>
                  <span className="text-caption text-ink-placeholder">{r.date}</span>
                  {r.hasPhoto && (
                    <span className="px-1.5 py-0.5 bg-primary-50 text-primary text-caption font-bold rounded">사진</span>
                  )}
                </div>
                <p className="text-caption text-ink-tertiary truncate">{r.content}</p>
              </div>
              <div className="text-label font-bold text-primary tabular-nums shrink-0">+{r.reward}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 유의사항 */}
      <div className="px-page py-section pb-8">
        <h3 className="text-label font-bold text-ink-tertiary mb-2">유의사항</h3>
        <ul className="flex flex-col gap-1.5 text-caption text-ink-placeholder">
          {tab === 'naver' ? (
            <>
              <li className="flex gap-1.5"><span className="shrink-0">·</span>네이버 플레이스에서 바디채널 강남점 영수증 리뷰만 인정됩니다</li>
              <li className="flex gap-1.5"><span className="shrink-0">·</span>영수증 날짜와 리뷰 작성일이 30일 이내여야 합니다</li>
              <li className="flex gap-1.5"><span className="shrink-0">·</span>동일 영수증으로 중복 리뷰는 인정되지 않습니다</li>
            </>
          ) : (
            <>
              <li className="flex gap-1.5"><span className="shrink-0">·</span>공개 계정에서 @bodychannel_official 태그 필수</li>
              <li className="flex gap-1.5"><span className="shrink-0">·</span>#바디채널 #바디채널강남점 해시태그를 반드시 포함해주세요</li>
              <li className="flex gap-1.5"><span className="shrink-0">·</span>포인트 지급 후 게시물 삭제 시 포인트가 회수됩니다</li>
            </>
          )}
          <li className="flex gap-1.5"><span className="shrink-0">·</span>포인트는 리뷰 확인 후 영업일 기준 1~3일 내 지급됩니다</li>
          <li className="flex gap-1.5"><span className="shrink-0">·</span>부정한 방법으로 작성된 리뷰는 포인트가 회수될 수 있습니다</li>
        </ul>
      </div>
    </PageLayout>
  )
}
