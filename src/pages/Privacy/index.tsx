import { memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconChevronRight, IconLock, IconUser, IconShield, IconX, IconEye, IconEyeOff } from '../../components/Icons'

const STORAGE_KEY = 'privacySettings'

type PrivacyState = {
  allowDM: boolean
  allowComment: boolean
  adPersonalization: boolean
  locationTracking: boolean
  marketing: boolean
}

const DEFAULT_STATE: PrivacyState = {
  allowDM: true,
  allowComment: true,
  adPersonalization: true,
  locationTracking: false,
  marketing: false,
}

const load = (): PrivacyState => {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (s && typeof s === 'object') return { ...DEFAULT_STATE, ...s }
  } catch { /* noop */ }
  return DEFAULT_STATE
}

// ─── 토글 스위치 ─────────────────────────────────────
const Toggle = memo(({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    role="switch"
    aria-checked={checked}
    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
      checked ? 'bg-primary' : 'bg-border'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
))
Toggle.displayName = 'Toggle'

// ─── 토글 행 ─────────────────────────────────────────
interface RowProps {
  label: string
  description?: string
  checked: boolean
  onToggle: () => void
}

const ToggleRow = memo(({ label, description, checked, onToggle }: RowProps) => (
  <div className="flex items-center gap-3 py-3.5 border-b border-border-light last:border-0">
    <div className="flex-1 min-w-0">
      <div className="text-body text-ink font-semibold">{label}</div>
      {description && (
        <p className="text-caption text-ink-tertiary mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <Toggle checked={checked} onChange={onToggle} />
  </div>
))
ToggleRow.displayName = 'ToggleRow'

// ─── 섹션 헤더 ───────────────────────────────────────
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 px-page pt-6 pb-2">
    <span className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-primary">
      {icon}
    </span>
    <h3 className="text-label font-extrabold text-ink tracking-wider">{title}</h3>
  </div>
)

// ─── 링크 행 ─────────────────────────────────────────
const LinkRow = memo(({ label, description, onClick }: { label: string; description?: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 py-3.5 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors text-left"
  >
    <div className="flex-1 min-w-0">
      <div className="text-body text-ink font-semibold">{label}</div>
      {description && (
        <p className="text-caption text-ink-tertiary mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <IconChevronRight className="w-4 h-4 stroke-ink-disabled stroke-[1.5] flex-shrink-0" />
  </button>
))
LinkRow.displayName = 'LinkRow'

// ─── 페이지 ──────────────────────────────────────────
export const PrivacyPage = () => {
  const navigate = useNavigate()
  const [state, setState] = useState<PrivacyState>(load)
  const [toast, setToast] = useState<string | null>(null)
  const [pwOpen, setPwOpen] = useState(false)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteAck, setDeleteAck] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1600)
    return () => clearTimeout(id)
  }, [toast])

  const toggle = useCallback(<K extends keyof PrivacyState>(key: K) => () => {
    setState(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const openDeleteModal = useCallback(() => {
    setDeleteAck(false)
    setDeleteOpen(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteOpen(false)
    setDeleteAck(false)
  }, [])

  const confirmDelete = useCallback(() => {
    if (!deleteAck) return
    localStorage.clear()
    setDeleteOpen(false)
    setDeleteAck(false)
    setToast('탈퇴가 완료됐어요. 그동안 이용해 주셔서 감사해요')
    setTimeout(() => navigate('/login', { replace: true }), 1400)
  }, [deleteAck, navigate])

  const openPasswordModal = useCallback(() => setPwOpen(true), [])

  const closePasswordModal = useCallback(() => {
    setPwOpen(false)
    setPwCurrent('')
    setPwNew('')
    setPwConfirm('')
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
  }, [])

  const submitPassword = useCallback(() => {
    if (!pwCurrent) {
      setToast('현재 비밀번호를 입력해 주세요')
      return
    }
    if (pwNew.length < 8) {
      setToast('새 비밀번호는 8자 이상이어야 해요')
      return
    }
    if (pwNew === pwCurrent) {
      setToast('현재 비밀번호와 다르게 설정해 주세요')
      return
    }
    if (pwNew !== pwConfirm) {
      setToast('새 비밀번호가 일치하지 않아요')
      return
    }
    closePasswordModal()
    setToast('비밀번호가 변경됐어요')
  }, [pwCurrent, pwNew, pwConfirm, closePasswordModal])

  return (
    <PageLayout
      header={<SubPageHeader title="개인정보 보호" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 인트로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-5 pb-4 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-card bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconShield className="w-5 h-5 stroke-primary stroke-[1.8]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-title font-extrabold text-ink">개인정보 보호</h1>
            <p className="text-label text-ink-tertiary mt-1">
              공개 범위와 데이터 사용 방식을 직접 관리할 수 있어요
            </p>
          </div>
        </div>
      </div>

      {/* 상호작용 */}
      <SectionHeader icon={<IconShield className="w-4 h-4 stroke-[1.5]" />} title="상호작용" />
      <div className="px-page">
        <ToggleRow
          label="메시지 받기"
          description="팔로우하지 않은 사용자에게도 메시지를 받아요"
          checked={state.allowDM}
          onToggle={toggle('allowDM')}
        />
        <ToggleRow
          label="댓글 허용"
          description="내 피드에 댓글을 남길 수 있도록 허용"
          checked={state.allowComment}
          onToggle={toggle('allowComment')}
        />
      </div>

      {/* 데이터 사용 */}
      <SectionHeader icon={<IconLock className="w-4 h-4 stroke-[1.5]" />} title="데이터 사용" />
      <div className="px-page">
        <ToggleRow
          label="맞춤형 광고"
          description="활동 기반 추천 광고를 볼 수 있어요"
          checked={state.adPersonalization}
          onToggle={toggle('adPersonalization')}
        />
        <ToggleRow
          label="위치 정보 수집"
          description="주변 지점·모임 추천을 위해 위치를 사용"
          checked={state.locationTracking}
          onToggle={toggle('locationTracking')}
        />
        <ToggleRow
          label="마케팅 정보 수신"
          description="이벤트·혜택 알림을 이메일/푸시로 받아요"
          checked={state.marketing}
          onToggle={toggle('marketing')}
        />
      </div>

      {/* 계정 관리 */}
      <SectionHeader icon={<IconUser className="w-4 h-4 stroke-[1.5]" />} title="계정 관리" />
      <div className="px-page">
        <LinkRow
          label="비밀번호 변경"
          description="마지막 변경: 2026.01.12"
          onClick={openPasswordModal}
        />
        <LinkRow
          label="계정 탈퇴"
          description="계정 및 모든 데이터를 영구 삭제해요"
          onClick={openDeleteModal}
        />
      </div>

      {/* 비밀번호 변경 모달 */}
      {pwOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={closePasswordModal}
        >
          <div
            className="w-full max-w-[480px] bg-surface rounded-t-card-lg pt-3 pb-5 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
            <div className="px-page">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-title font-extrabold text-ink">비밀번호 변경</h3>
                <button
                  onClick={closePasswordModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
                  aria-label="닫기"
                >
                  <IconX className="w-4 h-4 stroke-ink stroke-2" />
                </button>
              </div>
              <p className="text-caption text-ink-tertiary mb-4">
                안전을 위해 영문·숫자·특수문자를 포함한 8자 이상을 권장해요
              </p>

              {/* 현재 비밀번호 */}
              <label className="block text-caption font-bold text-ink-secondary mb-1.5">현재 비밀번호</label>
              <div className="relative mb-4">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={pwCurrent}
                  onChange={e => setPwCurrent(e.target.value)}
                  placeholder="현재 비밀번호"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-tertiary hover:text-ink transition-colors"
                  aria-label={showCurrent ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showCurrent
                    ? <IconEyeOff className="w-4 h-4 stroke-current stroke-[1.8]" />
                    : <IconEye className="w-4 h-4 stroke-current stroke-[1.8]" />}
                </button>
              </div>

              {/* 새 비밀번호 */}
              <label className="block text-caption font-bold text-ink-secondary mb-1.5">새 비밀번호</label>
              <div className="relative mb-4">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={pwNew}
                  onChange={e => setPwNew(e.target.value)}
                  placeholder="새 비밀번호 (8자 이상)"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-tertiary hover:text-ink transition-colors"
                  aria-label={showNew ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showNew
                    ? <IconEyeOff className="w-4 h-4 stroke-current stroke-[1.8]" />
                    : <IconEye className="w-4 h-4 stroke-current stroke-[1.8]" />}
                </button>
              </div>

              {/* 새 비밀번호 확인 */}
              <label className="block text-caption font-bold text-ink-secondary mb-1.5">새 비밀번호 확인</label>
              <div className="relative mb-5">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={pwConfirm}
                  onChange={e => setPwConfirm(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  autoComplete="new-password"
                  className={`w-full px-3.5 py-2.5 pr-10 bg-surface-muted rounded-card text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 ${
                    pwConfirm && pwConfirm !== pwNew
                      ? 'ring-2 ring-semantic-like/60'
                      : 'focus:ring-primary/40'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-tertiary hover:text-ink transition-colors"
                  aria-label={showConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showConfirm
                    ? <IconEyeOff className="w-4 h-4 stroke-current stroke-[1.8]" />
                    : <IconEye className="w-4 h-4 stroke-current stroke-[1.8]" />}
                </button>
              </div>

              <button
                onClick={submitPassword}
                className="w-full py-3 bg-primary text-white text-body font-extrabold rounded-card hover:bg-primary-dark active:scale-[0.99] transition-all"
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 계정 탈퇴 확인 모달 */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-[480px] bg-surface rounded-t-card-lg pt-3 pb-5 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
            <div className="px-page">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-title font-extrabold text-ink">정말 탈퇴하시겠어요?</h3>
                <button
                  onClick={closeDeleteModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
                  aria-label="닫기"
                >
                  <IconX className="w-4 h-4 stroke-ink stroke-2" />
                </button>
              </div>
              <p className="text-caption text-ink-tertiary mb-4">
                탈퇴하면 계정과 모든 데이터가 영구 삭제되며 복구할 수 없어요
              </p>

              <div className="bg-primary-50 border border-primary/30 rounded-card p-3.5 mb-4">
                <ul className="space-y-1.5 text-caption text-ink-secondary leading-relaxed">
                  <li>• 프로필·피드·메시지 등 모든 활동 기록이 삭제돼요</li>
                  <li>• 보유한 쿠폰·포인트·잔여 이용권이 함께 소멸돼요</li>
                  <li>• 동일 이메일로는 30일간 재가입할 수 없어요</li>
                </ul>
              </div>

              <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deleteAck}
                  onChange={e => setDeleteAck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                />
                <span className="text-label text-ink-secondary leading-relaxed">
                  위 내용을 모두 확인했으며, 탈퇴에 동의합니다
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 py-3 bg-surface-muted text-ink text-body font-extrabold rounded-card hover:bg-border-light active:scale-[0.99] transition-all"
                >
                  취소
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={!deleteAck}
                  className="flex-1 py-3 bg-primary text-white text-body font-extrabold rounded-card hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </PageLayout>
  )
}
