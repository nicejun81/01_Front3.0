import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconMail, IconLock, IconEye, IconEyeOff } from '../../components/Icons'

type Step = 'request' | 'verify' | 'reset' | 'done'

const CODE_TTL = 180

export const FindPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  useEffect(() => {
    if (step !== 'verify' || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [step, timeLeft])

  const showToast = useCallback((m: string) => setToast(m), [])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValid = password.length >= 6
  const passwordMatch = password.length > 0 && password === passwordConfirm
  const timerMMSS = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`

  const sendCode = useCallback(() => {
    if (!emailValid) return showToast('이메일 형식을 확인해 주세요')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('verify')
      setCode('')
      setTimeLeft(CODE_TTL)
      showToast('인증번호가 이메일로 전송되었어요')
    }, 600)
  }, [emailValid, showToast])

  const verifyCode = useCallback(() => {
    if (timeLeft <= 0) return showToast('인증 시간이 만료되었어요. 재전송해 주세요')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('reset')
      showToast('인증이 완료되었어요')
    }, 400)
  }, [timeLeft, showToast])

  const resetPassword = useCallback(() => {
    if (!passwordValid) return showToast('비밀번호는 6자 이상이어야 해요')
    if (!passwordMatch) return showToast('비밀번호가 일치하지 않아요')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('done')
    }, 600)
  }, [passwordValid, passwordMatch, showToast])

  return (
    <PageLayout header={<SubPageHeader title="비밀번호 찾기" />} hideBottomNav>
      <div className="pt-2">
        {/* 진행 표시 */}
        {step !== 'done' && (
          <div className="flex items-center gap-2 mb-6">
            <StepDot active={step === 'request'} done={step !== 'request'} label="이메일" />
            <StepLine done={step !== 'request'} />
            <StepDot active={step === 'verify'} done={step === 'reset'} label="인증" />
            <StepLine done={step === 'reset'} />
            <StepDot active={step === 'reset'} done={false} label="재설정" />
          </div>
        )}

        {/* 1단계: 이메일 */}
        {step === 'request' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-heading font-extrabold text-ink">가입한 이메일을 입력해 주세요</h2>
              <p className="text-body text-ink-tertiary mt-1.5 leading-snug">
                입력한 이메일로 인증번호를 보내드려요
              </p>
            </div>
            <label className="flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
              <IconMail className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일"
                autoComplete="email"
                autoFocus
                className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
              />
            </label>
            <button
              type="button"
              onClick={sendCode}
              disabled={!emailValid || loading}
              className="mt-2 w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '전송 중…' : '인증번호 받기'}
            </button>
          </div>
        )}

        {/* 2단계: 인증번호 */}
        {step === 'verify' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-heading font-extrabold text-ink">인증번호를 입력해 주세요</h2>
              <p className="text-body text-ink-tertiary mt-1.5 leading-snug">
                <span className="font-semibold text-ink">{email}</span>로 전송된<br />6자리 인증번호를 입력해 주세요
              </p>
            </div>
            <div className="flex items-stretch gap-2">
              <label className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="인증번호 6자리"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none tracking-widest"
                />
                <span className={`text-caption font-bold flex-shrink-0 tabular-nums ${timeLeft <= 30 ? 'text-semantic-like' : 'text-primary'}`}>
                  {timerMMSS}
                </span>
              </label>
              <button
                type="button"
                onClick={sendCode}
                className="flex-shrink-0 px-3.5 whitespace-nowrap bg-ink text-white text-label font-bold rounded-card-lg active:scale-[0.99] transition-all"
              >
                재전송
              </button>
            </div>
            <button
              type="button"
              onClick={verifyCode}
              disabled={code.length === 0 || loading}
              className="mt-2 w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '확인 중…' : '인증하기'}
            </button>
          </div>
        )}

        {/* 3단계: 새 비밀번호 */}
        {step === 'reset' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-heading font-extrabold text-ink">새 비밀번호를 설정해 주세요</h2>
              <p className="text-body text-ink-tertiary mt-1.5 leading-snug">
                안전한 비밀번호로 계정을 지켜주세요
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2 px-3.5 py-3 bg-surface-muted rounded-card-lg focus-within:ring-2 focus-within:ring-primary/40 transition">
                <IconLock className="w-4 h-4 stroke-ink-tertiary stroke-2 flex-shrink-0" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="새 비밀번호 (6자 이상)"
                  autoComplete="new-password"
                  autoFocus
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
                  placeholder="새 비밀번호 확인"
                  autoComplete="new-password"
                  className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-placeholder outline-none"
                />
              </label>
              {passwordConfirm.length > 0 && !passwordMatch && (
                <p className="text-caption text-semantic-like ml-1">비밀번호가 일치하지 않아요</p>
              )}
            </div>
            <button
              type="button"
              onClick={resetPassword}
              disabled={!passwordValid || !passwordMatch || loading}
              className="mt-2 w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? '변경 중…' : '비밀번호 변경하기'}
            </button>
          </div>
        )}

        {/* 완료 */}
        {step === 'done' && (
          <div className="flex flex-col items-center text-center pt-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl scale-110" />
              <div className="relative w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center shadow-elevated ring-8 ring-primary/10">
                <svg viewBox="0 0 24 24" className="w-9 h-9 stroke-white stroke-[3] fill-none">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h2 className="text-display font-extrabold text-ink leading-tight">비밀번호 변경 완료</h2>
            <p className="text-body text-ink-tertiary mt-2 leading-snug">
              새 비밀번호로 다시 로그인해 주세요
            </p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-8 w-full py-3.5 bg-primary text-white text-body font-extrabold rounded-card-lg hover:bg-primary-dark active:scale-[0.99] transition-all"
            >
              로그인하러 가기
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </PageLayout>
  )
}

interface StepDotProps {
  active: boolean
  done: boolean
  label: string
}

const StepDot = ({ active, done, label }: StepDotProps) => (
  <div className="flex flex-col items-center gap-1 flex-shrink-0">
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center text-caption font-extrabold transition-colors ${
        done
          ? 'bg-primary text-white'
          : active
            ? 'bg-primary text-white ring-4 ring-primary/15'
            : 'bg-surface-muted text-ink-placeholder'
      }`}
    >
      {done ? (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white stroke-[3]" fill="none">
          <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        label[0]
      )}
    </span>
    <span className={`text-caption ${active ? 'text-ink font-bold' : done ? 'text-ink-secondary' : 'text-ink-placeholder'}`}>
      {label}
    </span>
  </div>
)

const StepLine = ({ done }: { done: boolean }) => (
  <span className={`flex-1 h-px transition-colors ${done ? 'bg-primary' : 'bg-border'} -mt-5`} />
)
