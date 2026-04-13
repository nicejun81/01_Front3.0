import { useNavigate } from 'react-router-dom'
import { PageLayout, SubPageHeader } from '../../components'
import { IconSearch } from '../../components/Icons'

const classes = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    title: '홈트레이닝 기초',
    instructor: '김민수 강사',
    lessonCount: 12,
    level: '초급',
    duration: '총 3시간 24분',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    title: '바레톤 입문',
    instructor: '박지영 강사',
    lessonCount: 8,
    level: '초급',
    duration: '총 2시간 16분',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    title: '근력 운동 마스터',
    instructor: '최강민 강사',
    lessonCount: 20,
    level: '중급',
    duration: '총 5시간 40분',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop',
    title: '스트레칭 루틴',
    instructor: '정서연 강사',
    lessonCount: 6,
    level: '초급',
    duration: '총 1시간 30분',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
    title: 'HIIT 다이어트',
    instructor: '한동훈 강사',
    lessonCount: 15,
    level: '고급',
    duration: '총 4시간 15분',
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
    title: '바레톤 기초반',
    instructor: '이수진 강사',
    lessonCount: 10,
    level: '초급',
    duration: '총 2시간 50분',
  },
]

export const OnlineClassPage = () => {
  const navigate = useNavigate()

  const header = (
    <SubPageHeader
      title="온라인 강의"
      right={
        <button className="icon-btn">
          <IconSearch className="w-[22px] h-[22px] stroke-ink stroke-2" />
        </button>
      }
    />
  )

  return (
    <PageLayout header={header}>
      <div className="divide-y divide-border-light">
        {classes.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/class/${item.id}`)}
            className="flex gap-4 py-4 w-full hover:bg-surface-muted transition-colors text-left"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-[120px] h-[90px] rounded-card object-cover flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-center">
              <span className="inline-block w-fit px-2 py-0.5 bg-surface-muted text-ink-secondary text-label font-semibold rounded mb-1.5">
                {item.level}
              </span>
              <h3 className="text-title text-ink mb-1">{item.title}</h3>
              <p className="text-body text-ink-tertiary mb-1">{item.instructor}</p>
              <p className="text-label text-ink-placeholder">{item.lessonCount}강 · {item.duration}</p>
            </div>
          </button>
        ))}
      </div>
    </PageLayout>
  )
}
