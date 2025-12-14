"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function Sessions() {
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
    <section ref={sectionRef} className="relative overflow-hidden bg-[#fffcf3] min-h-auto lg:h-[75vh] lg:pl-30 xl:pl-30" id="about">
      {/* Top and bottom gradient shadow overlays - same as video section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 via-black/5 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 via-black/5 to-transparent z-10" />
      
      <div className={`relative grid grid-cols-1 lg:grid-cols-3 gap-0 h-full w-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        {/* Left two-thirds: Main Sessions and Seminars with light background */}
        <div className="lg:col-span-2 bg-[#fffcf3] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative w-full">
            {/* Main Sessions - left column */}
            <div className="px-4 md:px-6 pt-8 sm:pt-10 md:pt-10 lg:pt-12 pb-8 sm:pb-10 md:pb-10 lg:pb-20 relative flex flex-col items-center lg:items-start">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#A0302A] mb-6 sm:mb-8 md:mb-10 text-center lg:text-left w-full" style={{ fontFamily: 'var(--font-dm-sans-font), sans-serif' }}>
                2026 Main Sessions
              </h2>
              {/* Short black line - only on desktop */}
              <div className="absolute right-0 top-8 sm:top-10 md:top-10 lg:top-12 bottom-8 sm:bottom-10 md:bottom-10 lg:bottom-20 w-px bg-black hidden lg:block"></div>
              <ol className="space-y-4 sm:space-y-5 md:space-y-6 pl-0 w-full max-w-md lg:max-w-none mx-auto lg:mx-0" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
                {[
                  { name: "Adam", desc: "Bible passage TBD" },
                  { name: "Moses", desc: "Bible passage TBD" },
                  { name: "Isaiah", desc: "Bible passage TBD" },
                  { name: "David", desc: "Bible passage TBD" },
                ].map((session, i) => (
                  <li key={i} className="flex gap-2 sm:gap-3 justify-start">
                    <span className="font-bold text-black text-lg sm:text-xl flex-shrink-0">{i + 1}.</span>
                    <div>
                      <p className="font-bold text-black text-base sm:text-lg md:text-xl leading-tight">
                        Christ the true and better <em>{session.name}</em>
                      </p>
                      <p className="text-sm sm:text-base md:text-lg text-black italic mt-0.5">{session.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Seminars - middle column */}
            <div className="px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-10 lg:pt-12 pb-8 sm:pb-10 md:pb-10 lg:pb-20 lg:border-0 flex flex-col items-center lg:items-start">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2A6A9B] mb-6 sm:mb-8 md:mb-10 text-center lg:text-left w-full" style={{ fontFamily: 'var(--font-dm-sans-font), sans-serif' }}>
                2026 Seminars
              </h2>
              <ol className="space-y-4 sm:space-y-5 md:space-y-6 pl-0 w-full max-w-md lg:max-w-none mx-auto lg:mx-0" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
                {[1, 2].map((_, i) => (
                  <li key={i} className="flex gap-2 sm:gap-3 justify-start">
                    <span className="font-bold text-black text-lg sm:text-xl flex-shrink-0">{i + 1}.</span>
                    <div>
                      <p className="font-bold text-black text-base sm:text-lg md:text-xl leading-tight">TBD</p>
                      <p className="text-sm sm:text-base md:text-lg text-black italic mt-0.5">TBD</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Read More Section - right third with dark red background and shadow */}
        <div
          className="lg:col-span-1 bg-[#A0302A] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[400px] md:min-h-[350px] lg:h-full relative overflow-hidden"
          style={{
            backgroundImage: "url(/read-more-bg.svg)",
            backgroundSize: "105vw 100vh",
            backgroundPosition: "center",
          }}
        >
         
          <Link href="/about" className="flex flex-col items-center justify-center text-center relative z-10 w-full px-4 lg:px-6 max-w-full my-auto group cursor-pointer">
            <div className="space-y-1 mb-2 sm:mb-0.5">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#7BC8FF] tracking-wide uppercase leading-tight break-words group-hover:text-blue-300 transition-colors duration-300">
                READ MORE
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide uppercase leading-tight break-words group-hover:text-gray-200 transition-colors duration-300">
                ABOUT OUR
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide uppercase leading-tight break-words group-hover:text-gray-200 transition-colors duration-300">
                2026 THEME
              </p>
            </div>
            {/* Mobile: Blue Button */}
            <div className="flex justify-center w-full mt-6 sm:mt-4 md:mt-2 lg:hidden">
              <button className="bg-[#7BC8FF] hover:bg-[#6BB0E8] text-white font-bold px-8 py-3 sm:px-10 sm:py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-sm sm:text-base uppercase tracking-wide">
                READ MORE
              </button>
            </div>
            {/* Desktop: Clickable Arrow */}
            <div className="hidden lg:flex justify-center w-full mt-2 md:mt-0.5">
              <div className="transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
              <img 
                src="/read more arrow.svg" 
                alt="Arrow" 
                  className="w-40 xl:w-48 h-auto object-contain transition-transform duration-300"
                style={{ maxWidth: '240px' }}
              />
            </div>
          </div>
          </Link>
        </div>
      </div>
    </section>
  )
}