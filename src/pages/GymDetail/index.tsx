import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, RatingSummary, ReviewItem, ReviewSort, BottomCTA, Badge, InfoRow, EmptyState, FeedCard, TrainerListItem, PlanCard, PTTrainerCard } from '../../components'
import { IconShare, IconClock, IconMapPin } from '../../components/Icons'
import { baItems } from './BeforeAfter'
import { lessonIdMap } from '../GroupLessonDetail'

/* ── types ── */
interface Facility { icon: string; label: string }
interface PricePlan { name: string; duration: string; price: string; original?: string; tag?: string; installment?: string }
interface ReviewData { name: string; avatar: string; rating: number; date: string; text: string; photos?: string[]; membershipType?: string }
interface GymPhoto { url: string; label: string; type?: 'image' | 'video'; videoUrl?: string }
interface Trainer { id: number; name: string; avatar: string; specialty: string; rating: number; reviewCount: number; perSession: string }
interface ScheduleItem { time: string; name: string; instructor: string; avatar: string; category: string; categoryColor: 'bareton' | 'hit35' | 'gymground' | 'pt'; hasTicket?: boolean }
type WeekSchedule = Record<string, ScheduleItem[]>
interface Coupon { label: string; discount: string; condition: string }
interface PTplan { sessions: string; pricePerSession: string; totalPrice: string; tag?: string }
interface Notice { date: string; title: string; isNew?: boolean }
interface CongestionLevel { time: string; level: number }

interface GymInfo {
  name: string
  address: string
  lat: number
  lng: number
  phone: string
  hours: string
  hoursDetail: { day: string; time: string }[]
  rating: number
  reviewCount: number
  heroImages: GymPhoto[]
  galleryImages: GymPhoto[]
  description: string
  facilities: Facility[]
  plans: PricePlan[]
  ptPlans: PTplan[]
  reviews: ReviewData[]
  tags: string[]
  badge?: string
  badgeType?: string
  trainers: Trainer[]
  schedule: WeekSchedule
  coupons: Coupon[]
  nearbyGyms: { id: string; name: string; distance: string; price: string }[]
  notices: Notice[]
  congestion: CongestionLevel[]
  usageGuide: string[]
  refundPolicy: string[]
}

/* ── data (gym1 full, others abbreviated) ── */
export const gymsData: Record<string, GymInfo> = {
  gym1: {
    name: '바디채널 강남점',
    address: '서울 강남구 테헤란로 123 4층',
    lat: 37.4980, lng: 127.0276,
    phone: '02-1234-5678',
    hours: '06:00 - 24:00',
    hoursDetail: [
      { day: '평일', time: '06:00 - 24:00' },
      { day: '토요일', time: '08:00 - 22:00' },
      { day: '일요일·공휴일', time: '09:00 - 20:00' },
    ],
    rating: 4.8, reviewCount: 412,
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '메인' },
      { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=450&fit=crop', label: '웨이트존' },
      { url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop', label: '카디오존' },
    ],
    galleryImages: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', label: '메인' },
      { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=400&fit=crop', label: '웨이트존' },
      { url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop', label: '카디오존', type: 'video' as const, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=400&fit=crop', label: '러닝머신' },
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop', label: '스트레칭존' },
      { url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&fit=crop', label: 'GX룸', type: 'video' as const, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
      { url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=400&fit=crop', label: '샤워실' },
      { url: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=400&h=400&fit=crop', label: '락커룸' },
    ],
    description: '강남역 3번 출구 도보 2분 거리에 위치한 프리미엄 피트니스 센터입니다. 최신 장비와 넓은 운동 공간, 전문 트레이너가 함께합니다.',
    tags: ['24시간', '주차가능', '샤워실'], badge: 'BEST',
    facilities: [
      { icon: '🏋️', label: '프리웨이트' }, { icon: '🚿', label: '샤워실' },
      { icon: '🅿️', label: '주차장' }, { icon: '🧖', label: '사우나' },
      { icon: '👕', label: '운동복 대여' }, { icon: '🔒', label: '개인 락커' },
      { icon: '📶', label: 'Wi-Fi' }, { icon: '💪', label: 'GX룸' },
    ],
    trainers: [
      { id: 1, name: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', specialty: 'PT · 체형교정', rating: 4.9, reviewCount: 127, perSession: '70,000' },
      { id: 2, name: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', specialty: 'PT · 다이어트', rating: 4.8, reviewCount: 89, perSession: '60,000' },
      { id: 3, name: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', specialty: '바레톤', rating: 4.7, reviewCount: 64, perSession: '65,000' },
    ],
    schedule: {
      '월': [
        { time: '07:00', name: '모닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '09:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '10:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '12:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '13:00', name: '이브닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '14:00', name: 'HIIT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: true },
        { time: '15:00', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '16:00', name: '플로우 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '17:00', name: '스피닝', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '18:30', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '19:00', name: '나이트 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '19:30', name: '타바타', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '20:00', name: '짐그라운드 서킷', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '20:30', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '21:00', name: '짐그라운드 파워', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
      ],
      '화': [
        { time: '07:00', name: '모닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '09:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '10:00', name: 'HIIT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '11:00', name: '스피닝', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '12:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '13:00', name: '플로우 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '14:00', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '15:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: true },
        { time: '16:00', name: '짐그라운드 코어', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '17:00', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '18:30', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '19:00', name: '나이트 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '19:30', name: '타바타', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '20:00', name: '짐그라운드 서킷', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '20:30', name: '나이트 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
      ],
      '수': [
        { time: '07:00', name: '모닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '09:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '10:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '11:00', name: '스피닝', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '12:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '13:00', name: '플로우 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '14:00', name: 'HIIT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: true },
        { time: '15:00', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '16:00', name: '짐그라운드 파워', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '17:00', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '18:30', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '19:00', name: '나이트 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '19:30', name: '타바타', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '20:00', name: '짐그라운드 서킷', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '20:30', name: '나이트 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
      ],
      '목': [
        { time: '07:00', name: '모닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '09:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '10:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '11:00', name: '스피닝', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '12:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '13:00', name: '플로우 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '14:00', name: 'HIIT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: true },
        { time: '15:00', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '16:00', name: '짐그라운드 코어', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '17:00', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '18:30', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '19:00', name: '나이트 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '19:30', name: '타바타', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '20:00', name: '짐그라운드 서킷', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '20:30', name: '나이트 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
      ],
      '금': [
        { time: '07:00', name: '모닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '09:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '10:00', name: 'HIIT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '11:00', name: '스피닝', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '12:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '13:00', name: '플로우 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '14:00', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: true },
        { time: '15:00', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '16:00', name: '짐그라운드 파워', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '17:00', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '18:30', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '19:00', name: '나이트 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '19:30', name: '타바타', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '20:00', name: '짐그라운드 서킷', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '20:30', name: '나이트 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
      ],
      '토': [
        { time: '10:00', name: '주말 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '11:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '12:00', name: 'HIIT 서킷', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '13:00', name: '플로우 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '14:00', name: '바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '14:30', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '15:00', name: '짐그라운드 파워', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '15:30', name: '타바타', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: true },
        { time: '16:00', name: '이브닝 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '16:30', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '17:00', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '17:30', name: '바디펌프', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false },
        { time: '18:00', name: '스피닝', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '18:30', name: '나이트 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '19:00', name: '짐그라운드 서킷', instructor: '김민수', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false },
      ],
      '일': [
        { time: '10:00', name: '주말 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '11:00', name: '1:1 웨이트', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '12:00', name: '플로우 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: true },
        { time: '13:00', name: '점심 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: true },
        { time: '14:00', name: '체형교정 PT', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: false },
        { time: '14:30', name: '나이트 바레톤', instructor: '이수진', avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'gymground' as const, hasTicket: false },
        { time: '15:00', name: '이브닝 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
        { time: '16:00', name: 'HIIT 클래스', instructor: '최강민', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face', category: 'PT', categoryColor: 'pt' as const, hasTicket: true },
        { time: '16:30', name: '나이트 바레톤', instructor: '박지영', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', category: '바레톤', categoryColor: 'bareton' as const, hasTicket: false },
      ],
    },
    coupons: [
      { label: '신규 가입', discount: '첫 달 80% OFF', condition: '첫 결제 시' },
      { label: '친구 추천', discount: '1개월 무료', condition: '추천인과 함께 등록 시' },
    ],
    plans: [
      { name: '월 구독권', duration: '월 자동결제', price: '79,000' },
      { name: '3개월권', duration: '3개월', price: '249,000', original: '297,000', tag: '16% OFF', installment: '월 83,000원 (3개월 무이자)' },
      { name: '6개월권', duration: '6개월', price: '449,000', original: '594,000', tag: '24% OFF', installment: '월 74,833원 (6개월 무이자)' },
      { name: '12개월권', duration: '12개월', price: '790,000', original: '1,188,000', tag: '33% OFF', installment: '월 65,833원 (12개월 무이자)' },
    ],
    ptPlans: [
      { sessions: '1회 체험', pricePerSession: '50,000', totalPrice: '50,000', tag: '체험특가' },
      { sessions: '10회', pricePerSession: '70,000', totalPrice: '700,000' },
      { sessions: '20회', pricePerSession: '65,000', totalPrice: '1,300,000', tag: '5만원 할인' },
      { sessions: '30회', pricePerSession: '60,000', totalPrice: '1,800,000', tag: '인기' },
    ],
    reviews: [
      { name: '헬스왕', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.20', text: '시설이 깔끔하고 장비가 최신이라 좋습니다. 특히 프리웨이트 구역이 넓어서 쾌적해요.', photos: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&h=200&fit=crop'], membershipType: '12개월권' },
      { name: '운동초보', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.05', text: '트레이너분들이 친절하고 운동 방법 잘 알려주세요. 초보자한테 추천합니다!', membershipType: 'PT 20회' },
      { name: '직장인B', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 4, date: '2025.11.18', text: '24시간이라 퇴근 후 늦게 가도 운동할 수 있어서 최고입니다.', photos: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop'], membershipType: '6개월권' },
    ],
    nearbyGyms: [
      { id: 'gym2', name: '바디채널 역삼점', distance: '1.2km', price: '79,000' },
      { id: 'gym5', name: '바디채널 선릉점', distance: '1.8km', price: '89,000' },
    ],
    notices: [
      { date: '2025.12.28', title: '연말 특별 이벤트 - 신규 가입 80% 할인', isNew: true },
      { date: '2025.12.20', title: '크리스마스 휴무 안내 (12/25 10:00-18:00 운영)' },
      { date: '2025.12.15', title: 'GX 프로그램 시간표 변경 안내' },
    ],
    congestion: [
      { time: '06', level: 2 }, { time: '07', level: 3 }, { time: '08', level: 5 },
      { time: '09', level: 4 }, { time: '10', level: 3 }, { time: '11', level: 2 },
      { time: '12', level: 4 }, { time: '13', level: 3 }, { time: '14', level: 2 },
      { time: '15', level: 2 }, { time: '16', level: 3 }, { time: '17', level: 4 },
      { time: '18', level: 7 }, { time: '19', level: 9 }, { time: '20', level: 8 },
      { time: '21', level: 6 }, { time: '22', level: 4 }, { time: '23', level: 2 },
    ],
    usageGuide: [
      '운동복 및 실내화를 착용해주세요 (운동복 대여 가능)',
      '개인 물병을 지참해주세요 (정수기 이용 가능)',
      '기구 사용 후 소독 타월로 닦아주세요',
      '무인 운영 시간(22:00-06:00)에는 QR코드로 입장해주세요',
      '주차는 2시간 무료이며, 추가 시 시간당 1,000원입니다',
      '락커 이용은 당일 반납이 원칙이며, 월정액 락커는 별도 문의바랍니다',
    ],
    refundPolicy: [
      '이용 시작 전: 전액 환불',
      '이용 시작 후 1/3 경과 전: 이용일수 차감 후 2/3 환불',
      '이용 시작 후 1/2 경과 전: 이용일수 차감 후 1/2 환불',
      '이용 시작 후 1/2 경과 후: 환불 불가',
      'PT 회원권: 잔여 횟수 기준 환불 (위약금 10%)',
    ],
  },
  gym2: {
    name: '바디채널 역삼점', address: '서울 강남구 역삼로 789 2층', lat: 37.5007, lng: 127.0365, phone: '02-2345-6789', hours: '05:00 - 23:00',
    hoursDetail: [{ day: '평일', time: '05:00 - 23:00' }, { day: '주말', time: '07:00 - 21:00' }],
    rating: 4.6, reviewCount: 287,
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=450&fit=crop', label: '메인' },
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '머신존' },
    ],
    galleryImages: [],
    description: '역삼역 1번 출구 바로 앞, 접근성이 뛰어난 피트니스 센터입니다.', tags: ['24시간', 'PT', 'GX'], badge: '50% OFF', badgeType: 'sale',
    facilities: [{ icon: '🏋️', label: '프리웨이트' }, { icon: '🚿', label: '샤워실' }, { icon: '💪', label: 'GX룸' }, { icon: '🧘', label: '바레톤룸' }],
    trainers: [
      { id: 2, name: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', specialty: 'PT · HIIT', rating: 4.9, reviewCount: 93, perSession: '65,000' },
    ],
    schedule: { '월': [{ time: '10:00', name: 'GX 바디컴뱃', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false }], '수': [{ time: '10:00', name: 'GX 바디컴뱃', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false }], '금': [{ time: '10:00', name: 'GX 바디컴뱃', instructor: '한동훈', avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop&crop=face', category: '히트35', categoryColor: 'hit35' as const, hasTicket: false }] },
    coupons: [{ label: '반값 이벤트', discount: '첫 달 50% OFF', condition: '이번 달 한정' }],
    plans: [
      { name: '첫결제 특가', duration: '1개월', price: '9,900', original: '79,000', tag: '87% OFF' },
      { name: '월 회원권', duration: '1개월', price: '79,000' },
      { name: '3개월권', duration: '3개월', price: '199,000', original: '237,000', tag: '16% OFF' },
    ],
    ptPlans: [],
    reviews: [
      { name: 'PT러버', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.15', text: 'PT 프로그램이 체계적이에요.' },
    ],
    nearbyGyms: [{ id: 'gym1', name: '바디채널 강남점', distance: '1.2km', price: '99,000' }],
    notices: [],
    congestion: [
      { time: '05', level: 1 }, { time: '06', level: 2 }, { time: '07', level: 4 },
      { time: '08', level: 6 }, { time: '09', level: 5 }, { time: '10', level: 3 },
      { time: '11', level: 2 }, { time: '12', level: 5 }, { time: '13', level: 4 },
      { time: '14', level: 3 }, { time: '15', level: 2 }, { time: '16', level: 3 },
      { time: '17', level: 5 }, { time: '18', level: 8 }, { time: '19', level: 9 },
      { time: '20', level: 7 }, { time: '21', level: 5 }, { time: '22', level: 3 },
    ],
    usageGuide: [
      '운동복 및 실내화를 착용해주세요',
      '개인 물병을 지참해주세요 (정수기 이용 가능)',
      '기구 사용 후 소독 타월로 닦아주세요',
      '주차는 1시간 무료이며, 추가 시 시간당 1,000원입니다',
    ],
    refundPolicy: [
      '이용 시작 전: 전액 환불',
      '이용 시작 후 1/3 경과 전: 이용일수 차감 후 2/3 환불',
      '이용 시작 후 1/2 경과 전: 이용일수 차감 후 1/2 환불',
      '이용 시작 후 1/2 경과 후: 환불 불가',
    ],
  },
  gym3: {
    name: '바디채널 서초점', address: '서울 서초구 서초대로 456 3층', lat: 37.4917, lng: 127.0078, phone: '02-3456-7890', hours: '06:00 - 22:00',
    hoursDetail: [{ day: '평일', time: '06:00 - 22:00' }, { day: '주말', time: '09:00 - 18:00' }],
    rating: 4.7, reviewCount: 195,
    heroImages: [{ url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop', label: '메인' }],
    galleryImages: [],
    description: '서초역 인근의 깔끔한 무인 피트니스 센터입니다.', tags: ['24시간', '무인', '락커'],
    facilities: [{ icon: '🏋️', label: '프리웨이트' }, { icon: '🚿', label: '샤워실' }, { icon: '🔒', label: '개인 락커' }],
    trainers: [], schedule: {}, coupons: [],
    plans: [{ name: '월 회원권', duration: '1개월', price: '49,000' }, { name: '3개월권', duration: '3개월', price: '129,000', original: '147,000', tag: '12% OFF' }],
    ptPlans: [],
    reviews: [{ name: '가성비왕', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.10', text: '이 가격에 이 시설이면 가성비 최고입니다.' }],
    nearbyGyms: [{ id: 'gym1', name: '바디채널 강남점', distance: '2.1km', price: '99,000' }],
    notices: [],
    congestion: [
      { time: '06', level: 1 }, { time: '07', level: 2 }, { time: '08', level: 3 },
      { time: '09', level: 4 }, { time: '10', level: 3 }, { time: '11', level: 2 },
      { time: '12', level: 3 }, { time: '13', level: 2 }, { time: '14', level: 2 },
      { time: '15', level: 3 }, { time: '16', level: 4 }, { time: '17', level: 5 },
      { time: '18', level: 6 }, { time: '19', level: 7 }, { time: '20', level: 5 },
      { time: '21', level: 3 },
    ],
    usageGuide: [
      '운동복 및 실내화를 착용해주세요',
      '기구 사용 후 소독 타월로 닦아주세요',
      '무인 운영 시설이므로 QR코드로 입장해주세요',
    ],
    refundPolicy: [
      '이용 시작 전: 전액 환불',
      '이용 시작 후 1/3 경과 전: 이용일수 차감 후 2/3 환불',
      '이용 시작 후 1/2 경과 후: 환불 불가',
    ],
  },
  gym4: {
    name: '바디채널 판교점', address: '경기 성남시 분당구 판교로 321 5층', lat: 37.3947, lng: 127.1112, phone: '031-4567-8901', hours: '06:00 - 24:00',
    hoursDetail: [{ day: '평일', time: '06:00 - 24:00' }, { day: '주말', time: '08:00 - 22:00' }],
    rating: 4.9, reviewCount: 156,
    heroImages: [{ url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop', label: '메인' }],
    galleryImages: [],
    description: '판교 테크노밸리 직장인을 위한 프리미엄 피트니스.', tags: ['크로스핏', 'PT', '그룹운동'], badge: 'NEW', badgeType: 'new',
    facilities: [{ icon: '🏋️', label: '프리웨이트' }, { icon: '🤸', label: '크로스핏존' }, { icon: '💪', label: 'GX룸' }, { icon: '🅿️', label: '주차장' }],
    trainers: [{ id: 4, name: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', specialty: '크로스핏 · 체력', rating: 4.6, reviewCount: 58, perSession: '80,000' }],
    schedule: { '월': [{ time: '19:00', name: '크로스핏 WOD', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false }], '화': [{ time: '19:00', name: '크로스핏 WOD', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false }], '목': [{ time: '19:00', name: '크로스핏 WOD', instructor: '이준혁', avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&crop=face', category: '짐그라운드', categoryColor: 'gymground' as const, hasTicket: false }] },
    coupons: [{ label: '오픈 기념', discount: '80% OFF', condition: '신규 회원 한정' }],
    plans: [{ name: '첫결제 특가', duration: '1개월', price: '29,900', original: '150,000', tag: '80% OFF' }, { name: '월 회원권', duration: '1개월', price: '150,000' }],
    ptPlans: [],
    reviews: [{ name: '판교직장인', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.18', text: '크로스핏 프로그램이 체계적이고 재미있어요.' }],
    nearbyGyms: [],
    notices: [],
    congestion: [
      { time: '06', level: 2 }, { time: '07', level: 3 }, { time: '08', level: 5 },
      { time: '09', level: 6 }, { time: '10', level: 4 }, { time: '11', level: 3 },
      { time: '12', level: 5 }, { time: '13', level: 4 }, { time: '14', level: 3 },
      { time: '15', level: 2 }, { time: '16', level: 3 }, { time: '17', level: 5 },
      { time: '18', level: 8 }, { time: '19', level: 9 }, { time: '20', level: 8 },
      { time: '21', level: 6 }, { time: '22', level: 4 }, { time: '23', level: 2 },
    ],
    usageGuide: [
      '운동복 및 실내화를 착용해주세요',
      '개인 물병을 지참해주세요 (정수기 이용 가능)',
      '기구 사용 후 소독 타월로 닦아주세요',
      '주차는 2시간 무료이며, 추가 시 시간당 2,000원입니다',
    ],
    refundPolicy: [
      '이용 시작 전: 전액 환불',
      '이용 시작 후 1/3 경과 전: 이용일수 차감 후 2/3 환불',
      '이용 시작 후 1/2 경과 전: 이용일수 차감 후 1/2 환불',
      '이용 시작 후 1/2 경과 후: 환불 불가',
    ],
  },
  gym5: {
    name: '바디채널 선릉점', address: '서울 강남구 선릉로 567 B1층', lat: 37.5045, lng: 127.0490, phone: '02-5678-9012', hours: '06:00 - 23:00',
    hoursDetail: [{ day: '평일', time: '06:00 - 23:00' }, { day: '주말', time: '08:00 - 20:00' }],
    rating: 4.5, reviewCount: 203,
    heroImages: [{ url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=450&fit=crop', label: '메인' }],
    galleryImages: [],
    description: '선릉역 도보 3분 거리의 피트니스 센터. 사우나 시설까지 완비.', tags: ['웨이트', '유산소', '사우나'],
    facilities: [{ icon: '🏋️', label: '프리웨이트' }, { icon: '🚴', label: '유산소존' }, { icon: '🧖', label: '사우나' }, { icon: '🚿', label: '샤워실' }],
    trainers: [], schedule: {}, coupons: [],
    plans: [{ name: '월 회원권', duration: '1개월', price: '89,000' }, { name: '3개월권', duration: '3개월', price: '239,000', original: '267,000', tag: '10% OFF' }],
    ptPlans: [],
    reviews: [{ name: '사우나매니아', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5, date: '2025.12.08', text: '운동 후 사우나가 진짜 최고입니다.' }],
    nearbyGyms: [{ id: 'gym2', name: '바디채널 역삼점', distance: '0.8km', price: '79,000' }],
    notices: [],
    congestion: [
      { time: '06', level: 2 }, { time: '07', level: 3 }, { time: '08', level: 4 },
      { time: '09', level: 3 }, { time: '10', level: 2 }, { time: '11', level: 2 },
      { time: '12', level: 4 }, { time: '13', level: 3 }, { time: '14', level: 2 },
      { time: '15', level: 3 }, { time: '16', level: 4 }, { time: '17', level: 6 },
      { time: '18', level: 8 }, { time: '19', level: 7 }, { time: '20', level: 5 },
      { time: '21', level: 3 }, { time: '22', level: 2 },
    ],
    usageGuide: [
      '운동복 및 실내화를 착용해주세요',
      '개인 물병을 지참해주세요 (정수기 이용 가능)',
      '기구 사용 후 소독 타월로 닦아주세요',
      '사우나 이용 시 수건을 지참해주세요',
    ],
    refundPolicy: [
      '이용 시작 전: 전액 환불',
      '이용 시작 후 1/3 경과 전: 이용일수 차감 후 2/3 환불',
      '이용 시작 후 1/2 경과 전: 이용일수 차감 후 1/2 환불',
      '이용 시작 후 1/2 경과 후: 환불 불가',
    ],
  },
}

export const defaultGym: GymInfo = {
  name: '바디채널', address: '서울', lat: 37.4980, lng: 127.0276, phone: '02-0000-0000', hours: '06:00 - 23:00',
  hoursDetail: [{ day: '평일', time: '06:00 - 23:00' }, { day: '주말', time: '08:00 - 20:00' }], rating: 4.5, reviewCount: 10,
  heroImages: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop', label: '메인' }],
  galleryImages: [],
  description: '바디채널 피트니스 센터입니다.', tags: [], facilities: [], trainers: [], schedule: {}, coupons: [],
  plans: [{ name: '월 회원권', duration: '1개월', price: '99,000' }], ptPlans: [], reviews: [], nearbyGyms: [],
  notices: [], congestion: [], usageGuide: [], refundPolicy: [],
}

/* ── helpers ── */
/* tabs removed */

function StarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
}

/* ── component ── */
export const GymDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const data = gymsData[id || ''] || defaultGym
  const [_liked, _setLiked] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const [showFullImage, setShowFullImage] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<GymPhoto | null>(null)
  const [congestionDayOffset, setCongestionDayOffset] = useState(0) // -6 ~ 0 (과거 1주일 ~ 오늘)
  void _liked; void _setLiked
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
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const selectedDay = scheduleDays[selectedDateIdx].dayKey
  const [reviewSort, setReviewSort] = useState<'latest' | 'high' | 'low'>('latest')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewImages, setReviewImages] = useState<string[]>([])


  const sortedReviews = [...data.reviews].sort((a, b) => {
    if (reviewSort === 'high') return b.rating - a.rating
    if (reviewSort === 'low') return a.rating - b.rating
    return b.date.localeCompare(a.date)
  })

  const currentHour = new Date().getHours()
  const _currentCongestion = data.congestion.find(c => parseInt(c.time) === currentHour)
  void _currentCongestion

  return (
    <PageLayout
      header={
        <SubPageHeader
          title={data.name}
          right={
            <button className="icon-btn">
              <IconShare className="w-[18px] h-[18px] stroke-ink stroke-2" />
            </button>
          }
          showChat
        />
      }
      hideBottomNav
      className="!px-0 !py-0 !pb-[70px]"
    >
      {/* ── Hero Carousel ── */}
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${heroIdx * 100}%)` }}>
            {data.heroImages.map((img, i) => <img key={i} src={img.url} alt={img.label} className="w-full aspect-video object-cover flex-shrink-0 cursor-pointer" onClick={() => setShowFullImage(true)} />)}
          </div>
        </div>
        {data.heroImages.length > 1 && (
          <>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 rounded-full text-white text-label font-medium">{heroIdx + 1} / {data.heroImages.length}</div>
            {heroIdx > 0 && <button onClick={() => setHeroIdx(heroIdx - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/70 rounded-full flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink stroke-2 fill-none"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button>}
            {heroIdx < data.heroImages.length - 1 && <button onClick={() => setHeroIdx(heroIdx + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/70 rounded-full flex items-center justify-center rotate-180"><svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink stroke-2 fill-none"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></button>}
          </>
        )}
      </div>

      {/* ── 1. 기본정보 + 소개 ── */}
      <div className="px-page pt-page pb-section">
        <div className="flex items-center gap-2 mb-2">
          {data.badge && <Badge variant={data.badgeType === 'sale' ? 'danger' : data.badgeType === 'new' ? 'success' : 'primary'} size="sm">{data.badge}</Badge>}
          {(() => {
            const h = currentHour
            const match = data.hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
            const isOpen = match && h >= parseInt(match[1]) && h < parseInt(match[3])
            return <Badge variant={isOpen ? 'success' : 'danger'} size="sm">{isOpen ? '영업중' : '영업종료'}</Badge>
          })()}
        </div>
        <h1 className="text-display font-bold text-ink mb-1">{data.name}</h1>
        <div className="flex items-center gap-1 mb-3">
          <StarIcon className="text-semantic-star" style={{ width: 14, height: 14 }} />
          <span className="text-body font-bold text-ink">{data.rating}</span>
          <span className="text-body text-ink-tertiary">({data.reviewCount})</span>
        </div>
        <p className="text-body text-ink-secondary leading-relaxed mb-section">{data.description}</p>

        {/* 정보 */}
        <div className="space-y-2 mb-section">
          <InfoRow icon={<IconMapPin className="w-4 h-4 stroke-ink-tertiary stroke-2" />} href={`https://map.naver.com/v5/search/${encodeURIComponent(data.name + ' ' + data.address)}`}>{data.address}</InfoRow>
          <InfoRow icon={<svg viewBox="0 0 24 24" className="w-4 h-4 stroke-ink-tertiary stroke-2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}>{data.phone}</InfoRow>
          <div className="flex items-start gap-2 text-body text-ink-secondary">
            <IconClock className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              {data.hoursDetail.map((h, i) => (
                <div key={i} className="flex justify-between text-label"><span className="text-ink-tertiary">{h.day}</span><span className="text-ink font-medium">{h.time}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* 쿠폰 */}
        {data.coupons.length > 0 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-page px-page">
            {data.coupons.map((c, i) => (
              <div key={i} className="min-w-[180px] flex-shrink-0 p-card-lg bg-primary-50 border border-primary/20 rounded-card">
                <Badge variant="primary" size="sm">{c.label}</Badge>
                <p className="text-title font-bold text-primary mt-1.5">{c.discount}</p>
                <p className="text-label text-ink-tertiary mt-0.5">{c.condition}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 2. 편의시설 ── */}
      {data.facilities.length > 0 && (
        <div className="px-page py-section">
          <h3 className="text-heading font-bold text-ink mb-4">편의시설</h3>
          <div className="grid grid-cols-4 gap-3">
            {data.facilities.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 py-3 bg-surface-subtle rounded-card">
                <span className="text-display">{f.icon}</span>
                <span className="text-label text-ink-secondary font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-2 bg-surface-muted" />

      {/* ── 혼잡도 ── */}
      {data.congestion.length > 0 && (
        <div className="px-page py-section">
          <div className="p-card bg-surface-subtle rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-body font-bold text-ink">혼잡도</span>
                {congestionDayOffset === 0 && (() => {
                  const ac = data.congestion.find(c => parseInt(c.time) === currentHour)
                  return ac ? (
                    <span className={`px-1.5 py-0.5 text-caption font-bold rounded ${ac.level >= 7 ? 'bg-semantic-like/15 text-semantic-like' : ac.level >= 4 ? 'bg-semantic-star/15 text-semantic-star' : 'bg-semantic-online/15 text-semantic-online'}`}>
                      {ac.level >= 7 ? '혼잡' : ac.level >= 4 ? '보통' : '여유'}
                    </span>
                  ) : null
                })()}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCongestionDayOffset(Math.max(-6, congestionDayOffset - 1))} className={`w-6 h-6 rounded-full flex items-center justify-center ${congestionDayOffset === -6 ? 'text-ink-disabled' : 'text-ink hover:bg-surface-muted'}`} disabled={congestionDayOffset === -6}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current stroke-2 fill-none"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <span className="text-label font-medium text-ink min-w-[60px] text-center">
                  {congestionDayOffset === 0 ? '오늘' : (() => { const d = new Date(); d.setDate(d.getDate() + congestionDayOffset); return `${d.getMonth() + 1}/${d.getDate()}(${'일월화수목금토'[d.getDay()]})`; })()}
                </span>
                <button onClick={() => setCongestionDayOffset(Math.min(0, congestionDayOffset + 1))} className={`w-6 h-6 rounded-full flex items-center justify-center ${congestionDayOffset === 0 ? 'text-ink-disabled' : 'text-ink hover:bg-surface-muted'}`} disabled={congestionDayOffset === 0}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current stroke-2 fill-none"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
            <div className="flex items-end gap-[3px] h-[40px]">
              {data.congestion.map((c, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className={`w-full rounded-sm transition-colors ${congestionDayOffset === 0 && parseInt(c.time) === currentHour ? 'bg-primary' : c.level >= 7 ? 'bg-semantic-like/40' : c.level >= 4 ? 'bg-semantic-star/40' : 'bg-semantic-online/40'}`}
                    style={{ height: `${(c.level / 10) * 36}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-caption text-ink-tertiary">6시</span>
              <span className="text-caption text-ink-tertiary">12시</span>
              <span className="text-caption text-ink-tertiary">18시</span>
              <span className="text-caption text-ink-tertiary">23시</span>
            </div>
          </div>
        </div>
      )}

      <div className="h-2 bg-surface-muted" />

      {/* ── 3. 회원권 ── */}
      {data.plans.length > 0 && (
        <div className="px-page py-section">
          <h3 className="text-heading font-bold text-ink mb-4">회원권</h3>
          <div className="flex flex-col gap-3">
            {data.plans.map((plan, i) => (
              <PlanCard
                key={i}
                name={plan.name}
                duration={plan.duration}
                price={plan.price}
                original={plan.original}
                tag={plan.tag}
                installment={plan.installment}
                highlighted={i === 0}
              />
            ))}
          </div>
        </div>
      )}

      <div className="h-2 bg-surface-muted" />

      {/* ── 3. 그룹 레슨 ── */}
      {Object.keys(data.schedule).length > 0 && (
        <div className="px-page py-section">
          <h3 className="text-heading font-bold text-ink mb-4">그룹 레슨</h3>
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
              const items = data.schedule[selectedDay] || []
              if (items.length === 0) {
                return <EmptyState message={`${scheduleDays[selectedDateIdx].isToday ? '오늘은' : scheduleDays[selectedDateIdx].label + '(' + selectedDay + ')은'} 수업이 없습니다`} />
              }
              const dateLabel = scheduleDays[selectedDateIdx].isToday ? '오늘' : scheduleDays[selectedDateIdx].label + '(' + selectedDay + ')'
              const ratingMap: Record<string, number> = { '최강민': 4.9, '박지영': 4.8, '한동훈': 4.7, '정서연': 4.8, '이수진': 4.7, '이준혁': 4.6 }
              const reviewMap: Record<string, number> = { '최강민': 128, '박지영': 95, '한동훈': 82, '정서연': 67, '이수진': 48, '이준혁': 54 }
              const grouped: { instructor: string; items: typeof items }[] = []
              for (const s of items) {
                const existing = grouped.find(g => g.instructor === s.instructor)
                if (existing) existing.items.push(s)
                else grouped.push({ instructor: s.instructor, items: [s] })
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
                    rating={ratingMap[g.instructor] || 4.5}
                    reviewCount={reviewMap[g.instructor] || 30}
                    rightAction={hasAnyTicket
                      ? <span onClick={(e) => { e.stopPropagation(); navigate(`/reservation?trainer=${encodeURIComponent(g.instructor + ' 강사')}&lesson=${encodeURIComponent(first.category)}&time=${encodeURIComponent(g.items[0].time)}`) }} className="px-3 py-1 bg-primary text-white text-label font-bold rounded-lg cursor-pointer">예약</span>
                      : <span onClick={(e) => { e.stopPropagation(); navigate(`/gym/${id}/products`) }} className="px-3 py-1 border border-primary text-primary text-label font-bold rounded-lg cursor-pointer">구매</span>
                    }
                    onClick={() => navigate(`/group-lesson/${lessonIdMap[first.name] || first.name}`)}
                  />
                )
              })
            })()}
          </div>
        </div>
      )}

      <div className="h-2 bg-surface-muted" />

      {/* ── 3. 개인 레슨 ── */}
      <div className="py-section">
        <div className="flex items-center justify-between mb-4 px-page">
          <h2 className="text-heading font-bold text-ink">개인 레슨</h2>
          <button onClick={() => navigate('/lesson')} className="text-label text-primary font-medium">전체보기</button>
        </div>
        {data.trainers.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-page">
            {data.trainers.map((t) => (
              <PTTrainerCard
                key={t.id}
                imageUrl={t.avatar}
                name={t.name}
                category="PT"
                categoryColor="pt"
                description={t.specialty.replace(/^PT\s*·?\s*/, '') || t.specialty}
                rating={t.rating}
                reviewCount={t.reviewCount}
                action={t.id === 1
                  ? <span onClick={() => navigate(`/reservation?trainer=${encodeURIComponent(t.name)}&lesson=PT&time=09:00`)} className="w-full block text-center px-3 py-1.5 bg-primary text-white text-label font-bold rounded-lg cursor-pointer">예약</span>
                  : <span onClick={() => navigate(`/gym/${id}/products`)} className="w-full block text-center px-3 py-1.5 border border-primary text-primary text-label font-bold rounded-lg cursor-pointer">구매</span>
                }
                onClick={() => navigate(`/trainer/${t.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="등록된 트레이너가 없습니다" />
        )}
      </div>

      <div className="h-2 bg-surface-muted" />

      <div className="h-2 bg-surface-muted" />

      {/* ── 5. 비포&애프터 ── */}
      <div className="py-section">
        <div className="flex items-center justify-between mb-4 px-page">
          <h2 className="text-heading font-bold text-ink">Before & After</h2>
          <button onClick={() => navigate(`/gym/${id}/before-after`)} className="text-label text-primary font-medium">전체보기</button>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar px-page">
          {baItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[180px] cursor-pointer" onClick={() => navigate(`/gym/${id}/before-after/${i}`)}>
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
          ))}
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 6. 후기 ── */}
      <div className="px-page py-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading font-bold text-ink">방문자 후기</h2>
          <span className="text-label text-ink-tertiary">{data.reviewCount}개</span>
        </div>
        <div className="mb-4">
          <RatingSummary rating={data.rating} reviewCount={data.reviewCount} />
        </div>
        <ReviewSort value={reviewSort} onChange={(v) => setReviewSort(v as 'latest' | 'high' | 'low')} onWrite={() => { setShowReviewForm(true); setReviewSubmitted(false); setReviewRating(0); setReviewText(''); setReviewImages([]) }} />
        <div className="space-y-4">
          {sortedReviews.map((review, i) => (
            <ReviewItem
              key={i}
              avatar={review.avatar}
              name={review.name}
              rating={review.rating}
              date={review.date}
              text={review.text}
              badge={review.membershipType}
              photos={review.photos}
              isMine={i === 0}
              onEdit={() => { setShowReviewForm(true); setReviewSubmitted(false); setReviewRating(review.rating); setReviewText(review.text); setReviewImages([]) }}
              onDelete={() => {}}
            />
          ))}
        </div>
        {data.reviews.length > 0 && <button onClick={() => navigate(`/gym/${id}/reviews`)} className="w-full py-3 mt-4 border border-border rounded-card text-body font-semibold text-ink hover:bg-surface-subtle transition-colors">후기 더보기</button>}
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* ── 8. 피드 ── */}
      <div className="px-page py-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading font-bold text-ink">피드</h2>
          <button onClick={() => navigate('/activity')} className="text-label text-primary font-medium">전체보기</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 1, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', authorImageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face', authorName: '김민수', text: '오늘도 열심히 운동 완료! 💪', likeCount: 128, commentCount: 24, isLiked: true },
            { id: 2, imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', authorImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face', authorName: '박지영', text: '바레톤 수업 후기 🧘‍♀️', likeCount: 89, commentCount: 12, isLiked: false },
            { id: 3, imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop', authorImageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=100&h=100&fit=crop&crop=face', authorName: '한동훈', text: '벌크업 3개월 결과 🎉', likeCount: 256, commentCount: 48, isLiked: true },
            { id: 4, imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=400&fit=crop', authorImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', authorName: '윤미래', text: '다이어트 -5kg 달성! 🔥', likeCount: 312, commentCount: 56, isLiked: true },
          ].map((feed) => (
            <FeedCard key={feed.id} {...feed} onClick={() => navigate(`/feed/${feed.id}`)} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <BottomCTA hideBottomNav>
        <button onClick={() => navigate(`/gym/${id}/products`)} className="flex-1 py-3.5 bg-primary text-white text-body font-bold rounded-xl hover:bg-primary-dark transition-colors">상품 구매</button>
      </BottomCTA>

      {/* ── 후기 작성 풀스크린 ── */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 bg-surface flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-page py-3 border-b border-border flex-shrink-0">
            <button onClick={() => setShowReviewForm(false)} className="p-1">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-title font-bold text-ink">후기 작성</h3>
            <div className="w-8" />
          </div>

          {reviewSubmitted ? (
            /* ── 제출 완료 ── */
            <div className="flex-1 flex flex-col items-center justify-center px-page">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-section">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-heading font-bold text-ink mb-2">후기가 등록되었습니다</p>
              <p className="text-body text-ink-secondary mb-8">소중한 후기 감사합니다!</p>
              <button onClick={() => setShowReviewForm(false)} className="w-full py-3.5 bg-primary text-white text-body font-bold rounded-xl">확인</button>
            </div>
          ) : (
            /* ── 작성 폼 ── */
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="px-page py-section">

                  {/* 1. 별점 */}
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

                  {/* 3. 이용 프로그램 */}
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

                  {/* 4. 텍스트 입력 */}
                  <div className="mb-section">
                    <p className="text-heading font-bold text-ink mb-4">상세 후기</p>
                    <textarea
                      value={reviewText}
                      onChange={e => { if (e.target.value.length <= 500) setReviewText(e.target.value) }}
                      placeholder="시설, 수업, 트레이너 등 이용 경험을 자유롭게 작성해 주세요 (최소 10자)"
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

                  {/* 5. 사진 첨부 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-heading font-bold text-ink">사진 첨부</p>
                        <p className="text-label text-ink-tertiary mt-1">최대 5장까지 등록 가능</p>
                      </div>
                      <span className="text-label text-ink-tertiary">{reviewImages.length}/5</span>
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
                      {/* 추가 버튼 */}
                      {reviewImages.length < 5 && (
                        <label className="flex-shrink-0 w-20 h-20 bg-surface-muted rounded-card border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                          <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink-tertiary mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
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
                      {/* 첨부된 이미지 */}
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

              {/* 하단 고정 버튼 */}
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
      {showFullImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
          <div className="flex items-center justify-between px-page py-3 flex-shrink-0">
            <span className="text-body font-bold text-white">사진 {data.galleryImages.filter(g => g.type !== 'video').length}장 · 동영상 {data.galleryImages.filter(g => g.type === 'video').length}개</span>
            <button onClick={() => setShowFullImage(false)} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-1 pb-6">
            <div className="grid grid-cols-2 gap-1">
              {data.galleryImages.map((img, i) => (
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
            <video
              src={zoomedImage.videoUrl}
              controls
              autoPlay
              className="w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img src={zoomedImage.url.replace(/w=\d+&h=\d+/, 'w=1200&h=1200')} alt={zoomedImage.label} className="w-full h-auto max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          )}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 rounded-full text-body text-white">{zoomedImage.label}</span>
        </div>
      )}
    </PageLayout>
  )
}
