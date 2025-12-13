"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function GetInvolved() {
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
    <section ref={sectionRef} className="relative w-full overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[75vh] lg:h-[75vh] flex items-center py-12 sm:py-16 md:py-0 gap-0" id="volunteer">
      <div
        className="absolute inset-0 bg-center bg-no-repeat get-involved-bg-mobile md:get-involved-bg-desktop"
        style={{
          backgroundImage: "url(/get-involved-background.svg)",
          backgroundPosition: "center",
          backgroundSize: "auto 200%",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

   

      <div className={`relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content - 33% width */}
          <div className="text-white text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-spartan-font)' }}>
              Get<span className="hidden lg:inline"><br /></span> Involved
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 text-white" style={{ fontFamily: 'var(--font-dm-sans-font)' }}>
              Interested in getting involved with Gospel Conference as an adult?
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white" style={{ fontFamily: 'var(--font-dm-sans-font)' }}>
              Here are two ways to participate.
            </p>
          </div>

          {/* Right Content - 67% width - Cards Horizontal on Desktop */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-stretch">
            {/* Volunteer Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-dm-sans-font)' }}>
                Volunteer
              </h3>
              <p className="text-gray-700 mb-6 sm:mb-8 text-sm lg:text-base leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans-font)' }}>
                Have a heart for youth, adequate theological knowledge, and skills in leading? We're looking for small
                group leaders for 2026!
              </p>
              <Link 
                href="/volunteer"
                className="bg-[#6D4E47] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#5a3f39] transition w-full text-xs sm:text-sm uppercase inline-block text-center"
                style={{ fontFamily: 'var(--font-dm-sans-font)' }}
              >
                APPLY TO VOLUNTEER
              </Link>
            </div>

            {/* Donate Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-dm-sans-font)' }}>
                Donate
              </h3>
              <p className="text-gray-700 mb-6 sm:mb-8 text-sm lg:text-base leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans-font)' }}>
                Interested in financially supporting Gospel Conference? We'd love to partner with you in serving the
                youth in Ontario.
              </p>
              <Link 
                href="/donate"
                className="bg-[#4285F4] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#357AE8] transition w-full text-xs sm:text-sm uppercase inline-block text-center"
                style={{ fontFamily: 'var(--font-dm-sans-font)' }}
              >
                DONATE NOW
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .get-involved-bg-mobile {
          background-size: auto 200% !important;
        }
        
        @media (min-width: 768px) {
          .get-involved-bg-desktop {
            background-size: cover !important;
          }
        }
      `}</style>
    </section>
  )
}
