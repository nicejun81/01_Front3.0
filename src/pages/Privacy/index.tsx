import { memo, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconChevronRight, IconLock, IconUser, IconBell, IconShield } from '../../components/Icons'

type Visibility = 'public' | 'followers' | 'private'

const STORAGE_KEY = 'privacySettings'

type PrivacyState = {
  visibility: Visibility
  activeStatus: boolean
  readReceipt: boolean
  searchable: boolean
  allowDM: boolean
  allowMention: boolean
  allowComment: boolean
  adPersonalization: boolean
  locationTracking: boolean
  analytics: boolean
  marketing: boolean
}

const DEFAULT_STATE: PrivacyState = {
  visibility: 'public',
  activeStatus: true,
  readReceipt: true,
  searchable: true,
  allowDM: true,
  allowMention: true,
  allowComment: true,
  adPersonalization: true,
  locationTracking: false,
  analytics: true,
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

// ─── 공개 범위 라디오 ─────────────────────────────────
const VISIBILITY_OPTIONS: { value: Visibility; label: string; description: string }[] = [
  { value: 'public', label: '전체 공개', description: '누구나 내 프로필과 피드를 볼 수 있어요' },
  { value: 'followers', label: '팔로워만', description: '나를 팔로우한 사용자만 볼 수 있어요' },
  { value: 'private', label: '비공개', description: '나와 내가 승인한 사용자만 볼 수 있어요' },
]

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

  const setVisibility = useCallback((v: Visibility) => {
    setState(prev => ({ ...prev, visibility: v }))
    setToast('프로필 공개 범위가 변경됐어요')
  }, [])

  const handleDelete = () => {
    if (window.confirm('정말 계정을 탈퇴하시겠어요?\n모든 데이터가 영구 삭제됩니다.')) {
      setToast('탈퇴 신청이 접수됐어요')
    }
  }

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

      {/* 프로필 공개 범위 */}
      <SectionHeader icon={<IconUser className="w-4 h-4 stroke-[1.5]" />} title="프로필 공개" />
      <div className="px-page">
        <div className="flex flex-col gap-2">
          {VISIBILITY_OPTIONS.map(opt => {
            const active = state.visibility === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setVisibility(opt.value)}
                className={`flex items-center gap-3 p-4 rounded-card-lg border text-left transition-colors ${
                  active
                    ? 'border-primary bg-primary-50'
                    : 'border-border hover:border-ink-placeholder'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    active ? 'border-primary' : 'border-border'
                  }`}
                >
                  {active && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-body font-bold ${active ? 'text-primary-dark' : 'text-ink'}`}>{opt.label}</div>
                  <p className="text-caption text-ink-tertiary mt-0.5 leading-relaxed">{opt.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 활동 */}
      <SectionHeader icon={<IconBell className="w-4 h-4 stroke-[1.5]" />} title="활동 정보" />
      <div className="px-page">
        <ToggleRow
          label="활동 상태 표시"
          description="나의 온라인/오프라인 상태를 다른 사용자에게 표시"
          checked={state.activeStatus}
          onToggle={toggle('activeStatus')}
        />
        <ToggleRow
          label="메시지 읽음 표시"
          description="상대방에게 메시지 읽음 여부를 알려줘요"
          checked={state.readReceipt}
          onToggle={toggle('readReceipt')}
        />
        <ToggleRow
          label="검색에 내 프로필 노출"
          description="이름·아이디로 검색할 때 프로필이 노출돼요"
          checked={state.searchable}
          onToggle={toggle('searchable')}
        />
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
          label="언급·태그 허용"
          description="다른 사용자가 나를 피드/댓글에서 언급할 수 있어요"
          checked={state.allowMention}
          onToggle={toggle('allowMention')}
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
          label="서비스 개선 통계 수집"
          description="익명화된 사용 데이터로 서비스를 개선해요"
          checked={state.analytics}
          onToggle={toggle('analytics')}
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
          onClick={() => navigate('/mypage/edit')}
        />
        <LinkRow
          label="내 데이터 다운로드"
          description="피드·메시지 등 내 활동 데이터 내보내기"
        />
        <LinkRow
          label="계정 탈퇴"
          description="계정 및 모든 데이터를 영구 삭제해요"
          onClick={handleDelete}
        />
      </div>

      {/* 정책 */}
      <div className="px-page py-5 mt-2">
        <div className="bg-surface-muted rounded-card-lg p-4">
          <h4 className="text-label font-extrabold text-ink mb-2 tracking-wider">관련 정책</h4>
          <div className="flex flex-col">
            <button className="flex items-center justify-between py-2 text-left hover:underline">
              <span className="text-label text-ink-secondary">개인정보 처리방침</span>
              <IconChevronRight className="w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5]" />
            </button>
            <button className="flex items-center justify-between py-2 text-left hover:underline">
              <span className="text-label text-ink-secondary">서비스 이용약관</span>
              <IconChevronRight className="w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5]" />
            </button>
            <button className="flex items-center justify-between py-2 text-left hover:underline">
              <span className="text-label text-ink-secondary">위치기반 서비스 이용약관</span>
              <IconChevronRight className="w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-ink/95 text-white text-label font-semibold rounded-pill shadow-elevated animate-slide-up">
          {toast}
        </div>
      )}
    </PageLayout>
  )
}
