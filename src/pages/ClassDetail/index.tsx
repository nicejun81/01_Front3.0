import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, RatingSummary, ReviewItem, BottomCTA, Badge } from '../../components'
import { IconHeart, IconShare, IconPlay, IconClock, IconChevronDown, IconStarFilled } from '../../components/Icons'

/* ── data types ─────────────────────────────────────── */
interface Lesson {
  title: string
  duration: string
  preview?: boolean
  thumb: string
}
interface Chapter {
  title: string
  lessons: Lesson[]
}
interface Review {
  name: string
  avatar: string
  rating: number
  date: string
  text: string
}
interface ClassInfo {
  title: string
  subtitle: string
  instructor: string
  instructorAvatar: string
  instructorBio: string
  instructorFollowers: string
  level: string
  duration: string
  lessonCount: number
  studentCount: string
  rating: number
  reviewCount: number
  imageUrl: string
  description: string
  highlights: string[]
  chapters: Chapter[]
  reviews: Review[]
  price: number
  originalPrice: number
}

/* ── mock data ──────────────────────────────────────── */
const classesData: Record<string, ClassInfo> = {
  '1': {
    title: '홈트레이닝 기초',
    subtitle: '기구 없이 집에서 완성하는 탄탄한 몸',
    instructor: '김민수',
    instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: '현 바디채널 강남점 수석 트레이너. 10년 경력의 홈트레이닝 전문가로, 누적 수강생 5,000명 이상을 지도했습니다.',
    instructorFollowers: '2,847',
    level: '초급',
    duration: '총 3시간 24분',
    lessonCount: 12,
    studentCount: '1,234',
    rating: 4.9,
    reviewCount: 327,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop',
    description: '집에서도 효과적으로 운동할 수 있는 홈트레이닝 기초 과정입니다. 기구 없이 맨몸으로 할 수 있는 다양한 운동법을 단계별로 배워보세요. 초보자도 쉽게 따라할 수 있도록 구성했습니다.',
    highlights: ['기구 없이 맨몸 운동만으로 구성', '초보자 맞춤 단계별 난이도', '매일 15분 루틴 제공', '운동 전후 스트레칭 포함'],
    chapters: [
      {
        title: '시작하기',
        lessons: [
          { title: '오리엔테이션', duration: '10:00', preview: true, thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
          { title: '운동 전 준비사항', duration: '08:30', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&h=68&fit=crop' },
        ],
      },
      {
        title: '워밍업 & 기초',
        lessons: [
          { title: '동적 스트레칭', duration: '15:00', preview: true, thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=68&fit=crop' },
          { title: '관절 가동성 운동', duration: '12:00', thumb: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=120&h=68&fit=crop' },
        ],
      },
      {
        title: '상체 운동',
        lessons: [
          { title: '푸쉬업 변형 5가지', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1598971639058-a25e41d0a88e?w=120&h=68&fit=crop' },
          { title: '딥스 & 플랭크', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=120&h=68&fit=crop' },
        ],
      },
      {
        title: '하체 운동',
        lessons: [
          { title: '스쿼트 & 런지', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=120&h=68&fit=crop' },
          { title: '힙브릿지 & 글루트킥', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&h=68&fit=crop' },
        ],
      },
      {
        title: '코어 & 전신',
        lessons: [
          { title: '코어 집중 루틴', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
          { title: '전신 서킷 트레이닝', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=68&fit=crop' },
        ],
      },
    ],
    reviews: [
      { name: '운동초보', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.15', text: '진짜 초보자한테 딱 맞는 강의예요! 설명이 너무 친절해서 하나도 어렵지 않았어요.' },
      { name: '헬린이탈출', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.11.28', text: '매일 15분씩 따라하고 있는데 확실히 체력이 좋아지는 게 느껴집니다. 강추합니다!' },
      { name: '직장인A', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.11.10', text: '퇴근 후에 짧게 할 수 있어서 좋아요. 기구 없이 가능한 점이 최고입니다.' },
    ],
    price: 69000,
    originalPrice: 129000,
  },
  '2': {
    title: '바레톤 입문',
    subtitle: '올바른 호흡과 자세로 시작하는 바레톤',
    instructor: '박지영',
    instructorAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face',
    instructorBio: '국제 바레톤 자격 보유. 바디채널 강남점 바레톤 전담 강사로 8년간 활동하며 체형교정 전문가로 활동 중입니다.',
    instructorFollowers: '4,122',
    level: '초급',
    duration: '총 2시간 16분',
    lessonCount: 8,
    studentCount: '2,891',
    rating: 4.8,
    reviewCount: 215,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop',
    description: '바레톤의 기본 원리와 동작을 배우는 입문 과정입니다. 올바른 호흡법과 자세를 단계별로 익혀, 근력과 유연성을 동시에 향상시킬 수 있습니다.',
    highlights: ['6가지 바레톤 기본 원리 습득', '횡격막·측흉식 호흡법 마스터', '매트 바레톤 기본 동작 20가지', '체형 교정에 효과적인 루틴'],
    chapters: [
      {
        title: '바레톤 이해하기',
        lessons: [
          { title: '바레톤란?', duration: '12:00', preview: true, thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=68&fit=crop' },
          { title: '6가지 기본 원리', duration: '10:00', thumb: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=120&h=68&fit=crop' },
        ],
      },
      {
        title: '호흡과 기본 자세',
        lessons: [
          { title: '횡격막 호흡법', duration: '15:00', preview: true, thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=68&fit=crop' },
          { title: '뉴트럴 스파인 & 임프린트', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=120&h=68&fit=crop' },
        ],
      },
      {
        title: '매트 운동',
        lessons: [
          { title: '헌드레드 & 롤업', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
          { title: '싱글레그 서클', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=120&h=68&fit=crop' },
          { title: '크리스크로스 & 스완', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
          { title: '사이드킥 시리즈', duration: '16:00', thumb: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&h=68&fit=crop' },
        ],
      },
    ],
    reviews: [
      { name: '바레톤러버', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.20', text: '호흡법 설명이 정말 자세해서 좋았어요. 바레톤 처음인데 잘 따라갈 수 있었습니다.' },
      { name: '체형교정중', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.01', text: '거북목이 심했는데 2주 만에 확실히 나아진 느낌이에요!' },
      { name: '필라입문', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.11.15', text: '동작 하나하나 천천히 알려주셔서 초보자한테 딱이에요.' },
    ],
    price: 59000,
    originalPrice: 109000,
  },
  '3': {
    title: '근력 운동 마스터', subtitle: '체계적인 웨이트 트레이닝 완전 정복',
    instructor: '최강민', instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: '보디빌딩 대회 입상 경력. 바디채널 강남점 웨이트 전문 트레이너로 12년간 활동하며 근력 향상 프로그램을 설계합니다.',
    instructorFollowers: '5,320', level: '중급', duration: '총 5시간 40분', lessonCount: 20,
    studentCount: '2,104', rating: 4.7, reviewCount: 289,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop',
    description: '웨이트 트레이닝의 기본 원리부터 고급 테크닉까지. 부위별 근력 운동을 체계적으로 배우고, 자신만의 루틴을 설계할 수 있는 능력을 길러보세요.',
    highlights: ['5대 복합 운동 마스터', '부위별 고립 운동 테크닉', '주간 분할 루틴 설계법', '부상 예방 폼 교정'],
    chapters: [
      { title: '근력 운동 기초', lessons: [
        { title: '웨이트 트레이닝 원리', duration: '12:00', preview: true, thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
        { title: '올바른 호흡법과 그립', duration: '10:00', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&h=68&fit=crop' },
      ]},
      { title: '상체 운동', lessons: [
        { title: '벤치프레스 & 체스트 플라이', duration: '22:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
        { title: '숄더 프레스 & 레터럴 레이즈', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=120&h=68&fit=crop' },
        { title: '바벨 로우 & 랫풀다운', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=120&h=68&fit=crop' },
      ]},
      { title: '하체 운동', lessons: [
        { title: '바벨 스쿼트 마스터', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=120&h=68&fit=crop' },
        { title: '데드리프트 & 루마니안', duration: '22:00', thumb: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '근육맨', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.10', text: '폼 교정이 확실합니다. 혼자 운동하면서 잘못된 자세가 많았는데 많이 고쳤어요.' },
      { name: '헬스초보', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.28', text: '5대 운동 제대로 배운 건 처음이에요. 강추!' },
      { name: '3년차', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.03.15', text: '중급자에게 딱 맞는 난이도. 세트 구성도 좋습니다.' },
    ],
    price: 79000, originalPrice: 149000,
  },
  '4': {
    title: '매일 10분 스트레칭', subtitle: '하루 10분으로 유연성과 건강을 되찾다',
    instructor: '정서연', instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    instructorBio: '요가·스트레칭 전문가. 재활운동 자격 보유. 유연성 향상과 통증 완화를 위한 맞춤 프로그램을 제공합니다.',
    instructorFollowers: '3,890', level: '초급', duration: '총 1시간 30분', lessonCount: 6,
    studentCount: '3,210', rating: 4.9, reviewCount: 456,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=450&fit=crop',
    description: '바쁜 일상 속에서도 매일 10분만 투자하면 몸이 달라집니다. 목·어깨·허리·골반 부위별 스트레칭 루틴으로 만성 통증을 예방하고 유연성을 높여보세요.',
    highlights: ['부위별 맞춤 스트레칭 루틴', '거북목·라운드숄더 교정', '하루 10분 루틴으로 구성', '사무실에서도 가능한 동작 포함'],
    chapters: [
      { title: '스트레칭 기본', lessons: [
        { title: '스트레칭의 원리', duration: '08:00', preview: true, thumb: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=120&h=68&fit=crop' },
        { title: '목·어깨 스트레칭', duration: '12:00', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=68&fit=crop' },
      ]},
      { title: '부위별 루틴', lessons: [
        { title: '허리·골반 스트레칭', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=68&fit=crop' },
        { title: '하체 유연성 루틴', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
        { title: '전신 릴렉스 루틴', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=68&fit=crop' },
        { title: '사무실 스트레칭', duration: '10:00', thumb: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '직장인B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.12', text: '하루 10분이라 부담없이 따라할 수 있어요. 어깨 결림이 확실히 줄었습니다.' },
      { name: '거북목탈출', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.05', text: '거북목 때문에 시작했는데 2주 만에 효과 봤어요!' },
    ],
    price: 39000, originalPrice: 79000,
  },
  '5': {
    title: 'HIIT 다이어트 챌린지', subtitle: '짧고 강하게, 최대 칼로리 소모',
    instructor: '한동훈', instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: 'NSCA-CPT 자격 보유. 고강도 인터벌 트레이닝 전문가로 체지방 감량 프로그램을 설계합니다.',
    instructorFollowers: '2,150', level: '고급', duration: '총 4시간 15분', lessonCount: 15,
    studentCount: '987', rating: 4.6, reviewCount: 178,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop',
    description: '20~30분의 고강도 인터벌 트레이닝으로 최대 칼로리를 소모하세요. 4주 프로그램으로 체지방 감량과 심폐 능력 향상을 동시에 달성합니다.',
    highlights: ['4주 완성 체지방 감량 프로그램', '운동 후 24시간 애프터번 효과', '난이도별 3단계 구성', '기구 없이 맨몸으로 가능'],
    chapters: [
      { title: '1주차: 기초 HIIT', lessons: [
        { title: 'HIIT의 원리', duration: '10:00', preview: true, thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&h=68&fit=crop' },
        { title: '기초 서킷 A', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=120&h=68&fit=crop' },
        { title: '기초 서킷 B', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
      ]},
      { title: '2~3주차: 강도 업', lessons: [
        { title: '중급 타바타', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
        { title: '플라이오메트릭 HIIT', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=120&h=68&fit=crop' },
      ]},
      { title: '4주차: 파이널', lessons: [
        { title: '고강도 파이널 서킷', duration: '30:00', thumb: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=120&h=68&fit=crop' },
        { title: '쿨다운 & 리커버리', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '다이어터', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.08', text: '4주 완주하고 체지방 3% 빠졌습니다. 힘들지만 확실히 효과 있어요!' },
      { name: '런닝맨', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.03.22', text: '심폐 능력이 확실히 올라갑니다. 고급자 난이도는 진짜 힘들어요.' },
    ],
    price: 69000, originalPrice: 129000,
  },
  '6': {
    title: '바레톤 중급 테크닉', subtitle: '깊이 있는 동작과 흐름을 익히다',
    instructor: '이수진', instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    instructorBio: '바레톤 마스터 트레이너. 바디채널 바레톤 프로그램 총괄. 정확한 동작과 흐름 연결에 중점을 둔 수업을 진행합니다.',
    instructorFollowers: '3,456', level: '중급', duration: '총 2시간 50분', lessonCount: 10,
    studentCount: '754', rating: 4.8, reviewCount: 134,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=450&fit=crop',
    description: '바레톤 기초를 마친 분들을 위한 중급 과정. 더 깊은 근육 활성화와 동작 연결, 호흡과 움직임의 조화를 배워 한 단계 성장하세요.',
    highlights: ['심화 매트 운동 15가지', '동작 간 흐름 연결법', '소도구 활용 바레톤', '자세 정밀 교정'],
    chapters: [
      { title: '중급 기본', lessons: [
        { title: '중급 과정 안내', duration: '08:00', preview: true, thumb: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=68&fit=crop' },
        { title: '심화 호흡 테크닉', duration: '12:00', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=68&fit=crop' },
      ]},
      { title: '심화 매트 운동', lessons: [
        { title: '티저 & 스윔', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=120&h=68&fit=crop' },
        { title: '잭나이프 & 부메랑', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=120&h=68&fit=crop' },
        { title: '사이드밴드 & 트위스트', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '바레톤3년차', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.14', text: '흐름 연결법을 배우니까 운동의 질이 확 달라졌어요.' },
      { name: '유연해지고싶다', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.02', text: '기초반 듣고 바로 넘어왔는데 난이도가 딱 적절해요.' },
    ],
    price: 65000, originalPrice: 119000,
  },
  '7': {
    title: '전신 근력 프로그램', subtitle: '균형 잡힌 몸을 위한 전신 운동',
    instructor: '최강민', instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: '보디빌딩 대회 입상 경력. 바디채널 강남점 웨이트 전문 트레이너로 12년간 활동하며 근력 향상 프로그램을 설계합니다.',
    instructorFollowers: '5,320', level: '중급', duration: '총 4시간 30분', lessonCount: 16,
    studentCount: '1,123', rating: 4.7, reviewCount: 198,
    imageUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&h=450&fit=crop',
    description: '상·하체 밸런스를 맞춘 전신 근력 프로그램. 주 3~4회 운동으로 전신의 근력과 근지구력을 고르게 발달시킵니다.',
    highlights: ['주 3~4회 전신 루틴', '상하체 밸런스 강화', '점진적 과부하 원칙 적용', '주간 프로그래밍 포함'],
    chapters: [
      { title: '프로그램 소개', lessons: [
        { title: '프로그램 구성 안내', duration: '10:00', preview: true, thumb: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=120&h=68&fit=crop' },
      ]},
      { title: '상체 데이', lessons: [
        { title: '가슴 & 삼두', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
        { title: '등 & 이두', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
        { title: '어깨 & 코어', duration: '22:00', thumb: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=120&h=68&fit=crop' },
      ]},
      { title: '하체 데이', lessons: [
        { title: '대퇴사두 & 햄스트링', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=120&h=68&fit=crop' },
        { title: '글루트 & 종아리', duration: '20:00', thumb: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '밸런스중시', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.11', text: '분할 루틴이 체계적이라 따라하기만 하면 됩니다.' },
      { name: '3개월차', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.03.30', text: '전신을 골고루 운동할 수 있어서 좋아요.' },
    ],
    price: 75000, originalPrice: 139000,
  },
  '8': {
    title: '모닝 요가 루틴', subtitle: '아침을 여는 상쾌한 요가 수련',
    instructor: '정서연', instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    instructorBio: '요가·스트레칭 전문가. RYT-200 자격 보유. 아침 요가를 통해 하루의 에너지를 높이는 루틴을 전파합니다.',
    instructorFollowers: '3,890', level: '초급', duration: '총 2시간 20분', lessonCount: 10,
    studentCount: '2,567', rating: 4.9, reviewCount: 367,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop',
    description: '매일 아침 15~20분, 부드러운 요가 동작으로 하루를 시작하세요. 몸을 깨우고 마음을 정돈하는 모닝 루틴입니다.',
    highlights: ['매일 15~20분 아침 루틴', '태양 경배 자세 마스터', '호흡·명상 결합', '모든 레벨 가능'],
    chapters: [
      { title: '요가 기본', lessons: [
        { title: '모닝 요가 소개', duration: '08:00', preview: true, thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&h=68&fit=crop' },
        { title: '기본 호흡법', duration: '10:00', thumb: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=120&h=68&fit=crop' },
      ]},
      { title: '주간 루틴', lessons: [
        { title: 'Day 1: 태양 경배', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&h=68&fit=crop' },
        { title: 'Day 2: 밸런스 플로우', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=68&fit=crop' },
        { title: 'Day 3: 코어 요가', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '아침형인간', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.15', text: '매일 아침 따라하고 있어요. 하루가 완전 달라집니다!' },
      { name: '요가입문', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.08', text: '부드럽고 무리 없는 동작이라 초보자에게 딱이에요.' },
    ],
    price: 49000, originalPrice: 89000,
  },
  '9': {
    title: '30일 홈트 챌린지', subtitle: '30일 동안 매일 운동하는 습관 만들기',
    instructor: '김민수', instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: '현 바디채널 강남점 수석 트레이너. 10년 경력의 홈트레이닝 전문가로, 누적 수강생 5,000명 이상을 지도했습니다.',
    instructorFollowers: '2,847', level: '중급', duration: '총 7시간 30분', lessonCount: 30,
    studentCount: '1,890', rating: 4.8, reviewCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=450&fit=crop',
    description: '30일간 매일 15~20분씩 운동하며 건강한 습관을 만드는 챌린지 프로그램. 주차별로 강도가 올라가며 전신 근력과 체력을 향상시킵니다.',
    highlights: ['30일 매일 운동 루틴', '주차별 점진적 강도 상승', '전신 균형 잡힌 프로그램', '챌린지 완주 인증서 제공'],
    chapters: [
      { title: '1주차', lessons: [
        { title: 'Day 1: 전신 워밍업', duration: '15:00', preview: true, thumb: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=120&h=68&fit=crop' },
        { title: 'Day 2: 상체 기초', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
        { title: 'Day 3: 하체 기초', duration: '15:00', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=120&h=68&fit=crop' },
      ]},
      { title: '2주차', lessons: [
        { title: 'Day 8: 상체 강화', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
        { title: 'Day 9: 하체 강화', duration: '18:00', thumb: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '습관형성중', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.13', text: '30일 완주했습니다! 매일 하니까 확실히 체력이 달라졌어요.' },
      { name: '의지박약탈출', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.01', text: '짧은 시간이라 부담없고, 매일 하는 재미가 있어요.' },
    ],
    price: 59000, originalPrice: 109000,
  },
  '10': {
    title: '타바타 4분 운동', subtitle: '단 4분, 최대 효율의 운동',
    instructor: '한동훈', instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
    instructorBio: 'NSCA-CPT 자격 보유. 고강도 인터벌 트레이닝 전문가로 체지방 감량 프로그램을 설계합니다.',
    instructorFollowers: '2,150', level: '고급', duration: '총 32분', lessonCount: 8,
    studentCount: '645', rating: 4.5, reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=450&fit=crop',
    description: '20초 전력 운동 + 10초 휴식을 8라운드! 단 4분 만에 폭발적인 칼로리 소모를 경험하세요. 8가지 다른 타바타 루틴을 제공합니다.',
    highlights: ['4분 완성 타바타 루틴 8종', '시간 대비 최고 효율', '부위별/전신 루틴 구성', '타이머 가이드 포함'],
    chapters: [
      { title: '타바타 기본', lessons: [
        { title: '타바타 프로토콜 안내', duration: '04:00', preview: true, thumb: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=120&h=68&fit=crop' },
        { title: '전신 타바타 A', duration: '04:00', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&h=68&fit=crop' },
        { title: '전신 타바타 B', duration: '04:00', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&h=68&fit=crop' },
      ]},
      { title: '부위별 타바타', lessons: [
        { title: '상체 타바타', duration: '04:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' },
        { title: '하체 타바타', duration: '04:00', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=120&h=68&fit=crop' },
        { title: '코어 타바타', duration: '04:00', thumb: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=120&h=68&fit=crop' },
      ]},
    ],
    reviews: [
      { name: '시간없는직장인', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.04.10', text: '4분이라 매일 할 수 있어요. 근데 진짜 힘듭니다 ㅋㅋ' },
      { name: '타바타중독', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.03.25', text: '짧지만 확실한 운동. 매일 다른 루틴이라 안 질려요.' },
    ],
    price: 29000, originalPrice: 59000,
  },
}

const defaultClass: ClassInfo = {
  title: '온라인 강의',
  subtitle: '온라인으로 배우는 운동',
  instructor: '강사',
  instructorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face',
  instructorBio: '전문 트레이너입니다.',
  instructorFollowers: '100',
  level: '초급',
  duration: '1시간',
  lessonCount: 5,
  studentCount: '100',
  rating: 4.5,
  reviewCount: 10,
  imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop',
  description: '온라인 강의입니다.',
  highlights: ['기초부터 시작'],
  chapters: [{ title: '기본', lessons: [{ title: '강의 1', duration: '10:00', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=68&fit=crop' }] }],
  reviews: [{ name: '수강생', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.01', text: '좋은 강의였습니다.' }],
  price: 49000,
  originalPrice: 99000,
}

/* ── helpers ─────────────────────────────────────────── */
const tabs = ['클래스 소개', '커리큘럼', '크리에이터', '후기'] as const
type Tab = typeof tabs[number]

/* ── component ──────────────────────────────────────── */
export const ClassDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = classesData[id || ''] || defaultClass
  const [activeTab, setActiveTab] = useState<Tab>('클래스 소개')
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set([0]))
  const [liked, setLiked] = useState(false)

  const sectionRefs = useRef<Record<Tab, HTMLDivElement | null>>({
    '클래스 소개': null,
    '커리큘럼': null,
    '크리에이터': null,
    '후기': null,
  })

  const tabBarRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (tab: Tab) => {
    setActiveTab(tab)
    const el = sectionRefs.current[tab]
    if (el) {
      const offset = (tabBarRef.current?.getBoundingClientRect().height || 48) + 56
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const toggleChapter = (i: number) => {
    setOpenChapters((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const discount = Math.round((1 - data.price / data.originalPrice) * 100)

  /* scroll spy */
  useEffect(() => {
    const handleScroll = () => {
      const offset = (tabBarRef.current?.getBoundingClientRect().height || 48) + 60
      for (const tab of [...tabs].reverse()) {
        const el = sectionRefs.current[tab]
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top <= offset) {
            setActiveTab(tab)
            return
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const header = (
    <SubPageHeader
      title={data.title}
      right={
        <div className="flex gap-1">
          <button className="icon-btn">
            <IconShare className="w-[18px] h-[18px] stroke-ink stroke-2" />
          </button>
          <button onClick={() => setLiked(!liked)} className="icon-btn">
            <IconHeart className={`w-[18px] h-[18px] stroke-2 ${liked ? 'fill-semantic-like stroke-semantic-like' : 'fill-none stroke-ink'}`} />
          </button>
        </div>
      }
    />
  )

  return (
    <PageLayout header={header} hideBottomNav className="!px-0 !py-0 !pb-[70px]">
      {/* ── Hero Image ── */}
      <div className="relative aspect-video">
        <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover" />
        <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
            <IconPlay className="w-6 h-6 fill-ink stroke-ink ml-0.5" />
          </div>
        </button>
      </div>

      {/* ── Class Info ── */}
      <div className="px-page pt-5 pb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Badge variant="secondary" size="md">{data.level}</Badge>
          <Badge variant="muted" size="md">{data.lessonCount}강</Badge>
        </div>
        <h1 className="text-display font-bold leading-tight text-ink mb-1">{data.title}</h1>
        <p className="text-body text-ink-secondary mb-4">{data.subtitle}</p>

        {/* Instructor row */}
        <div className="flex items-center gap-2 mb-4">
          <img src={data.instructorAvatar} alt={data.instructor} className="w-7 h-7 rounded-full object-cover" />
          <span className="text-body font-medium text-ink">{data.instructor}</span>
        </div>

        {/* Rating + stats */}
        <div className="flex items-center gap-3 text-body">
          <div className="flex items-center gap-1">
            <IconStarFilled className="w-3.5 h-3.5 text-semantic-star" />
            <span className="font-bold text-ink">{data.rating}</span>
            <span className="text-ink-tertiary">({data.reviewCount})</span>
          </div>
          <span className="text-ink-disabled">|</span>
          <div className="flex items-center gap-1 text-ink-secondary">
            <IconClock className="w-3.5 h-3.5 stroke-ink-tertiary stroke-2" />
            <span>{data.duration}</span>
          </div>
          <span className="text-ink-disabled">|</span>
          <span className="text-ink-secondary">{data.studentCount}명 수강</span>
        </div>
      </div>

      {/* ── Sticky Tabs ── */}
      <div ref={tabBarRef} className="sticky top-[48px] z-40 bg-white border-b border-border">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => scrollToSection(tab)}
              className={`flex-1 py-3 text-body font-semibold text-center transition-colors relative ${
                activeTab === tab ? 'text-ink' : 'text-ink-tertiary'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-ink rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 클래스 소개 ── */}
      <div ref={(el) => { sectionRefs.current['클래스 소개'] = el }} className="px-page py-section">
        <p className="text-body text-ink-secondary leading-relaxed mb-section">{data.description}</p>

        <div className="bg-surface-subtle rounded-xl p-card-lg">
          <h3 className="text-body font-bold text-ink mb-3">이런 걸 배워요</h3>
          <ul className="space-y-2.5">
            {data.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-body text-ink-secondary">
                <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-px">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 커리큘럼 ── */}
      <div ref={(el) => { sectionRefs.current['커리큘럼'] = el }} className="px-page py-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading font-bold text-ink">커리큘럼</h2>
          <span className="text-label text-ink-tertiary">{data.chapters.reduce((a, c) => a + c.lessons.length, 0)}개 강의 · {data.duration}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {data.chapters.map((chapter, ci) => {
            const isOpen = openChapters.has(ci)
            return (
              <div key={ci} className="border border-border rounded-xl overflow-hidden">
                {/* chapter header */}
                <button
                  onClick={() => toggleChapter(ci)}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-surface-subtle hover:bg-surface-muted transition-colors"
                >
                  <div className="flex items-center gap-2 text-left min-w-0">
                    <span className="text-label font-bold text-primary shrink-0">섹션 {ci + 1}</span>
                    <span className="text-body font-semibold text-ink truncate">{chapter.title}</span>
                    <span className="text-label text-ink-tertiary shrink-0">{chapter.lessons.length}강</span>
                  </div>
                  <IconChevronDown className={`w-4 h-4 stroke-ink-tertiary stroke-2 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* lessons */}
                <div className={`transition-all duration-200 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'} overflow-hidden`}>
                  {chapter.lessons.map((lesson, li) => (
                    <div key={li} className="flex items-center justify-between px-4 py-3.5 border-t border-border-light gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-[88px] h-[50px] rounded-lg overflow-hidden shrink-0 bg-surface-muted">
                          <img src={lesson.thumb} alt={lesson.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <IconPlay className="w-4 h-4 fill-white stroke-white ml-0.5" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-body font-medium text-ink truncate">{lesson.title}</p>
                          <p className="text-caption text-ink-tertiary mt-0.5">{lesson.duration}</p>
                        </div>
                      </div>
                      {lesson.preview && (
                        <span className="px-2.5 py-1 border border-primary text-primary text-caption font-bold rounded-md shrink-0">미리보기</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 크리에이터 ── */}
      <div ref={(el) => { sectionRefs.current['크리에이터'] = el }} className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-4">크리에이터</h2>
        <div className="flex items-center gap-3 mb-4">
          <img src={data.instructorAvatar} alt={data.instructor} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <p className="text-title font-bold text-ink">{data.instructor}</p>
            <p className="text-label text-ink-tertiary">팔로워 {data.instructorFollowers}명</p>
          </div>
        </div>
        <p className="text-body text-ink-secondary leading-relaxed mb-4">{data.instructorBio}</p>
        <button
          onClick={() => {
            const trainerMap: Record<string, string> = { '김민수': '1', '박지영': '2', '한동훈': '3', '정서연': '4', '최강민': '1', '이수진': '2' }
            const trainerId = trainerMap[data.instructor] || '1'
            navigate(`/trainer/${trainerId}`)
          }}
          className="w-full py-2.5 border border-border rounded-lg text-body font-semibold text-ink hover:bg-surface-subtle transition-colors"
        >
          크리에이터 프로필
        </button>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 후기 ── */}
      <div ref={(el) => { sectionRefs.current['후기'] = el }} className="px-page py-section">
        <div className="flex items-center justify-between mb-section">
          <h2 className="text-heading font-bold text-ink">수강생 후기</h2>
          <span className="text-label text-ink-tertiary">{data.reviewCount}개</span>
        </div>

        {/* rating summary */}
        <div className="mb-4">
          <RatingSummary rating={data.rating} reviewCount={data.reviewCount} distribution={[82, 14, 3, 1, 0]} />
        </div>

        {/* review list */}
        <div className="space-y-4">
          {data.reviews.map((review, i) => (
            <ReviewItem
              key={i}
              avatar={review.avatar}
              name={review.name}
              rating={review.rating}
              date={review.date}
              text={review.text}
            />
          ))}
        </div>

        <button className="w-full py-3 mt-4 border border-border rounded-lg text-body font-semibold text-ink hover:bg-surface-subtle transition-colors">
          후기 더보기
        </button>
      </div>

      {/* ── Bottom CTA ── */}
      <BottomCTA hideBottomNav>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-body font-bold text-primary">{discount}%</span>
            <span className="text-label text-ink-tertiary line-through">{data.originalPrice.toLocaleString()}원</span>
          </div>
          <p className="text-heading font-bold text-ink">{data.price.toLocaleString()}원</p>
        </div>
        <button onClick={() => {
          // 수강 이력 저장
          const history = JSON.parse(localStorage.getItem('class-history') || '[]')
          if (!history.find((h: { id: string }) => h.id === id)) {
            history.unshift({
              id,
              title: data.title,
              instructor: data.instructor,
              level: data.level,
              lessonCount: data.lessonCount,
              duration: data.duration,
              imageUrl: data.imageUrl,
              progress: 0,
              enrolledAt: new Date().toISOString(),
            })
            localStorage.setItem('class-history', JSON.stringify(history))
          }
          navigate(`/checkout?name=${encodeURIComponent(data.title)}&price=${encodeURIComponent(data.price.toLocaleString())}&gym=${encodeURIComponent('바디채널 강남점')}`)
        }} className="px-8 py-3.5 bg-primary text-white text-body font-bold rounded-xl hover:bg-primary-dark transition-colors">
          바로 수강하기
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
