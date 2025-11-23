"use client"

import Image from "next/image"

export function EventDetailsSection() {
  return (
    <section className="w-screen h-screen relative overflow-hidden -mt-px" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}>
      {/* Background image - renamed and cropped */}
      <div className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }}>
        <Image
          src="/images/home/event-details-background-cropped.png"
          alt="Event details background"
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
      </div>
      
      {/* Content - centered on mobile, right of center on desktop */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col space-y-5 md:space-y-6 text-center md:text-left items-center md:items-start w-full md:w-auto md:ml-[55%]">
          {/* Daehan Prayer House */}
          <div className="flex flex-col items-center">
            <p className="text-white text-[24px] font-inter leading-normal whitespace-nowrap">
              📍 Daehan Prayer House
            </p>
            <div className="mt-5 h-[1.5px] bg-white/50 w-[50vw] md:w-[200%]"></div>
          </div>
          
          {/* Date */}
          <div className="flex flex-col items-center">
            <p className="text-white text-[24px] font-inter font-bold leading-normal whitespace-nowrap">
              📅 March 18–20, 2026
            </p>
            <div className="mt-5 h-[1.5px] bg-white/50 w-[50vw] md:w-[200%]"></div>
          </div>
          
          {/* Youth Retreat */}
          <div className="flex flex-col items-center">
            <p className="text-white text-[24px] font-inter leading-normal whitespace-nowrap">
              Youth Retreat
            </p>
            <div className="mt-5 h-[1.5px] bg-white/50 w-[50vw] md:w-[200%]"></div>
          </div>
          
          {/* Grades */}
          <div className="flex flex-col items-center">
            <p className="text-white text-[24px] font-inter leading-normal whitespace-nowrap">
              Grades 7–12
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

