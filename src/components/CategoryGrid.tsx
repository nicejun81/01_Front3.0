import { Link } from 'react-router-dom'
import {
  IconVideo,
  IconZap,
  IconShoppingBag,
  IconBook,
  IconUsers,
  IconCalendarCheck,
  IconUserPlus,
  IconStar,
} from './Icons'

interface CategoryItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  gradient: string
}

const categories: CategoryItem[] = [
  {
    id: 'online',
    label: '온라인 강의',
    icon: <IconVideo className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/online-class',
    gradient: 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]',
  },
  {
    id: 'workout',
    label: '맞춤운동',
    icon: <IconZap className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/workout',
    gradient: 'bg-gradient-to-br from-[#F97316] to-[#fb923c]',
  },
  {
    id: 'feed',
    label: '피드',
    icon: <IconBook className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/activity',
    gradient: 'bg-gradient-to-br from-[#F59E0B] to-[#fbbf24]',
  },
  {
    id: 'meetup',
    label: '모임',
    icon: <IconUsers className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/activity#meetup',
    gradient: 'bg-gradient-to-br from-[#06B6D4] to-[#22d3ee]',
  },
  {
    id: 'attendance',
    label: '출석 챌린지',
    icon: <IconCalendarCheck className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/attendance',
    gradient: 'bg-gradient-to-br from-accent-purple to-primary-light',
  },
  {
    id: 'friend',
    label: '친구소개',
    icon: <IconUserPlus className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/invite',
    gradient: 'bg-gradient-to-br from-[#EF4444] to-[#f87171]',
  },
  {
    id: 'review',
    label: '리뷰 이벤트',
    icon: <IconStar className="w-7 h-7 stroke-white fill-white stroke-[1.5]" />,
    href: '/review-event',
    gradient: 'bg-gradient-to-br from-[#EC4899] to-[#f472b6]',
  },
  {
    id: 'shop',
    label: '쇼핑몰',
    icon: <IconShoppingBag className="w-7 h-7 stroke-white stroke-[1.5]" />,
    href: '/shop',
    gradient: 'bg-gradient-to-br from-[#10B981] to-[#4ade9f]',
  },
]

export const CategoryGrid = () => {
  return (
    <div className="bg-surface rounded-card-lg shadow-card px-3 py-4 mb-section">
      <div className="grid grid-cols-4 gap-y-2 gap-x-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className="flex flex-col items-center py-3 px-1 rounded-card hover:bg-surface-muted active:scale-95 transition-all"
          >
            <div
              className={`w-[52px] h-[52px] rounded-card-lg flex items-center justify-center mb-2 ${category.gradient}`}
            >
              {category.icon}
            </div>
            <span className="text-label font-semibold text-ink text-center leading-tight">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
