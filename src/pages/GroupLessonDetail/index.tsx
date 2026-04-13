import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, RatingSummary, ReviewItem, ReviewSort, BottomCTA, EmptyState } from '../../components'
import { IconShare, IconStarFilled, IconClock, IconMapPin } from '../../components/Icons'
import { gymsData } from '../GymDetail'
import { baItems } from '../GymDetail/BeforeAfter'

/* ── types ── */
interface ScheduleSlot { day: string; time: string }
interface ReviewData { name: string; avatar: string; rating: number; date: string; text: string; photos?: string[]; program?: string }

interface GroupLessonData {
  name: string
  category: string
  categoryColor: 'bareton' | 'hit35' | 'gymground' | 'pt'
  instructor: string
  instructorAvatar: string
  instructorBio: string
  gym: string
  gymId: string
  rating: number
  reviewCount: number
  imageUrl: string
  heroImages: { url: string; label: string }[]
  description: string
  highlights: string[]
  duration: string
  capacity: number
  difficulty: string
  location: string
  schedule: ScheduleSlot[]
  reviews: ReviewData[]
  hasTicket: boolean
}

/* ── mock data ── */
export const lessonsData: Record<string, GroupLessonData> = {
  'morning-bareton': {
    name: '모닝 바레톤',
    category: '바레톤',
    categoryColor: 'gymground',
    instructor: '이수진',
    instructorAvatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face',
    instructorBio: '바레톤 전문 강사 5년 경력. 발레와 바레톤를 결합한 체형 교정 전문가입니다. 아침 시간대 활력 넘치는 수업으로 하루를 시작해보세요.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.8,
    reviewCount: 86,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop', label: '바레톤 수업' },
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop', label: '스트레칭' },
      { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=450&fit=crop', label: '코어 운동' },
    ],
    description: '아침 시간대에 진행되는 바레톤 수업입니다. 발레 동작을 기반으로 한 저강도 전신 운동으로, 코어 근력 강화와 유연성 향상에 효과적입니다. 은은한 음악과 함께 하루를 활기차게 시작해보세요.',
    highlights: ['코어 근력 강화', '유연성 향상', '체형 교정 효과', '스트레스 해소', '초보자도 참여 가능'],
    duration: '50분',
    capacity: 15,
    difficulty: '초급',
    location: 'GX룸 A',
    schedule: [
      { day: '월', time: '07:00' }, { day: '월', time: '10:00' }, { day: '월', time: '19:00' },
      { day: '화', time: '07:00' }, { day: '화', time: '10:00' },
      { day: '수', time: '07:00' }, { day: '수', time: '19:00' },
      { day: '목', time: '07:00' }, { day: '목', time: '10:00' }, { day: '목', time: '19:00' },
      { day: '금', time: '07:00' },
      { day: '토', time: '10:00' },
    ],
    reviews: [
      { name: '아침형인간', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.18', text: '아침에 바레톤 하고 출근하면 하루가 달라져요! 이수진 선생님 수업이 정말 좋습니다. 초보자도 따라하기 쉽게 알려주세요.', program: '그룹 레슨권' },
      { name: '직장인C', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.10', text: '거북목이 심했는데 바레톤 하면서 많이 개선됐어요. 코어 운동이라 자세 교정에도 좋습니다.', program: '그룹 레슨권' },
      { name: '운동뉴비', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.11.25', text: '처음 해봤는데 생각보다 강도가 있어요. 그래도 선생님이 개인 레벨에 맞춰서 동작을 알려주셔서 좋았어요.', program: '그룹 레슨권' },
    ],
    hasTicket: false,
  },
  'bodypump': {
    name: '바디펌프',
    category: '히트35',
    categoryColor: 'hit35',
    instructor: '한동훈',
    instructorAvatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face',
    instructorBio: '히트35 전문 강사. 바디펌프, 크로스핏 등 고강도 그룹 운동 전문가입니다. 체계적인 프로그램으로 확실한 변화를 만들어드립니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.7,
    reviewCount: 62,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '바디펌프 수업' },
      { url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=450&fit=crop', label: '바벨 트레이닝' },
      { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=450&fit=crop', label: '그룹 운동' },
    ],
    description: '바벨과 웨이트를 활용한 전신 근력 운동입니다. 음악에 맞춰 스쿼트, 런지, 프레스 등 다양한 동작을 반복하며, 근력과 지구력을 동시에 향상시킬 수 있습니다.',
    highlights: ['전신 근력 강화', '체지방 감소', '근지구력 향상', '바벨 기본기 학습', '에너지 소모 극대화'],
    duration: '50분',
    capacity: 20,
    difficulty: '중급',
    location: 'GX룸 B',
    schedule: [
      { day: '월', time: '09:00' }, { day: '월', time: '18:00' },
      { day: '수', time: '09:00' }, { day: '수', time: '18:00' },
      { day: '목', time: '09:00' }, { day: '목', time: '18:00' },
      { day: '금', time: '09:00' },
      { day: '토', time: '11:00' },
    ],
    reviews: [
      { name: '근육맨', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.15', text: '바디펌프 최고! 한동훈 선생님 수업은 강도 조절을 잘 해주셔서 초보부터 상급자까지 다 만족할 수 있어요.', program: '그룹 레슨권' },
      { name: '다이어터', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.12.01', text: '땀이 엄청 나요. 한 시간인데 칼로리 소모가 장난 아닙니다. 다이어트 중이라 효과 좋습니다.', program: '그룹 레슨권' },
    ],
    hasTicket: false,
  },
  'hiit': {
    name: 'HIIT 클래스',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '최강민',
    instructorAvatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face',
    instructorBio: '10년 경력의 체계적인 PT 전문가. 고강도 인터벌 트레이닝으로 단시간 최대 효과를 이끌어냅니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.9,
    reviewCount: 94,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop', label: 'HIIT 트레이닝' },
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '인터벌 운동' },
      { url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=450&fit=crop', label: '고강도 서킷' },
    ],
    description: '고강도 인터벌 트레이닝(HIIT)으로 단시간에 최대 칼로리를 소모하는 수업입니다. 30초 운동 + 10초 휴식을 반복하며, 심폐 지구력과 근력을 동시에 향상시킵니다.',
    highlights: ['최대 칼로리 소모', '심폐 지구력 향상', '애프터번 효과', '전신 근력 강화', '짧은 시간 높은 효율'],
    duration: '50분',
    capacity: 15,
    difficulty: '상급',
    location: 'GX룸 A',
    schedule: [
      { day: '월', time: '18:30' }, { day: '월', time: '20:00' },
      { day: '화', time: '18:30' }, { day: '화', time: '20:00' },
      { day: '수', time: '18:30' },
      { day: '목', time: '18:30' }, { day: '목', time: '20:00' },
      { day: '금', time: '18:30' },
      { day: '토', time: '14:00' },
    ],
    reviews: [
      { name: '헬스왕', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.20', text: 'HIIT 수업 강도가 장난 아닌데 최강민 트레이너가 잘 이끌어줍니다. 한 달 만에 체지방 3% 빠졌어요!', program: '그룹 레슨권' },
      { name: '운동중독', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.12', text: '이 수업 듣고 나면 진짜 살 빠지는 느낌이에요. 힘들지만 성취감이 대단합니다.', program: '그룹 레슨권' },
    ],
    hasTicket: true,
  },
  'lunch-pilates': {
    name: '점심 바레톤',
    category: '바레톤',
    categoryColor: 'bareton',
    instructor: '박지영',
    instructorAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face',
    instructorBio: '바레톤 & 바레톤 전문 강사. 섬세한 동작 교정과 호흡 지도로 정확한 운동 효과를 이끌어냅니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.7,
    reviewCount: 58,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop', label: '바레톤 수업' },
      { url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&h=450&fit=crop', label: '매트 바레톤' },
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop', label: '코어 강화' },
    ],
    description: '점심 시간을 활용한 바레톤 수업입니다. 매트 위에서 진행되는 코어 중심 운동으로, 자세 교정과 유연성 향상에 탁월합니다. 직장인들의 점심 시간 활용에 최적화된 프로그램입니다.',
    highlights: ['코어 강화', '자세 교정', '유연성 향상', '허리 통증 개선', '점심 시간 활용'],
    duration: '50분',
    capacity: 12,
    difficulty: '초급',
    location: 'GX룸 A',
    schedule: [
      { day: '월', time: '12:00' },
      { day: '화', time: '12:00' }, { day: '화', time: '19:00' },
      { day: '수', time: '12:00' },
      { day: '목', time: '12:00' }, { day: '목', time: '19:00' },
      { day: '금', time: '12:00' },
      { day: '토', time: '10:00' },
    ],
    reviews: [
      { name: '점심러너', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.16', text: '점심 시간에 바레톤하고 오후 업무하면 집중력이 확 올라가요. 박지영 선생님 수업 강추합니다!', program: '그룹 레슨권' },
      { name: '허리아파', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.05', text: '오래 앉아있어서 허리가 아팠는데 바레톤 시작하고 많이 나아졌어요.', program: '그룹 레슨권' },
    ],
    hasTicket: true,
  },
  'spinning': {
    name: '스피닝',
    category: '짐그라운드',
    categoryColor: 'gymground',
    instructor: '김민수',
    instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: '스피닝 & 유산소 전문 강사. 에너지 넘치는 음악과 함께 최고의 유산소 운동을 경험해보세요.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.6,
    reviewCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=450&fit=crop', label: '스피닝 수업' },
      { url: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=800&h=450&fit=crop', label: '실내 사이클' },
      { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=450&fit=crop', label: '유산소 운동' },
    ],
    description: '실내 사이클을 활용한 고강도 유산소 운동입니다. 신나는 음악에 맞춰 페달을 밟으며, 하체 근력과 심폐 지구력을 동시에 강화할 수 있습니다.',
    highlights: ['유산소 운동 최고', '하체 근력 강화', '심폐 지구력 향상', '스트레스 해소', '칼로리 대량 소모'],
    duration: '45분',
    capacity: 20,
    difficulty: '중급',
    location: '스피닝룸',
    schedule: [
      { day: '월', time: '20:00' },
      { day: '화', time: '20:00' }, { day: '화', time: '21:30' },
      { day: '수', time: '20:00' },
      { day: '목', time: '20:00' }, { day: '목', time: '21:30' },
      { day: '금', time: '20:00' },
      { day: '토', time: '15:00' },
    ],
    reviews: [
      { name: '사이클러', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.14', text: '스피닝 진짜 재밌어요! 김민수 선생님이 분위기를 너무 잘 이끌어주셔서 시간 가는 줄 모르고 운동합니다.', program: '그룹 레슨권' },
    ],
    hasTicket: false,
  },
  'weekend-bareton': {
    name: '주말 바레톤',
    category: '바레톤',
    categoryColor: 'gymground',
    instructor: '이수진',
    instructorAvatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face',
    instructorBio: '바레톤 전문 강사 5년 경력. 발레와 바레톤를 결합한 체형 교정 전문가입니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.8,
    reviewCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop', label: '주말 바레톤' },
      { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=450&fit=crop', label: '유연성 운동' },
      { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop', label: '코어 강화' },
    ],
    description: '주말 오전 시간에 여유롭게 즐기는 바레톤 수업입니다. 평일에 바쁜 분들을 위한 주말 전용 클래스로, 한 주의 피로를 풀고 활력을 되찾아보세요.',
    highlights: ['주말 전용 클래스', '여유로운 분위기', '코어 강화', '유연성 향상', '스트레스 해소'],
    duration: '50분',
    capacity: 15,
    difficulty: '초급',
    location: 'GX룸 A',
    schedule: [
      { day: '토', time: '10:00' }, { day: '토', time: '14:00' },
      { day: '일', time: '10:00' }, { day: '일', time: '14:00' },
    ],
    reviews: [
      { name: '주말운동러', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.08', text: '평일에 못 오는데 주말 수업이 있어서 너무 좋아요. 이수진 선생님 수업은 항상 만족입니다!', program: '그룹 레슨권' },
    ],
    hasTicket: false,
  },
  'bareton': {
    name: '바레톤',
    category: '바레톤',
    categoryColor: 'bareton',
    instructor: '박지영',
    instructorAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face',
    instructorBio: '바레톤 & 바레톤 전문 강사. 섬세한 동작 교정과 호흡 지도로 정확한 운동 효과를 이끌어냅니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.7,
    reviewCount: 41,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop', label: '바레톤 수업' },
      { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop', label: '밸런스 운동' },
      { url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&h=450&fit=crop', label: '전신 토닝' },
    ],
    description: '발레의 우아한 동작과 바레톤의 코어 운동을 결합한 바레톤 수업입니다. 근력, 유연성, 밸런스를 동시에 향상시킬 수 있는 종합 운동 프로그램입니다.',
    highlights: ['발레 기반 동작', '코어 강화', '밸런스 향상', '체형 교정', '전신 토닝'],
    duration: '50분',
    capacity: 12,
    difficulty: '초급 ~ 중급',
    location: 'GX룸 A',
    schedule: [
      { day: '화', time: '14:00' },
      { day: '목', time: '14:00' },
      { day: '토', time: '14:00' }, { day: '토', time: '16:00' },
    ],
    reviews: [
      { name: '바레톤매니아', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.11', text: '박지영 선생님 바레톤 수업은 동작 하나하나 꼼꼼하게 잡아주셔서 정말 효과가 좋아요.', program: '그룹 레슨권' },
    ],
    hasTicket: true,
  },
  'pt-kangmin': {
    name: '1:1 웨이트 트레이닝',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '최강민',
    instructorAvatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face',
    instructorBio: '10년 경력의 체형교정 및 웨이트 전문 PT 트레이너. 개인 맞춤형 프로그램으로 확실한 변화를 만들어드립니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.9,
    reviewCount: 128,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '웨이트 트레이닝' },
      { url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=450&fit=crop', label: '체형 교정' },
      { url: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&h=450&fit=crop', label: '맞춤 프로그램' },
    ],
    description: '체형 분석을 기반으로 한 1:1 맞춤 웨이트 트레이닝입니다. 근력 강화, 체형 교정, 다이어트 등 개인 목표에 맞춘 프로그램을 제공합니다.',
    highlights: ['1:1 맞춤 프로그램', '체형 분석', '근력 강화', '자세 교정', '식단 코칭'],
    duration: '50분',
    capacity: 1,
    difficulty: '맞춤',
    location: 'PT룸',
    schedule: [
      { day: '월', time: '09:00' }, { day: '월', time: '15:00' },
      { day: '수', time: '11:00' }, { day: '금', time: '10:00' },
    ],
    reviews: [
      { name: '웨이트러버', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.20', text: '최강민 트레이너님 체형교정 PT 3개월 받고 어깨가 확 펴졌어요. 맞춤 프로그램이라 효과가 확실합니다.', program: 'PT 10회권' },
    ],
    hasTicket: true,
  },
  'pt-taehyun': {
    name: '다이어트 PT',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '김태현',
    instructorAvatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop&crop=face',
    instructorBio: '다이어트 및 체지방 관리 전문 PT 트레이너. 유산소와 근력 운동을 조합한 효율적 감량 프로그램을 제공합니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.5,
    reviewCount: 43,
    imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=450&fit=crop', label: '다이어트 PT' },
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop', label: '유산소 운동' },
      { url: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&h=450&fit=crop', label: '서킷 트레이닝' },
    ],
    description: '체지방 감량에 특화된 1:1 PT 프로그램입니다. 유산소와 근력 운동을 과학적으로 조합하여 효율적인 다이어트를 도와드립니다.',
    highlights: ['체지방 감량', '식단 관리', '유산소+근력 조합', '체성분 분석', '주간 피드백'],
    duration: '50분',
    capacity: 1,
    difficulty: '맞춤',
    location: 'PT룸',
    schedule: [
      { day: '화', time: '10:00' }, { day: '목', time: '10:00' },
      { day: '금', time: '16:00' }, { day: '토', time: '15:00' },
    ],
    reviews: [
      { name: '다이어터', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.15', text: '3개월 만에 8kg 감량 성공! 식단 코칭까지 해주셔서 요요 없이 유지 중입니다.', program: 'PT 20회권' },
    ],
    hasTicket: false,
  },
  'pt-jihoon': {
    name: '얼리버드 PT',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '오지훈',
    instructorAvatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop&crop=face',
    instructorBio: '새벽·아침 전문 PT 트레이너. 출근 전 효율적인 운동으로 하루를 활기차게 시작할 수 있도록 도와드립니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.7,
    reviewCount: 61,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop', label: '모닝 PT' },
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '웨이트 트레이닝' },
      { url: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=800&h=450&fit=crop', label: '코어 운동' },
    ],
    description: '아침 시간대에 집중적으로 운동할 수 있는 1:1 PT 프로그램입니다. 짧은 시간 내 최대 효과를 낼 수 있는 고효율 프로그램을 제공합니다.',
    highlights: ['06:30 조기 수업', '고효율 프로그램', '전신 운동', '근력 강화', '컨디션 관리'],
    duration: '50분',
    capacity: 1,
    difficulty: '맞춤',
    location: 'PT룸',
    schedule: [
      { day: '월', time: '06:30' }, { day: '수', time: '06:30' },
      { day: '금', time: '06:30' }, { day: '토', time: '09:00' },
    ],
    reviews: [
      { name: '아침형인간', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.18', text: '출근 전 운동이 가능해서 너무 좋아요. 오지훈 트레이너님 덕분에 아침 운동 습관이 잡혔습니다.', program: 'PT 10회권' },
    ],
    hasTicket: true,
  },
  'pt-seoyeon': {
    name: '코어 강화 PT',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '정서연',
    instructorAvatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&crop=face',
    instructorBio: '코어 및 바디라인 전문 PT 트레이너. 필라테스 기반의 체형 교정과 코어 강화 프로그램을 제공합니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.8,
    reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop', label: '코어 강화' },
      { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop', label: '바디라인' },
      { url: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=800&h=450&fit=crop', label: '필라테스' },
    ],
    description: '필라테스 기반의 1:1 코어 강화 PT 프로그램입니다. 깊은 코어 근육을 활성화하고 바디라인을 정리하여 균형 잡힌 체형을 만들어드립니다.',
    highlights: ['코어 강화', '바디라인 정리', '필라테스 기반', '체형 교정', '유연성 향상'],
    duration: '50분',
    capacity: 1,
    difficulty: '맞춤',
    location: 'PT룸',
    schedule: [
      { day: '월', time: '13:00' }, { day: '수', time: '17:00' },
      { day: '목', time: '13:00' }, { day: '금', time: '17:00' },
    ],
    reviews: [
      { name: '코어퀸', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.22', text: '정서연 트레이너님 코어 수업 듣고 허리 통증이 사라졌어요. 바디라인도 예뻐졌다고 주변에서 얘기해줘요!', program: 'PT 20회권' },
    ],
    hasTicket: false,
  },
  'pt-donghun': {
    name: 'HIIT 다이어트 PT',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '한동훈',
    instructorAvatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face',
    instructorBio: 'HIIT 및 다이어트 전문 PT 트레이너. 고강도 인터벌 트레이닝으로 단기간 체지방 감량을 도와드립니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.9,
    reviewCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=450&fit=crop', label: 'HIIT 트레이닝' },
      { url: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=450&fit=crop', label: '다이어트' },
      { url: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&h=450&fit=crop', label: '서킷 운동' },
    ],
    description: '고강도 인터벌 트레이닝 기반의 1:1 다이어트 PT입니다. 짧은 시간 내 최대 칼로리를 소모하고 체지방을 효과적으로 감량합니다.',
    highlights: ['고강도 인터벌', '체지방 감량', '칼로리 폭발', '근력 유지', '식단 관리'],
    duration: '50분',
    capacity: 1,
    difficulty: '맞춤',
    location: 'PT룸',
    schedule: [
      { day: '화', time: '10:00' }, { day: '화', time: '18:00' },
      { day: '목', time: '10:00' }, { day: '토', time: '11:00' },
    ],
    reviews: [
      { name: 'HIIT매니아', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.25', text: '한동훈 트레이너님 HIIT PT 2개월 받고 체지방 5% 감량했어요. 힘들지만 확실히 효과 있습니다!', program: 'PT 20회권' },
    ],
    hasTicket: false,
  },
  'pt-haeun': {
    name: '점심 PT 익스프레스',
    category: 'PT',
    categoryColor: 'pt',
    instructor: '장하은',
    instructorAvatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop&crop=face',
    instructorBio: '점심시간 활용 전문 PT 트레이너. 40분 집중 프로그램으로 바쁜 직장인도 효율적으로 운동할 수 있습니다.',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.4,
    reviewCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&h=450&fit=crop',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&h=450&fit=crop', label: '점심 PT' },
      { url: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&h=450&fit=crop', label: '집중 트레이닝' },
      { url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=450&fit=crop', label: '전신 운동' },
    ],
    description: '점심시간을 활용한 40분 집중 PT 프로그램입니다. 짧지만 알차게 구성된 운동으로 바쁜 일상 속에서도 체력을 관리할 수 있습니다.',
    highlights: ['40분 집중 프로그램', '점심시간 활용', '전신 운동', '스트레스 해소', '체력 관리'],
    duration: '40분',
    capacity: 1,
    difficulty: '맞춤',
    location: 'PT룸',
    schedule: [
      { day: '월', time: '12:00' }, { day: '목', time: '12:00' },
      { day: '금', time: '12:00' },
    ],
    reviews: [
      { name: '직장인', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.12.10', text: '점심시간에 운동하니까 오후 업무 집중력이 확 올라가요. 시간 대비 효율 최고!', program: 'PT 10회권' },
    ],
    hasTicket: true,
  },
}

/* ── lesson ID mapping (name → id) ── */
export const lessonIdMap: Record<string, string> = {
  '모닝 바레톤': 'morning-bareton',
  '바디펌프': 'bodypump',
  'HIIT 클래스': 'hiit',
  '점심 바레톤': 'lunch-pilates',
  '스피닝': 'spinning',
  '주말 바레톤': 'weekend-bareton',
  '바레톤': 'bareton',
}

const instructorTrainerId: Record<string, string> = {
  '최강민': '1', '박지영': '2', '한동훈': '3', '이준혁': '4',
  '정서연': '5', '김태현': '6', '이수진': '5', '김민수': '4',
  '오지훈': '1', '장하은': '1',
}

/* ── category color helper ── */
const categoryBadgeClass = (color: string) => {
  switch (color) {
    case 'bareton': return 'bg-category-bareton-bg text-category-bareton-text'
    case 'hit35': return 'bg-category-hit35-bg text-category-hit35-text'
    case 'gymground': return 'bg-category-gymground-bg text-category-gymground-text'
    default: return 'bg-primary-50 text-primary'
  }
}

export const GroupLessonDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const data = lessonsData[id || '']
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const [zoomedImage, setZoomedImage] = useState<{ url: string; label: string; type?: string; videoUrl?: string } | null>(null)
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [reviewSort, setReviewSort] = useState<'latest' | 'high' | 'low'>('latest')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewImages, setReviewImages] = useState<string[]>([])

  if (!data) {
    return (
      <PageLayout header={<SubPageHeader title="수업 상세" />}>
        <div className="flex items-center justify-center h-64">
          <p className="text-body text-ink-secondary">수업 정보를 찾을 수 없습니다.</p>
        </div>
      </PageLayout>
    )
  }

  const gymData = gymsData[data.gymId]
  const scheduleDays = (() => {
    const result: { date: Date; label: string; dayKey: string; isToday: boolean }[] = []
    const now = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      result.push({
        date: d,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        dayKey: ['일', '월', '화', '수', '목', '금', '토'][d.getDay()],
        isToday: i === 0,
      })
    }
    return result
  })()
  const selectedDay = scheduleDays[selectedDateIdx].dayKey
  const filteredSchedule = gymData
    ? (gymData.schedule[selectedDay] || []).filter(s => s.instructor === data.instructor)
    : []
  const trainerBaItems = baItems.filter(item => item.trainer.name === data.instructor)

  const ratingDist = [72, 18, 7, 2, 1]
  const sortedReviews = [...data.reviews].sort((a, b) => {
    if (reviewSort === 'high') return b.rating - a.rating
    if (reviewSort === 'low') return a.rating - b.rating
    return b.date.localeCompare(a.date)
  })
  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)

  const header = (
    <SubPageHeader
      title={data.name}
      right={
        <button className="w-9 h-9 flex items-center justify-center"><IconShare className="w-5 h-5 text-ink-secondary" /></button>
      }
    />
  )

  return (
    <PageLayout header={header} hideBottomNav noPadding>
      {/* ── Hero Carousel ── */}
      <div className="relative -mt-1">
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${heroIdx * 100}%)` }}>
            {(data.heroImages).map((img, i) => (
              <img key={i} src={img.url} alt={img.label} className="w-full aspect-video object-cover flex-shrink-0 cursor-pointer" onClick={() => setShowFullImage(true)} />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          {data.heroImages.length > 1 && (
            <>
              <div className="absolute bottom-14 right-3 px-2.5 py-1 bg-black/50 rounded-full text-white text-label font-medium">{heroIdx + 1} / {data.heroImages.length}</div>
              {heroIdx > 0 && <button onClick={() => setHeroIdx(heroIdx - 1)} className="absolute left-2 top-1/3 -translate-y-1/2 w-8 h-8 bg-white/70 rounded-full flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink stroke-2 fill-none"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button>}
              {heroIdx < data.heroImages.length - 1 && <button onClick={() => setHeroIdx(heroIdx + 1)} className="absolute right-2 top-1/3 -translate-y-1/2 w-8 h-8 bg-white/70 rounded-full flex items-center justify-center rotate-180"><svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink stroke-2 fill-none"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button>}
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-page pb-4 cursor-pointer" onClick={() => setShowFullImage(true)}>
            <span className={`inline-block px-2 py-0.5 text-caption font-bold rounded mb-2 ${categoryBadgeClass(data.categoryColor)}`}>{data.category}</span>
            <h1 className="text-display text-white">{data.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <IconStarFilled className="w-4 h-4 text-semantic-star" />
                <span className="text-body font-bold text-white">{data.rating}</span>
              </div>
              <span className="text-label text-white/70">리뷰 {data.reviewCount}개</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 커리큘럼 소개 ── */}
      <div className="px-page pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            onClick={() => {
              const tid = instructorTrainerId[data.instructor]
              if (tid) navigate(`/trainer/${tid}`)
            }}
          >
            <img src={data.instructorAvatar} alt={data.instructor} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-body font-bold text-ink">{data.instructor} 강사</span>
              <span className={`px-2 py-0.5 text-caption font-bold rounded ${categoryBadgeClass(data.categoryColor)}`}>{data.category}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 text-ink-tertiary flex-shrink-0">
            <IconMapPin className="w-3.5 h-3.5" />
            <span className="text-caption">{data.gym}</span>
          </div>
        </div>
      </div>

      {/* ── 수업 설명 + 정보 ── */}
      <div className="px-page pb-section">
        <p className="text-body text-ink-secondary leading-relaxed mb-5">{data.description}</p>

        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-surface-muted rounded-full flex items-center justify-center mb-1">
              <IconClock className="w-[18px] h-[18px] text-primary" />
            </div>
            <p className="text-caption text-ink-tertiary">수업 시간</p>
            <p className="text-label font-bold text-ink">{data.duration}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-surface-muted rounded-full flex items-center justify-center mb-1">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
            </div>
            <p className="text-caption text-ink-tertiary">정원</p>
            <p className="text-label font-bold text-ink">{data.capacity}명</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-surface-muted rounded-full flex items-center justify-center mb-1">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-primary" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-caption text-ink-tertiary">난이도</p>
            <p className="text-label font-bold text-ink">{data.difficulty}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-9 h-9 bg-surface-muted rounded-full flex items-center justify-center mb-1">
              <IconMapPin className="w-[18px] h-[18px] text-primary" />
            </div>
            <p className="text-caption text-ink-tertiary">장소</p>
            <p className="text-label font-bold text-ink">{data.location}</p>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 운동 효과 ── */}
      <div className="px-page py-section">
        <h2 className="text-title font-bold text-ink mb-3">운동 효과</h2>
        <div className="flex flex-wrap gap-2">
          {data.highlights.map((h, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 rounded-pill text-label text-primary font-medium">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 수업 일정 ── */}
      <div className="px-page py-section">
        <h2 className="text-title font-bold text-ink mb-3">수업 일정</h2>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3">
          {scheduleDays.map((d, i) => (
            <button key={i} onClick={() => setSelectedDateIdx(i)} className={`flex-shrink-0 w-[52px] py-2 rounded-xl text-center transition-colors ${selectedDateIdx === i ? 'bg-primary text-white' : 'bg-surface-muted text-ink-secondary hover:bg-surface-subtle'}`}>
              <span className="text-label block">{d.isToday ? '오늘' : d.label}</span>
              <span className="text-label font-bold block">{d.dayKey}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const daySchedule = data.schedule.filter(s => s.day === selectedDay)
            return daySchedule.length > 0 ? daySchedule.map((s, i) => {
              const gymSlot = filteredSchedule.find(fs => fs.time === s.time)
              const hasTicket = gymSlot?.hasTicket ?? false
              return (
                <button
                  key={i}
                  onClick={() => hasTicket ? navigate(`/reservation?trainer=${encodeURIComponent(data.instructor + ' 강사')}&lesson=${encodeURIComponent(data.category)}&time=${encodeURIComponent(s.time)}`) : navigate(`/gym/${data.gymId}/products`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface-muted rounded-card hover:bg-surface-subtle transition-colors"
                >
                  <IconClock className="w-4 h-4 text-primary" />
                  <span className="text-body font-bold text-ink">{s.time}</span>
                  {hasTicket
                    ? <span className="px-2 py-0.5 bg-primary text-white text-caption font-bold rounded">예약</span>
                    : <span className="px-2 py-0.5 border border-primary text-primary text-caption font-bold rounded">구매</span>
                  }
                </button>
              )
            }) : (
              <EmptyState message={`${scheduleDays[selectedDateIdx].isToday ? '오늘은' : scheduleDays[selectedDateIdx].label + '(' + selectedDay + ')은'} 수업이 없습니다`} />
            )
          })()}
        </div>
      </div>

      {/* ── Before & After ── */}
      {trainerBaItems.length > 0 && (
        <>
          <div className="h-2 bg-surface-muted" />
          <div className="py-section">
            <div className="flex items-center justify-between mb-4 px-page">
              <h2 className="text-title font-bold text-ink">Before & After</h2>
              <button onClick={() => navigate(`/gym/${data.gymId}/before-after`)} className="text-label text-primary font-medium">전체보기</button>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-page">
              {trainerBaItems.map((item, i) => {
                const globalIdx = baItems.indexOf(item)
                return (
                  <div key={i} className="flex-shrink-0 w-[180px] cursor-pointer" onClick={() => navigate(`/gym/${data.gymId}/before-after/${globalIdx}`)}>
                    <div className="flex gap-1 mb-2 rounded-xl overflow-hidden">
                      <div className="relative flex-1">
                        <img src={item.before.replace('w=400&h=500', 'w=300&h=400')} alt="Before" className="w-full aspect-[3/4] object-cover" />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-caption font-bold rounded">BEFORE</span>
                      </div>
                      <div className="relative flex-1">
                        <img src={item.after.replace('w=400&h=500', 'w=300&h=400')} alt="After" className="w-full aspect-[3/4] object-cover" />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary text-white text-caption font-bold rounded">AFTER</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-body font-bold text-ink truncate flex-1 mr-2">{item.title}</p>
                      <span className="px-2 py-0.5 bg-surface-muted text-caption text-ink-secondary font-medium rounded-full flex-shrink-0">{item.tag}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      <div className="h-2 bg-surface-muted" />

      {/* ── 후기 ── */}
      <div className="px-page py-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-title font-bold text-ink">수강 후기</h2>
          <span className="text-label text-ink-tertiary">{data.reviewCount}개</span>
        </div>
        <div className="mb-4">
          <RatingSummary rating={data.rating} reviewCount={data.reviewCount} distribution={ratingDist} />
        </div>
        <ReviewSort value={reviewSort} onChange={(v) => setReviewSort(v as 'latest' | 'high' | 'low')} onWrite={() => { setShowReviewForm(true); setReviewSubmitted(false); setReviewRating(0); setReviewText(''); setReviewImages([]) }} />
        <div className="space-y-4">
          {visibleReviews.map((r, i) => (
            <ReviewItem
              key={i}
              name={r.name}
              avatar={r.avatar}
              rating={r.rating}
              date={r.date}
              text={r.text}
              photos={r.photos}
              badge={r.program}
              isMine={i === 0}
              onEdit={() => { setShowReviewForm(true); setReviewSubmitted(false); setReviewRating(r.rating); setReviewText(r.text); setReviewImages([]) }}
              onDelete={() => {}}
            />
          ))}
        </div>
        {data.reviews.length > 3 && !showAllReviews && (
          <button onClick={() => setShowAllReviews(true)} className="w-full py-3 mt-4 border border-border rounded-card text-body font-semibold text-ink hover:bg-surface-subtle transition-colors">후기 더보기</button>
        )}
      </div>

      {/* ── 하단 CTA ── */}
      <BottomCTA hideBottomNav>
        {data.hasTicket ? (
          <button
            onClick={() => navigate(`/reservation?trainer=${encodeURIComponent(data.instructor + ' 강사')}&lesson=${encodeURIComponent(data.category)}&time=${encodeURIComponent(data.schedule?.[0]?.time || '10:00')}`)}
            className="flex-1 py-3.5 bg-primary text-white text-body font-bold rounded-card hover:bg-primary-dark transition-colors"
          >
            예약하기
          </button>
        ) : (
          <button
            onClick={() => navigate(`/gym/${data.gymId}/products`)}
            className="flex-1 py-3.5 bg-primary text-white text-body font-bold rounded-card hover:bg-primary-dark transition-colors"
          >
            이용권 구매
          </button>
        )}
      </BottomCTA>

      {/* ── 후기 작성 풀스크린 ── */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 bg-surface flex flex-col">
          <div className="flex items-center justify-between px-page py-3 border-b border-border flex-shrink-0">
            <button onClick={() => setShowReviewForm(false)} className="p-1">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-title font-bold text-ink">후기 작성</h3>
            <div className="w-8" />
          </div>

          {reviewSubmitted ? (
            <div className="flex-1 flex flex-col items-center justify-center px-page">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-section">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-heading font-bold text-ink mb-2">후기가 등록되었습니다</p>
              <p className="text-body text-ink-secondary mb-8">소중한 후기 감사합니다!</p>
              <button onClick={() => setShowReviewForm(false)} className="w-full py-3.5 bg-primary text-white text-body font-bold rounded-xl">확인</button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="px-page py-section">
                  <div className="mb-section">
                    <p className="text-heading font-bold text-ink mb-4">만족도를 알려주세요</p>
                    <div className="flex gap-3 justify-center py-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setReviewRating(star)} className="p-0.5">
                          <svg viewBox="0 0 24 24" className={`w-10 h-10 transition-colors ${star <= reviewRating ? 'text-semantic-star' : 'text-ink-disabled'}`} fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {reviewRating > 0 && (
                      <p className="text-center text-body text-primary font-bold mt-2">
                        {['', '별로예요', '그저 그래요', '보통이에요', '좋아요', '최고예요!'][reviewRating]}
                      </p>
                    )}
                  </div>

                  <div className="h-px bg-border mb-section" />

                  <div className="mb-section">
                    <p className="text-heading font-bold text-ink mb-2">이용한 프로그램</p>
                    <p className="text-label text-ink-tertiary mb-4">선택사항</p>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                      {['PT', '바레톤', '히트35', '짐그라운드', '헬스 이용'].map(prog => (
                        <button
                          key={prog}
                          onClick={(e) => {
                            const btn = e.currentTarget
                            btn.classList.toggle('bg-primary-50')
                            btn.classList.toggle('text-primary')
                            btn.classList.toggle('border-primary')
                            btn.classList.toggle('bg-surface')
                            btn.classList.toggle('text-ink-secondary')
                            btn.classList.toggle('border-border')
                          }}
                          className="flex-shrink-0 px-4 py-2 border border-border rounded-pill text-label font-medium text-ink-secondary bg-surface transition-colors"
                        >
                          {prog}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border mb-section" />

                  <div className="mb-section">
                    <p className="text-heading font-bold text-ink mb-4">상세 후기</p>
                    <textarea
                      value={reviewText}
                      onChange={e => { if (e.target.value.length <= 500) setReviewText(e.target.value) }}
                      placeholder="수업, 강사, 시설 등 이용 경험을 자유롭게 작성해 주세요 (최소 10자)"
                      className="w-full h-36 p-card-lg bg-surface-muted rounded-card text-body text-ink placeholder:text-ink-placeholder resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex justify-between mt-1.5">
                      <p className={`text-caption ${reviewText.length > 0 && reviewText.length < 10 ? 'text-primary' : 'text-ink-tertiary'}`}>
                        {reviewText.length > 0 && reviewText.length < 10 ? '최소 10자 이상 작성해 주세요' : ' '}
                      </p>
                      <p className="text-caption text-ink-tertiary">{reviewText.length}/500</p>
                    </div>
                  </div>

                  <div className="h-px bg-border mb-section" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-heading font-bold text-ink">사진 첨부</p>
                        <p className="text-label text-ink-tertiary mt-1">최대 5장까지 등록 가능</p>
                      </div>
                      <span className="text-label text-ink-tertiary">{reviewImages.length}/5</span>
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
                      {reviewImages.length < 5 && (
                        <label className="flex-shrink-0 w-20 h-20 bg-surface-muted rounded-card border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink-tertiary mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
                          <span className="text-caption text-ink-tertiary">사진</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file && reviewImages.length < 5) {
                              const url = URL.createObjectURL(file)
                              setReviewImages(prev => [...prev, url])
                            }
                            e.target.value = ''
                          }} />
                        </label>
                      )}
                      {reviewImages.map((img, i) => (
                        <div key={i} className="flex-shrink-0 w-20 h-20 relative rounded-card overflow-hidden">
                          <img src={img} alt={`첨부 ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                          >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 px-page py-3 border-t border-border bg-surface">
                <button
                  onClick={() => setReviewSubmitted(true)}
                  disabled={reviewRating === 0 || reviewText.trim().length < 10}
                  className={`w-full py-3.5 text-body font-bold rounded-xl transition-colors ${
                    reviewRating > 0 && reviewText.trim().length >= 10
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-ink-disabled text-white cursor-not-allowed'
                  }`}
                >
                  등록하기
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 전체 이미지 갤러리 ── */}
      {showFullImage && gymData && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-page py-3 flex-shrink-0">
            <span className="text-body font-bold text-white">사진 {gymData.galleryImages.filter(g => g.type !== 'video').length}장{gymData.galleryImages.some(g => g.type === 'video') ? ` · 동영상 ${gymData.galleryImages.filter(g => g.type === 'video').length}개` : ''}</span>
            <button onClick={() => setShowFullImage(false)} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-1 pb-6">
            <div className="grid grid-cols-2 gap-1">
              {gymData.galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-square cursor-pointer" onClick={() => setZoomedImage(img)}>
                  <img src={img.url.replace('w=400&h=400', 'w=600&h=600')} alt={img.label} className="w-full h-full object-cover" />
                  {img.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white ml-0.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-caption text-white">{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 개별 이미지/동영상 확대 ── */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white z-10">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          {zoomedImage.type === 'video' && zoomedImage.videoUrl ? (
            <video src={zoomedImage.videoUrl} controls autoPlay className="w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={zoomedImage.url.replace(/w=\d+&h=\d+/, 'w=1200&h=1200')} alt={zoomedImage.label} className="w-full h-auto max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          )}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 rounded-full text-body text-white">{zoomedImage.label}</span>
        </div>
      )}
    </PageLayout>
  )
}
