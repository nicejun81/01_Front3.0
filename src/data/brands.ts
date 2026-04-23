export type BrandType = '종합 헬스' | '스튜디오' | '전문 스포츠'

export type BrandHighlight = {
  label: string
  description: string
}

export type Brand = {
  id: string
  name: string
  src: string
  type: BrandType
  origin: string
  foundedYear: number
  rating: number
  reviewCount: number
  priceRange: string
  description: string
  longDescription: string
  branchCount: number
  tags: string[]
  featured?: boolean
  highlights: BrandHighlight[]
  signature: string[]
  gallery: string[]
}

export const BRANDS: Brand[] = [
  {
    id: 'bodychannel-classic', name: '바디채널 Classic', src: '/img/logo07.png',
    type: '종합 헬스', origin: '대한민국', foundedYear: 2012,
    rating: 4.8, reviewCount: 12483, priceRange: '월 99,000원~',
    description: '전국 200+ 지점에서 만나볼 수 있는 프리미엄 종합 피트니스 프랜차이즈',
    longDescription: '바디채널 Classic은 2012년 첫 지점 오픈 이후 전국 주요 도시에 200개 이상의 직영·가맹 지점을 운영하고 있는 국내 최대 규모의 프리미엄 피트니스 프랜차이즈입니다. 넓은 운동 공간과 최신 장비, 전문 트레이너와 그룹 수업을 한 곳에서 만날 수 있어요.',
    branchCount: 213, tags: ['프리미엄', 'PT', '그룹수업', '사우나'], featured: true,
    highlights: [
      { label: '전국 200+ 직영 지점', description: '주요 업무지구·학군지 중심으로 접근성 높은 입지' },
      { label: '1:1 맞춤 PT',        description: '국가공인 자격 보유 트레이너와의 체계적 프로그램' },
      { label: '그룹 수업 데일리',   description: 'GX·요가·필라테스 등 매일 20개 이상의 수업' },
    ],
    signature: ['프라임 PT', '모닝 요가 클래스', '사우나·라운지'],
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'bodychannel-urban', name: '바디채널 Urban', src: '/img/logo08.png',
    type: '스튜디오', origin: '대한민국', foundedYear: 2019,
    rating: 4.7, reviewCount: 3642, priceRange: '월 69,000원~',
    description: '도심 직장인을 위한 24시간 스마트 스튜디오 프랜차이즈',
    longDescription: 'Urban 라인은 도심 직장인의 라이프 사이클에 맞춘 소규모 스튜디오 프랜차이즈입니다. 24시간 무인 운영과 스마트 키오스크, 컴팩트한 장비 구성으로 언제든 가볍게 운동할 수 있어요.',
    branchCount: 56, tags: ['24시간', '스튜디오', '소규모', '무인'], featured: true,
    highlights: [
      { label: '24시간 무인 운영',  description: 'QR 체크인·AI CCTV 기반 안전 관리' },
      { label: '도심형 스튜디오',   description: '역세권·오피스권 중심 소규모 지점' },
      { label: '멤버십 통합',       description: 'Classic과 한 번에 이용 가능한 통합권' },
    ],
    signature: ['나이트 운동존', '스마트 체크인', '샤워 & 드레스룸'],
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'hammer', name: 'Hammer Strength', src: '/img/logo01.png',
    type: '전문 스포츠', origin: '미국', foundedYear: 1989,
    rating: 4.9, reviewCount: 8021, priceRange: '월 149,000원~',
    description: '프로 선수들이 선택하는 크로스핏·스트렝스 전문 프랜차이즈',
    longDescription: 'Hammer Strength는 미국에서 시작된 크로스핏·스트렝스 전문 피트니스 프랜차이즈입니다. 프로 운동선수와 경찰·군 특수부대 출신 트레이너가 지도하는 본격 스트렝스 프로그램으로 유명해요.',
    branchCount: 42, tags: ['크로스핏', '스트렝스', '프로', '프리웨이트'],
    highlights: [
      { label: '본격 스트렝스 박스',    description: '프리웨이트·파워 케이지 중심의 본격 운동 환경' },
      { label: '프로 출신 트레이너',    description: '보디빌딩·크로스핏 챔피언 출신 인스트럭터' },
      { label: '바벨 파운데이션',       description: '초보자를 위한 8주 스트렝스 커리큘럼' },
    ],
    signature: ['파워리프팅 클래스', '크로스핏 WOD', '올림픽 리프팅 세션'],
    gallery: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'focus', name: 'Focus Fitness', src: '/img/logo02.png',
    type: '스튜디오', origin: '네덜란드', foundedYear: 2005,
    rating: 4.6, reviewCount: 2154, priceRange: '월 129,000원~',
    description: '유럽 감성 필라테스·요가 프리미엄 스튜디오',
    longDescription: 'Focus Fitness는 북유럽 미학과 몸의 밸런스에 집중한 필라테스·요가 전문 프리미엄 스튜디오입니다. 소수 정예 그룹 수업과 국제 자격 보유 강사진으로 운영돼요.',
    branchCount: 28, tags: ['필라테스', '요가', '프리미엄', '소그룹'],
    highlights: [
      { label: '소수 정예 수업',         description: '회당 최대 8명의 소그룹 클래스' },
      { label: '국제 자격 강사',         description: 'Polestar·STOTT PILATES 자격 보유' },
      { label: '리포머·체어 풀세팅',     description: '정품 리포머·캐딜락·체어 상시 배치' },
    ],
    signature: ['리포머 그룹', '프리넷탈 요가', '포스처 교정 PT'],
    gallery: [
      'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'technogym', name: 'TechnoGym', src: '/img/logo03.png',
    type: '종합 헬스', origin: '이탈리아', foundedYear: 1983,
    rating: 4.9, reviewCount: 15302, priceRange: '월 299,000원~',
    description: '회원제 럭셔리 피트니스 프랜차이즈',
    longDescription: 'TechnoGym은 올림픽 공식 파트너의 기술력을 기반으로 한 회원제 럭셔리 피트니스 프랜차이즈입니다. 고급 호텔 수준의 시설과 개인 락커룸, 전담 트레이너 매칭 서비스를 제공해요.',
    branchCount: 18, tags: ['럭셔리', '회원제', '호텔급', 'VIP'],
    highlights: [
      { label: '회원제 럭셔리',        description: '정원제로 운영되는 프라이빗 공간' },
      { label: '전담 트레이너 매칭',   description: '입회 시 전담 트레이너 1:1 지정' },
      { label: 'mywellness 연동',       description: '해외 지점에서도 내 운동 기록 동기화' },
    ],
    signature: ['프라이빗 PT 존', 'VIP 라운지·스파', 'Kinesis Personal 세션'],
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'gymground', name: 'Gym Ground', src: '/img/logo04.png',
    type: '종합 헬스', origin: '대한민국', foundedYear: 2008,
    rating: 4.5, reviewCount: 4318, priceRange: '월 39,000원~',
    description: '가성비와 접근성을 갖춘 동네 헬스 프랜차이즈',
    longDescription: 'Gym Ground는 동네 상권을 기반으로 한 합리적 가격의 대형 헬스 프랜차이즈입니다. 넓은 운동 공간과 24시간 이용, 부담 없는 가격으로 오랜 회원에게 사랑받고 있어요.',
    branchCount: 187, tags: ['가성비', '24시간', '넓은공간', '동네'],
    highlights: [
      { label: '월 3만원대 회원권',    description: '부담 없는 가격으로 장기 이용 가능' },
      { label: '24시간 자유 이용',     description: '출퇴근 전후 자유로운 운동 스케줄' },
      { label: '전국 공용 회원권',     description: '모든 지점 출입 가능한 통합 멤버십' },
    ],
    signature: ['24시간 프리존', '무료 GX 클래스', '오픈 PT 세션'],
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'cybex', name: 'Cybex', src: '/img/logo05.png',
    type: '전문 스포츠', origin: '미국', foundedYear: 1970,
    rating: 4.7, reviewCount: 5127, priceRange: '월 159,000원~',
    description: '재활·시니어 특화 메디컬 피트니스 프랜차이즈',
    longDescription: 'Cybex는 재활·시니어·산후 회복에 특화된 메디컬 피트니스 프랜차이즈입니다. 물리치료사·운동처방사가 상주하며 안전한 운동 환경과 맞춤 재활 프로그램을 제공해요.',
    branchCount: 34, tags: ['재활', '시니어', '메디컬', '산후'],
    highlights: [
      { label: '물리치료사 상주',        description: '운동 전 바디체크·처방 포함' },
      { label: '안전 동작 머신',         description: '관절 부담을 최소화한 머신 라인업' },
      { label: '시니어·산후 프로그램',   description: '연령·상태별 특화 프로그램 제공' },
    ],
    signature: ['시니어 서킷', '산후 회복 프로그램', '무릎 케어 PT'],
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'viliti', name: 'VILITI', src: '/img/logo06.png',
    type: '스튜디오', origin: '대한민국', foundedYear: 2021,
    rating: 4.4, reviewCount: 812, priceRange: '월 89,000원~',
    description: '여성 전용 부티크 피트니스 스튜디오',
    longDescription: '2021년 론칭된 VILITI는 여성 회원만을 위한 부티크 피트니스 스튜디오 프랜차이즈입니다. 프라이빗한 공간과 여성 트레이너, 체형별 특화 프로그램이 강점이에요.',
    branchCount: 22, tags: ['여성전용', '부티크', '프라이빗', '신흥'],
    highlights: [
      { label: '여성 전용 공간',         description: '전 직원·트레이너 여성으로 구성' },
      { label: '체형별 맞춤 PT',         description: '코어·힙업·전신순환 3트랙 운영' },
      { label: '앱 커뮤니티 연동',       description: '바디채널 앱과 직접 연동된 운동 기록' },
    ],
    signature: ['코어 필라테스 그룹', '힙업 PT 트랙', '푸드 다이어리 코칭'],
    gallery: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'rogers', name: 'Rogers', src: '/img/logo09.png',
    type: '전문 스포츠', origin: '미국', foundedYear: 1994,
    rating: 4.8, reviewCount: 1923, priceRange: '월 119,000원~',
    description: '격투기·복싱 특화 컴뱃 스포츠 프랜차이즈',
    longDescription: 'Rogers는 복싱·킥복싱·MMA 등 격투기 특화 피트니스 프랜차이즈입니다. 프로 선수 출신 트레이너와 본격 경기장 시설로 실전 운동과 체력 향상을 동시에 추구해요.',
    branchCount: 38, tags: ['복싱', 'MMA', '컴뱃', '실전'],
    highlights: [
      { label: '프로 경기장 시설',     description: '경기용 링·케이지·샌드백 풀 세팅' },
      { label: '챔피언 출신 트레이너', description: '아시안게임·프로 메달리스트 지도' },
      { label: '초보자 입문 클래스',   description: '여성·직장인 대상 초보 반 운영' },
    ],
    signature: ['복싱 스파링 클래스', 'MMA 입문 8주반', '컨디셔닝 서킷'],
    gallery: [
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=500&fit=crop',
    ],
  },
]

export const findBrand = (id: string) => BRANDS.find(b => b.id === id)
