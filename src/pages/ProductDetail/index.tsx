import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'
import { IconHeart, IconShare, IconShoppingBag } from '../../components/Icons'

/* 이미지 플레이스홀더 */
const makeImg = (emoji: string, bg: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="${bg}"/><text x="400" y="440" font-size="200" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

type ProductData = {
  name: string; price: number; originalPrice: number; discount: number
  imageUrl: string; badge?: string; category: string; rating: number; reviewCount: number
  description: string; features: string[]; specs: { label: string; value: string }[]
  options?: { label: string; values: string[] }[]
  reviews: { name: string; rating: number; date: string; text: string }[]
  relatedIds: number[]
}

const PRODUCTS: Record<string, ProductData> = {
  '1': {
    name: '골드 스탠다드 웨이 프로틴 2kg', price: 59000, originalPrice: 79000, discount: 25,
    imageUrl: makeImg('🥛', '#FFF5E6'), badge: 'BEST', category: '보충제', rating: 4.8, reviewCount: 324,
    description: '세계 판매 1위 웨이 프로틴. 1스쿱(30g)당 순수 유청 단백질 24g 함유. 운동 후 빠른 근육 회복과 성장에 최적화된 프리미엄 프로틴입니다.',
    features: ['100% 유청 단백질 원료', 'BCAA 5.5g 자연 함유', '인공 색소/방부제 무첨가', '뛰어난 용해도와 맛'],
    specs: [
      { label: '용량', value: '2kg (약 66회분)' }, { label: '1회 제공량', value: '30g' },
      { label: '단백질', value: '24g / 1회' }, { label: '칼로리', value: '120kcal / 1회' },
      { label: '원산지', value: '미국' }, { label: '유통기한', value: '제조일로부터 24개월' },
    ],
    options: [{ label: '맛 선택', values: ['더블 초콜릿', '바닐라 아이스크림', '딸기 바나나', '쿠키 앤 크림'] }],
    reviews: [
      { name: '김**', rating: 5, date: '2026.04.10', text: '단백질 함량 높고 맛도 좋아요. 초코맛 강추!' },
      { name: '이**', rating: 5, date: '2026.04.05', text: '물에도 잘 녹고 운동 후 바로 마시기 좋습니다' },
      { name: '박**', rating: 4, date: '2026.03.28', text: '가성비 최고. 다만 달달한 맛을 좋아하면 바닐라보단 초코 추천' },
    ],
    relatedIds: [2, 3, 10],
  },
  '2': {
    name: 'BCAA 아미노산 파우더 300g', price: 32000, originalPrice: 40000, discount: 20,
    imageUrl: makeImg('💊', '#EFF6FF'), category: '보충제', rating: 4.6, reviewCount: 187,
    description: '운동 중 근육 분해를 억제하고 회복을 촉진하는 필수 아미노산 BCAA. 상쾌한 레몬라임 맛으로 운동 중 음료 대용으로 최적.',
    features: ['류신:이소류신:발린 = 2:1:1 황금 비율', '전해질 함유로 수분 보충', '설탕 무첨가', '운동 중/후 섭취 가능'],
    specs: [
      { label: '용량', value: '300g (약 30회분)' }, { label: 'BCAA', value: '7g / 1회' },
      { label: '칼로리', value: '15kcal / 1회' }, { label: '원산지', value: '독일' },
    ],
    options: [{ label: '맛 선택', values: ['레몬라임', '청포도', '수박'] }],
    reviews: [
      { name: '최**', rating: 5, date: '2026.04.08', text: '레몬라임 맛이 시원하고 운동 중 마시기 좋아요' },
      { name: '정**', rating: 4, date: '2026.03.20', text: '잘 녹고 맛있습니다. 재구매 의사 있어요' },
    ],
    relatedIds: [1, 3, 10],
  },
  '3': {
    name: '프리워크아웃 부스터 30서빙', price: 28000, originalPrice: 35000, discount: 20,
    imageUrl: makeImg('⚡', '#FEF3C7'), badge: 'NEW', category: '보충제', rating: 4.5, reviewCount: 92,
    description: '카페인, 베타알라닌, 시트룰린 함유 프리워크아웃. 운동 30분 전 섭취로 강력한 펌핑감과 집중력을 경험하세요.',
    features: ['카페인 200mg 함유', '베타알라닌 3.2g', 'L-시트룰린 6g', '비타민B 복합체 포함'],
    specs: [
      { label: '용량', value: '390g (30회분)' }, { label: '카페인', value: '200mg / 1회' },
      { label: '칼로리', value: '10kcal / 1회' }, { label: '원산지', value: '미국' },
    ],
    options: [{ label: '맛 선택', values: ['블루 라즈베리', '과일 펀치'] }],
    reviews: [
      { name: '한**', rating: 5, date: '2026.04.12', text: '확실히 펌핑감이 다릅니다. 운동 퀄리티가 올라감' },
      { name: '윤**', rating: 4, date: '2026.04.01', text: '맛은 괜찮은데 카페인 민감하면 반스쿱부터 시작 추천' },
    ],
    relatedIds: [1, 2, 10],
  },
  '4': {
    name: '프리미엄 요가매트 10mm', price: 35000, originalPrice: 45000, discount: 22,
    imageUrl: makeImg('🧘', '#ECFDF5'), badge: 'BEST', category: '운동용품', rating: 4.9, reviewCount: 512,
    description: '10mm 두께의 고밀도 TPE 소재 요가매트. 우수한 쿠셔닝으로 관절을 보호하고 양면 미끄럼 방지 처리로 안정적인 운동이 가능합니다.',
    features: ['친환경 TPE 소재', '양면 논슬립 처리', '경량 설계 (1.2kg)', '전용 캐리 스트랩 포함'],
    specs: [
      { label: '크기', value: '183 x 61cm' }, { label: '두께', value: '10mm' },
      { label: '재질', value: 'TPE' }, { label: '무게', value: '1.2kg' },
    ],
    options: [{ label: '색상', values: ['블랙', '그레이', '민트', '퍼플'] }],
    reviews: [
      { name: '서**', rating: 5, date: '2026.04.14', text: '두께도 적당하고 미끄러지지 않아서 좋아요' },
      { name: '강**', rating: 5, date: '2026.04.09', text: '냄새도 안 나고 쿠션감이 최고입니다' },
      { name: '조**', rating: 5, date: '2026.03.30', text: '홈트용으로 완벽해요. 색상도 이쁘네요' },
    ],
    relatedIds: [5, 6, 9],
  },
  '5': {
    name: '고밀도 폼롤러 45cm', price: 28000, originalPrice: 35000, discount: 20,
    imageUrl: makeImg('🔵', '#EDE9FE'), category: '운동용품', rating: 4.7, reviewCount: 203,
    description: '고밀도 EVA 소재로 체중을 받쳐도 변형 없는 프리미엄 폼롤러. 운동 전후 근막 이완 및 스트레칭에 효과적입니다.',
    features: ['고밀도 EVA 폼', '변형 없는 내구성', '표면 돌기로 마사지 효과', '가벼운 휴대성'],
    specs: [
      { label: '길이', value: '45cm' }, { label: '지름', value: '15cm' },
      { label: '재질', value: 'EVA' }, { label: '무게', value: '400g' },
    ],
    options: [{ label: '색상', values: ['블랙', '블루', '핑크'] }],
    reviews: [
      { name: '임**', rating: 5, date: '2026.04.11', text: '단단해서 근막이완 잘 됩니다' },
      { name: '오**', rating: 4, date: '2026.04.02', text: '처음에는 아프지만 확실히 뭉침이 풀려요' },
    ],
    relatedIds: [4, 11, 12],
  },
  '6': {
    name: '저항 밴드 5종 세트', price: 18000, originalPrice: 30000, discount: 40,
    imageUrl: makeImg('🏋️', '#FEE2E2'), badge: 'SALE', category: '소도구', rating: 4.6, reviewCount: 278,
    description: '강도별 5종 저항 밴드 세트. 초보자부터 고급자까지 단계별로 사용 가능하며, 전신 근력 운동과 스트레칭에 활용할 수 있습니다.',
    features: ['5단계 강도 (5~30kg)', '천연 라텍스 소재', '휴대용 파우치 포함', '200가지 이상 운동 가능'],
    specs: [
      { label: '구성', value: '5종 (5/10/15/20/30kg)' }, { label: '재질', value: '천연 라텍스' },
      { label: '길이', value: '각 60cm' }, { label: '포함', value: '수납 파우치' },
    ],
    reviews: [
      { name: '송**', rating: 5, date: '2026.04.13', text: '5종이라 강도별로 골라 쓸 수 있어서 좋아요' },
      { name: '양**', rating: 4, date: '2026.04.06', text: '홈트 필수템. 이 가격에 이 구성은 대박' },
    ],
    relatedIds: [4, 9, 5],
  },
  '7': {
    name: '드라이핏 트레이닝 반팔 티셔츠', price: 29000, originalPrice: 39000, discount: 26,
    imageUrl: makeImg('👕', '#F0F9FF'), badge: 'NEW', category: '웨어', rating: 4.7, reviewCount: 156,
    description: '속건 기능성 원단으로 땀을 빠르게 흡수, 건조시키는 트레이닝 티셔츠. 가볍고 통기성이 뛰어나 격한 운동에도 쾌적합니다.',
    features: ['속건 드라이핏 원단', '4방향 스트레치', '항균 탈취 처리', '심리스 봉제'],
    specs: [
      { label: '소재', value: '폴리에스터 92% + 스판덱스 8%' }, { label: '사이즈', value: 'S / M / L / XL' },
      { label: '세탁', value: '세탁기 가능 (찬물)' }, { label: '원산지', value: '한국' },
    ],
    options: [
      { label: '색상', values: ['블랙', '네이비', '화이트', '그레이'] },
      { label: '사이즈', values: ['S', 'M', 'L', 'XL'] },
    ],
    reviews: [
      { name: '백**', rating: 5, date: '2026.04.15', text: '핏이 예쁘고 땀 흡수도 빨라요. 운동복 중 최고' },
      { name: '나**', rating: 5, date: '2026.04.07', text: '가볍고 시원해서 여름 운동복으로 딱입니다' },
    ],
    relatedIds: [8, 9, 4],
  },
  '8': {
    name: '컴프레션 레깅스 하이웨스트', price: 38000, originalPrice: 52000, discount: 27,
    imageUrl: makeImg('👖', '#1a1a2e'), category: '웨어', rating: 4.8, reviewCount: 341,
    description: '하이웨스트 디자인으로 복부를 잡아주고, 적절한 압박감으로 근육 피로를 줄여주는 프리미엄 컴프레션 레깅스.',
    features: ['하이웨스트 디자인', '4방향 스트레치', '비침 없는 원단', '사이드 포켓'],
    specs: [
      { label: '소재', value: '나일론 75% + 스판덱스 25%' }, { label: '사이즈', value: 'S / M / L / XL' },
      { label: '세탁', value: '세탁기 가능 (냉수 손세탁 권장)' }, { label: '원산지', value: '한국' },
    ],
    options: [
      { label: '색상', values: ['블랙', '차콜', '네이비'] },
      { label: '사이즈', values: ['S', 'M', 'L', 'XL'] },
    ],
    reviews: [
      { name: '문**', rating: 5, date: '2026.04.12', text: '비치지 않고 핏도 예뻐요. 재구매할 예정!' },
      { name: '신**', rating: 5, date: '2026.04.03', text: '스쿼트해도 비침 없고 포켓도 실용적' },
    ],
    relatedIds: [7, 4, 6],
  },
  '9': {
    name: '네오프렌 운동 장갑', price: 15000, originalPrice: 22000, discount: 32,
    imageUrl: makeImg('🧤', '#F5F5F4'), category: '소도구', rating: 4.4, reviewCount: 98,
    description: '네오프렌 소재로 그립감이 뛰어나고 손바닥 굳은살을 방지하는 운동 장갑. 웨이트 트레이닝 필수 아이템.',
    features: ['네오프렌 + 인조가죽', '벨크로 손목 밴드', '통기성 메쉬 소재', '미끄럼 방지 패드'],
    specs: [
      { label: '소재', value: '네오프렌 + 인조가죽' }, { label: '사이즈', value: 'S / M / L' },
      { label: '세탁', value: '손세탁 권장' }, { label: '원산지', value: '중국' },
    ],
    options: [{ label: '사이즈', values: ['S', 'M', 'L'] }],
    reviews: [
      { name: '유**', rating: 5, date: '2026.04.09', text: '그립감이 확실히 좋아졌어요. 필수템!' },
      { name: '권**', rating: 4, date: '2026.03.25', text: '가격 대비 품질 좋습니다' },
    ],
    relatedIds: [6, 10, 5],
  },
  '10': {
    name: '프리미엄 쉐이커 보틀 700ml', price: 12000, originalPrice: 15000, discount: 20,
    imageUrl: makeImg('🥤', '#E0F2FE'), category: '소도구', rating: 4.5, reviewCount: 445,
    description: '스테인리스 믹싱볼이 내장된 프리미엄 쉐이커. 프로틴이 뭉침 없이 깔끔하게 녹으며, BPA-free 소재로 안심하고 사용 가능.',
    features: ['스테인리스 믹싱볼 포함', 'BPA-free 트라이탄 소재', '눈금 표시', '원터치 뚜껑'],
    specs: [
      { label: '용량', value: '700ml' }, { label: '소재', value: '트라이탄 (BPA-free)' },
      { label: '세척', value: '식기세척기 가능' }, { label: '포함', value: '스테인리스 믹싱볼' },
    ],
    options: [{ label: '색상', values: ['블랙', '화이트', '민트'] }],
    reviews: [
      { name: '장**', rating: 5, date: '2026.04.11', text: '프로틴이 뭉치지 않고 잘 섞여요' },
      { name: '추**', rating: 4, date: '2026.04.04', text: '디자인도 이쁘고 뚜껑 잠금이 확실합니다' },
    ],
    relatedIds: [1, 2, 3],
  },
  '11': {
    name: '근육 마사지건 프로', price: 89000, originalPrice: 129000, discount: 31,
    imageUrl: makeImg('💆', '#FDF4FF'), badge: 'NEW', category: '케어', rating: 4.9, reviewCount: 67,
    description: '6단계 강도 조절, 4가지 헤드 교체 가능한 프로 마사지건. 운동 전후 근육 이완에 효과적이며, 저소음 설계로 언제 어디서든 사용 가능.',
    features: ['6단계 강도 조절', '4종 교체 헤드', '저소음 모터 (45dB)', '최대 6시간 배터리'],
    specs: [
      { label: '무게', value: '680g' }, { label: '배터리', value: '2500mAh (최대 6시간)' },
      { label: '소음', value: '45dB 이하' }, { label: '포함', value: '본체 + 헤드 4종 + 충전기 + 케이스' },
    ],
    reviews: [
      { name: '안**', rating: 5, date: '2026.04.14', text: '저소음이라 밤에도 사용 가능하고 효과 확실해요' },
      { name: '전**', rating: 5, date: '2026.04.08', text: '운동 후 근육통 회복이 훨씬 빨라졌습니다' },
    ],
    relatedIds: [12, 5, 4],
  },
  '12': {
    name: '냉온 찜질팩 대형', price: 15000, originalPrice: 20000, discount: 25,
    imageUrl: makeImg('🧊', '#F0FDFA'), category: '케어', rating: 4.3, reviewCount: 132,
    description: '전자레인지/냉동실 모두 사용 가능한 대형 냉온 찜질팩. 운동 후 부상 부위 냉찜질, 근육통 온찜질에 활용하세요.',
    features: ['냉/온 겸용', '대형 사이즈', '벨크로 고정 밴드', '반영구적 사용'],
    specs: [
      { label: '크기', value: '35 x 25cm' }, { label: '사용법', value: '냉동실 2시간 / 전자레인지 1분' },
      { label: '소재', value: 'PVC + 젤' }, { label: '포함', value: '찜질팩 + 고정 밴드' },
    ],
    reviews: [
      { name: '홍**', rating: 4, date: '2026.04.10', text: '크기가 커서 넓은 부위에 쓰기 좋아요' },
      { name: '노**', rating: 4, date: '2026.03.28', text: '온찜질 온도가 적당하게 유지됩니다' },
    ],
    relatedIds: [11, 5, 4],
  },
}

const makeSmallImg = (emoji: string, bg: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${bg}"/><text x="200" y="220" font-size="100" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const RELATED_MAP: Record<number, { name: string; price: number; discount: number; img: string }> = {
  1: { name: '웨이 프로틴 2kg', price: 59000, discount: 25, img: makeSmallImg('🥛', '#FFF5E6') },
  2: { name: 'BCAA 파우더', price: 32000, discount: 20, img: makeSmallImg('💊', '#EFF6FF') },
  3: { name: '프리워크아웃 부스터', price: 28000, discount: 20, img: makeSmallImg('⚡', '#FEF3C7') },
  4: { name: '프리미엄 요가매트', price: 35000, discount: 22, img: makeSmallImg('🧘', '#ECFDF5') },
  5: { name: '고밀도 폼롤러', price: 28000, discount: 20, img: makeSmallImg('🔵', '#EDE9FE') },
  6: { name: '저항 밴드 5종', price: 18000, discount: 40, img: makeSmallImg('🏋️', '#FEE2E2') },
  7: { name: '트레이닝 티셔츠', price: 29000, discount: 26, img: makeSmallImg('👕', '#F0F9FF') },
  8: { name: '컴프레션 레깅스', price: 38000, discount: 27, img: makeSmallImg('👖', '#1a1a2e') },
  9: { name: '운동 장갑', price: 15000, discount: 32, img: makeSmallImg('🧤', '#F5F5F4') },
  10: { name: '쉐이커 보틀', price: 12000, discount: 20, img: makeSmallImg('🥤', '#E0F2FE') },
  11: { name: '마사지건 프로', price: 89000, discount: 31, img: makeSmallImg('💆', '#FDF4FF') },
  12: { name: '냉온 찜질팩', price: 15000, discount: 25, img: makeSmallImg('🧊', '#F0FDFA') },
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-[#FACC15]' : 'fill-ink-disabled'}`}>
        <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" />
      </svg>
    ))}
  </div>
)

export const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS[id || '']
  const [liked, setLiked] = useState(false)
  const [qty, setQty] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [activeInfoTab, setActiveInfoTab] = useState<'desc' | 'spec' | 'review'>('desc')

  if (!product) {
    return (
      <PageLayout header={<SubPageHeader title="상품 상세" />} className="flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-heading font-bold text-ink mb-2">상품을 찾을 수 없습니다</p>
          <button onClick={() => navigate('/shop')} className="text-primary font-semibold">쇼핑몰로 돌아가기</button>
        </div>
      </PageLayout>
    )
  }

  const header = (
    <SubPageHeader
      title=""
      right={
        <div className="flex gap-1">
          <button className="icon-btn" onClick={() => {
            const url = `${window.location.origin}/product/${id}`
            navigator.clipboard?.writeText(url)
            alert('상품 링크가 복사되었어요!')
          }}>
            <IconShare className="w-5 h-5 stroke-ink stroke-2" />
          </button>
          <button className="icon-btn relative" onClick={() => navigate('/shop')}>
            <IconShoppingBag className="w-5 h-5 stroke-ink stroke-2" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-caption font-bold rounded-full flex items-center justify-center">2</span>
          </button>
        </div>
      }
    />
  )

  return (
    <PageLayout header={header} noPadding className="!pb-[180px]">
      {/* 상품 이미지 */}
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover" />
        {product.badge && (
          <span className={`absolute top-4 left-4 px-3 py-1 text-label font-bold rounded ${
            product.badge === 'BEST' ? 'bg-primary text-white' : product.badge === 'NEW' ? 'bg-ink text-white' : 'bg-semantic-like text-white'
          }`}>{product.badge}</span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="px-page pt-5 pb-4">
        <p className="text-caption text-ink-tertiary mb-1">{product.category}</p>
        <h1 className="text-heading font-bold text-ink mb-3">{product.name}</h1>

        {/* 별점 */}
        <div className="flex items-center gap-2 mb-4">
          <Stars rating={product.rating} />
          <span className="text-label font-bold text-ink tabular-nums">{product.rating}</span>
          <span className="text-caption text-ink-placeholder">리뷰 {product.reviewCount}개</span>
        </div>

        {/* 가격 */}
        <div className="flex items-baseline gap-2">
          <span className="text-primary font-extrabold text-title">{product.discount}%</span>
          <span className="text-display font-extrabold text-ink tabular-nums">{product.price.toLocaleString()}<span className="text-heading">원</span></span>
        </div>
        <span className="text-body text-ink-placeholder line-through tabular-nums">{product.originalPrice.toLocaleString()}원</span>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 옵션 선택 */}
      {product.options && product.options.length > 0 && (
        <>
          <div className="px-page py-section">
            {product.options.map(opt => (
              <div key={opt.label} className="mb-4 last:mb-0">
                <div className="text-label font-bold text-ink mb-2">{opt.label}</div>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.label]: v }))}
                      className={`px-4 py-2 rounded-card text-label font-medium border transition-colors ${
                        selectedOptions[opt.label] === v
                          ? 'border-primary bg-primary-50 text-primary font-bold'
                          : 'border-border text-ink-secondary hover:border-ink-placeholder'
                      }`}
                    >{v}</button>
                  ))}
                </div>
              </div>
            ))}

            {/* 수량 */}
            <div>
              <div className="text-label font-bold text-ink mb-2">수량</div>
              <div className="inline-flex items-center border border-border rounded-card">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-ink-tertiary hover:text-ink text-heading">-</button>
                <span className="w-12 text-center text-body font-bold text-ink tabular-nums">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-ink-tertiary hover:text-ink text-heading">+</button>
              </div>
              <span className="ml-3 text-body font-bold text-ink tabular-nums">{(product.price * qty).toLocaleString()}원</span>
            </div>
          </div>
          <div className="h-2 bg-surface-muted" />
        </>
      )}

      {/* 배송 정보 */}
      <div className="px-page py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-body">
            <span className="text-body">📦</span>
            <span className="text-ink-secondary"><span className="font-semibold text-ink">무료배송</span> · 평균 2~3일 내 도착</span>
          </div>
          <div className="flex items-center gap-2.5 text-body">
            <span className="text-body">🔄</span>
            <span className="text-ink-secondary">7일 이내 <span className="font-semibold text-ink">무료 반품/교환</span></span>
          </div>
          <div className="flex items-center gap-2.5 text-body">
            <span className="text-body">💳</span>
            <span className="text-ink-secondary">포인트 <span className="font-semibold text-primary">{Math.floor(product.price * qty * 0.03).toLocaleString()}P</span> 적립</span>
          </div>
        </div>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 탭: 설명 / 스펙 / 리뷰 */}
      <div className="flex border-b border-border">
        {([
          { key: 'desc' as const, label: '상품설명' },
          { key: 'spec' as const, label: '상세정보' },
          { key: 'review' as const, label: `리뷰 (${product.reviews.length})` },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveInfoTab(t.key)}
            className={`flex-1 py-3.5 text-label font-semibold text-center border-b-2 transition-colors ${
              activeInfoTab === t.key ? 'text-ink border-ink' : 'text-ink-placeholder border-transparent'
            }`}
          >{t.label}</button>
        ))}
      </div>

      <div className="px-page py-section">
        {activeInfoTab === 'desc' && (
          <>
            <p className="text-body text-ink-secondary leading-relaxed mb-5">{product.description}</p>
            <div className="flex flex-col gap-2">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] fill-primary shrink-0 mt-0.5"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  <span className="text-body text-ink">{f}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {activeInfoTab === 'spec' && (
          <div className="flex flex-col">
            {product.specs.map((s, i) => (
              <div key={i} className={`flex py-3 ${i > 0 ? 'border-t border-border-light' : ''}`}>
                <span className="w-28 text-label font-semibold text-ink-tertiary shrink-0">{s.label}</span>
                <span className="text-body text-ink">{s.value}</span>
              </div>
            ))}
          </div>
        )}
        {activeInfoTab === 'review' && (
          <div className="flex flex-col gap-4">
            {/* 리뷰 요약 */}
            <div className="flex items-center gap-4 p-4 bg-surface-muted rounded-card-lg mb-2">
              <div className="text-center">
                <div className="text-display font-extrabold text-ink tabular-nums">{product.rating}</div>
                <Stars rating={product.rating} />
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = product.reviews.filter(r => r.rating === star).length
                  const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-caption text-ink-placeholder w-4 tabular-nums">{star}</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-[#FACC15] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {product.reviews.map((r, i) => (
              <div key={i} className="pb-4 border-b border-border-light last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-body font-semibold text-ink">{r.name}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <span className="text-caption text-ink-placeholder">{r.date}</span>
                </div>
                <p className="text-body text-ink-secondary">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* 연관 상품 */}
      <div className="px-page py-section">
        <h3 className="text-body font-bold text-ink mb-3">함께 많이 구매해요</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {product.relatedIds.map(rid => {
            const rel = RELATED_MAP[rid]
            if (!rel) return null
            return (
              <button key={rid} onClick={() => navigate(`/product/${rid}`)} className="flex-shrink-0 w-[130px] text-left">
                <img src={rel.img} alt={rel.name} className="w-full aspect-square rounded-card-lg object-cover mb-2" />
                <p className="text-label font-semibold text-ink line-clamp-2 mb-1">{rel.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-caption font-bold text-primary">{rel.discount}%</span>
                  <span className="text-label font-bold text-ink tabular-nums">{rel.price.toLocaleString()}원</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 하단 CTA */}
      <BottomCTA>
        <button
          onClick={() => setLiked(!liked)}
          className="w-14 h-14 flex items-center justify-center border border-border rounded-xl hover:bg-surface-subtle transition-colors"
        >
          <IconHeart className={`w-6 h-6 stroke-2 ${liked ? 'fill-semantic-like stroke-semantic-like' : 'fill-none stroke-ink-tertiary'}`} />
        </button>
        <button
          onClick={() => alert('장바구니에 담았습니다!')}
          className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-body"
        >
          {(product.price * qty).toLocaleString()}원 · 구매하기
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
