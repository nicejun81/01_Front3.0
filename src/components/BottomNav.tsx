import { Link, useLocation } from 'react-router-dom'
import { IconHome, IconLocation, IconBriefcase, IconUsers, IconUser } from './Icons'

interface NavItem {
  path: string
  label: string
  icon: React.FC<{ className?: string; filled?: boolean }>
}

const navItems: NavItem[] = [
  { path: '/', label: '홈', icon: IconHome },
  { path: '/membership', label: '지점소개', icon: IconLocation },
  { path: '/lesson', label: '레슨권', icon: IconBriefcase },
  { path: '/activity', label: '커뮤니티', icon: IconUsers },
  { path: '/mypage', label: '마이', icon: IconUser },
]

export const BottomNav = () => {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div className="flex justify-around items-center pt-3 pb-7">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 group transition-colors ${
                isActive ? 'text-primary' : 'text-ink-placeholder'
              }`}
            >
              <span className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon
                  className={`w-6 h-6 ${
                    isActive
                      ? 'fill-current stroke-0'
                      : 'stroke-current stroke-[1.5] fill-none group-hover:stroke-primary'
                  }`}
                />
              </span>
              <span className="text-label font-medium tracking-wider">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
