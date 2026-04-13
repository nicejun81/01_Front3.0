import { useParams } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'
import { IconHeart, IconShare, IconShoppingBag } from '../../components/Icons'

const productsData: Record<string, {
  name: string
  price: number
  originalPrice: number
  discount: number
  imageUrl: string
  description: string
  details: string[]
}> = {
  '1': {
    name: '프로틴 파우더 2kg',
    price: 59000,
    originalPrice: 79000,
    discount: 25,
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=800&fit=crop',
    description: '고품질 유청 단백질로 만든 프로틴 파우더입니다. 운동 후 근육 회복에 효과적입니다.',
    details: ['용량: 2kg', '맛: 초코/바닐라/딸기', '1회 제공량: 30g', '단백질 함량: 24g/1회'],
  },
  '2': {
    name: '바레톤 매트 프리미엄',
    price: 35000,
    originalPrice: 45000,
    discount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop',
    description: '미끄럼 방지 기능이 있는 프리미엄 바레톤 매트입니다. 두꺼운 쿠션감으로 관절을 보호합니다.',
    details: ['크기: 183cm x 61cm', '두께: 6mm', '재질: TPE', '색상: 블랙/그레이/퍼플'],
  },
}

const defaultProduct = {
  name: '상품',
  price: 10000,
  originalPrice: 15000,
  discount: 33,
  imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop',
  description: '상품 설명입니다.',
  details: ['상세 정보'],
}

export const ProductDetailPage = () => {
  const { id } = useParams()
  const product = productsData[id || ''] || defaultProduct

  const header = (
    <SubPageHeader
      title="상품 상세"
      right={
        <div className="flex gap-2">
          <button className="icon-btn">
            <IconShare className="w-5 h-5 stroke-ink stroke-2" />
          </button>
          <button className="icon-btn relative">
            <IconShoppingBag className="w-5 h-5 stroke-ink stroke-2" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-caption font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      }
    />
  )

  return (
    <PageLayout header={header} className="!px-0 !py-0 !pb-[180px]">
      {/* Product Image */}
      <div className="aspect-square">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Title & Price */}
      <div className="px-page py-section">
        <h1 className="text-display font-bold mb-3">{product.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-heading">{product.discount}%</span>
          <span className="text-display font-bold">{product.price.toLocaleString()}원</span>
        </div>
        <span className="text-ink-tertiary line-through">{product.originalPrice.toLocaleString()}원</span>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* Description */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-3">상품 설명</h2>
        <p className="text-ink-secondary text-body leading-relaxed">{product.description}</p>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* Details */}
      <div className="px-page py-section">
        <h2 className="text-heading font-bold text-ink mb-3">상세 정보</h2>
        <ul className="space-y-2">
          {product.details.map((detail, i) => (
            <li key={i} className="flex items-center gap-2 text-body text-ink-secondary">
              <span className="w-1.5 h-1.5 bg-ink-tertiary rounded-full" />
              {detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-2 bg-surface-muted" />

      {/* Delivery Info */}
      <div className="px-page py-section">
        <section className="p-4 bg-surface-subtle rounded-xl">
          <p className="text-body text-ink-secondary">📦 무료배송 | 평균 2-3일 내 도착</p>
        </section>
      </div>

      {/* Bottom CTA */}
      <BottomCTA>
        <button className="w-14 h-14 flex items-center justify-center border border-border rounded-xl hover:bg-surface-subtle transition-colors">
          <IconHeart className="w-6 h-6 stroke-ink-tertiary stroke-2" />
        </button>
        <button className="flex-1 py-4 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
          구매하기
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
