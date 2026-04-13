import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { gymsData } from '../GymDetail'
import { IconStarFilled } from '../../components/Icons'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const branches = [
  { id: 'gym1', distance: '현재 위치', tag: '내 지점' },
  { id: 'gym2', distance: '1.2km' },
  { id: 'gym3', distance: '2.1km' },
  { id: 'gym4', distance: '15.3km' },
  { id: 'gym5', distance: '1.8km' },
]

export const BranchSelectPage = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (viewMode !== 'map' || !mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [37.498, 127.035],
      zoom: 14,
      zoomControl: false,
    })
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
    }).addTo(map)

    L.control.zoom({ position: 'topright' }).addTo(map)

    branches.forEach(branch => {
      const gym = gymsData[branch.id]
      if (!gym) return
      const isPrimary = !!branch.tag
      const displayName = gym.name

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: pointer;
        ">
          <div style="
            background: ${isPrimary ? '#FF6B35' : '#0a0a0a'};
            color: white;
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 3px 12px rgba(0,0,0,0.3);
            font-family: Poppins, sans-serif;
            letter-spacing: -0.02em;
          ">${displayName}</div>
          <div style="
            width: 0; height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid ${isPrimary ? '#FF6B35' : '#0a0a0a'};
            margin-top: -1px;
          "></div>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })

      L.marker([gym.lat, gym.lng], { icon })
        .addTo(map)
        .on('click', () => setSelectedPin(branch.id))
    })

    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [viewMode])

  const header = (
    <SubPageHeader title="지점 선택">
      <div className="flex">
        {([{ key: 'list', label: '목록' }, { key: 'map', label: '지도' }] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => { setViewMode(tab.key); if (tab.key === 'list') setSelectedPin(null) }}
            className={`flex-1 py-3 text-body font-semibold text-center border-b-2 transition-colors ${
              viewMode === tab.key
                ? 'text-ink border-ink'
                : 'text-ink-placeholder border-transparent hover:text-ink-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </SubPageHeader>
  )

  return (
    <PageLayout header={header} hideBottomNav noPadding={viewMode === 'map'}>
      {viewMode === 'list' ? (
        <div className="flex flex-col px-page py-4">
          {branches.map(branch => {
            const gym = gymsData[branch.id]
            if (!gym) return null
            return (
              <button
                key={branch.id}
                onClick={() => { localStorage.setItem('selectedBranch', gym.name); navigate('/') }}
                className="w-full flex items-center gap-3 py-4 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors text-left"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 fill-none stroke-[1.5] stroke-ink-tertiary">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-body font-bold text-ink">{gym.name}</span>
                    {branch.tag && (
                      <span className="px-1.5 py-0.5 bg-primary text-white text-caption font-bold rounded">{branch.tag}</span>
                    )}
                  </div>
                  <span className="text-caption text-ink-tertiary">{gym.address}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <div className="flex items-center gap-0.5">
                    <IconStarFilled className="w-3 h-3 text-semantic-star" />
                    <span className="text-caption font-bold text-ink-secondary">{gym.rating}</span>
                  </div>
                  <span className="text-caption text-ink-placeholder">{branch.distance}</span>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="relative" style={{ height: 'calc(100vh - 105px)' }}>
          <div ref={mapRef} className="w-full h-full" />

          {/* 선택된 핀의 카드 */}
          {selectedPin && (() => {
            const branch = branches.find(b => b.id === selectedPin)
            const gym = branch ? gymsData[branch.id] : null
            if (!branch || !gym) return null
            return (
              <div className="absolute bottom-4 left-4 right-4 z-[1000]">
                <button
                  onClick={() => { localStorage.setItem('selectedBranch', gym.name); navigate('/') }}
                  className="w-full flex items-center gap-3 p-card-lg bg-surface rounded-card shadow-elevated text-left"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 fill-none stroke-[1.5] stroke-primary">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-body font-bold text-ink">{gym.name}</span>
                      {branch.tag && (
                        <span className="px-1.5 py-0.5 bg-primary text-white text-caption font-bold rounded">{branch.tag}</span>
                      )}
                    </div>
                    <span className="text-caption text-ink-tertiary">{gym.address}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <div className="flex items-center gap-0.5">
                      <IconStarFilled className="w-3 h-3 text-semantic-star" />
                      <span className="text-caption font-bold text-ink-secondary">{gym.rating}</span>
                    </div>
                    <span className="text-caption text-ink-placeholder">{branch.distance}</span>
                  </div>
                </button>
              </div>
            )
          })()}
        </div>
      )}
    </PageLayout>
  )
}
