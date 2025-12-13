"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame for smoother start
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
      <section className="relative w-full overflow-hidden">
        {/* Hero Section with Background */}
        <div className="relative min-h-screen md:h-[78vh] bg-black">
          <div
            className="absolute inset-0 bg-center bg-no-repeat hero-bg-mobile md:hero-bg-desktop"
            style={{
              backgroundImage: "url(/hero-bg.svg)",
              backgroundPosition: "center",
              backgroundSize: "auto 165%",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50"></div>
          </div>
          <div className="relative z-10 min-h-screen md:h-[78vh] flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 py-16 md:py-12">
            {/* Complete Hero Content - Logo, Title, Details, and Button together */}
            <div className={`hero-all-content ${isLoaded ? 'animate-fade-in-up' : 'hero-hidden'}`}>
              {/* Conference Year with Logo */}
              <div className="mb-8 sm:mb-10 md:mb-16" style={{ marginTop: '2%' }}>
                <p className="text-xs sm:text-sm md:text-base text-white mb-0 tracking-wider flex items-center justify-center gap-2">
                  <img src="/logo-hero.svg" alt="Gospel Conference Logo" className="h-5 sm:h-6 md:h-9 w-auto" />
              </p>
            </div>

            {/* Main Title */}
            <h1 
                className="font-spartan font-bold mb-0 w-[90vw] sm:w-[85vw] md:w-[80vw] leading-tight mx-auto px-2 text-center"
              style={{ 
                textShadow: '0 6px 16px rgba(0, 0, 0, 0.7)',
                  fontSize: 'clamp(1.75rem, 6vw, 5rem)',
              }}
            >
              CHRIST <span className="text-blue-400">THE TRUE AND BETTER</span>
            </h1>

            {/* Event Details */}
              <p className="font-dm-sans text-sm sm:text-base md:text-[23px] mt-2 sm:-mt-3 md:-mt-2 mb-20 sm:mb-24 md:mb-20 text-white-200 px-4 sm:px-2 max-w-2xl mx-auto text-center">
              <b>March 18-20</b> | Grades 7-12 | East Gwillimbury, Ontario
            </p>

            {/* Register Button */}
            <Link
              href="/register"
                className="font-dm-sans inline-block text-sm sm:text-base md:text-xl border-2 border-white bg-gray-800/50 text-white px-6 sm:px-5 md:px-7 py-2 sm:py-1 md:py-2 rounded-full font-bold transition duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:-translate-y-[2px]"
            >
              REGISTER NOW
            </Link>
            </div>
          </div>
        </div>

      {/* Mission Statement Section - with Background Image */}
      <div className="relative text-white h-[50vh] md:h-[30vh] flex items-center mission-section bg-black">
        <div
          className="absolute inset-0 bg-center bg-no-repeat mission-bg-mobile md:mission-bg-desktop"
          style={{
            backgroundImage: "url(/mission-bottom-hero.svg)",
            backgroundSize: "auto 1100%",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <p 
            className={`font-dm-sans relative z-10 font-bold leading-relaxed w-[85vw] sm:w-[80vw] md:w-[82vw] text-left md:text-center mx-auto px-6 sm:px-8 md:px-0 ${isLoaded ? 'animate-fade-in-up' : 'hero-hidden'}`}
            style={{
              textShadow: '0 6px 16px rgba(0, 0, 0, 0.7)',
              fontSize: 'clamp(1.125rem, 2.07vw, 2rem)',
              animationDelay: '0.3s'
            }}
        >
          Gospel Conference hopes to continue the legacy of preserving and preaching the one true gospel of Jesus Christ in the midst of the noise of our generation.
        </p>

      </div>

      <style jsx>{`
        .hero-bg-mobile {
          background-size: auto 165% !important;
        }
        
        @media (min-width: 768px) {
          .hero-bg-desktop {
            background-size: 125% auto !important;
          }
        }

        .mission-bg-mobile {
          background-size: auto 1100% !important;
        }
        
        @media (min-width: 768px) {
          .mission-bg-desktop {
            background-size: 145% auto !important;
          }
        }

        .hero-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          will-change: opacity, transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
        }

        .hero-all-content {
          animation-delay: 0.15s;
        }

        .mission-section {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  )
}