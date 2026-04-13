import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader, BottomCTA } from '../../components'

export const ProfileEditPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('김피트')
  const [bio, setBio] = useState('바디채널 강남점 💪 3개월째 운동중\n매일 아침 6시 기상 | PT + 바레톤 | 체중 -8kg 달성')
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&crop=face')

  const handlePhoto = (files: FileList | null) => {
    if (!files || !files[0]) return
    setPhoto(URL.createObjectURL(files[0]))
  }

  const handleSave = () => {
    alert('프로필이 저장되었어요!')
    navigate(-1)
  }

  const header = <SubPageHeader title="프로필 편집" />

  return (
    <PageLayout header={header} hideBottomNav noPadding>
      <div className="flex flex-col items-center py-8 border-b border-border-light">
        <label className="relative mb-3 cursor-pointer">
          <img
            src={photo}
            alt="프로필"
            className="w-24 h-24 rounded-full object-cover ring-2 ring-primary p-0.5"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-2 fill-none">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhoto(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
        <span className="text-caption text-primary font-semibold">사진 변경</span>
      </div>

      <div className="px-page py-4 flex flex-col gap-4">
        <div>
          <label className="text-label font-bold text-ink mb-1.5 block">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="w-full px-3 py-3 bg-surface-muted rounded-card text-body text-ink placeholder:text-ink-placeholder focus:outline-none"
          />
        </div>
        <div>
          <label className="text-label font-bold text-ink mb-1.5 block">소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={150}
            className="w-full px-3 py-3 bg-surface-muted rounded-card text-body text-ink placeholder:text-ink-placeholder focus:outline-none resize-none"
          />
          <div className="text-caption text-ink-tertiary text-right mt-1 tabular-nums">{bio.length}/150</div>
        </div>
      </div>

      <BottomCTA hideBottomNav>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-4 bg-primary text-white font-semibold rounded-card hover:bg-primary-dark transition-colors disabled:bg-ink-disabled disabled:cursor-not-allowed"
        >
          저장하기
        </button>
      </BottomCTA>
    </PageLayout>
  )
}
