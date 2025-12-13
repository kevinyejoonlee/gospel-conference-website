"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function RegisterForm() {
  const searchParams = useSearchParams()

  return (
    <div className="bg-[#fffcf3]">
      <Navbar />

      {/* Main content - responsive container */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-16 lg:pt-0">
        {/* Left: Promotional Poster Section - 33% width with background SVG - Hidden on mobile/tablet */}
        <div 
          className="hidden lg:block w-full lg:w-1/3 h-screen relative shrink-0 overflow-hidden"
          style={{ 
            backgroundImage: 'url("/about our theme background.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Poster vertically centered on desktop */}
          <div className="relative w-full h-full flex items-center justify-center px-6 md:px-8 lg:px-10 z-10">
            <div>
              <img 
                src="/register poster.svg" 
                alt="Gospel Conference 2026 Poster" 
                className="w-full h-auto max-w-full object-contain max-h-[90vh] relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Right: Opening Soon Section - Full width on mobile, 67% on desktop */}
        <div className="w-full lg:w-2/3 lg:h-[100vh] bg-[#fffcf3] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 sm:pt-8 md:pt-12 lg:pt-24 pb-8 sm:pb-10 md:pb-12 lg:pb-4 overflow-y-auto lg:overflow-y-auto flex items-center justify-center" style={{ direction: "rtl" }}>
          <div className="max-w-2xl mx-auto w-full" style={{ direction: "ltr" }}>
            
            {/* Opening Soon Message */}
            <div className="bg-white rounded-2xl p-8 sm:p-12 md:p-16 text-center shadow-xl border-2 border-blue-100">
              <div className="mb-8">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: '#428ce4', fontFamily: 'var(--font-spartan-font)' }}>
                Opening Soon!
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-4 font-[var(--font-dm-sans-font)]">
                Registration for Gospel Conference 2026 will open January 1st, 2026.
              </p>
              <p className="text-base sm:text-lg text-gray-600 font-[var(--font-dm-sans-font)]">
                Check back later or follow us for updates!
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer - Outside the 100vh container */}
      <Footer />
    </div>
  )
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffcf3] flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}