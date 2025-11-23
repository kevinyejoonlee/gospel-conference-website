"use client"

import Image from "next/image"

export function IntroSection() {
  return (
    <section className="w-screen h-[50vh] relative overflow-hidden -mt-px" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}>
      {/* Background image - tightly cropped, covers entire width with zero white bars, focused on top bright area */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/home/intro-background.png"
          alt="Background gradient"
          fill
          className="object-cover object-top"
          quality={90}
          sizes="100vw"
        />
      </div>
      
      {/* Content - centered vertically and horizontally */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-[20px] md:text-[22px] font-inter leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <span className="block lg:inline">Gospel Conference hopes to continue the legacy of preserving and preaching </span>
            <span className="block lg:inline">the one true gospel of Jesus Christ in the midst of the noise of our generation.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
