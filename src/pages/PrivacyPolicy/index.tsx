import { memo, useCallback, useMemo, useState } from 'react'
import { PageLayout, SubPageHeader } from '../../components'
import { IconChevronRight, IconShield } from '../../components/Icons'

type Section = {
  id: string
  title: string
  body: string
}

const SECTIONS: Section[] = [
  {
    id: 's1', title: '1. 개인정보의 수집 항목 및 방법',
    body: '회사는 회원가입·서비스 이용 과정에서 다음 개인정보를 수집합니다.\n\n[필수]\n— 이메일, 비밀번호(암호화 저장), 휴대전화번호, 이름(닉네임)\n\n[선택]\n— 프로필 사진, 성별, 생년월일, 운동 목표, 관심 지점\n\n[자동 수집]\n— 서비스 이용 기록, 접속 로그, 기기 정보, IP 주소, 쿠키\n\n수집 방법: 회원가입 화면, 설정 변경, 서비스 이용 중 자동 생성',
  },
  {
    id: 's2', title: '2. 개인정보의 이용 목적',
    body: '수집한 개인정보는 다음 목적을 위해서만 이용됩니다.\n\n— 회원 식별 및 본인 확인\n— 서비스 제공 및 요금 결제\n— 맞춤형 콘텐츠·운동 프로그램 제공\n— 공지사항 전달 및 고객 문의 응대\n— 부정 이용 방지 및 비인가 사용 조사\n— 서비스 개선을 위한 통계 분석',
  },
  {
    id: 's3', title: '3. 개인정보의 보유 및 이용 기간',
    body: '회원 탈퇴 시 회사는 지체 없이 개인정보를 파기합니다. 단, 관련 법령에 따라 다음 정보는 일정 기간 보관합니다.\n\n— 계약·청약철회 기록: 5년 (전자상거래법)\n— 결제·재화 공급 기록: 5년 (전자상거래법)\n— 소비자 불만·분쟁 처리 기록: 3년 (전자상거래법)\n— 접속 로그: 3개월 (통신비밀보호법)',
  },
  {
    id: 's4', title: '4. 개인정보의 제3자 제공',
    body: '회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우 예외적으로 제공할 수 있습니다.\n\n— 이용자가 사전에 동의한 경우\n— 법령의 규정에 의거하거나 수사 목적으로 법적 절차에 따라 요청이 있는 경우\n— 통계 작성, 학술 연구를 위해 특정 개인을 식별할 수 없는 형태로 제공하는 경우',
  },
  {
    id: 's5', title: '5. 개인정보 처리의 위탁',
    body: '회사는 원활한 서비스 제공을 위해 다음 업무를 외부 전문 업체에 위탁하고 있습니다.\n\n— 결제 처리: 토스페이먼츠, KG이니시스\n— 알림톡·SMS 발송: NHN클라우드\n— 클라우드 인프라: AWS, Google Cloud\n\n위탁 계약 시 개인정보 보호 관련 법규 준수를 명시하고 관리·감독하고 있습니다.',
  },
  {
    id: 's6', title: '6. 이용자의 권리',
    body: '이용자는 언제든지 다음 권리를 행사할 수 있습니다.\n\n— 개인정보 열람 요청\n— 오류 정정·삭제 요청\n— 처리 정지 요청\n— 동의 철회 및 회원 탈퇴\n\n설정 → 개인정보 보호 메뉴에서 직접 처리하거나, 고객센터로 요청할 수 있습니다.',
  },
  {
    id: 's7', title: '7. 개인정보의 안전성 확보 조치',
    body: '회사는 개인정보 보호를 위해 다음 조치를 취하고 있습니다.\n\n— 비밀번호 단방향 암호화 저장\n— 통신 구간 TLS 암호화\n— 개인정보 접근 권한 최소화 및 접근 기록 관리\n— 개인정보 처리 담당자 정기 교육\n— 외부 침입 차단 시스템 운영',
  },
  {
    id: 's8', title: '8. 쿠키(Cookie)의 사용',
    body: '회사는 이용자에게 맞춤 서비스를 제공하기 위해 쿠키를 사용합니다.\n\n— 사용 목적: 로그인 유지, 맞춤 콘텐츠 제공, 서비스 이용 분석\n— 거부 방법: 브라우저 설정에서 쿠키 저장 거부 가능 (일부 서비스 이용 제한될 수 있음)',
  },
  {
    id: 's9', title: '9. 개인정보 보호 책임자',
    body: '회사는 이용자의 개인정보 보호 관련 업무를 총괄하는 책임자를 지정하고 있습니다.\n\n— 책임자: 김보호 (CPO)\n— 이메일: privacy@bodychannel.com\n— 전화: 1588-0000',
  },
  {
    id: 's10', title: '10. 방침의 변경',
    body: '본 개인정보 처리방침은 법령·정책의 변경에 따라 수정될 수 있습니다. 변경 시 시행일 7일 전부터 공지하며, 이용자에게 불리한 변경은 30일 전에 공지합니다.',
  },
]

interface SectionRowProps {
  section: Section
  open: boolean
  onToggle: (id: string) => void
}

const SectionRow = memo(({ section: s, open, onToggle }: SectionRowProps) => (
  <li className="border-b border-border-light last:border-0">
    <button
      onClick={() => onToggle(s.id)}
      className="w-full flex items-center justify-between gap-3 py-3.5 text-left hover:bg-surface-subtle transition-colors"
      aria-expanded={open}
    >
      <span className="text-body font-bold text-ink leading-snug">{s.title}</span>
      <IconChevronRight
        className={`w-3.5 h-3.5 stroke-ink-placeholder stroke-[1.5] flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
      />
    </button>
    {open && (
      <div className="pb-4">
        <div className="bg-surface-muted rounded-card p-3.5">
          <p className="text-label text-ink-secondary leading-relaxed whitespace-pre-line">{s.body}</p>
        </div>
      </div>
    )}
  </li>
))
SectionRow.displayName = 'SectionRow'

export const PrivacyPolicyPage = () => {
  const [openId, setOpenId] = useState<string | null>('s1')
  const [query, setQuery] = useState('')

  const handleToggle = useCallback((id: string) => {
    setOpenId(prev => prev === id ? null : id)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.filter(s =>
      s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <PageLayout
      header={<SubPageHeader title="개인정보 처리방침" />}
      hideBottomNav
      noPadding
      className="!pb-0"
    >
      {/* 히어로 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-surface px-page pt-5 pb-4 border-b border-border-light">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-card bg-primary/10 flex items-center justify-center flex-shrink-0">
            <IconShield className="w-5 h-5 stroke-primary stroke-[1.8]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-title font-extrabold text-ink">개인정보 처리방침</h1>
            <p className="text-label text-ink-tertiary mt-1">
              시행일 2026.05.01 · 이용자의 권리를 안전하게 보호해요
            </p>
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className="px-page pt-4 pb-1">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="내용 검색"
          className="w-full px-3.5 py-2.5 bg-surface-muted rounded-pill text-label text-ink placeholder:text-ink-placeholder outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* 섹션 리스트 */}
      <div className="px-page pt-2 pb-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-body text-ink-tertiary">검색 결과가 없어요</p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {filtered.map(s => (
              <SectionRow key={s.id} section={s} open={openId === s.id} onToggle={handleToggle} />
            ))}
          </ul>
        )}
      </div>
    </PageLayout>
  )
}
