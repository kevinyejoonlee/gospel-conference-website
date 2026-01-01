"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
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
        <div className="relative z-10 min-h-screen md:h-[78vh] flex flex-col items-center justify-center text-center text-white">
          <div className={`max-w-7xl mx-auto w-full px-4 md:px-6 hero-all-content ${isLoaded ? 'animate-fade-in-up' : 'hero-hidden'}`}>
            {/* Conference Year with Logo */}
            <div className="mb-8 sm:mb-10 md:mb-16 mt-[15%] md:mt-[2%]">
              <p className="text-xs sm:text-sm md:text-base text-white mb-0 tracking-wider flex items-center justify-center gap-2">
                <img src="/logo-hero.svg" alt="Gospel Conference Logo" className="h-5 sm:h-6 md:h-9 w-auto" />
              </p>
            </div>

            {/* Main Title - Consistent max-width instead of vw */}
            <h1 
              className="font-spartan font-bold mb-0 max-w-4xl mx-auto leading-tight text-center"
              style={{ 
                textShadow: '0 6px 16px rgba(0, 0, 0, 0.7)',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
              }}
            >
              CHRIST <span className="text-blue-400">THE <br className="md:hidden" />TRUE AND BETTER</span>
            </h1>

            {/* Event Details - Consistent max-width */}
            <p className="font-dm-sans text-sm sm:text-base md:text-[23px] mt-2 sm:-mt-3 md:-mt-2 mb-20 sm:mb-24 md:mb-20 text-white-200 max-w-2xl mx-auto text-center">
              <b>March 18-20</b> | Grades 7-12 | East Gwillimbury, Ontario
            </p>

            {/* Register Button */}
            <Link
              href="/register"
              className="font-dm-sans inline-block text-sm sm:text-base md:text-xl border-2 border-white bg-gray-800/50 text-white px-6 sm:px-5 md:px-7 py-2 sm:py-1 md:py-2 rounded-full font-bold transition duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:-translate-y-[2px]"
            >
              REGISTER JAN 1ST
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
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
          <p 
            className={`mission-statement font-dm-sans font-bold leading-relaxed max-w-4xl mx-auto text-center ${isLoaded ? 'animate-fade-in-up' : 'hero-hidden'}`}
            style={{
              textShadow: '0 6px 16px rgba(0, 0, 0, 0.7)',
              animationDelay: '0.3s'
            }}
          >
            Gospel Conference hopes to continue the legacy of preserving and preaching the one true gospel of Jesus Christ in the midst of the noise of our generation.
          </p>
        </div>
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

        .mission-statement {
          font-size: 1.125rem;
        }
        
        @media (min-width: 768px) {
          .mission-statement {
            font-size: clamp(1.125rem, 2.07vw, 2rem);
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


