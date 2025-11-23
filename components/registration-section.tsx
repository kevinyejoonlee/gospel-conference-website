"use client"

import Image from "next/image"
import { RegistrationForm } from "@/components/registration-form"

export function RegistrationSection() {
  return (
    <section id="registration" className="w-screen h-screen relative overflow-hidden -mt-px" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }}>
      {/* Background image - full width and height, no white space */}
      <div className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }}>
        <Image
          src="/images/home/registration-background.png"
          alt="Registration background"
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
      </div>
      
      <div className="relative z-10 w-full h-full flex items-center justify-start px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-2xl space-y-10 md:space-y-12">
          {/* Section Title - styled like reference */}
          <div className="text-left space-y-4">
            <h2 className="text-[40px] font-league-spartan font-bold">
              <span className="text-gray-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">REGISTER FOR </span>
              <span className="text-yellow-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">GC26</span>
              <span className="text-gray-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"> NOW</span>
            </h2>
          </div>

          {/* Registration Form Container */}
          <div className="bg-white rounded-lg border-2 border-blue-600 p-6 md:p-8 lg:p-10 shadow-lg">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  )
}
