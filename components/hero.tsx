"use client"

import Image from "next/image"

export function Hero() {
  const scrollToRegistration = () => {
    const element = document.getElementById("registration")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background - Using Hero Background image.png */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/home/hero-background-texture.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
      </div>
      
      {/* Content container - vertically and horizontally centered */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 md:px-8">
        {/* All content centered as a single block */}
        <div className="flex flex-col items-center justify-center text-center w-full space-y-8 md:space-y-10">
          {/* Hero Logo - cropped and scaled down 2x */}
          <div className="flex flex-col items-center">
            <div className="relative w-auto h-auto">
              <Image
                src="/images/home/hero-logo-cropped.png"
                alt="Gospel Conference Logo"
                width={250}
                height={13}
                className="object-contain h-auto w-auto max-w-[200px] md:max-w-[250px] lg:max-w-[300px]"
                priority
                quality={90}
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 250px, 300px"
              />
            </div>
          </div>

          {/* Main Title - CHRIST THE TRUE AND BETTER */}
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-[55.2px] font-league-spartan font-black leading-tight tracking-tight mb-4 md:mb-6">
              <span className="text-[#FFFFFF] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(0,0,0,0.4)]">CHRIST</span>{" "}
              <span className="text-[#6E97FF] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8),0_2px_10px_rgba(0,0,0,0.6),0_0_40px_rgba(0,0,0,0.4)]">THE TRUE AND BETTER</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] text-[#EAEAEA] font-inter drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              March 18–20 | Youth Retreat | Ontario, Canada
            </p>
          </div>

          {/* Register Now Button */}
          <div className="flex justify-center">
            <button
              onClick={scrollToRegistration}
              className="bg-[#C86611] text-white font-inter font-bold text-[17px] uppercase px-8 md:px-12 py-3 md:py-4 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(200,102,17,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]"
              aria-label="Register Now"
            >
              REGISTER NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}