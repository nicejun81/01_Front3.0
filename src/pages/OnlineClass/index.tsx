import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch } from '../../components/Icons'

const CATEGORIES = ['전체', '홈트레이닝', '바레톤', '근력', '스트레칭', 'HIIT', '요가'] as const
type Category = typeof CATEGORIES[number]

type OnlineClass = {
  id: number; title: string; instructor: string; instructorImg: string
  lessonCount: number; level: '초급' | '중급' | '고급'; duration: string
  category: Category; imageUrl: string; rating: number; studentCount: number
  progress?: number; badge?: 'HOT' | 'NEW' | '추천'
}

const classes: OnlineClass[] = [
  {
    id: 1, title: '홈트레이닝 기초', instructor: '김민수', instructorImg: '👨‍🏫',
    lessonCount: 12, level: '초급', duration: '3시간 24분', category: '홈트레이닝',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=340&fit=crop',
    rating: 4.9, studentCount: 1842, progress: 75, badge: 'HOT',
  },
  {
    id: 2, title: '바레톤 입문 클래스', instructor: '박지영', instructorImg: '👩‍🏫',
    lessonCount: 8, level: '초급', duration: '2시간 16분', category: '바레톤',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=340&fit=crop',
    rating: 4.8, studentCount: 1356, progress: 30, badge: '추천',
  },
  {
    id: 3, title: '근력 운동 마스터', instructor: '최강민', instructorImg: '💪',
    lessonCount: 20, level: '중급', duration: '5시간 40분', category: '근력',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=340&fit=crop',
    rating: 4.7, studentCount: 2104, badge: 'HOT',
  },
  {
    id: 4, title: '매일 10분 스트레칭', instructor: '정서연', instructorImg: '🧘‍♀️',
    lessonCount: 6, level: '초급', duration: '1시간 30분', category: '스트레칭',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=340&fit=crop',
    rating: 4.9, studentCount: 3210, badge: '추천',
  },
  {
    id: 5, title: 'HIIT 다이어트 챌린지', instructor: '한동훈', instructorImg: '🔥',
    lessonCount: 15, level: '고급', duration: '4시간 15분', category: 'HIIT',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=340&fit=crop',
    rating: 4.6, studentCount: 987,
  },
  {
    id: 6, title: '바레톤 중급 테크닉', instructor: '이수진', instructorImg: '💃',
    lessonCount: 10, level: '중급', duration: '2시간 50분', category: '바레톤',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=340&fit=crop',
    rating: 4.8, studentCount: 754, badge: 'NEW',
  },
  {
    id: 7, title: '전신 근력 프로그램', instructor: '최강민', instructorImg: '💪',
    lessonCount: 16, level: '중급', duration: '4시간 30분', category: '근력',
    imageUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&h=340&fit=crop',
    rating: 4.7, studentCount: 1123,
  },
  {
    id: 8, title: '모닝 요가 루틴', instructor: '정서연', instructorImg: '🧘‍♀️',
    lessonCount: 10, level: '초급', duration: '2시간 20분', category: '요가',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=340&fit=crop',
    rating: 4.9, studentCount: 2567, badge: 'HOT',
  },
  {
    id: 9, title: '30일 홈트 챌린지', instructor: '김민수', instructorImg: '👨‍🏫',
    lessonCount: 30, level: '중급', duration: '7시간 30분', category: '홈트레이닝',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=340&fit=crop',
    rating: 4.8, studentCount: 1890, badge: 'NEW',
  },
  {
    id: 10, title: '타바타 4분 운동', instructor: '한동훈', instructorImg: '🔥',
    lessonCount: 8, level: '고급', duration: '32분', category: 'HIIT',
    imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=600&h=340&fit=crop',
    rating: 4.5, studentCount: 645,
  },
]

const levelStyles: Record<string, string> = {
  '초급': 'bg-accent-green/10 text-accent-green',
  '중급': 'bg-primary/10 text-primary',
  '고급': 'bg-semantic-like/10 text-semantic-like',
}

const badgeStyles: Record<string, string> = {
  HOT: 'bg-semantic-like text-white',
  NEW: 'bg-ink text-white',
  '추천': 'bg-primary text-white',
}

export const OnlineClassPage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category>('전체')

  const filtered = classes.filter(c => category === '전체' || c.category === category)
  const myClasses = classes.filter(c => c.progress !== undefined && c.progress > 0)

  const header = (
    <SubPageHeader
      title="온라인 강의"
      right={
        <button className="icon-btn">
          <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding>
      {/* 수강 중인 강의 */}
      {myClasses.length > 0 && (
        <div className="px-page pt-5 pb-4">
          <h2 className="text-body font-bold text-ink mb-3">이어서 수강하기</h2>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {myClasses.map(c => (
              <button
                key={c.id}
                onClick={() => navigate(`/class/${c.id}`)}
                className="flex-shrink-0 w-[260px] bg-surface rounded-card-lg border border-border overflow-hidden text-left hover:border-ink-placeholder transition-colors"
              >
                <div className="relative">
                  <img src={c.imageUrl} alt={c.title} className="w-full h-[120px] object-cover" />
                  {/* 진행률 바 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div className="h-full bg-primary rounded-r-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-body font-semibold text-ink truncate">{c.title}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-ink-tertiary">{c.instructor} 강사</span>
                    <span className="text-caption font-bold text-primary tabular-nums">{c.progress}% 완료</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {myClasses.length > 0 && <div className="h-2 bg-surface-muted" />}

      {/* 카테고리 */}
      <div className="flex gap-2 px-page py-3 overflow-x-auto hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-pill text-label font-semibold whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-ink text-white'
                : 'bg-surface-muted text-ink-secondary hover:bg-border-light'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="h-px bg-border" />

      {/* 강의 수 */}
      <div className="px-page py-2.5">
        <span className="text-caption text-ink-tertiary">총 <span className="font-bold text-ink">{filtered.length}</span>개 강의</span>
      </div>

      {/* 강의 그리드 */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-page pb-8">
        {filtered.map(c => (
          <button
            key={c.id}
            onClick={() => navigate(`/class/${c.id}`)}
            className="text-left group"
          >
            {/* 썸네일 */}
            <div className="relative rounded-card-lg overflow-hidden mb-2.5">
              <img
                src={c.imageUrl}
                alt={c.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {c.badge && (
                <span className={`absolute top-2 left-2 px-2 py-0.5 text-caption font-bold rounded ${badgeStyles[c.badge]}`}>
                  {c.badge}
                </span>
              )}
              {/* 강의 수 뱃지 */}
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-caption font-medium rounded tabular-nums">
                {c.lessonCount}강
              </span>
            </div>

            {/* 정보 */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`px-1.5 py-0.5 text-caption font-bold rounded ${levelStyles[c.level]}`}>{c.level}</span>
                <span className="text-caption text-ink-placeholder">{c.duration}</span>
              </div>
              <h3 className="text-body font-semibold text-ink line-clamp-2 leading-snug mb-1.5">{c.title}</h3>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-label text-ink-tertiary">{c.instructor} 강사</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-[#FACC15]"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z"/></svg>
                <span className="text-caption font-semibold text-ink tabular-nums">{c.rating}</span>
                <span className="text-caption text-ink-placeholder">· {c.studentCount.toLocaleString()}명 수강</span>
              </div>
              {/* 진행률 */}
              {c.progress !== undefined && c.progress > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="text-caption font-bold text-primary tabular-nums">{c.progress}%</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
