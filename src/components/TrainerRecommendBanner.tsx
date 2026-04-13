import { IconLightbulb, IconChevronRight } from './Icons'

interface TrainerRecommendBannerProps {
  onClick?: () => void
}

export const TrainerRecommendBanner = ({ onClick }: TrainerRecommendBannerProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full mx-auto overflow-hidden rounded-card-lg shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-left"
    >
      <div className="relative bg-gradient-to-r from-primary via-primary-dark to-primary px-5 py-3">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
            <IconLightbulb className="w-5 h-5 stroke-white stroke-2" />
          </div>
          <div className="flex-1">
            <h3 className="text-body font-bold text-white">
              나에게 맞는 트레이너 추천받기
            </h3>
          </div>
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <IconChevronRight className="w-4 h-4 stroke-white stroke-2" />
          </div>
        </div>
      </div>
    </button>
  )
}
