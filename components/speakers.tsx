"use client"
import { useEffect, useRef, useState } from "react"

export default function Speakers() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#fffcf3] flex items-center">
      <div className={`max-w-7xl mx-auto w-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 
          className="font-spartan text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#8B2E2E] mb-10 sm:mb-12 md:mb-16 text-center uppercase tracking-tight px-2"
        >
          2026 CONFERENCE SPEAKERS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-6 lg:gap-8">
          {/* Main Speaker - Sam Song */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-lg sm:text-xl md:text-2xl font-black text-[#8B2E2E] mb-3 sm:mb-3 tracking-normal uppercase text-center"
            >
              MAIN SPEAKER
            </h3>
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#8B2E2E] mb-3 sm:mb-4 flex items-center justify-center overflow-hidden"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <img 
                src="/sam-song.png" 
                alt="Sam Song" 
                className="w-full h-full object-cover scale-110"
                style={{ objectPosition: 'center top' }}
              />
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-lg sm:text-xl md:text-2xl lg:text-[27px]">SAM SONG</p>
            <p className="text-center text-xs sm:text-sm md:text-base text-black px-2 leading-tight min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
             Comming soon
            </p>
          </div>

          {/* Seminar Speaker 1 - Lyndon Jost */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-lg sm:text-xl md:text-2xl font-black text-[#3182CE] mb-3 sm:mb-3 tracking-tight uppercase text-center"
            >
              SEMINAR SPEAKER
            </h3>
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#3182CE] mb-3 sm:mb-4 flex items-center justify-center overflow-hidden"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <img 
                src="/lyndon-jost.png" 
                alt="Lyndon Jost" 
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
              />
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-lg sm:text-xl md:text-2xl lg:text-[27px]">LYNDON JOST</p>
            <p className="text-center text-xs sm:text-sm md:text-base text-black px-2 leading-tight min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
              Associate Pastor of Christ Church Toronto (PCA) and Director of the Reformed House of Studies at Wycliffe College, University of Toronto.
            </p>
          </div>

          {/* Seminar Speaker 2 - Juhan Song */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-lg sm:text-xl md:text-2xl font-black text-[#3182CE] mb-3 sm:mb-3 tracking-tight uppercase text-center"
            >
              SEMINAR SPEAKER
            </h3>
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#3182CE] mb-3 sm:mb-4 flex items-center justify-center overflow-hidden"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <img 
                src="/juhan-song.png" 
                alt="Juhan Song" 
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
              />
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-lg sm:text-xl md:text-2xl lg:text-[27px]">JUHAN SONG</p>
            <p className="text-center text-xs sm:text-sm md:text-base text-black px-2 leading-tight min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
              Born in Korea, raised in Toronto. Recent graduate of Westminster Theological Seminary, currently serving as an intern at Trinity OPC in Easton, PA.
            </p>
          </div>

          {/* Seminar Speaker 3 - Max */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-lg sm:text-xl md:text-2xl font-black text-[#3182CE] mb-3 sm:mb-3 tracking-tight uppercase text-center"
            >
              SEMINAR SPEAKER
            </h3>
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#3182CE] mb-3 sm:mb-4 flex items-center justify-center overflow-hidden"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <img 
                src="/max.png" 
                alt="Max" 
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
              />
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-lg sm:text-xl md:text-2xl lg:text-[27px]">MAX PARK</p>
            <p className="text-center text-xs sm:text-sm md:text-base text-black px-2 leading-tight min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
              Associate Pastor at Sheepgate since 2013. Master of Divinity from Tyndale Seminary. Passionate about teaching God's Word faithfully.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
