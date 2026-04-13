import { ComponentSection } from './components/ComponentSection'
import {
  Header,
  BottomNav,
  HeroSlider,
  CategoryGrid,
  QuickTabs,
  RecentChat,
  SectionHeader,
  OnlineClassCard,
  TrainerListItem,
  TrainerRecommendBanner,
  PTTrainerCard,
  MeetupCard,
  FeedCard,
  IconHome,
  IconSearch,
  IconBell,
  IconHeart,
  IconStar,
  IconStarFilled,
  IconUser,
  IconUsers,
  IconCalendar,
  IconChevronRight,
} from '../../components'

export const ComponentsShowcasePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Components Showcase</h1>
          <p className="text-gray-600 mt-1">모든 공통 컴포넌트 목록</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Icons */}
        <ComponentSection title="Icons">
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <IconHome className="w-6 h-6" />
              <span className="text-xs text-gray-500">Home</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconSearch className="w-6 h-6" />
              <span className="text-xs text-gray-500">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconBell className="w-6 h-6" />
              <span className="text-xs text-gray-500">Bell</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconHeart className="w-6 h-6" />
              <span className="text-xs text-gray-500">Heart</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconStar className="w-6 h-6" />
              <span className="text-xs text-gray-500">Star</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconStarFilled className="w-6 h-6 text-yellow-400" />
              <span className="text-xs text-gray-500">StarFilled</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconUser className="w-6 h-6" />
              <span className="text-xs text-gray-500">User</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconUsers className="w-6 h-6" />
              <span className="text-xs text-gray-500">Users</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconCalendar className="w-6 h-6" />
              <span className="text-xs text-gray-500">Calendar</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IconChevronRight className="w-6 h-6" />
              <span className="text-xs text-gray-500">ChevronRight</span>
            </div>
          </div>
        </ComponentSection>

        {/* Header */}
        <ComponentSection title="Header">
          <div className="bg-white rounded-lg overflow-hidden">
            <Header />
          </div>
        </ComponentSection>

        {/* HeroSlider */}
        <ComponentSection title="HeroSlider">
          <div className="bg-white rounded-lg p-4">
            <HeroSlider />
          </div>
        </ComponentSection>

        {/* CategoryGrid */}
        <ComponentSection title="CategoryGrid">
          <div className="bg-white rounded-lg p-4">
            <CategoryGrid />
          </div>
        </ComponentSection>

        {/* QuickTabs */}
        <ComponentSection title="QuickTabs">
          <div className="bg-white rounded-lg p-4">
            <QuickTabs />
          </div>
        </ComponentSection>

        {/* SectionHeader */}
        <ComponentSection title="SectionHeader">
          <div className="bg-white rounded-lg p-4">
            <SectionHeader title="섹션 제목" href="#" />
            <SectionHeader title="더보기 없음" showMore={false} />
          </div>
        </ComponentSection>

        {/* RecentChat */}
        <ComponentSection title="RecentChat">
          <div className="bg-white rounded-lg p-4">
            <RecentChat
              avatarUrl="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face"
              name="김민수 트레이너"
              message="내일 PT 수업 시간 변경 가능할까요?"
              time="오후 2:30"
              unreadCount={1}
            />
          </div>
        </ComponentSection>

        {/* OnlineClassCard */}
        <ComponentSection title="OnlineClassCard">
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-3 overflow-x-auto">
              <OnlineClassCard
                imageUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop"
                title="홈트레이닝 기초"
                lessonCount={12}
                level="초급"
              />
              <OnlineClassCard
                imageUrl="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop"
                title="바레톤 입문"
                lessonCount={8}
                level="초급"
              />
            </div>
          </div>
        </ComponentSection>

        {/* TrainerListItem */}
        <ComponentSection title="TrainerListItem">
          <div className="bg-white rounded-lg p-4">
            <TrainerListItem
              imageUrl="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop"
              name="박지영 강사"
              category="바레톤"
              categoryColor="bareton"
              description="바디채널 강남점"
              todayTime="오늘 14:00, 19:30"
              rating={4.7}
              reviewCount={64}
              trialInfo="10회 / 66,000원"
            />
            <TrainerListItem
              imageUrl="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&h=200&fit=crop"
              name="한동훈 강사"
              category="히트35"
              categoryColor="hit35"
              description="바디채널 역삼점"
              todayTime="오늘 10:00, 18:00"
              rating={4.9}
              reviewCount={93}
              trialInfo="10회 / 66,000원"
            />
          </div>
        </ComponentSection>

        {/* TrainerRecommendBanner */}
        <ComponentSection title="TrainerRecommendBanner">
          <div className="bg-white rounded-lg overflow-hidden">
            <TrainerRecommendBanner />
          </div>
        </ComponentSection>

        {/* PTTrainerCard */}
        <ComponentSection title="PTTrainerCard">
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-3 overflow-x-auto">
              <PTTrainerCard
                imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=240&fit=crop"
                name="최강민 강사"
                description="바디채널 강남점"
                todayTime="오늘 09:00, 15:00"
                rating={4.9}
                reviewCount={127}
                trialInfo="10회 / 66,000원"
              />
              <PTTrainerCard
                imageUrl="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=240&fit=crop"
                name="정서연 강사"
                description="바디채널 서초점"
                todayTime="오늘 13:00, 17:00"
                rating={4.8}
                reviewCount={89}
                trialInfo="10회 / 66,000원"
              />
            </div>
          </div>
        </ComponentSection>

        {/* MeetupCard */}
        <ComponentSection title="MeetupCard">
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-3 overflow-x-auto">
              <MeetupCard
                imageUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop"
                category="러닝"
                title="강남 러닝크루"
                schedule="매주 토요일 오전 7시"
                memberCount={24}
              />
              <MeetupCard
                imageUrl="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=200&fit=crop"
                category="요가"
                title="모닝 요가 클럽"
                schedule="매주 수/금 오전 6시"
                memberCount={18}
              />
            </div>
          </div>
        </ComponentSection>

        {/* FeedCard */}
        <ComponentSection title="FeedCard">
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3">
              <FeedCard
                imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop"
                authorImageUrl="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100&h=100&fit=crop&crop=face"
                authorName="김민수"
                text="오늘도 열심히 운동 완료!"
                likeCount={128}
                commentCount={24}
                isLiked={true}
              />
              <FeedCard
                imageUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop"
                authorImageUrl="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face"
                authorName="박지영"
                text="바레톤 수업 후기 정말 시원하네요"
                likeCount={89}
                commentCount={12}
                isLiked={false}
              />
            </div>
          </div>
        </ComponentSection>

        {/* BottomNav */}
        <ComponentSection title="BottomNav">
          <p className="text-sm text-gray-500 mb-2">화면 하단에 고정된 네비게이션 바</p>
          <div className="bg-white rounded-lg p-4 relative h-20 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0">
              <div className="border-t border-gray-200 flex justify-around items-center pt-4 pb-4">
                <div className="flex flex-col items-center gap-1.5 text-[var(--primary)]">
                  <IconHome className="w-6 h-6" />
                  <span className="text-xs font-medium">홈</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <IconSearch className="w-6 h-6" />
                  <span className="text-xs font-medium">지점소개</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <IconCalendar className="w-6 h-6" />
                  <span className="text-xs font-medium">예약</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <IconUser className="w-6 h-6" />
                  <span className="text-xs font-medium">마이</span>
                </div>
              </div>
            </div>
          </div>
        </ComponentSection>
      </main>

      <BottomNav />
    </div>
  )
}
