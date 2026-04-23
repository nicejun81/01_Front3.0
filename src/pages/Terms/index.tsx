import { memo, useCallback, useMemo, useState } from 'react'
import { PageLayout, SubPageHeader } from '../../components'
import { IconChevronRight, IconClipboard } from '../../components/Icons'

type Article = {
  id: string
  title: string
  body: string
}

const ARTICLES: Article[] = [
  {
    id: 'a1', title: '제1조 (목적)',
    body: '이 약관은 회사(이하 "회사")가 제공하는 바디채널 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.',
  },
  {
    id: 'a2', title: '제2조 (용어의 정의)',
    body: '1. "서비스"란 회사가 모바일 앱·웹을 통해 제공하는 피트니스 관련 콘텐츠, 예약, 결제, 커뮤니티 등 일체의 서비스를 의미합니다.\n2. "이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.\n3. "회원"이란 서비스에 가입하여 아이디를 부여받은 자를 말합니다.\n4. "이용권"이란 특정 지점·프로그램을 이용할 수 있는 유료 상품을 의미합니다.',
  },
  {
    id: 'a3', title: '제3조 (약관의 게시와 개정)',
    body: '1. 회사는 본 약관을 서비스 초기 화면 또는 연결 화면에 게시합니다.\n2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.\n3. 약관 개정 시 적용일자와 개정 사유를 명시하여 적용일 7일 전부터 공지합니다. 이용자에게 불리한 개정의 경우 30일 전에 공지합니다.',
  },
  {
    id: 'a4', title: '제4조 (서비스의 제공 및 변경)',
    body: '1. 회사는 다음과 같은 서비스를 제공합니다.\n  — 피트니스 지점 및 클래스 예약\n  — 온라인 강의 제공\n  — 운동 기록 및 커뮤니티 기능\n  — 이용권·쿠폰 판매\n2. 회사는 서비스의 내용과 품질을 변경할 수 있으며, 변경 시 사전에 공지합니다.',
  },
  {
    id: 'a5', title: '제5조 (이용계약의 성립)',
    body: '1. 이용계약은 이용자가 약관에 동의하고 가입 신청을 완료한 후 회사가 이를 승낙함으로써 성립합니다.\n2. 회사는 다음 각 호에 해당하는 경우 가입을 거절하거나 취소할 수 있습니다.\n  — 타인의 명의를 이용한 경우\n  — 허위 정보를 기재한 경우\n  — 만 14세 미만인 경우(법정대리인 동의 시 예외)',
  },
  {
    id: 'a6', title: '제6조 (결제 및 환불)',
    body: '1. 서비스 이용료는 회사가 정한 방식으로 결제합니다.\n2. 환불은 관련 법령 및 개별 상품의 환불 규정에 따릅니다.\n3. 이용 시작 후 환불은 이용일수에 따라 일할 계산되며, 위약금이 발생할 수 있습니다.',
  },
  {
    id: 'a7', title: '제7조 (이용자의 의무)',
    body: '이용자는 다음 행위를 하여서는 안 됩니다.\n— 타인의 정보 도용\n— 회사 또는 제3자의 지적재산권 침해\n— 서비스 운영을 방해하는 행위\n— 법령·공서양속에 위반되는 행위\n— 기타 회사가 정한 이용 규칙을 위반하는 행위',
  },
  {
    id: 'a8', title: '제8조 (서비스 이용의 제한)',
    body: '회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 사전 통지 후 이용을 제한하거나 이용계약을 해지할 수 있습니다.',
  },
  {
    id: 'a9', title: '제9조 (책임의 제한)',
    body: '1. 회사는 천재지변, 전쟁, 정전, 통신장애 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.\n2. 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.',
  },
  {
    id: 'a10', title: '제10조 (분쟁 해결)',
    body: '본 약관 및 서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 상호 협의하여 해결합니다. 협의가 이루어지지 않을 경우 회사의 본점 소재지를 관할하는 법원을 전속 관할로 합니다.',
  },
]

interface ArticleRowProps {
  article: Article
  open: boolean
  onToggle: (id: string) => void
}

const ArticleRow = memo(({ article: a, open, onToggle }: ArticleRowProps) => (
  <li className="border-b border-border-light last:border-0">
    <button
      onClick={() => onToggle(a.id)}
      className="w-full flex items-center justify-between gap-3 py-3.5 text-left hover:bg-surface-subtle transition-colors"
      aria-expanded={open}
    >
      <span className="text-body font-bold text-ink leading-snug">{a.title}</span>
      <IconChevronRight
        className={`w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5] flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
      />
    </button>
    {open && (
      <div className="pb-4">
        <div className="bg-surface-muted rounded-card p-3.5">
          <p className="text-label text-ink-secondary leading-relaxed whitespace-pre-line">{a.body}</p>
        </div>
      </div>
    )}
  </li>
))
ArticleRow.displayName = 'ArticleRow'

export const TermsPage = () => {
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const handleToggle = useCallback((id: string) => {
    setOpenId(prev => prev === id ? null : id)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ARTICLES
    return ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <PageLayout
      header={<SubPageHeader title="이용약관" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-5 pb-4 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-card bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconClipboard className="w-5 h-5 stroke-primary stroke-[1.8]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-title font-extrabold text-ink">서비스 이용약관</h1>
            <p className="text-label text-ink-tertiary mt-1">
              시행일 2026.04.01 · 버전 v3.0
            </p>
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className="px-page pt-4 pb-1">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="조항 내용 검색"
          className="w-full px-3.5 py-2.5 bg-surface-muted rounded-pill text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* 조항 리스트 */}
      <div className="px-page pt-2 pb-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-body text-ink-tertiary">검색 결과가 없어요</p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {filtered.map(a => (
              <ArticleRow key={a.id} article={a} open={openId === a.id} onToggle={handleToggle} />
            ))}
          </ul>
        )}

        <div className="mt-6 bg-surface-muted rounded-card-lg p-4">
          <h4 className="text-label font-extrabold text-ink mb-1.5 tracking-wider">부칙</h4>
          <p className="text-label text-ink-tertiary leading-relaxed">
            본 약관은 2026년 4월 1일부터 시행됩니다. 이전 약관은 고객센터에서 확인할 수 있어요.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
