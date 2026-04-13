import { useState } from 'react'
import { PageLayout, SubPageHeader, EmptyState } from '../../components'

export const BlockedPage = () => {
  const [list, setList] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('blockedUsers') || '[]')
  )

  const unblock = (name: string) => {
    if (!confirm(`${name}님을 차단 해제할까요?`)) return
    const next = list.filter((n) => n !== name)
    setList(next)
    localStorage.setItem('blockedUsers', JSON.stringify(next))
  }

  return (
    <PageLayout header={<SubPageHeader title="차단한 사용자" />}>
      <div className="py-section">
        {list.length === 0 ? (
          <EmptyState message="차단한 사용자가 없어요" />
        ) : (
          <ul className="space-y-2">
            {list.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between px-card-lg py-4 bg-surface-subtle rounded-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-disabled flex items-center justify-center text-ink-secondary font-semibold">
                    {name.slice(0, 1)}
                  </div>
                  <span className="text-body font-semibold text-ink">{name}</span>
                </div>
                <button
                  onClick={() => unblock(name)}
                  className="px-4 py-2 text-label font-semibold text-ink border border-border rounded-pill hover:bg-surface-muted transition-colors"
                >
                  차단 해제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageLayout>
  )
}
