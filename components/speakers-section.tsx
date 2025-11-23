"use client"

import Image from "next/image"

export function SpeakersSection() {
  const speakers = [
    {
      name: "Carlton Wynne",
      role: "Main Speaker",
      description: "Provides technical assistance to customers during and after sales",
      image: "/images/home/speakers-section.png", // TODO: Replace with individual speaker photo
    },
    {
      name: "Juhan Song",
      role: "Seminar Speaker",
      description: "Provides technical assistance to customers during and after sales",
      image: "/images/home/speakers-section.png", // TODO: Replace with individual speaker photo
    },
    {
      name: "Richard Min",
      role: "Seminar Speaker",
      description: "Coordinates technical updates with product and development teams",
      image: "/images/home/speakers-section.png", // TODO: Replace with individual speaker photo
    },
  ]

  return (
    <section id="speakers" className="w-full py-16 md:py-24 bg-[#d4a574]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="space-y-12 md:space-y-16">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#8b6f47] tracking-wide">
            CONFERENCE SPEAKERS
          </h2>
          
          {/* Speakers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {speakers.map((speaker, index) => (
              <div key={index} className="text-center space-y-4">
                {/* Speaker Image - Square profile picture */}
                <div className="mx-auto w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 relative rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>
                
                {/* Speaker Info */}
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#007bff]">
                    {speaker.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 max-w-sm mx-auto">
                    {speaker.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}