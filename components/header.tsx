"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToRegistration = () => {
    setIsMobileMenuOpen(false)
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        const element = document.getElementById("registration")
        element?.scrollIntoView({ behavior: "smooth" })
      } else {
        window.location.href = '/#registration'
      }
    }
  }

  const scrollToHome = () => {
    setIsMobileMenuOpen(false)
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return (
    <header className="bg-black text-white py-3 md:py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo - using new navbar logo, zoomed in for better visibility */}
        <Link href="/" onClick={scrollToHome} className="flex items-center">
          <Image
            src="/images/header/navbar-logo-cropped.png"
            alt="Gospel Conference Logo"
            width={131}
            height={35}
            className="object-contain h-8 md:h-10 lg:h-12 w-auto"
            priority
            quality={90}
            sizes="(max-width: 768px) 120px, (max-width: 1024px) 150px, 180px"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-base font-inter uppercase">
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-80 transition-opacity text-white">
            ABOUT
          </Link>
          <Link href="/" onClick={scrollToHome} className="hover:opacity-80 transition-opacity text-[#C86611]">
            GC26
          </Link>
          <Link href="/volunteer" className="hover:opacity-80 transition-opacity text-white">
            VOLUNTEER
          </Link>
          <Link href="/support" className="hover:opacity-80 transition-opacity text-white">
            SUPPORT
          </Link>
          <Link href="/contact" className="hover:opacity-80 transition-opacity text-white">
            CONTACT
          </Link>
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
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white"
            >
              ABOUT
            </Link>
            <Link
              href="/"
              onClick={scrollToHome}
              className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-[#C86611]"
            >
              GC26
            </Link>
            <Link href="/volunteer" className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white">
              VOLUNTEER
            </Link>
            <Link href="/support" className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white">
              SUPPORT
            </Link>
            <Link href="/contact" className="text-left hover:opacity-80 transition-opacity py-2 text-base font-inter uppercase text-white">
              CONTACT
            </Link>
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