import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconQrCode } from './Icons'
import { ChatButton } from './SubPageHeader'

export const Header = () => {
  const navigate = useNavigate()
  const [branchName, setBranchName] = useState(localStorage.getItem('selectedBranch') || '바디채널 강남점')

  const openQr = () => window.dispatchEvent(new Event('open-qr-scanner'))

  // localStorage 변경 감지 (지점 선택 페이지에서 돌아올 때)
  useEffect(() => {
    const onStorage = () => setBranchName(localStorage.getItem('selectedBranch') || '바디채널 강남점')
    window.addEventListener('storage', onStorage)
    // popstate로도 감지 (같은 탭 내 뒤로가기)
    const onFocus = () => setBranchName(localStorage.getItem('selectedBranch') || '바디채널 강남점')
    window.addEventListener('focus', onFocus)
    window.addEventListener('popstate', onFocus)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', onFocus); window.removeEventListener('popstate', onFocus) }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-page py-3.5">
        {/* Left: Branch Selector */}
        <button
          onClick={() => navigate('/branch')}
          className="flex items-center gap-1.5 active:opacity-70 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-ink stroke-[1.5]">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="text-title font-bold text-ink">{branchName}</span>
          <svg viewBox="0 0 20 20" className="w-4 h-4 fill-ink/50 mt-px">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button onClick={openQr} className="icon-btn" title="QR 입장">
            <IconQrCode className="w-5 h-5 stroke-ink stroke-[1.5] fill-none" />
          </button>
          <ChatButton />
        </div>
      </div>
    </header>
  )
}
