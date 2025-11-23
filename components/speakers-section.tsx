"use client"

import Image from "next/image"

export function SpeakersSection() {
  return (
    <section id="speakers" className="w-full bg-[#F7F5F0] py-10 md:py-14 -mt-px relative overflow-hidden">
      {/* Shadow Overlay - matches section width and positioned at top */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-[20%] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(225, 225, 225, 0.6), rgba(230, 230, 230, 0.5), rgba(235, 235, 235, 0.3), transparent)',
          borderRadius: '0',
          opacity: '1'
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-10">
        {/* Section Title */}
        <h2 className="text-[#6E97FF] text-[40px] font-league-spartan font-black uppercase tracking-wide text-center mb-10 md:mb-12">
          CONFERENCE SPEAKERS
        </h2>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Speaker - Left */}
          <div className="flex flex-col items-center">
            {/* Speaker Label */}
            <p className="text-black text-[20px] font-inter font-bold uppercase text-center mb-6">
              MAIN SPEAKER
            </p>
            
            {/* Speaker Image Card */}
            <div className="relative w-full max-w-[280px] aspect-square rounded-[20px] border-[3px] border-[#6E97FF] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] mb-6">
              <Image
                src="/images/speakers/carlton-wynne.jpg"
                alt="Carlton Wynne"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
            
            {/* Speaker Name */}
            <h3 className="text-black text-[24px] font-inter font-bold text-center mb-5 md:mb-6">
              Carlton Wynne
            </h3>
            
            {/* Speaker Description */}
            <p className="text-black text-[16px] md:text-[18px] font-inter font-normal text-center leading-[1.5] max-w-[280px]">
              Provides technical assistance to customers during and after sales
            </p>
          </div>

          {/* Seminar Speaker - Middle */}
          <div className="flex flex-col items-center">
            {/* Speaker Label */}
            <p className="text-black text-[20px] font-inter font-bold uppercase text-center mb-6">
              SEMINAR SPEAKER
            </p>
            
            {/* Speaker Image Card */}
            <div className="relative w-full max-w-[280px] aspect-square rounded-[20px] border-[3px] border-[#F4A64A] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] mb-6">
              <Image
                src="/images/speakers/juhan-song.jpg"
                alt="Juhan Song"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
            
            {/* Speaker Name */}
            <h3 className="text-black text-[24px] font-inter font-bold text-center mb-5 md:mb-6">
              Juhan Song
            </h3>
            
            {/* Speaker Description */}
            <p className="text-black text-[16px] md:text-[18px] font-inter font-normal text-center leading-[1.5] max-w-[280px]">
              Provides technical assistance to customers during and after sales
            </p>
          </div>

          {/* Seminar Speaker - Right */}
          <div className="flex flex-col items-center">
            {/* Speaker Label */}
            <p className="text-black text-[20px] font-inter font-bold uppercase text-center mb-6">
              SEMINAR SPEAKER
            </p>
            
            {/* Speaker Image Card */}
            <div className="relative w-full max-w-[280px] aspect-square rounded-[20px] border-[3px] border-[#F4A64A] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] mb-6">
              <Image
                src="/images/speakers/richard-min.jpg"
                alt="Richard Min"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
            
            {/* Speaker Name */}
            <h3 className="text-black text-[24px] font-inter font-bold text-center mb-5 md:mb-6">
              Richard Min
            </h3>
            
            {/* Speaker Description */}
            <p className="text-black text-[16px] md:text-[18px] font-inter font-normal text-center leading-[1.5] max-w-[280px]">
              Coordinates technical updates with product and development teams
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
