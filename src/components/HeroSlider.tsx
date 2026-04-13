import { useState, useEffect, useCallback } from 'react'

interface Slide {
  id: number
  greeting: string
  title: string
  highlight: string
  titleSuffix?: string
  variant: 'default' | 'event' | 'promo'
}

const slides: Slide[] = [
  {
    id: 1,
    greeting: '안녕하세요, 김피트님!',
    title: '오늘도 ',
    highlight: '건강한 하루',
    titleSuffix: ' 시작해볼까요?',
    variant: 'default',
  },
  {
    id: 2,
    greeting: 'EVENT',
    title: '신규 회원 ',
    highlight: '20% 할인',
    titleSuffix: ' 이벤트 진행중!',
    variant: 'event',
  },
  {
    id: 3,
    greeting: 'SPECIAL OFFER',
    title: 'PT 패키지 ',
    highlight: '최대 40%',
    titleSuffix: ' 할인 혜택',
    variant: 'promo',
  },
]

const slideBackgrounds: Record<Slide['variant'], string> = {
  default: 'bg-gradient-to-br from-ink to-[#2a2a2a]',
  event: 'bg-gradient-to-br from-[#2a2a2a] to-[#404040]',
  promo: 'bg-gradient-to-br from-[#1a1a1a] to-[#333333]',
}

export const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="relative rounded-card-lg overflow-hidden mb-section touch-pan-y">
      <div
        className="flex transition-transform duration-[400ms] ease-smooth"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full px-page py-5 pb-8 relative overflow-hidden min-h-[100px] flex flex-col justify-center ${slideBackgrounds[slide.variant]}`}
          >
            <div className="absolute -top-[50%] -right-[20%] w-[150px] h-[150px] bg-primary rounded-full opacity-15" />
            <p className={`text-label mb-1 relative z-10 ${slide.variant === 'event' ? 'text-white/80' : 'text-ink-placeholder'}`}>
              {slide.greeting}
            </p>
            <h1 className="text-white text-body font-bold leading-snug relative z-10">
              {slide.title}
              <span className="text-primary">{slide.highlight}</span>
              <br />
              {slide.titleSuffix}
            </h1>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-[5px] rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-4 bg-white'
                : 'w-[5px] bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
