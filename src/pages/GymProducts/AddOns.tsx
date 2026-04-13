import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'

interface AddonOption { label: string; price: number; tag?: string; best?: boolean }
interface Addon { name: string; img: string; desc: string; monthlyPrice: number; options: AddonOption[] }

const addons: Addon[] = [
  {
    name: '개인 락커', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=80&h=80&fit=crop', desc: '개인 물품 보관 전용 락커', monthlyPrice: 30000,
    options: [
      { label: '1개월', price: 30000 },
      { label: '3개월', price: 80000, tag: '11% OFF', best: true },
      { label: '6개월', price: 150000, tag: '17% OFF' },
      { label: '12개월', price: 270000, tag: '25% OFF' },
    ],
  },
  {
    name: '운동복 대여', img: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=80&h=80&fit=crop', desc: '매일 세탁된 운동복 제공', monthlyPrice: 20000,
    options: [
      { label: '1개월', price: 20000 },
      { label: '3개월', price: 54000, tag: '10% OFF' },
      { label: '6개월', price: 96000, tag: '20% OFF', best: true },
    ],
  },
  {
    name: '프리미엄 타월', img: 'https://images.unsplash.com/photo-1583922606661-0822ed0bd916?w=80&h=80&fit=crop', desc: '고급 대형 타월 무제한 이용', monthlyPrice: 10000,
    options: [
      { label: '1개월', price: 10000 },
      { label: '3개월', price: 27000, tag: '10% OFF' },
      { label: '6개월', price: 48000, tag: '20% OFF', best: true },
    ],
  },
]

export const AddOnsPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productName = searchParams.get('name') || ''
  const productPrice = searchParams.get('price') || '0'
  const gymName = searchParams.get('gym') || ''
  const durLabel = searchParams.get('dur') || ''
  const mainPriceNum = parseInt(productPrice.replace(/[^0-9]/g, ''))

  // 월 구독권 여부
  const isSubscription = durLabel.includes('구독')

  // 체크 여부 + 선택된 옵션 인덱스
  const [checked, setChecked] = useState<boolean[]>(addons.map(() => false))
  const [optIdx, setOptIdx] = useState<number[]>(addons.map(() => 0))
  const [openIdx, setOpenIdx] = useState<number>(-1)

  const toggleCheck = (ai: number) => {
    setChecked(prev => { const n = [...prev]; n[ai] = !n[ai]; return n })
    if (!checked[ai] && !isSubscription) setOpenIdx(ai)
  }

  const selectOpt = (ai: number, oi: number) => {
    setOptIdx(prev => { const n = [...prev]; n[ai] = oi; return n })
    setChecked(prev => { const n = [...prev]; n[ai] = true; return n })
  }

  const addonTotal = checked.reduce((sum, on, i) => {
    if (!on) return sum
    return sum + (isSubscription ? addons[i].monthlyPrice : addons[i].options[optIdx[i]].price)
  }, 0)
  const totalPrice = mainPriceNum + addonTotal

  const selectedAddonNames = checked
    .map((on, i) => {
      if (!on) return null
      return isSubscription ? addons[i].name : `${addons[i].name} ${addons[i].options[optIdx[i]].label}`
    })
    .filter(Boolean)
  const allNames = [productName, ...selectedAddonNames].join(' + ')

  const header = <SubPageHeader title="부가상품 추가" />

  return (
    <PageLayout header={header} hideBottomNav>
      <div className="-mx-page -mt-4 bg-surface-muted pb-[130px]">

        {/* ── 선택한 상품 요약 ── */}
        <div className="bg-surface px-page pt-5 pb-4">
          <div className="bg-primary-50 rounded-card-lg px-card-lg py-3.5 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-caption text-primary font-bold">선택한 상품</p>
              <p className="text-body font-bold text-ink mt-0.5">{productName}</p>
            </div>
            <span className="text-title text-primary flex-shrink-0 ml-3">{mainPriceNum.toLocaleString()}원{isSubscription && <span className="text-label font-normal">/월</span>}</span>
          </div>
        </div>

        <div className="h-2 bg-surface-muted" />

        {/* ── 부가상품 ── */}
        <div className="bg-surface px-page pt-4 pb-4">
          <h3 className="text-title text-ink mb-1">함께 이용하면 더 편해요</h3>
          <p className="text-label text-ink-tertiary mb-4">
            {isSubscription
              ? '선택한 부가상품은 월 구독에 함께 포함됩니다'
              : '필요한 부가상품을 선택해 주세요 (선택사항)'}
          </p>

          {isSubscription ? (
            /* ── 월 구독 모드: 간단 체크 리스트 ── */
            <div className="flex flex-col gap-3">
              {addons.map((addon, ai) => {
                const isChecked = checked[ai]
                return (
                  <button
                    key={ai}
                    onClick={() => toggleCheck(ai)}
                    className={`w-full text-left rounded-card-lg border-2 px-card-lg py-4 transition-all ${
                      isChecked ? 'border-primary bg-primary-50 shadow-card' : 'border-border bg-surface hover:border-ink-disabled'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 체크박스 */}
                      <div className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0 transition-colors ${
                        isChecked ? 'bg-primary' : 'border-2 border-ink-disabled'
                      }`}>
                        {isChecked && (
                          <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white">
                            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                          </svg>
                        )}
                      </div>
                      <img src={addon.img} alt={addon.name} className="w-11 h-11 rounded-card object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-body font-bold ${isChecked ? 'text-ink' : 'text-ink-secondary'}`}>{addon.name}</p>
                        <p className="text-caption text-ink-tertiary mt-0.5">{addon.desc}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className={`text-title font-bold ${isChecked ? 'text-primary' : 'text-ink'}`}>+{addon.monthlyPrice.toLocaleString()}</span>
                        <span className={`text-label ${isChecked ? 'text-primary' : 'text-ink-secondary'}`}>원/월</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            /* ── 일반 모드: 아코디언 + 기간 선택 ── */
            <div className="flex flex-col gap-1.5">
              {addons.map((addon, ai) => {
                const isOpen = openIdx === ai
                const isChecked = checked[ai]
                const selectedOpt = optIdx[ai]
                return (
                  <div key={ai} className={`rounded-card-lg overflow-hidden transition-all ${
                    isChecked ? 'border-2 border-primary/30 bg-primary-50/30' : 'border border-border bg-surface'
                  }`}>
                    <button
                      onClick={() => setOpenIdx(isOpen ? -1 : ai)}
                      className={`w-full flex items-center justify-between px-card-lg py-3 transition-colors ${
                        isOpen ? 'bg-primary-50' : 'hover:bg-surface-subtle'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          onClick={e => { e.stopPropagation(); toggleCheck(ai) }}
                          className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                            isChecked ? 'bg-primary' : 'border-2 border-ink-disabled'
                          }`}
                        >
                          {isChecked && (
                            <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white">
                              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                            </svg>
                          )}
                        </div>
                        <img src={addon.img} alt={addon.name} className="w-10 h-10 rounded-card object-cover flex-shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className={`text-body font-bold ${isOpen || isChecked ? 'text-primary' : 'text-ink-secondary'}`}>{addon.name}</p>
                          <p className="text-caption text-ink-tertiary truncate mt-0.5">{addon.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isChecked && !isOpen && (
                          <span className="text-label font-bold text-primary">{addons[ai].options[selectedOpt].price.toLocaleString()}원</span>
                        )}
                        <svg viewBox="0 0 20 20" className={`w-5 h-5 transition-transform ${isOpen ? 'text-primary rotate-180' : 'text-ink-tertiary'}`}>
                          <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3">
                        <div className="px-1 pt-4 pb-2">
                          <span className="text-label font-bold text-ink-tertiary tracking-wide">기간권</span>
                        </div>
                        <div className="flex flex-col gap-3">
                          {addon.options.map((opt, oi) => {
                            const active = isChecked && selectedOpt === oi
                            return (
                              <button
                                key={oi}
                                onClick={() => selectOpt(ai, oi)}
                                className={`w-full text-left rounded-card-lg border-2 px-card-lg py-3.5 transition-all ${
                                  active ? 'border-primary bg-primary-50 shadow-card' : 'border-border bg-surface hover:border-ink-disabled'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0">
                                    {active ? (
                                      <div className="w-[22px] h-[22px] rounded-full bg-primary flex items-center justify-center">
                                        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white fill-current">
                                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="w-[22px] h-[22px] rounded-full border-2 border-ink-disabled" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-body font-bold ${active ? 'text-ink' : 'text-ink-secondary'}`}>{opt.label}</span>
                                      {opt.best && <span className="px-1.5 py-0.5 bg-primary text-white text-caption font-bold rounded">추천</span>}
                                      {opt.tag && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-caption font-bold rounded">{opt.tag}</span>}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 text-right">
                                    <span className={`text-title font-bold ${active ? 'text-primary' : 'text-ink'}`}>{opt.price.toLocaleString()}</span>
                                    <span className={`text-label ${active ? 'text-primary' : 'text-ink-secondary'}`}>원</span>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <BottomCTA hideBottomNav>
        <div className="flex-1 min-w-0">
          {addonTotal > 0 && (
            <p className="text-caption text-ink-tertiary">
              {mainPriceNum.toLocaleString()} + {addonTotal.toLocaleString()}원{isSubscription && '/월'}
            </p>
          )}
          <p className="text-title font-bold text-ink">{totalPrice.toLocaleString()}원{isSubscription && <span className="text-label font-normal text-ink-tertiary">/월</span>}</p>
        </div>
        <button
          onClick={() => navigate(`/checkout?name=${encodeURIComponent(allNames)}&price=${encodeURIComponent(totalPrice.toLocaleString())}&gym=${encodeURIComponent(gymName)}`)}
          className="px-8 py-3.5 bg-primary text-white text-body font-bold rounded-card hover:bg-primary-dark transition-colors flex-shrink-0"
        >
          {addonTotal > 0 ? '결제하기' : '건너뛰기'}
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
