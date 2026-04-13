import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, ScrollRow } from '../../components'
import { IconStarFilled, IconChevronRight, IconSearch } from '../../components/Icons'


const myMemberships = [
  { id: 1, status: '이용중', gym: '바디채널 강남점', days: '67일 남음', variant: 'primary' },
  { id: 2, status: '이용중', gym: '바디채널 역삼점', days: '23일 남음', variant: 'secondary' },
  { id: 3, status: '일시정지', gym: '바디채널 서초점', days: '45일 남음', variant: 'secondary' },
  { id: 4, status: '시작전', gym: '바디채널 판교점', days: '30일권', variant: 'waiting' },
]

const gyms = [
  {
    id: 'gym1',
    name: '바디채널 강남점',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop',
    rating: 4.8,
    address: '서울 강남구 테헤란로 123',
    tags: ['24시간', '주차가능', '샤워실'],
    badge: 'BEST',
    firstPay: '19,900원',
    monthlyPrice: '99,000',
  },
  {
    id: 'gym2',
    name: '바디채널 역삼점',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=200&fit=crop',
    rating: 4.6,
    address: '서울 강남구 역삼로 789',
    tags: ['24시간', 'PT', 'GX'],
    badge: '50% OFF',
    badgeType: 'sale',
    firstPay: '9,900원',
    monthlyPrice: '79,000',
  },
  {
    id: 'gym3',
    name: '바디채널 서초점',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=200&fit=crop',
    rating: 4.7,
    address: '서울 서초구 서초대로 456',
    tags: ['24시간', '무인', '락커'],
    monthlyPrice: '49,000',
  },
  {
    id: 'gym4',
    name: '바디채널 판교점',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop',
    rating: 4.9,
    address: '경기 성남시 분당구 판교로 321',
    tags: ['크로스핏', 'PT', '그룹운동'],
    badge: 'NEW',
    badgeType: 'new',
    firstPay: '29,900원',
    monthlyPrice: '150,000',
  },
  {
    id: 'gym5',
    name: '바디채널 선릉점',
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=200&fit=crop',
    rating: 4.5,
    address: '서울 강남구 선릉로 567',
    tags: ['웨이트', '유산소', '사우나'],
    monthlyPrice: '89,000',
  },
]

export const MembershipPage = () => {
  const navigate = useNavigate()

  const header = (
    <SubPageHeader
      title="지점소개"
      showChat
      right={
        <button className="icon-btn">
          <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
        </button>
      }
    />
  )

  return (
    <PageLayout header={header}>
      {/* My Memberships Banner */}
      <ScrollRow className="pb-4">
        {myMemberships.map((membership) => (
          <div
            key={membership.id}
            className={`min-w-[280px] flex-shrink-0 flex justify-between items-center p-3.5 rounded-card cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-elevated ${
              membership.variant === 'waiting'
                ? 'bg-surface border-2 border-ink-disabled'
                : membership.variant === 'secondary'
                ? 'bg-ink-secondary'
                : 'bg-ink'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`badge ${
                membership.variant === 'waiting' ? 'bg-ink-placeholder text-white' : 'bg-primary text-white'
              }`}>
                {membership.status}
              </span>
              <span className={membership.variant === 'waiting' ? 'text-ink text-body font-semibold' : 'text-white text-body font-semibold'}>
                {membership.gym}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={membership.variant === 'waiting' ? 'text-ink-secondary text-body font-semibold' : 'text-primary text-body font-semibold'}>
                {membership.days}
              </span>
              <IconChevronRight className="w-4 h-4 stroke-ink-placeholder stroke-[1.5]" />
            </div>
          </div>
        ))}
      </ScrollRow>

      <div className="h-2 bg-surface-muted -mx-page" />

      {/* Gym List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-heading">헬스장</h2>
          <span className="text-body text-ink-placeholder">{gyms.length}개</span>
        </div>

        <div className="flex flex-col gap-4">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => navigate(`/gym/${gym.id}`)}
              className="border border-border rounded-card-lg overflow-hidden cursor-pointer transition-all hover:border-ink hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="relative">
                <img src={gym.image} alt={gym.name} className="w-full h-[140px] object-cover" />
                {gym.badge && (
                  <span className={`absolute top-3 left-3 badge ${
                    gym.badgeType === 'sale' ? 'bg-semantic-like text-white' :
                    gym.badgeType === 'new' ? 'bg-semantic-online text-white' :
                    'bg-primary text-white'
                  }`}>
                    {gym.badge}
                  </span>
                )}
              </div>
              <div className="p-card-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-title">{gym.name}</h3>
                  <div className="flex items-center gap-1">
                    <IconStarFilled className="w-4 h-4 text-semantic-star" />
                    <span className="text-body font-semibold">{gym.rating}</span>
                  </div>
                </div>
                <p className="text-body text-ink-placeholder mb-3">{gym.address}</p>
                <div className="flex justify-between items-center">
                  {gym.firstPay && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 rounded-lg">
                      <span className="text-label text-ink-tertiary">첫결제</span>
                      <span className="text-body font-bold text-primary">{gym.firstPay}</span>
                    </span>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-body text-ink-placeholder">월</span>
                    <span className="text-heading">{gym.monthlyPrice}</span>
                    <span className="text-body text-ink-placeholder">원~</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
