import type { ReactNode } from 'react'

interface ProfileStat {
  value: string | number
  label: string
  onClick?: () => void
}

interface ProfileHeaderProps {
  imageUrl: string
  name: string
  bio?: string
  link?: string
  stats: ProfileStat[]
  actions: ReactNode
}

export const ProfileHeader = ({ imageUrl, name, bio, link, stats, actions }: ProfileHeaderProps) => {
  return (
    <>
      <div className="px-page py-section">
        <div className="flex items-center gap-6 mb-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary p-0.5"
          />
          <div className="flex-1 grid grid-cols-3 text-center">
            {stats.map((s) => (
              <button
                key={s.label}
                onClick={s.onClick}
                className="hover:opacity-70 transition-opacity"
              >
                <div className="text-title font-bold text-ink">{s.value}</div>
                <div className="text-label text-ink-secondary">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-body font-semibold text-ink">{name}</div>
          {bio && (
            <div className="text-body text-ink-secondary whitespace-pre-line">{bio}</div>
          )}
          {link && (
            <a
              href={`https://${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-primary font-semibold"
            >
              {link}
            </a>
          )}
        </div>

        <div className="flex gap-2">{actions}</div>
      </div>

    </>
  )
}
