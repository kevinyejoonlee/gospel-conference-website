"use client"

import { useState } from "react"

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

  const scrollToSpeakers = () => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById("speakers")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToHome = () => {
    setIsMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="bg-primary text-primary-foreground py-4 md:py-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/efd5328a-9f28-4cc6-aa7a-772c9d70d630-RkDCgi6OMRgbdJKxlKBMbjP5sREnR8.png"
            alt="Gospel Conference Logo"
            className="w-10 h-10 object-contain"
            style={{ background: "transparent" }}
            onError={(e) => {
              // Hide image if it fails to load
              const target = e.target as HTMLImageElement
              target.style.display = "none"
            }}
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={scrollToHome} className="hover:opacity-80 transition-opacity">
            HOME
          </button>
          <button onClick={scrollToAbout} className="hover:opacity-80 transition-opacity">
            ABOUT
          </button>
          <button onClick={scrollToSpeakers} className="hover:opacity-80 transition-opacity">
            SPEAKERS
          </button>
          <button
            onClick={scrollToRegistration}
            className="bg-white text-primary px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all"
          >
            REGISTER NOW
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
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
        <nav className="md:hidden border-t border-primary-foreground/20 mt-4 pt-4 pb-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
            <button
              onClick={scrollToHome}
              className="text-left hover:opacity-80 transition-opacity py-2 text-sm font-medium"
            >
              HOME
            </button>
            <button
              onClick={scrollToAbout}
              className="text-left hover:opacity-80 transition-opacity py-2 text-sm font-medium"
            >
              ABOUT
            </button>
            <button
              onClick={scrollToSpeakers}
              className="text-left hover:opacity-80 transition-opacity py-2 text-sm font-medium"
            >
              SPEAKERS
            </button>
            <button
              onClick={scrollToRegistration}
              className="bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-all text-center mt-2"
            >
              REGISTER NOW
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
