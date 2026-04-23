import { memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconEyeOff, IconMail, IconLock } from '../../components/Icons'

type Provider = 'kakao'

const PROVIDER_META: Record<Provider, { label: string; bg: string; fg: string; icon: React.ReactNode }> = {
  kakao: {
    label: '카카오로 계속하기',
    bg: 'bg-[#FEE500] hover:brightness-95',
    fg: 'text-[#191919]',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.42 2 10.67c0 2.7 1.82 5.06 4.56 6.42l-.94 3.47c-.09.33.28.58.57.39l4.13-2.75c.55.06 1.12.09 1.68.09 5.52 0 10-3.42 10-7.66C22 6.42 17.52 3 12 3z" />
      </svg>
    ),
  },
}

interface SocialButtonProps {
  provider: Provider
  onClick: (p: Provider) => void
}

const SocialButton = memo(({ provider, onClick }: SocialButtonProps) => {
  const m = PROVIDER_META[provider]
  return (
    <button
      onClick={() => onClick(provider)}
      className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-card-lg text-body font-bold active:scale-[0.99] transition-all ${m.bg} ${m.fg}`}
    >
      {m.icon}
      <span>{m.label}</span>
    </button>
  )
})
SocialButton.displayName = 'SocialButton'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const showToast = useCallback((m: string) => setToast(m), [])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const canSubmit  = emailValid && password.length >= 6 && !loading

  const handleSocial = useCallback((p: Provider) => {
    setLoading(true)
    showToast(`${PROVIDER_META[p].label.replace('로 계속하기', '')} 인증 중…`)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 900)
  }, [navigate, showToast])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) {
      if (!emailValid) showToast('이메일 형식을 확인해 주세요')
      else showToast('비밀번호는 6자 이상이어야 해요')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 800)
  }, [canSubmit, emailValid, navigate, showToast])

  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      {/* 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-14 pb-10">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-8 top-16 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-card-lg bg-white ring-1 ring-border-light flex items-center justify-center shadow-elevated mb-4 overflow-hidden">
            <img
              src="/img/logo07.png"
              alt="바디채널"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h1 className="text-display font-extrabold text-ink leading-tight">
            다시 만나서<br />반가워요
          </h1>
          <p className="text-body text-ink-tertiary mt-2">
            로그인하고 오늘의 운동을 기록해 볼까요?
          </p>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 px-page pt-6 pb-8">
        {/* 소셜 로그인 */}
        <div className="flex flex-col gap-2">
          <SocialButton provider="kakao" onClick={handleSocial} />
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6" role="separator">
          <span className="flex-1 h-px bg-border-light" />
          <span className="text-caption text-ink-placeholder">또는</span>
          <span className="flex-1 h-px bg-border-light" />
        </div>

        {/* 이메일 로그인 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
            <IconMail className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일"
              autoComplete="email"
              className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
            />
          </label>

          <label className="flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
            <IconLock className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-border-light flex-shrink-0"
              aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPw ? (
                <IconEyeOff className="w-4 h-4 stroke-ink-tertiary stroke-[1.8]" />
              ) : (
                <IconEye className="w-4 h-4 stroke-ink-tertiary stroke-[1.8]" />
              )}
            </button>
          </label>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setRemember(v => !v)}
                role="switch"
                aria-checked={remember}
                className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                  remember ? 'bg-primary' : 'bg-surface border border-border'
                }`}
              >
                {remember && (
                  <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-white stroke-[3]" fill="none">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-caption text-ink-secondary">자동 로그인</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/find-password')}
              className="text-caption text-ink-tertiary hover:text-ink-secondary"
            >
              비밀번호 찾기
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-3 w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중…' : '로그인'}
          </button>
        </form>

        {/* 회원가입 */}
        <div className="text-center mt-7">
          <span className="text-caption text-ink-tertiary">아직 회원이 아니신가요? </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-caption font-extrabold text-primary hover:underline"
          >
            회원가입
          </button>
        </div>

        {/* 정책 링크 */}
        <div className="flex items-center justify-center gap-3 mt-4 text-caption text-ink-placeholder">
          <button onClick={() => navigate('/terms')} className="hover:underline">이용약관</button>
          <span className="w-0.5 h-0.5 rounded-full bg-ink-placeholder" />
          <button onClick={() => navigate('/privacy-policy')} className="hover:underline font-bold">개인정보 처리방침</button>
        </div>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </div>
  )
}
