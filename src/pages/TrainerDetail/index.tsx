import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, ReviewItem, ReviewSort, RatingSummary } from '../../components'
import { IconShare } from '../../components/Icons'
import { lessonsData } from '../GroupLessonDetail'

/* ── Radar Chart ── */
interface RadarStats {
  전문성: number
  소통력: number
  열정: number
  체계성: number
  동기부여: number
  피드백: number
}

const RadarChart = ({ stats }: { stats: RadarStats }) => {
  const labels = Object.keys(stats) as (keyof RadarStats)[]
  const values = labels.map(k => stats[k])
  const cx = 100, cy = 100, r = 72
  const angleStep = (2 * Math.PI) / 6

  const getPoint = (i: number, scale: number) => {
    const angle = angleStep * i - Math.PI / 2
    return { x: cx + r * scale * Math.cos(angle), y: cy + r * scale * Math.sin(angle) }
  }

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]
  const dataPoints = values.map((v, i) => getPoint(i, v / 5))
  return (
    <svg viewBox="0 0 200 200" className="w-[180px] h-[180px]">
      {gridLevels.map(level => {
        const points = Array.from({ length: 6 }, (_, i) => getPoint(i, level))
        return <polygon key={level} points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const p = getPoint(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e5e5e5" strokeWidth="0.5" />
      })}
      <polygon points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(255,107,53,0.12)" stroke="#FF6B35" strokeWidth="1.5" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FF6B35" />
      ))}
      {labels.map((label, i) => {
        const p = getPoint(i, 1.28)
        return (
          <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-ink-secondary font-medium">
            {label}
          </text>
        )
      })}
    </svg>
  )
}

/* ── Types ── */
interface TrainerReview { name: string; avatar: string; rating: number; date: string; text: string; photos?: string[]; program?: string }

interface TrainerData {
  name: string
  avatar: string
  coverImage: string
  category: string
  categoryColor: string
  gym: string
  gymId: string
  rating: number
  reviewCount: number
  intro: string
  philosophy: string
  career: string[]
  certifications: string[]
  specialties: { title: string; desc: string }[]
  radar: RadarStats
  stats: { label: string; value: string }[]
  lessonIds: string[]
  schedule: { day: string; time: string }[]
  reviews: TrainerReview[]
  gallery: string[]
}

/* ── Data ── */
export const trainersData: Record<string, TrainerData> = {
  '1': {
    name: '최강민',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
    category: 'PT',
    categoryColor: 'pt',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.9,
    reviewCount: 128,
    intro: '10년 경력의 체형교정 및 웨이트 전문 퍼스널 트레이너입니다. 서울대학교 체육교육과를 졸업하고, 미국 NSCA-CSCS 자격을 보유하고 있습니다. 개인의 체형과 목표에 맞춘 과학적 프로그램 설계를 통해 500명 이상의 회원님들의 변화를 이끌어 왔습니다.',
    philosophy: '운동은 단순한 체력 향상이 아니라 삶의 질을 바꾸는 투자입니다. 회원님 한 분 한 분의 신체적 특성과 생활 패턴을 분석하여, 지속 가능한 운동 습관을 만들어 드리는 것이 제 목표입니다. "몸이 바뀌면 인생이 바뀝니다."',
    career: [
      '서울대학교 체육교육과 졸업',
      '바디채널 강남점 수석 트레이너 (2020~현재)',
      '스포애니 역삼점 팀장 (2016~2020)',
      'CJ ENM 건강프로그램 자문 트레이너',
      '2023 KSPO 올해의 트레이너 수상',
    ],
    certifications: [
      'NSCA-CSCS (미국 근력컨디셔닝 전문가)',
      'NASM-CPT (미국 퍼스널 트레이너)',
      '대한체육회 생활체육지도사 2급',
      'FMS Level 2 (기능적 움직임 평가)',
      'KACEP 운동처방사',
    ],
    specialties: [
      { title: '체형교정 PT', desc: '거북목, 라운드숄더, 골반 틀어짐 등 체형 불균형을 근력 강화와 스트레칭으로 교정합니다.' },
      { title: '벌크업 프로그램', desc: '근비대에 최적화된 분할 운동과 영양 계획을 제공합니다.' },
      { title: '재활 운동', desc: '부상 후 회복 단계에 맞는 안전한 운동 프로그램을 제공합니다.' },
    ],
    radar: { 전문성: 5, 소통력: 4.5, 열정: 5, 체계성: 4.8, 동기부여: 4.7, 피드백: 4.9 },
    stats: [
      { label: '경력', value: '10년' },
      { label: '수강생', value: '500+' },
      { label: '총 세션', value: '12,000+' },
      { label: '만족도', value: '98%' },
    ],
    lessonIds: ['pt-kangmin', 'hiit'],
    schedule: [
      { day: '월', time: '06:30~12:00' }, { day: '월', time: '15:00~21:00' },
      { day: '화', time: '15:00~21:00' },
      { day: '수', time: '06:30~12:00' }, { day: '수', time: '14:00~20:00' },
      { day: '목', time: '09:00~12:00' }, { day: '목', time: '17:00~21:00' },
      { day: '금', time: '10:00~12:00' }, { day: '금', time: '18:00~21:00' },
      { day: '토', time: '12:00~15:00' },
    ],
    reviews: [
      { name: '김서연', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.28', text: '체형교정 3개월 받고 거북목이 눈에 띄게 좋아졌어요. 매 세션마다 자세를 꼼꼼히 체크해주시고, 집에서 할 수 있는 운동도 알려주셔서 효과가 배가 됩니다.', program: 'PT 20회권', photos: ['https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop'] },
      { name: '이동현', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.15', text: '벌크업 프로그램으로 3개월 만에 제지방량 5kg 증가! 식단까지 세심하게 관리해주셔서 체지방은 유지하면서 근육만 늘었습니다.', program: 'PT 30회권' },
      { name: '박수아', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.02.20', text: '다른 헬스장에서 2년 운동했는데 효과가 없었거든요. 여기서 최강민 트레이너님 만나고 3개월 만에 목표 체중 달성했어요.', program: 'PT 10회권' },
      { name: '정민호', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.01.10', text: '운동 강도 조절을 잘 해주셔서 무리 없이 꾸준히 할 수 있었습니다. 다만 인기가 많아서 원하는 시간대 예약이 어려울 때가 있어요.', program: 'PT 10회권' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=400&h=400&fit=crop',
    ],
  },
  '2': {
    name: '박지영',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop',
    category: '바레톤',
    categoryColor: 'bareton',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.8,
    reviewCount: 95,
    intro: '한국예술종합학교 무용과를 졸업하고, 7년간 발레와 바레톤을 접목한 체형교정 프로그램을 운영하고 있습니다. 섬세한 동작 교정과 호흡 지도를 통해 아름다운 바디라인과 건강한 체형을 만들어 드립니다.',
    philosophy: '바레톤은 발레의 우아함과 필라테스의 과학을 결합한 운동입니다. 단순히 근육을 키우는 것이 아니라, 몸의 균형을 찾고 내면의 에너지를 깨우는 과정이라고 생각합니다.',
    career: [
      '한국예술종합학교 무용과 졸업',
      '바디채널 강남점 바레톤 메인 강사 (2022~현재)',
      '국립발레단 부속 교육기관 강사 (2019~2022)',
      '유튜브 "지영의 홈바레톤" 운영 (구독자 8만)',
      '2024 K-Fitness Awards 바레톤 부문 대상',
    ],
    certifications: [
      'Barre Above 국제 바레톤 자격증',
      'Stott Pilates 매트/리포머 자격',
      '대한발레협회 정회원',
      '산전산후 운동 전문가 자격',
      '해부학 기반 자세교정 전문가',
    ],
    specialties: [
      { title: '체형교정 바레톤', desc: '발레 바 동작과 필라테스를 결합하여 골반 정렬, 어깨 균형, 척추 커브를 교정합니다.' },
      { title: '코어 강화 프로그램', desc: '깊은 코어 근육을 활성화하여 허리 통증 예방과 탄탄한 복부를 만듭니다.' },
      { title: '산전·산후 바레톤', desc: '임산부와 출산 후 여성을 위한 안전한 바레톤 프로그램입니다.' },
    ],
    radar: { 전문성: 4.8, 소통력: 5, 열정: 4.7, 체계성: 4.6, 동기부여: 4.9, 피드백: 4.8 },
    stats: [
      { label: '경력', value: '7년' },
      { label: '수강생', value: '350+' },
      { label: '총 세션', value: '8,500+' },
      { label: '만족도', value: '97%' },
    ],
    lessonIds: ['lunch-pilates', 'bareton'],
    schedule: [
      { day: '월', time: '14:00~15:00' }, { day: '월', time: '19:30~20:30' },
      { day: '화', time: '19:30~20:30' },
      { day: '수', time: '12:00~13:00' },
      { day: '금', time: '07:00~08:00' }, { day: '금', time: '14:00~15:00' },
      { day: '토', time: '11:30~12:30' },
    ],
    reviews: [
      { name: '한소희', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.25', text: '박지영 선생님 바레톤 수업은 동작 하나하나 꼼꼼하게 잡아주셔서 정말 효과가 좋아요. 3개월 다니니 허리 통증도 없어지고 자세가 확 달라졌어요!', program: '그룹 레슨권', photos: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop'] },
      { name: '이지은', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.10', text: '출산 후 체형이 많이 무너졌었는데 산후 바레톤 프로그램으로 회복 중이에요. 선생님이 항상 편안하게 진행해주셔서 안심이 됩니다.', program: '개인 레슨권' },
      { name: '최유나', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.02.15', text: '발레 경험이 전혀 없었는데도 수업 따라가기 쉬웠어요. 초급부터 차근차근 알려주셔서 좋았습니다.', program: '그룹 레슨권' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop',
    ],
  },
  '3': {
    name: '한동훈',
    avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=400&fit=crop',
    category: '히트35',
    categoryColor: 'hit35',
    gym: '바디채널 역삼점',
    gymId: 'gym2',
    rating: 4.7,
    reviewCount: 82,
    intro: '한국체육대학교 출신으로, 크로스핏 레벨 3 트레이너이자 히트35 프로그램 개발에 참여한 고강도 인터벌 트레이닝 전문가입니다. 8년간 그룹 피트니스와 개인 PT를 병행하며 "즐겁게, 하지만 확실하게" 변화를 만들어 왔습니다.',
    philosophy: '운동이 고통이면 지속할 수 없습니다. 그래서 저는 항상 "오늘 하루 중 가장 재미있는 35분"을 만들려고 합니다. 음악, 팀워크, 그리고 약간의 경쟁심이 결합되면 스스로도 놀라는 퍼포먼스가 나옵니다.',
    career: [
      '한국체육대학교 스포츠과학과 졸업',
      '바디채널 역삼점 히트35 리드 (2021~현재)',
      '크로스핏 강남 헤드코치 (2018~2021)',
      '히트35 프로그램 공동 개발 참여',
      '나이키 트레이닝 클럽 객원 트레이너',
    ],
    certifications: [
      'CrossFit Level 3 Trainer (CF-L3)',
      'HIIT 전문 트레이너 (ACE)',
      'TRX Suspension Training 자격',
      'Kettlebell Athletics Level 2',
      '응급처치 및 CPR 자격',
    ],
    specialties: [
      { title: 'HIIT 인터벌', desc: '35분간 고강도 인터벌로 최대 500kcal를 소모하는 프로그램입니다.' },
      { title: '바디펌프', desc: '바벨을 활용한 음악 기반 그룹 운동입니다.' },
      { title: '서킷 트레이닝', desc: '6~8가지 운동을 순환하며 수행하는 전신 운동입니다.' },
    ],
    radar: { 전문성: 4.7, 소통력: 4.5, 열정: 5, 체계성: 4.3, 동기부여: 5, 피드백: 4.5 },
    stats: [
      { label: '경력', value: '8년' },
      { label: '수강생', value: '420+' },
      { label: '총 세션', value: '9,200+' },
      { label: '만족도', value: '96%' },
    ],
    lessonIds: ['bodypump'],
    schedule: [
      { day: '월', time: '18:00~19:00' }, { day: '월', time: '19:30~20:30' },
      { day: '화', time: '11:00~12:00' },
      { day: '수', time: '09:00~10:00' }, { day: '수', time: '19:30~20:30' },
      { day: '목', time: '18:00~19:00' }, { day: '목', time: '19:00~20:00' },
      { day: '토', time: '11:00~12:00' }, { day: '토', time: '17:00~18:00' },
    ],
    reviews: [
      { name: '김준영', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.20', text: '한동훈 코치님 히트35 수업은 진짜 중독성 있어요. 힘든데 또 가고 싶어지는 마력이 있습니다. 3개월 만에 체지방 7% 감량!', program: '그룹 레슨권' },
      { name: '이하나', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.05', text: '분위기를 정말 잘 살려주세요. 힘들 때 딱 옆에서 응원해주시는데 그게 큰 힘이 됩니다.', program: '그룹 레슨권' },
      { name: '박태준', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.02.12', text: '수업 강도가 높아서 운동 경험이 좀 있는 분들에게 추천합니다. 초보자도 할 수 있지만 꽤 힘들 수 있어요.', program: '그룹 레슨권' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=400&fit=crop',
    ],
  },
  '5': {
    name: '정서연',
    avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop',
    category: 'PT',
    categoryColor: 'pt',
    gym: '바디채널 강남점',
    gymId: 'gym1',
    rating: 4.8,
    reviewCount: 89,
    intro: '이화여자대학교 체육과학과를 졸업하고, 필라테스와 코어 트레이닝을 접목한 바디라인 전문 PT를 8년간 운영하고 있습니다. 해부학 기반의 정밀한 동작 지도로 근본적인 체형 변화를 이끌어 드립니다.',
    philosophy: '아름다운 바디라인은 무리한 운동이 아닌, 정확한 움직임에서 시작됩니다. 몸의 중심인 코어를 깨우면 자세가 바뀌고, 자세가 바뀌면 실루엣이 달라집니다. 회원님 스스로 몸의 변화를 느끼는 그 순간을 함께 만들어 가겠습니다.',
    career: [
      '이화여자대학교 체육과학과 졸업',
      '바디채널 강남점 PT 트레이너 (2022~현재)',
      '플로우 필라테스 스튜디오 강사 (2018~2022)',
      'MBC 생방송 오늘아침 건강 코너 출연',
      '2024 Women\'s Fitness Korea 코어 부문 수상',
    ],
    certifications: [
      'Stott Pilates 매트/리포머 국제 자격',
      'NASM-CPT (미국 퍼스널 트레이너)',
      'KACEP 운동처방사',
      'FMS Level 2 (기능적 움직임 평가)',
      '해부학 기반 자세교정 전문가',
    ],
    specialties: [
      { title: '코어 강화 PT', desc: '깊은 코어 근육(횡복근, 골반저근)을 활성화하여 허리 통증 예방과 탄탄한 바디라인을 만듭니다.' },
      { title: '바디라인 프로그램', desc: '필라테스와 웨이트를 결합한 여성 맞춤 바디쉐이핑 프로그램입니다.' },
      { title: '산전·산후 케어', desc: '임신 중 안전한 운동부터 출산 후 골반·복부 회복까지 단계별로 관리합니다.' },
    ],
    radar: { 전문성: 4.8, 소통력: 5, 열정: 4.6, 체계성: 4.9, 동기부여: 4.7, 피드백: 5 },
    stats: [
      { label: '경력', value: '8년' },
      { label: '수강생', value: '380+' },
      { label: '총 세션', value: '9,500+' },
      { label: '만족도', value: '98%' },
    ],
    lessonIds: ['pt-seoyeon', 'bareton'],
    schedule: [
      { day: '월', time: '09:00~13:00' }, { day: '월', time: '17:00~21:00' },
      { day: '화', time: '10:00~14:00' },
      { day: '수', time: '09:00~13:00' }, { day: '수', time: '17:00~21:00' },
      { day: '목', time: '13:00~17:00' },
      { day: '금', time: '10:00~14:00' }, { day: '금', time: '17:00~21:00' },
      { day: '토', time: '10:00~14:00' },
    ],
    reviews: [
      { name: '이수빈', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.28', text: '정서연 선생님 코어 PT 받고 만성 허리통증이 사라졌어요! 동작 하나하나 왜 이렇게 하는지 설명해주셔서 집에서도 혼자 할 수 있게 됐습니다.', program: 'PT 20회권', photos: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop'] },
      { name: '김하윤', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.03.12', text: '출산 후 벌어진 골반과 복직근 이개가 고민이었는데, 3개월 산후 케어 프로그램으로 거의 회복됐어요. 전문적이고 세심합니다.', program: 'PT 30회권' },
      { name: '박민지', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2026.02.20', text: '바디라인 프로그램 2개월째인데 허리라인이 확 살아났어요. 필라테스+웨이트 조합이 이렇게 효과적인지 몰랐습니다.', program: 'PT 10회권' },
      { name: '정다은', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2026.01.15', text: '꼼꼼하고 체계적인 수업이에요. 가끔 시간이 부족할 때 아쉽지만, 퀄리티는 최고입니다.', program: 'PT 10회권' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=400&fit=crop',
    ],
  },
}

export const defaultTrainer = trainersData['1']

const categoryBadge: Record<string, string> = {
  pt: 'bg-primary-50 text-primary',
  bareton: 'bg-category-bareton-bg text-category-bareton-text',
  hit35: 'bg-category-hit35-bg text-category-hit35-text',
  gymground: 'bg-category-gymground-bg text-category-gymground-text',
}

export const TrainerDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const data = trainersData[id || ''] || defaultTrainer
  const [reviewSort, setReviewSort] = useState<'latest' | 'high' | 'low'>('latest')
  const [showAllReviews] = useState(false)
  const [selectedDateIdx, setSelectedDateIdx] = useState(0) // 오늘 = index 0

  // 오늘 + 미래 13일 = 14일 (Lesson 페이지와 동일)
  const dayLabels = ['일','월','화','수','목','금','토']
  const scheduleDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      date: d,
      dayName: dayLabels[d.getDay()],
      dayNum: `${d.getMonth() + 1}/${d.getDate()}`,
      isToday: i === 0,
      isSat: d.getDay() === 6,
      isSun: d.getDay() === 0,
    }
  })
  const selectedScheduleDay = scheduleDates[selectedDateIdx]
  const selectedSlots = data.schedule.filter(s => s.day === selectedScheduleDay.dayName)

  const sortedReviews = [...data.reviews].sort((a, b) => {
    if (reviewSort === 'high') return b.rating - a.rating
    if (reviewSort === 'low') return a.rating - b.rating
    return 0
  })
  const displayReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)

  const header = (
    <SubPageHeader
      title={`${data.name} 강사`}
      right={
        <button className="icon-btn">
          <IconShare className="w-5 h-5 stroke-ink stroke-2" />
        </button>
      }
    />
  )

  return (
    <PageLayout header={header} hideBottomNav noPadding className="!pb-0">
      {/* ── 히어로 + 프로필 ── */}
      <div className="relative">
        <div className="relative">
          <img src={data.coverImage} alt={data.name} className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-page pb-3">
            <div className="flex items-center gap-3">
              <img src={data.avatar} alt={data.name} className="w-14 h-14 rounded-full object-cover border-2 border-surface shadow-elevated" />
              <div className="flex items-center gap-2">
                <h1 className="text-display text-white">{data.name}</h1>
                <span className={`px-2 py-0.5 text-caption font-bold rounded ${categoryBadge[data.categoryColor] || categoryBadge.pt}`}>{data.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 핵심 수치 ── */}
      <div className="grid grid-cols-4 gap-3 py-4 px-page">
        {data.stats.map(s => (
          <div key={s.label} className="text-center py-2.5 bg-surface-muted rounded-card">
            <p className="text-title font-bold text-primary">{s.value}</p>
            <p className="text-label text-ink-tertiary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 강사 소개 ── */}
      <section className="py-4 px-page">
        <h3 className="text-heading font-bold text-ink mb-2">강사 소개</h3>
        <p className="text-body text-ink-secondary leading-relaxed mb-3">{data.intro}</p>
        <div className="p-card bg-primary-50 rounded-card border-l-[3px] border-primary">
          <p className="text-body text-ink-secondary leading-relaxed italic">"{data.philosophy}"</p>
        </div>
      </section>

      <div className="h-2 bg-surface-muted" />

      {/* ── 전문 분야 + 역량 ── */}
      <section className="py-4 px-page">
        <h3 className="text-heading font-bold text-ink mb-3">전문 분야</h3>
        <div className="flex gap-3 items-start mb-3">
          <RadarChart stats={data.radar} />
          <div className="flex-1 flex flex-col gap-1.5 pt-1">
            {(Object.keys(data.radar) as (keyof RadarStats)[]).map(key => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-caption text-ink-tertiary w-[42px] flex-shrink-0">{key}</span>
                <div className="flex-1 h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(data.radar[key] / 5) * 100}%` }} />
                </div>
                <span className="text-caption font-bold text-ink w-6 text-right">{data.radar[key]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.specialties.map((sp, i) => (
            <div key={i} className="flex gap-3 p-3 bg-surface-subtle rounded-card">
              <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-label font-bold text-primary">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-body font-bold text-ink mb-0.5">{sp.title}</h4>
                <p className="text-label text-ink-tertiary leading-relaxed">{sp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-2 bg-surface-muted" />

      {/* ── 경력 & 자격 ── */}
      <section className="py-4 px-page">
        <h3 className="text-heading font-bold text-ink mb-2">경력</h3>
        <div className="flex flex-col relative ml-3 mb-4">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
          {data.career.map((c, i) => (
            <div key={i} className="flex items-start gap-3 pb-2.5 relative">
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 -ml-[3.5px] relative z-[1]" />
              <span className="text-body text-ink-secondary">{c}</span>
            </div>
          ))}
        </div>
        <h3 className="text-heading font-bold text-ink mb-2">자격·인증</h3>
        <div className="flex flex-wrap gap-1.5">
          {data.certifications.map((c, i) => (
            <span key={i} className="px-2.5 py-1.5 bg-surface-subtle border border-border-light rounded-lg text-label text-ink-secondary">
              {c}
            </span>
          ))}
        </div>
      </section>

      <div className="h-2 bg-surface-muted" />

      {/* ── 수업 일정 ── */}
      <section className="py-section px-page">
        <h3 className="text-heading font-bold text-ink mb-4">수업 일정</h3>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
          {scheduleDates.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDateIdx(i)}
              className={`flex-shrink-0 w-[52px] py-2 rounded-xl text-center transition-colors ${selectedDateIdx === i ? 'bg-primary text-white' : 'bg-surface-muted text-ink-secondary hover:bg-surface-subtle'}`}
            >
              <span className="text-label block">{d.isToday ? '오늘' : d.dayNum}</span>
              <span className="text-label font-bold block">{d.dayName}</span>
            </button>
          ))}
        </div>
        {selectedSlots.length > 0 ? (
          <div>
            {selectedSlots.map((s, i) => {
              const startTime = s.time.split('~')[0]
              const allLessons = data.lessonIds.map(lid => ({ id: lid, ...lessonsData[lid] })).filter(l => l.name)
              const matchedLesson = allLessons.find(l => l.schedule?.some(sc => sc.day === s.day && sc.time === startTime)) || allLessons[i % allLessons.length]
              return (
                <button
                  key={i}
                  className="w-full flex gap-4 py-4 border-b border-border-light last:border-b-0 hover:bg-surface-subtle transition-colors text-left"
                  onClick={() => navigate(`/group-lesson/${matchedLesson.id}`)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-card overflow-hidden">
                      <img alt={matchedLesson.name} className="w-full h-full object-cover" src={matchedLesson.imageUrl} />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-title text-ink leading-tight">{matchedLesson.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`badge whitespace-nowrap ${matchedLesson.categoryColor === 'pt' ? 'bg-primary-50 text-primary' : matchedLesson.categoryColor === 'bareton' ? 'bg-category-bareton-bg text-category-bareton-text' : matchedLesson.categoryColor === 'hit35' ? 'bg-category-hit35-bg text-category-hit35-text' : 'bg-category-gymground-bg text-category-gymground-text'}`}>{matchedLesson.category}</span>
                        <p className="text-label text-ink-secondary truncate">{matchedLesson.duration} · {matchedLesson.difficulty} · {matchedLesson.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-primary stroke-[1.5] fill-none">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span className="text-body font-medium text-primary">{scheduleDates[selectedDateIdx].isToday ? '오늘' : `${scheduleDates[selectedDateIdx].dayNum}(${scheduleDates[selectedDateIdx].dayName})`} {startTime}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-body text-ink-placeholder">이 날은 수업이 없습니다</p>
          </div>
        )}
      </section>

      <div className="h-2 bg-surface-muted" />

      {/* ── 수강 후기 ── */}
      <div className="px-page py-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading font-bold text-ink">수강 후기</h2>
          <span className="text-label text-ink-tertiary">{data.reviewCount}개</span>
        </div>
        <div className="mb-4">
          <RatingSummary rating={data.rating} reviewCount={data.reviewCount} />
        </div>
        <ReviewSort value={reviewSort} onChange={(v) => setReviewSort(v as 'latest' | 'high' | 'low')} />
        <div className="space-y-4">
          {displayReviews.map((r, i) => (
            <ReviewItem key={i} {...r} />
          ))}
        </div>
        {data.reviews.length > 0 && (
          <button onClick={() => navigate(`/trainer/${id}/reviews`)} className="w-full py-3 mt-4 border border-border rounded-card text-body font-semibold text-ink hover:bg-surface-subtle transition-colors">
            후기 더보기
          </button>
        )}
      </div>

    </PageLayout>
  )
}
