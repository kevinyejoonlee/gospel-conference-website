"use client"
import { useEffect, useRef, useState } from "react"

export default function Sing() {
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
    <div className="sing-fullwidth-wrapper">
      <section ref={sectionRef} className="relative w-full overflow-hidden min-h-[220px] sm:min-h-[250px] md:min-h-[250px] lg:h-[43.5vh] lg:min-h-0 flex items-center justify-center">
        {/* Background with SVG */}
        <div
          className="absolute inset-0 bg-no-repeat sing-bg-mobile md:sing-bg-desktop"
          style={{
            backgroundImage: "url(/get-read-to-sing-background.svg)",
            backgroundPosition: "center",
            backgroundSize: "auto 420%",
        
          }}
        />

      {/* Content */}
      <div className={`relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-12 sm:py-14 md:py-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 
          className="font-bold text-white mb-6 sm:mb-8 md:mb-10"
          style={{ 
            fontFamily: 'var(--font-spartan-font)',
            fontSize: 'clamp(1.5rem, 5vw, 4rem)',
            textShadow: '0 6px 16px rgba(0, 0, 0, 0.7)',
            lineHeight: '1.2'
          }}
        >
          Get ready to sing with us!
        </h2>
        <a 
          href="https://open.spotify.com/playlist/448nlBFbx8Sofv4xnC1PEY?si=f0898bb9fdf64a96"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full font-bold transition-all duration-300 text-xs sm:text-sm md:text-base uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-[2px] inline-block"
          style={{ fontFamily: 'var(--font-dm-sans-font)' }}
        >
          GOSPEL CONFERENCE 2026 SETLIST
        </a>
      </div>
      </section>

      <style jsx>{`
        .sing-fullwidth-wrapper {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
        
        .sing-bg-mobile {
            background-size: auto 500% !important;
        }
        
        @media (min-width: 768px) {
          .sing-bg-desktop {
            background-size: 150% auto !important;
          }
        }
      `}</style>
    </div>
  )
}
