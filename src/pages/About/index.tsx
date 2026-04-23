import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import {
  IconInfo,
  IconChevronRight,
  IconShield,
  IconClipboard,
} from '../../components/Icons'

const APP_VERSION = '3.0.2'
const LATEST_VERSION = '3.0.2'
const BUILD = '20260422.1'

type LinkItem = {
  label: string
  sub?: string
  onClick: () => void
}

interface LinkRowProps {
  item: LinkItem
}

const LinkRow = memo(({ item }: LinkRowProps) => (
  <button
    onClick={item.onClick}
    className="w-full flex items-center justify-between py-3.5 border-b border-border-light last:border-0 hover:bg-surface-subtle transition-colors text-left"
  >
    <span className="text-body text-ink">{item.label}</span>
    <div className="flex items-center gap-1.5">
      {item.sub && <span className="text-caption text-ink-tertiary">{item.sub}</span>}
      <IconChevronRight className="w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5]" />
    </div>
  </button>
))
LinkRow.displayName = 'LinkRow'

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 px-page pt-6 pb-2">
    <span className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center text-primary">
      {icon}
    </span>
    <h3 className="text-label font-extrabold text-ink tracking-wider">{title}</h3>
  </div>
)

export const AboutPage = () => {
  const navigate = useNavigate()

  const isLatest = APP_VERSION === LATEST_VERSION

  const policyLinks: LinkItem[] = [
    { label: '서비스 이용약관',    onClick: () => navigate('/terms') },
    { label: '개인정보 처리방침',  onClick: () => navigate('/privacy-policy') },
  ]

  return (
    <PageLayout
      header={<SubPageHeader title="앱 정보" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-8 pb-6 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-card-lg bg-primary flex items-center justify-center text-white mb-3 shadow-elevated">
            <IconInfo className="w-8 h-8 stroke-white stroke-[1.8]" />
          </div>
          <h1 className="text-title font-extrabold text-ink">바디채널</h1>
          <p className="text-label text-ink-tertiary mt-1">당신의 건강한 하루를 기록해요</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-surface border border-border">
            <span className="text-caption text-ink-tertiary">v</span>
            <span className="text-caption font-extrabold text-ink tabular-nums">{APP_VERSION}</span>
            {isLatest && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-ink-placeholder" />
                <span className="text-caption text-primary font-bold">최신</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 버전 정보 */}
      <div className="px-page pt-4">
        <div className="flex items-center justify-between text-caption text-ink-tertiary">
          <span>빌드 번호</span>
          <span className="tabular-nums text-ink-secondary">{BUILD}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-caption text-ink-tertiary">
          <span>최신 버전</span>
          <span className="tabular-nums text-ink-secondary">v{LATEST_VERSION}</span>
        </div>
      </div>

      {/* 정책·약관 */}
      <SectionHeader icon={<IconClipboard className="w-4 h-4 stroke-[1.5]" />} title="정책·약관" />
      <div className="px-page">
        {policyLinks.map(item => (
          <LinkRow key={item.label} item={item} />
        ))}
      </div>

      {/* 사업자 정보 */}
      <SectionHeader icon={<IconShield className="w-4 h-4 stroke-[1.5]" />} title="사업자 정보" />
      <div className="px-page pb-6">
        <div className="bg-surface-muted rounded-card-lg p-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-caption">
            <dt className="text-ink-tertiary">상호</dt>
            <dd className="text-ink-secondary">(주)바디채널</dd>
            <dt className="text-ink-tertiary">대표</dt>
            <dd className="text-ink-secondary">김대표</dd>
            <dt className="text-ink-tertiary">사업자등록번호</dt>
            <dd className="text-ink-secondary tabular-nums">123-45-67890</dd>
            <dt className="text-ink-tertiary">통신판매업</dt>
            <dd className="text-ink-secondary tabular-nums">제 2026-서울강남-0000호</dd>
            <dt className="text-ink-tertiary">주소</dt>
            <dd className="text-ink-secondary">서울특별시 강남구 테헤란로 000, 10층</dd>
            <dt className="text-ink-tertiary">고객센터</dt>
            <dd className="text-ink-secondary tabular-nums">1588-0000</dd>
            <dt className="text-ink-tertiary">이메일</dt>
            <dd className="text-ink-secondary">help@bodychannel.com</dd>
          </dl>
        </div>
        <p className="text-caption text-ink-placeholder text-center mt-4">
          © 2026 BodyChannel Inc. All rights reserved.
        </p>
      </div>

    </PageLayout>
  )
}
