import { Link } from 'react-router-dom'
import { IconChevronRight } from './Icons'

interface SectionHeaderProps {
  title: string
  href?: string
  showMore?: boolean
}

export const SectionHeader = ({ title, href, showMore = true }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-heading text-ink">{title}</h2>
      {showMore && href && (
        <Link
          to={href}
          className="flex items-center gap-0.5 text-label text-ink-placeholder hover:text-primary transition-colors"
        >
          전체보기
          <IconChevronRight className="w-4 h-4 stroke-current stroke-[1.5]" />
        </Link>
      )}
    </div>
  )
}
