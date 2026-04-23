import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconStarFilled, IconSearch, IconX, IconChevronDown } from '../../components/Icons'

type Program = 'pt' | 'group-pt' | 'bareton' | 'gymground' | 'hit35'

const programTabs: { id: 'all' | Program; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'pt', label: 'PT' },
  { id: 'group-pt', label: '그룹 PT' },
  { id: 'bareton', label: '바레톤' },
  { id: 'gymground', label: '짐그라운드' },
  { id: 'hit35', label: '히트35' },
]

const gyms: {
  id: string
  name: string
  image: string
  rating: number
  address: string
  tags: string[]
  badge?: string
  badgeType?: 'sale' | 'new'
  firstPay?: string
  monthlyPrice: string
  programs: Program[]
}[] = [
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
    programs: ['pt', 'group-pt', 'bareton', 'gymground', 'hit35'],
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
    programs: ['pt', 'group-pt', 'hit35'],
  },
  {
    id: 'gym3',
    name: '바디채널 서초점',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=200&fit=crop',
    rating: 4.7,
    address: '서울 서초구 서초대로 456',
    tags: ['24시간', '무인', '락커'],
    monthlyPrice: '49,000',
    programs: ['pt'],
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
    programs: ['pt', 'group-pt', 'gymground', 'hit35'],
  },
  {
    id: 'gym5',
    name: '바디채널 선릉점',
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=200&fit=crop',
    rating: 4.5,
    address: '서울 강남구 선릉로 567',
    tags: ['웨이트', '유산소', '사우나'],
    monthlyPrice: '89,000',
    programs: ['pt', 'bareton', 'gymground'],
  },
]

export const MembershipPage = () => {
  const navigate = useNavigate()
  const [selectedBranch, setSelectedBranch] = useState<string | null>(() => localStorage.getItem('selectedBranch'))
  const [activeProgram, setActiveProgram] = useState<'all' | Program>('all')
  const [categoryOpen, setCategoryOpen] = useState(false)

  useEffect(() => {
    const sync = () => setSelectedBranch(localStorage.getItem('selectedBranch'))
    window.addEventListener('branch-changed', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('branch-changed', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  const activeProgramLabel = programTabs.find(t => t.id === activeProgram)?.label ?? '전체'

  const filteredGyms = useMemo(() => {
    return gyms
      .filter(g => !selectedBranch || g.name === selectedBranch)
      .filter(g => activeProgram === 'all' || g.programs.includes(activeProgram))
  }, [selectedBranch, activeProgram])

  const clearFilter = () => {
    localStorage.removeItem('selectedBranch')
    setSelectedBranch(null)
    window.dispatchEvent(new Event('branch-changed'))
  }

  const header = (
    <SubPageHeader title="지점소개" showChat>
      <div className="flex items-center gap-2 px-page py-3 border-t border-border-light">
        <button
          type="button"
          onClick={() => navigate('/branch')}
          className={`flex-1 min-w-0 flex items-center gap-2 px-3.5 py-2.5 rounded-pill transition-colors ${selectedBranch ? 'bg-primary-50 ring-1 ring-primary/30' : 'bg-surface-muted hover:bg-surface-subtle'}`}
        >
          <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
          <span className={`flex-1 min-w-0 text-left text-body truncate ${selectedBranch ? 'text-primary font-semibold' : 'text-ink-placeholder'}`}>
            {selectedBranch ?? '지점 검색'}
          </span>
          {selectedBranch && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); clearFilter() }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); clearFilter() } }}
              className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 cursor-pointer"
              aria-label="지점 선택 해제"
            >
              <IconX className="w-3 h-3 stroke-white stroke-[3]" />
            </span>
          )}
        </button>
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setCategoryOpen(v => !v)}
            className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-pill transition-colors ${activeProgram !== 'all' ? 'bg-primary-50 ring-1 ring-primary/30' : 'bg-surface-muted hover:bg-surface-subtle'}`}
            aria-expanded={categoryOpen}
            aria-haspopup="listbox"
          >
            <IconSearch className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <span className={`flex-1 min-w-0 text-left text-body truncate ${activeProgram !== 'all' ? 'text-primary font-semibold' : 'text-ink-placeholder'}`}>
              {activeProgram === 'all' ? '분류 검색' : activeProgramLabel}
            </span>
            <IconChevronDown className={`w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </button>
          {categoryOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCategoryOpen(false)}
                aria-hidden
              />
              <ul
                role="listbox"
                className="absolute left-0 right-0 top-full z-50 mt-1 bg-surface border border-border rounded-card-lg shadow-elevated overflow-hidden"
              >
                {programTabs.map(t => {
                  const active = t.id === activeProgram
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => { setActiveProgram(t.id); setCategoryOpen(false) }}
                        className={`w-full px-4 py-2.5 text-left text-body transition-colors ${active ? 'bg-primary-50 text-primary font-semibold' : 'text-ink hover:bg-surface-muted'}`}
                      >
                        {t.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </SubPageHeader>
  )

  return (
    <PageLayout header={header}>
      {/* 필터 칩 */}
      {selectedBranch && filteredGyms.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-primary-50 border border-primary/30 text-primary">
            <span className="text-caption font-bold">{selectedBranch}만 보는 중</span>
            <button
              onClick={clearFilter}
              className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
              aria-label="필터 해제"
            >
              <IconX className="w-2.5 h-2.5 stroke-primary stroke-[2.5]" />
            </button>
          </span>
          <button onClick={clearFilter} className="text-caption text-ink-tertiary underline hover:text-ink-secondary">
            전체 지점 보기
          </button>
        </div>
      )}

      {/* Gym List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-heading">헬스장</h2>
          <span className="text-body text-ink-placeholder">{filteredGyms.length}개</span>
        </div>

        {filteredGyms.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-body text-ink-tertiary mb-2">조건에 맞는 지점이 없어요</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {activeProgram !== 'all' && (
                <button
                  onClick={() => setActiveProgram('all')}
                  className="px-4 py-2 bg-ink text-white text-label font-bold rounded-pill hover:opacity-90 transition-opacity"
                >
                  전체 분류 보기
                </button>
              )}
              {selectedBranch && (
                <button
                  onClick={clearFilter}
                  className="px-4 py-2 bg-primary text-white text-label font-bold rounded-pill hover:bg-primary-dark transition-colors"
                >
                  전체 지점 보기
                </button>
              )}
            </div>
          </div>
        ) : (
        <div className="flex flex-col gap-4">
          {filteredGyms.map((gym) => (
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
                {gym.programs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {gym.programs.map(p => {
                      const label = programTabs.find(t => t.id === p)?.label ?? p
                      const active = activeProgram === p
                      return (
                        <span
                          key={p}
                          className={`inline-flex items-center px-2 py-0.5 rounded-pill text-caption font-semibold ${
                            active
                              ? 'bg-primary text-white'
                              : 'bg-surface-muted text-ink-secondary'
                          }`}
                        >
                          {label}
                        </span>
                      )
                    })}
                  </div>
                )}
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
        )}
      </section>
    </PageLayout>
  )
}
