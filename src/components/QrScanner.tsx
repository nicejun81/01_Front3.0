import { useState, useEffect, useCallback, useRef } from 'react'

export const QrScanner = () => {
  const [showQr, setShowQr] = useState(false)
  const [qrVisible, setQrVisible] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  const closeQr = useCallback(() => {
    setQrVisible(false)
    stopCamera()
    setTimeout(() => {
      setShowQr(false)
      setScanResult(null)
    }, 300)
  }, [stopCamera])

  const openQr = useCallback(() => {
    setScanResult(null)
    setShowQr(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setQrVisible(true))
    })
  }, [])

  useEffect(() => {
    const handler = () => openQr()
    window.addEventListener('open-qr-scanner', handler)
    return () => window.removeEventListener('open-qr-scanner', handler)
  }, [openQr])

  useEffect(() => {
    if (!showQr || !qrVisible) return
    let cancelled = false
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [showQr, qrVisible])

  if (!showQr) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-300 ${
        qrVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />

      <div
        className="absolute z-10"
        style={{
          width: '200px',
          height: '200px',
          left: '50%',
          top: '40%',
          marginLeft: '-100px',
          marginTop: '-100px',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        <div className="absolute" style={{ top: -2, left: -2, width: 36, height: 36, borderTop: '3px solid white', borderLeft: '3px solid white', borderRadius: '12px 0 0 0' }} />
        <div className="absolute" style={{ top: -2, right: -2, width: 36, height: 36, borderTop: '3px solid white', borderRight: '3px solid white', borderRadius: '0 12px 0 0' }} />
        <div className="absolute" style={{ bottom: -2, left: -2, width: 36, height: 36, borderBottom: '3px solid white', borderLeft: '3px solid white', borderRadius: '0 0 0 12px' }} />
        <div className="absolute" style={{ bottom: -2, right: -2, width: 36, height: 36, borderBottom: '3px solid white', borderRight: '3px solid white', borderRadius: '0 0 12px 0' }} />
        <div className="absolute left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-scan-line" />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-3 pb-3">
        <button onClick={closeQr} className="p-2 -ml-2">
          <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white stroke-2 fill-none">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-title font-bold text-white">QR 스캔</h3>
        <div className="w-10" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center px-5 pb-8 pt-6">
        {scanResult ? (
          <div className="bg-white rounded-card px-6 py-4 text-center mb-5 w-full">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-green-500 stroke-2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-body font-semibold text-ink">입장이 확인되었습니다</span>
            </div>
            <p className="text-label text-ink-secondary">바디채널 강남점</p>
          </div>
        ) : (
          <p className="text-body text-white/80 mb-5">헬스장 QR코드를 스캔해주세요</p>
        )}
        <button
          onClick={closeQr}
          className="w-full py-3.5 bg-white/15 backdrop-blur text-white text-body font-semibold rounded-card border border-white/20 transition-colors hover:bg-white/25"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
