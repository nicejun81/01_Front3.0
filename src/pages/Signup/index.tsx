import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconEye, IconEyeOff, IconMail, IconLock, IconUser, IconPhone } from '../../components/Icons'

const CODE_TTL = 180 // seconds

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length < 4) return d
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

export const SignupPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agreeAll, setAgreeAll] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  useEffect(() => {
    if (!codeSent || verified || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [codeSent, verified, timeLeft])

  const showToast = useCallback((m: string) => setToast(m), [])

  const timerMMSS = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`

  const sendCode = useCallback(() => {
    setCode('')
    setCodeSent(true)
    setVerified(false)
    setTimeLeft(CODE_TTL)
    showToast('인증번호가 전송되었어요')
  }, [showToast])

  const verifyCode = useCallback(() => {
    if (timeLeft <= 0) return showToast('인증 시간이 만료되었어요. 재전송해 주세요')
    setVerified(true)
    setTimeLeft(0)
    showToast('인증이 완료되었어요')
  }, [timeLeft, showToast])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValid = password.length >= 6
  const passwordMatch = password.length > 0 && password === passwordConfirm
  const canSubmit =
    name.trim().length >= 2 &&
    verified &&
    emailValid &&
    passwordValid &&
    passwordMatch &&
    agreeTerms &&
    agreePrivacy &&
    !loading

  const toggleAll = (v: boolean) => {
    setAgreeAll(v)
    setAgreeTerms(v)
    setAgreePrivacy(v)
    setAgreeMarketing(v)
  }

  useEffect(() => {
    const all = agreeTerms && agreePrivacy && agreeMarketing
    if (all !== agreeAll) setAgreeAll(all)
  }, [agreeTerms, agreePrivacy, agreeMarketing, agreeAll])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!canSubmit) {
        if (name.trim().length < 2) return showToast('이름은 2자 이상 입력해 주세요')
        if (!verified) return showToast('휴대폰 인증을 완료해 주세요')
        if (!emailValid) return showToast('이메일 형식을 확인해 주세요')
        if (!passwordValid) return showToast('비밀번호는 6자 이상이어야 해요')
        if (!passwordMatch) return showToast('비밀번호가 일치하지 않아요')
        if (!agreeTerms || !agreePrivacy) return showToast('필수 약관에 동의해 주세요')
        return
      }
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        navigate(`/signup/complete?name=${encodeURIComponent(name.trim())}`, { replace: true })
      }, 800)
    },
    [canSubmit, name, verified, emailValid, passwordValid, passwordMatch, agreeTerms, agreePrivacy, navigate, showToast]
  )

  return (
    <PageLayout header={<SubPageHeader title="회원가입" />} hideBottomNav>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 pt-2">
        <label className="flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
          <IconUser className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름"
            autoComplete="name"
            className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
          />
        </label>

        <div className="flex items-stretch gap-2">
          <label className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
            <IconPhone className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
            <input
              type="tel"
              value={phone}
              onChange={e => {
                if (verified) return
                setPhone(formatPhone(e.target.value))
              }}
              disabled={verified}
              placeholder="휴대폰 번호"
              autoComplete="tel"
              inputMode="numeric"
              className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none disabled:text-ink-secondary"
            />
            {verified && (
              <span className="text-caption font-bold text-primary flex-shrink-0">✓ 인증완료</span>
            )}
          </label>
          {!verified && (
            <button
              type="button"
              onClick={sendCode}
              className="flex-shrink-0 px-3.5 whitespace-nowrap bg-ink text-white text-label font-bold rounded-card-lg active:scale-[0.99] transition-all"
            >
              {codeSent ? '재전송' : '인증번호 받기'}
            </button>
          )}
        </div>

        {codeSent && !verified && (
          <div className="flex items-stretch gap-2">
            <label className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="인증번호 6자리"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none tracking-widest"
              />
              <span className={`text-caption font-bold flex-shrink-0 tabular-nums ${timeLeft <= 30 ? 'text-semantic-like' : 'text-primary'}`}>
                {timerMMSS}
              </span>
            </label>
            <button
              type="button"
              onClick={verifyCode}
              disabled={code.length !== 6 || timeLeft <= 0}
              className="flex-shrink-0 px-4 whitespace-nowrap bg-primary text-white text-label font-bold rounded-card-lg active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              확인
            </button>
          </div>
        )}

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
            placeholder="비밀번호 (6자 이상)"
            autoComplete="new-password"
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

        <label className="flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
          <IconLock className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
          <input
            type={showPw ? 'text' : 'password'}
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
          />
        </label>
        {passwordConfirm.length > 0 && !passwordMatch && (
          <p className="text-caption text-semantic-like ml-1">비밀번호가 일치하지 않아요</p>
        )}

        <div className="mt-4 p-4 bg-surface-muted rounded-card-lg flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox checked={agreeAll} onChange={toggleAll} />
            <span className="text-body font-bold text-ink">모두 동의합니다</span>
          </label>
          <div className="h-px bg-border-light" />
          <label className="flex items-center justify-between cursor-pointer select-none">
            <span className="flex items-center gap-2.5">
              <Checkbox checked={agreeTerms} onChange={setAgreeTerms} />
              <span className="text-caption text-ink-secondary">
                <span className="text-semantic-like font-bold">[필수] </span>
                이용약관 동의
              </span>
            </span>
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className="text-caption text-ink-tertiary underline"
            >
              보기
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer select-none">
            <span className="flex items-center gap-2.5">
              <Checkbox checked={agreePrivacy} onChange={setAgreePrivacy} />
              <span className="text-caption text-ink-secondary">
                <span className="text-semantic-like font-bold">[필수] </span>
                개인정보 처리방침 동의
              </span>
            </span>
            <button
              type="button"
              onClick={() => navigate('/privacy-policy')}
              className="text-caption text-ink-tertiary underline"
            >
              보기
            </button>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox checked={agreeMarketing} onChange={setAgreeMarketing} />
            <span className="text-caption text-ink-secondary">[선택] 마케팅 정보 수신 동의</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-4 w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '가입 중…' : '가입하기'}
        </button>

        <div className="text-center mt-4">
          <span className="text-caption text-ink-tertiary">이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-caption font-extrabold text-primary hover:underline"
          >
            로그인
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </PageLayout>
  )
}

interface CheckboxProps {
  checked: boolean
  onChange: (v: boolean) => void
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
      checked ? 'bg-primary' : 'bg-surface border border-border'
    }`}
  >
    {checked && (
      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-white stroke-[3]" fill="none">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
)
