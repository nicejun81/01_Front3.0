import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch, IconShoppingBag } from '../../components/Icons'

const products = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=400&fit=crop',
    name: '프로틴 파우더 2kg',
    price: 59000,
    originalPrice: 79000,
    discount: 25,
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
    name: '바레톤 매트 프리미엄',
    price: 35000,
    originalPrice: 45000,
    discount: 22,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    name: '운동 장갑 세트',
    price: 18000,
    originalPrice: 25000,
    discount: 28,
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop',
    name: '폼롤러 마사지',
    price: 28000,
    originalPrice: 35000,
    discount: 20,
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop',
    name: '저항 밴드 5종 세트',
    price: 22000,
    originalPrice: 30000,
    discount: 27,
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop',
    name: '쉐이커 보틀',
    price: 12000,
    originalPrice: 15000,
    discount: 20,
  },
]

export const ShopPage = () => {
  const navigate = useNavigate()

  const header = (
    <SubPageHeader
      title="쇼핑몰"
      right={
        <div className="flex items-center gap-1">
          <button className="icon-btn">
            <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
          </button>
          <button className="icon-btn relative">
            <IconShoppingBag className="w-[22px] h-[22px] stroke-ink stroke-2" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-caption font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      }
    />
  )

  return (
    <PageLayout header={header}>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-surface rounded-card overflow-hidden border border-border hover:border-ink transition-colors text-left"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            <div className="p-3">
              <h3 className="text-body font-semibold text-ink mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-body">{product.discount}%</span>
                <span className="text-title text-ink">{product.price.toLocaleString()}원</span>
              </div>
              <span className="text-label text-ink-placeholder line-through">{product.originalPrice.toLocaleString()}원</span>
            </div>
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
