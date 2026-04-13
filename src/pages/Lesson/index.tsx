import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, ScrollRow, TrainerListItem, PTTrainerCard, FilterTabs, EmptyState } from '../../components'
import { IconSearch, IconChevronRight } from '../../components/Icons'
const instructorLessonMap: Record<string, string> = {
  // PT 강사 → PT 레슨
  '최강민': 'pt-kangmin',
  '김태현': 'pt-taehyun',
  '오지훈': 'pt-jihoon',
  '장하은': 'pt-haeun',
  // 그룹 수업 강사
  '박지영': 'lunch-pilates',
  '한동훈': 'bodypump',
  '이수진': 'morning-bareton',
  '김민수': 'spinning',
  '이준혁': 'spinning',
  '정서연': 'pt-seoyeon',
  '송미래': 'morning-bareton',
  '윤서준': 'hiit',
  '임도현': 'spinning',
  '배수아': 'bareton',
  '권재민': 'bodypump',
  '신예린': 'morning-bareton',
  '조현우': 'hiit',
  '문채원': 'lunch-pilates',
  '류건호': 'spinning',
  '홍서윤': 'bareton',
}

const filterTabs = [
  { id: 'pt', label: 'PT' },
  { id: 'group-pt', label: '그룹 PT' },
  { id: 'bareton', label: '바레톤' },
  { id: 'gymground', label: '짐그라운드' },
  { id: 'hit35', label: '히트35' },
]

const categoryDescriptions: Record<string, { title: string; desc: string; icon: string }> = {
  pt: { title: '1:1 퍼스널 트레이닝', desc: '전문 트레이너와 함께하는 맞춤형 1:1 운동 프로그램. 체형 분석부터 식단 관리까지 개인 목표에 최적화된 트레이닝을 제공합니다.', icon: '💪' },
  'group-pt': { title: '소규모 그룹 트레이닝', desc: '2~6명의 소그룹으로 진행되는 서킷 트레이닝. 1:1보다 합리적인 가격으로 전문 지도를 받으며 함께 운동하는 에너지를 느껴보세요.', icon: '👥' },
  bareton: { title: '발레 + 필라테스 퓨전', desc: '발레 동작과 필라테스를 결합한 바디 컨디셔닝 프로그램. 코어 강화, 유연성 향상, 체형 교정에 효과적입니다.', icon: '🩰' },
  gymground: { title: '전신 기능성 트레이닝', desc: '다양한 기구와 맨몸 운동을 활용한 전신 서킷 프로그램. 근력, 심폐지구력, 민첩성을 동시에 향상시킵니다.', icon: '🏋️' },
  hit35: { title: '35분 고강도 인터벌', desc: '35분간 집중적으로 진행되는 HIIT 프로그램. 짧은 시간 안에 최대 칼로리를 소모하며 심폐 기능을 끌어올립니다.', icon: '⚡' },
}

const myLessons = [
  { id: 1, status: '이용중', trainer: '최강민 강사', remain: '8회 남음', variant: 'primary' },
  { id: 2, status: '이용중', trainer: '박지영 강사', remain: '3회 남음', variant: 'secondary' },
  { id: 3, status: '대기중', trainer: '정서연 강사', remain: '10회권', variant: 'waiting' },
]

interface LessonScheduleItem {
  time: string; name: string; instructor: string; avatar: string; category: string
  categoryColor: 'bareton' | 'hit35' | 'gymground' | 'pt' | 'group-pt'; hasTicket?: boolean
}

const lessonSchedule: Record<string, LessonScheduleItem[]> = {
  '월': [
    { time: '06:30', name: '얼리버드 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '07:00', name: '모닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '08:00', name: 'HIIT 부스터', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '09:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '10:00', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '10:30', name: '플로우 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '11:00', name: '전신 서킷 A', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '12:00', name: '점심 PT 익스프레스', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '13:00', name: '그룹 PT 코어', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '14:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:00', name: '짐그라운드 파워', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '16:00', name: '다이어트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:00', name: '히트35 타바타', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '18:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '19:00', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '19:30', name: 'HIIT 다이어트 PT', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '20:00', name: '전신 서킷', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '20:30', name: '나이트 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '21:00', name: '릴렉스 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '14:30', name: '체형교정 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '08:30', name: '플로우 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '16:30', name: '이브닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '10:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '15:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '13:30', name: '런치 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '17:30', name: '이브닝 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '11:30', name: '그룹 PT 파워', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '16:30', name: '그룹 PT 코어플러스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '13:30', name: '런치 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '18:30', name: '이브닝 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '14:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '17:30', name: '짐그라운드 코어', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '08:30', name: '모닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '16:30', name: '이브닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '15:30', name: '그룹 PT 파워', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '18:30', name: '그룹 PT 스트렝스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '11:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '17:30', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:30', name: '짐그라운드 스태미나', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '11:30', name: '체형교정 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '20:00', name: '나이트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '13:30', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '19:30', name: '히트35 파이널', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '09:30', name: '히트35 부스터', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '14:30', name: '히트35 스태미나', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '11:30', name: '그룹 PT 서킷플러스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '15:30', name: '그룹 PT 엔듀런스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '11:30', name: '코어 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '13:30', name: '플로우 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '17:30', name: '파워 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
  ],
  '화': [
    { time: '06:30', name: '모닝 HIIT', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '07:00', name: '얼리버드 바레톤', instructor: '신예린', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '08:00', name: '1:1 체형분석 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '09:00', name: '짐그라운드 펀치', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '10:00', name: '다이어트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '10:30', name: '그룹 PT 스트렝스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '11:00', name: 'HIIT 다이어트 PT', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '12:00', name: '런치 바레톤', instructor: '문채원', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '13:00', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '14:00', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '15:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '16:00', name: '전신 서킷 B', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '17:00', name: '플로우 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '18:00', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '19:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '19:30', name: '바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '20:00', name: '짐그라운드 엔듀런스', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '21:00', name: '나이트 PT 슬림', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '16:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '13:30', name: '얼리버드 바레톤', instructor: '신예린', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '18:30', name: '이브닝 바레톤', instructor: '신예린', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '13:30', name: '런치 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:30', name: '이브닝 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '14:30', name: '짐그라운드 코어', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '18:30', name: '짐그라운드 스태미나', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '13:30', name: '체형교정 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '20:30', name: '나이트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '14:30', name: '그룹 PT 파워', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '17:30', name: '그룹 PT 코어플러스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '08:30', name: '그룹 PT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '15:30', name: '그룹 PT 엔듀런스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '09:30', name: '플로우 바레톤', instructor: '문채원', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:30', name: '코어 바레톤', instructor: '문채원', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '08:30', name: '모닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:30', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '16:30', name: '히트35 파이널', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '11:30', name: '런치 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '20:30', name: '나이트 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: '짐그라운드 파워', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '14:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '09:30', name: '코어 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '이브닝 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:30', name: '그룹 PT 파워', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '16:30', name: '그룹 PT 코어플러스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '10:30', name: '히트35 부스터', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '15:30', name: '히트35 스태미나', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '08:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '파워 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '11:30', name: '짐그라운드 코어', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '15:30', name: '짐그라운드 스태미나', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '08:30', name: '모닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '16:30', name: '이브닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
  ],
  '수': [
    { time: '06:30', name: '얼리버드 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '07:00', name: '모닝 짐그라운드', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '08:00', name: '바레톤 스트레칭', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '10:00', name: '그룹 PT 코어', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '10:30', name: '모닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '11:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '12:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '13:00', name: '히트35 타바타', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '14:00', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '15:00', name: '짐그라운드 파워', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:00', name: '다이어트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:00', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '18:00', name: '전신 서킷 A', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '19:00', name: 'HIIT 부스터', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '19:30', name: 'HIIT 다이어트 PT', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '20:00', name: '전신 서킷', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '21:00', name: '릴렉스 바레톤', instructor: '신예린', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:30', name: '이브닝 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '09:30', name: '짐그라운드 코어', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '14:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '13:30', name: '파워 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '17:30', name: '이브닝 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '11:30', name: '히트35 부스터', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '15:30', name: '히트35 스태미나', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '13:30', name: '그룹 PT 파워', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '17:30', name: '그룹 PT 코어플러스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '08:30', name: '플로우 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:30', name: '이브닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '09:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '파워 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '08:30', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '15:30', name: '히트35 파이널', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '08:30', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '17:30', name: '그룹 PT 엔듀런스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '09:30', name: '짐그라운드 파워', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '17:30', name: '짐그라운드 스태미나', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '08:30', name: '체형교정 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '20:30', name: '나이트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: '모닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '14:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '11:30', name: '짐그라운드 코어', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '08:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '14:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '08:30', name: '그룹 PT 서킷플러스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '14:30', name: '그룹 PT 엔듀런스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '20:30', name: '나이트 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: '플로우 바레톤', instructor: '신예린', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:30', name: '코어 바레톤', instructor: '신예린', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
  ],
  '목': [
    { time: '06:30', name: '모닝 HIIT', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '07:00', name: '얼리버드 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '08:00', name: '짐그라운드 펀치', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '09:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '10:00', name: '다이어트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '10:30', name: '플로우 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '11:00', name: '그룹 PT 스트렝스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '12:00', name: '점심 PT 익스프레스', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '13:00', name: '바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '14:00', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '15:00', name: '전신 서킷 B', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:00', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '17:00', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '18:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '19:00', name: 'HIIT 다이어트 PT', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '20:00', name: '나이트 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '20:30', name: '짐그라운드 엔듀런스', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '21:00', name: '런치 바레톤', instructor: '문채원', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '09:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '15:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '13:30', name: '파워 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '17:30', name: '이브닝 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '11:30', name: '짐그라운드 코어', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '15:30', name: '짐그라운드 스태미나', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:30', name: '이브닝 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '08:30', name: '체형교정 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '15:30', name: '나이트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: '코어 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '이브닝 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '13:30', name: '그룹 PT 파워', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '16:30', name: '그룹 PT 코어플러스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '08:30', name: '모닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '16:30', name: '이브닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '09:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '파워 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '08:30', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '16:30', name: '히트35 파이널', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '09:30', name: '짐그라운드 파워', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '17:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '09:30', name: '모닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '17:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:30', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '16:30', name: '그룹 PT 엔듀런스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '09:30', name: '히트35 부스터', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '15:30', name: '히트35 스태미나', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '08:30', name: '그룹 PT 서킷플러스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '13:30', name: '그룹 PT 엔듀런스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:30', name: '이브닝 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '09:30', name: '짐그라운드 코어', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:30', name: '짐그라운드 스태미나', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '09:30', name: '플로우 바레톤', instructor: '문채원', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:30', name: '코어 바레톤', instructor: '문채원', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
  ],
  '금': [
    { time: '06:30', name: '얼리버드 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '07:00', name: '모닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '08:00', name: '짐그라운드 파워', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '09:00', name: '히트35 타바타', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '10:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '10:30', name: '그룹 PT 코어', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '11:00', name: '플로우 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '12:00', name: '점심 PT 익스프레스', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '13:00', name: '전신 서킷 A', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '14:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:00', name: 'HIIT 부스터', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '16:00', name: '다이어트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:00', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '18:00', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '19:00', name: '짐그라운드 펀치', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '19:30', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '20:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '21:00', name: '릴렉스 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '17:30', name: '이브닝 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '08:30', name: '플로우 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '13:30', name: '이브닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '09:30', name: '짐그라운드 코어', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '14:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '08:30', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '14:30', name: '히트35 파이널', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '11:30', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: '그룹 PT 파워', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '14:30', name: '그룹 PT 코어플러스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '09:30', name: '코어 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '이브닝 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '08:30', name: '모닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '15:30', name: '이브닝 PT', instructor: '장하은', avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '11:30', name: '짐그라운드 코어', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:30', name: '짐그라운드 스태미나', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '09:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '파워 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '17:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '08:30', name: '체형교정 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '20:30', name: '나이트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '09:30', name: '모닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '09:30', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '15:30', name: '그룹 PT 엔듀런스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '09:30', name: '짐그라운드 파워', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '15:30', name: '짐그라운드 스태미나', instructor: '임도현', avatar: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '09:30', name: '히트35 부스터', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '14:30', name: '히트35 스태미나', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '13:30', name: '파워 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '17:30', name: '플로우 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
  ],
  '토': [
    { time: '08:00', name: '모닝 HIIT', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '09:00', name: '얼리버드 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '09:30', name: '모닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '10:00', name: '전신 서킷', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '10:30', name: '그룹 PT 스트렝스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '11:00', name: 'HIIT 다이어트 PT', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '11:30', name: '바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '12:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '13:00', name: '히트35 타바타', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '14:00', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '14:30', name: '짐그라운드 엔듀런스', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '15:00', name: '다이어트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '16:00', name: '플로우 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '17:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '10:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '15:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '16:30', name: '이브닝 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '13:30', name: '플로우 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '이브닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '13:30', name: '짐그라운드 코어', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:30', name: '짐그라운드 스태미나', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '13:30', name: '그룹 PT 파워', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '15:30', name: '그룹 PT 코어플러스', instructor: '권재민', avatar: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '08:30', name: '그룹 PT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '14:30', name: '그룹 PT 엔듀런스', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '10:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '파워 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '10:30', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '16:30', name: '이브닝 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '10:30', name: '히트35 서킷', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '15:30', name: '히트35 파이널', instructor: '조현우', avatar: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '10:30', name: '모닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '10:30', name: '짐그라운드 파워', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '10:30', name: '체형교정 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '16:30', name: '나이트 PT', instructor: '김태현', avatar: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '10:30', name: '코어 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:30', name: '이브닝 바레톤', instructor: '배수아', avatar: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '10:30', name: '히트35 부스터', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '14:30', name: '히트35 스태미나', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
  ],
  '일': [
    { time: '09:00', name: '모닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '10:00', name: '얼리버드 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '10:30', name: '짐그라운드 파워', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '11:00', name: '1:1 웨이트 트레이닝', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '11:30', name: '코어 강화 PT', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '12:00', name: '그룹 PT 서킷', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '13:00', name: 'HIIT 부스터', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '14:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:00', name: '전신 서킷 B', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '16:00', name: '릴렉스 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '08:30', name: '플로우 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '15:30', name: '이브닝 바레톤', instructor: '송미래', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '16:30', name: '이브닝 PT', instructor: '오지훈', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '13:30', name: '짐그라운드 코어', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:30', name: '짐그라운드 스태미나', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '13:30', name: '런치 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: true },
    { time: '17:30', name: '이브닝 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: 'PT', categoryColor: 'pt', hasTicket: false },
    { time: '08:30', name: '코어 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '15:30', name: '이브닝 바레톤', instructor: '정서연', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '08:30', name: '그룹 PT 파워', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: false },
    { time: '15:30', name: '그룹 PT 엔듀런스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', category: '그룹 PT', categoryColor: 'group-pt', hasTicket: true },
    { time: '08:30', name: 'HIIT 서킷', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: true },
    { time: '15:30', name: '히트35 파워', instructor: '윤서준', avatar: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200&h=200&fit=crop', category: '히트35', categoryColor: 'hit35', hasTicket: false },
    { time: '08:30', name: '코어 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
    { time: '16:30', name: '파워 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '08:30', name: '짐그라운드 파워', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: true },
    { time: '16:30', name: '짐그라운드 스태미나', instructor: '류건호', avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop', category: '짐그라운드', categoryColor: 'gymground', hasTicket: false },
    { time: '13:30', name: '파워 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: true },
    { time: '17:30', name: '플로우 바레톤', instructor: '홍서윤', avatar: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop', category: '바레톤', categoryColor: 'bareton', hasTicket: false },
  ],
}

const trainerRatings: Record<string, { rating: number; reviews: number }> = {
  '최강민': { rating: 4.9, reviews: 128 },
  '박지영': { rating: 4.8, reviews: 95 },
  '한동훈': { rating: 4.7, reviews: 82 },
  '정서연': { rating: 4.8, reviews: 67 },
  '이준혁': { rating: 4.6, reviews: 54 },
  '김태현': { rating: 4.5, reviews: 43 },
  '오지훈': { rating: 4.7, reviews: 61 },
  '송미래': { rating: 4.9, reviews: 73 },
  '윤서준': { rating: 4.6, reviews: 38 },
  '장하은': { rating: 4.4, reviews: 29 },
  '임도현': { rating: 4.5, reviews: 35 },
  '배수아': { rating: 4.7, reviews: 52 },
  '권재민': { rating: 4.6, reviews: 47 },
  '신예린': { rating: 4.8, reviews: 41 },
  '조현우': { rating: 4.5, reviews: 33 },
  '문채원': { rating: 4.7, reviews: 56 },
  '류건호': { rating: 4.4, reviews: 27 },
  '홍서윤': { rating: 4.6, reviews: 44 },
  '김민수': { rating: 4.5, reviews: 36 },
  '이수진': { rating: 4.7, reviews: 48 },
}

const dayNames = ['일', '월', '화', '수', '목', '금', '토']

function getLessonScheduleDays() {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dayKey = dayNames[d.getDay()]
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    days.push({ dayKey, label, isToday: i === 0 })
  }
  return days
}

export const LessonPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pt')
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const scheduleDays = getLessonScheduleDays()
  const selectedDay = scheduleDays[selectedDateIdx].dayKey

  const header = (
    <SubPageHeader
      title="레슨권"
      showChat
      right={
        <button className="icon-btn">
          <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
        </button>
      }
    >
      <FilterTabs
        tabs={filterTabs.map(t => ({ key: t.id, label: t.label }))}
        active={activeTab}
        onSelect={setActiveTab}
        scrollable
        className="border-t border-border-light"
      />
    </SubPageHeader>
  )

  return (
    <PageLayout header={header}>
      {/* Category Description */}
      {categoryDescriptions[activeTab] && (
        <div className="flex items-start gap-3 p-card-lg bg-surface-muted rounded-card mb-section">
          <span className="text-heading flex-shrink-0">{categoryDescriptions[activeTab].icon}</span>
          <div>
            <p className="text-body font-bold text-ink mb-0.5">{categoryDescriptions[activeTab].title}</p>
            <p className="text-caption text-ink-secondary leading-relaxed">{categoryDescriptions[activeTab].desc}</p>
          </div>
        </div>
      )}

      {/* My Lessons Banner */}
      <ScrollRow className="mb-section">
        {myLessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`min-w-[280px] flex-shrink-0 flex justify-between items-center p-3.5 rounded-card cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-elevated ${
              lesson.variant === 'waiting'
                ? 'bg-surface border-2 border-ink-disabled'
                : lesson.variant === 'secondary'
                ? 'bg-ink-secondary'
                : 'bg-ink'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`badge ${
                lesson.variant === 'waiting' ? 'bg-ink-placeholder text-white' : 'bg-primary text-white'
              }`}>
                {lesson.status}
              </span>
              <span className={lesson.variant === 'waiting' ? 'text-ink text-body font-semibold' : 'text-white text-body font-semibold'}>
                {lesson.trainer}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={lesson.variant === 'waiting' ? 'text-ink-secondary text-body font-semibold' : 'text-primary text-body font-semibold'}>
                {lesson.remain}
              </span>
              <IconChevronRight className="w-4 h-4 stroke-ink-placeholder stroke-[1.5]" />
            </div>
          </div>
        ))}
      </ScrollRow>

      <div className="h-2 bg-surface-muted -mx-page" />

      {/* Lesson Schedule */}
      <section className="py-section">
        <h3 className="text-heading font-bold text-ink mb-4">강사 목록</h3>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
          {scheduleDays.map((d, i) => (
            <button key={i} onClick={() => setSelectedDateIdx(i)} className={`flex-shrink-0 w-[52px] py-2 rounded-xl text-center transition-colors ${selectedDateIdx === i ? 'bg-primary text-white' : 'bg-surface-muted text-ink-secondary hover:bg-surface-subtle'}`}>
              <span className="text-label block">{d.isToday ? '오늘' : d.label}</span>
              <span className="text-label font-bold block">{d.dayKey}</span>
            </button>
          ))}
        </div>
        <div>
          {(() => {
            const filtered = (lessonSchedule[selectedDay] || []).filter(s => s.categoryColor === activeTab)
            if (filtered.length === 0) {
              return <EmptyState message={`${scheduleDays[selectedDateIdx].isToday ? '오늘은' : scheduleDays[selectedDateIdx].label + '(' + selectedDay + ')은'} 레슨이 없습니다`} />
            }
            const dateLabel = scheduleDays[selectedDateIdx].isToday ? '오늘' : scheduleDays[selectedDateIdx].label + '(' + selectedDay + ')'
            // 강사별 그룹핑
            const grouped: { instructor: string; items: typeof filtered }[] = []
            for (const s of filtered) {
              const existing = grouped.find(g => g.instructor === s.instructor)
              if (existing) existing.items.push(s)
              else grouped.push({ instructor: s.instructor, items: [s] })
            }
            if (activeTab === 'pt') {
              return (
                <div className="grid grid-cols-2 gap-3">
                  {grouped.map((g, i) => {
                    const first = g.items[0]
                    const times = g.items.map(s => s.time).join(', ')
                    const hasAnyTicket = g.items.some(s => s.hasTicket)
                    return (
                      <PTTrainerCard
                        key={i}
                        fluid
                        imageUrl={first.avatar}
                        name={`${g.instructor} 강사`}
                        category="PT"
                        categoryColor="pt"
                        description={first.name}
                        todayTime={`${dateLabel} ${times}`}
                        rating={trainerRatings[g.instructor]?.rating || 4.5}
                        reviewCount={trainerRatings[g.instructor]?.reviews || 30}
                        action={hasAnyTicket
                          ? <span onClick={(e) => { e.stopPropagation(); navigate(`/reservation?trainer=${encodeURIComponent(g.instructor + ' 강사')}&lesson=${encodeURIComponent(first.category)}&time=${encodeURIComponent(g.items[0].time)}`) }} className="w-full block text-center px-3 py-1.5 bg-primary text-white text-label font-bold rounded-lg cursor-pointer">예약</span>
                          : <span onClick={(e) => { e.stopPropagation(); navigate('/gym/gym1/products') }} className="w-full block text-center px-3 py-1.5 border border-primary text-primary text-label font-bold rounded-lg cursor-pointer">구매</span>
                        }
                        onClick={() => navigate(`/group-lesson/${instructorLessonMap[g.instructor] || 'morning-bareton'}`)}
                      />
                    )
                  })}
                </div>
              )
            }
            return grouped.map((g, i) => {
              const first = g.items[0]
              const times = g.items.map(s => s.time).join(', ')
              const hasAnyTicket = g.items.some(s => s.hasTicket)
              return (
                <TrainerListItem
                  key={i}
                  imageUrl={first.avatar}
                  name={`${g.instructor} 강사`}
                  category={first.category}
                  categoryColor={first.categoryColor}
                  description={first.name}
                  todayTime={`${dateLabel} ${times}`}
                  rating={trainerRatings[g.instructor]?.rating || 4.5}
                  reviewCount={trainerRatings[g.instructor]?.reviews || 30}
                  rightAction={hasAnyTicket
                    ? <span onClick={(e) => { e.stopPropagation(); navigate(`/reservation?trainer=${encodeURIComponent(g.instructor + ' 강사')}&lesson=${encodeURIComponent(first.category)}&time=${encodeURIComponent(g.items[0].time)}`) }} className="px-3 py-1 bg-primary text-white text-label font-bold rounded-lg cursor-pointer">예약</span>
                    : <span onClick={(e) => { e.stopPropagation(); navigate('/gym/gym1/products') }} className="px-3 py-1 border border-primary text-primary text-label font-bold rounded-lg cursor-pointer">구매</span>
                  }
                  onClick={() => navigate(`/group-lesson/${instructorLessonMap[g.instructor] || 'morning-bareton'}`)}
                />
              )
            })
          })()}
        </div>
      </section>
    </PageLayout>
  )
}
