export const CATEGORIES = ['전체', '홈트레이닝', '바레톤', '근력', '스트레칭', 'HIIT', '요가'] as const
export type Category = typeof CATEGORIES[number]

export type OnlineClass = {
  id: number; title: string; instructor: string; instructorImg: string
  lessonCount: number; level: '초급' | '중급' | '고급'; duration: string
  category: Category; imageUrl: string; rating: number; studentCount: number
  progress?: number; lastWatchedAt?: string; badge?: 'HOT' | 'NEW' | '추천'
}

export const classes: OnlineClass[] = [
  {
    id: 1, title: '홈트레이닝 기초', instructor: '김민수', instructorImg: '👨‍🏫',
    lessonCount: 12, level: '초급', duration: '3시간 24분', category: '홈트레이닝',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=340&fit=crop',
    rating: 4.9, studentCount: 1842, progress: 75, lastWatchedAt: '2시간 전', badge: 'HOT',
  },
  {
    id: 2, title: '바레톤 입문 클래스', instructor: '박지영', instructorImg: '👩‍🏫',
    lessonCount: 8, level: '초급', duration: '2시간 16분', category: '바레톤',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=340&fit=crop',
    rating: 4.8, studentCount: 1356, progress: 30, lastWatchedAt: '어제', badge: '추천',
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
    rating: 4.9, studentCount: 3210, progress: 100, lastWatchedAt: '1주 전', badge: '추천',
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
    rating: 4.8, studentCount: 754, progress: 10, lastWatchedAt: '3일 전', badge: 'NEW',
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
    rating: 4.9, studentCount: 2567, progress: 50, lastWatchedAt: '5시간 전', badge: 'HOT',
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

export const levelStyles: Record<string, string> = {
  '초급': 'bg-accent-green/10 text-accent-green',
  '중급': 'bg-primary/10 text-primary',
  '고급': 'bg-semantic-like/10 text-semantic-like',
}

export const badgeStyles: Record<string, string> = {
  HOT: 'bg-semantic-like text-white',
  NEW: 'bg-ink text-white',
  '추천': 'bg-primary text-white',
}
