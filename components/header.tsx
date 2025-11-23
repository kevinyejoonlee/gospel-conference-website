"use client"

import { useState } from "react"
import Image from "next/image"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToRegistration = () => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById("registration")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToAbout = () => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById("about")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToHome = () => {
    setIsMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="bg-black text-white py-3 md:py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo - using new navbar logo, scaled down 2x */}
        <div className="flex items-center">
          <Image
            src="/images/header/navbar-logo-cropped.png"
            alt="Gospel Conference Logo"
            width={113}
            height={22}
            className="object-contain h-6 md:h-8 lg:h-10 w-auto"
            priority
            quality={90}
            sizes="(max-width: 768px) 100px, (max-width: 1024px) 110px, 113px"
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-base font-inter uppercase">
          <button onClick={scrollToAbout} className="hover:opacity-80 transition-opacity text-white">
            ABOUT
          </button>
          <button onClick={scrollToHome} className="hover:opacity-80 transition-opacity text-[#C86611]">
            GC26
          </button>
          <button className="hover:opacity-80 transition-opacity text-white">
            VOLUNTEER
          </button>
          <button className="hover:opacity-80 transition-opacity text-white">
            SUPPORT
          </button>
          <button className="hover:opacity-80 transition-opacity text-white">
            CONTACT
          </button>
          <button
            onClick={scrollToRegistration}
            className="text-[#C86611] hover:text-[#B85A0F] transition-colors font-bold"
          >
            REGISTER NOW
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-white/20 mt-4 pt-4 pb-4 bg-black">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
            <button
              onClick={scrollToAbout}
              className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white"
            >
              ABOUT
            </button>
            <button
              onClick={scrollToHome}
              className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-[#C86611]"
            >
              GC26
            </button>
            <button className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white">
              VOLUNTEER
            </button>
            <button className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white">
              SUPPORT
            </button>
            <button className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white">
              CONTACT
            </button>
            <button
              onClick={scrollToRegistration}
              className="text-left text-[#C86611] hover:text-[#B85A0F] transition-colors py-2 text-base font-inter uppercase font-bold"
            >
              REGISTER NOW
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}