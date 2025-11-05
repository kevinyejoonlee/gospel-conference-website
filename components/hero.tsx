"use client"

export function Hero() {
  const scrollToRegistration = () => {
    const element = document.getElementById("registration")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Nov%205%2C%202025%2C%2005_17_33%20PM-JN4IG8TfhQIvCUsGx2O5VWaapl1hiU.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content container */}
      <div className="relative z-10 max-w-6xl w-full px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4 md:space-y-6 text-center">
          {/* Large Logo */}
          <div className="mb-2 md:mb-4 mt-8 md:mt-12 lg:mt-16">
            <img
              src="/images/logo-black-bg.png"
              alt="Gospel Conference Logo"
              className="h-16 md:h-24 lg:h-32 w-auto mx-auto drop-shadow-2xl"
              style={{ 
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
                background: 'transparent'
              }}
              onError={(e) => {
                // Fallback to original if new logo fails
                const target = e.target as HTMLImageElement
                target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/efd5328a-9f28-4cc6-aa7a-772c9d70d630-RkDCgi6OMRgbdJKxlKBMbjP5sREnR8.png"
              }}
            />
          </div>

          {/* Main Conference Title */}
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white drop-shadow-lg tracking-tight">
              GOSPEL CONFERENCE
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 drop-shadow-md">
              MARCH 18-20, 2025
            </p>
          </div>

          {/* Theme/Subtitle */}
          <div className="space-y-1 md:space-y-2 pt-2 md:pt-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight text-sky-400 drop-shadow-lg">
              CHRIST THE TRUE AND BETTER
            </h2>
          </div>

          {/* Event details card */}
          <div className="space-y-2 md:space-y-3 bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 max-w-md mt-4 md:mt-6">
            <p className="text-base md:text-lg font-semibold text-white">GRADES 7-12</p>
            <p className="text-xs md:text-sm text-white/80">Ages 12-18</p>

            <p className="text-base md:text-lg font-semibold text-white pt-2">FEE: $90</p>
            <p className="text-xs md:text-sm text-white/80">CAD per student</p>

            <p className="text-base md:text-lg font-semibold text-white pt-2">DAE HAN PRAYER HOUSE</p>
            <p className="text-xs md:text-sm text-white/80">Toronto, Ontario</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToRegistration}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 md:px-12 lg:px-16 py-4 md:py-5 lg:py-6 rounded-lg font-bold text-lg md:text-xl lg:text-2xl transition-all hover:scale-105 shadow-lg mt-2 md:mt-4"
          >
            REGISTER NOW
          </button>

          {/* Scroll indicator arrow below button */}
          <div className="mt-4 md:mt-6 animate-bounce">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

