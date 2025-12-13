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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-6 lg:gap-8">
          {/* Main Speaker */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-xl sm:text-2xl md:text-3xl font-black text-[#8B2E2E] mb-4 sm:mb-3 tracking-normal uppercase w-[95%] max-w-[256px] text-center"
            >
              MAIN SPEAKER
            </h3>
            <div 
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#8B2E2E] mb-4 flex items-center justify-center"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <span className="text-6xl sm:text-7xl md:text-8xl text-gray-400 font-bold">?</span>
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-xl sm:text-2xl md:text-[27px] lg:text-[33px]">TBD</p>
            <p className="text-center text-sm sm:text-base md:text-lg text-black">To be determined</p>
          </div>

          {/* Seminar Speaker 1 */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-xl sm:text-2xl md:text-3xl font-black text-[#3182CE] mb-4 sm:mb-3 tracking-tight uppercase text-center"
            >
              SEMINAR SPEAKER
            </h3>
            <div 
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#3182CE] mb-4 flex items-center justify-center"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <span className="text-6xl sm:text-7xl md:text-8xl text-gray-400 font-bold">?</span>
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-xl sm:text-2xl md:text-[27px] lg:text-[33px]">TBD</p>
            <p className="text-center text-sm sm:text-base md:text-lg text-black">To be determined</p>
          </div>

          {/* Seminar Speaker 2 */}
          <div className="flex flex-col items-center">
            <h3 
              className="font-spartan text-xl sm:text-2xl md:text-3xl font-black text-[#3182CE] mb-4 sm:mb-3 tracking-tight uppercase text-center"
            >
              SEMINAR SPEAKER
            </h3>
            <div 
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-b from-gray-200 to-gray-100 rounded-3xl border-4 sm:border-[6px] border-[#3182CE] mb-4 flex items-center justify-center"
              style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)' }}
            >
              <span className="text-6xl sm:text-7xl md:text-8xl text-gray-400 font-bold">?</span>
            </div>
            <p className="text-center text-black font-bold mb-1 uppercase text-xl sm:text-2xl md:text-[27px] lg:text-[33px]">TBD</p>
            <p className="text-center text-sm sm:text-base md:text-lg text-black">To be determined</p>
          </div>
        </div>
      </div>
    </section>
  )
}
