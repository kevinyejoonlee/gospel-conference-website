"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const isDonatePage = pathname === "/donate"
  const isVolunteerPage = pathname === "/volunteer"
  const isRegisterPage = pathname === "/register"
  const isHomePage = pathname === "/"
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav
      className="absolute top-0 left-0 right-0 z-50 bg-transparent pointer-events-none"
      style={{ height: 'auto' }}
    >
      <div className="max-w-7xl mx-auto py-3 px-4 md:px-6 pointer-events-none">
        <div className="flex justify-between items-center pointer-events-auto">
        <Link href="/" className="flex items-center">
            <img 
              src="/logo-navbar.svg" 
              alt="Gospel Conference Logo" 
              className="h-7 sm:h-8 md:h-9 w-auto" 
              width="181"
              height="36"
              style={{ 
                imageRendering: 'auto',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
              loading="eager"
            />
          </Link>
          {/* Desktop Menu */}
          <ul
            className={`hidden md:flex gap-8 text-sm font-medium items-center ${
              isDonatePage ? "text-white" : isRegisterPage ? "text-black" : "text-white"
            }`}
          >
            <li>
              <Link
                href="/"
                className={`${
                  isRegisterPage 
                    ? "hover:text-gray-700 hover:border-b-2 hover:border-black hover:pb-1" 
                    : "hover:text-blue-400 hover:border-b-2 hover:border-blue-400 hover:pb-1"
                } transition ${
                  pathname === "/"
                    ? isRegisterPage
                      ? "border-b-2 border-black pb-1"
                      : "border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`${
                  isRegisterPage 
                    ? "hover:text-gray-700 hover:border-b-2 hover:border-black hover:pb-1" 
                    : "hover:text-blue-400 hover:border-b-2 hover:border-blue-400 hover:pb-1"
                } transition ${
                  pathname === "/about"
                    ? isRegisterPage
                      ? "border-b-2 border-black pb-1"
                      : "border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/volunteer"
                className={`${
                  isRegisterPage 
                    ? "hover:text-gray-700 hover:border-b-2 hover:border-black hover:pb-1" 
                    : "hover:text-blue-400 hover:border-b-2 hover:border-blue-400 hover:pb-1"
                } transition ${
                  pathname === "/volunteer"
                    ? isRegisterPage
                      ? "border-b-2 border-black pb-1"
                      : "border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                VOLUNTEER
              </Link>
            </li>
            <li>
              <Link
                href="/donate"
                className={`${
                  isRegisterPage 
                    ? "hover:text-gray-700 hover:border-b-2 hover:border-black hover:pb-1" 
                    : "hover:text-blue-400 hover:border-b-2 hover:border-blue-400 hover:pb-1"
                } transition ${
                  pathname === "/donate"
                    ? isRegisterPage
                      ? "border-b-2 border-black pb-1"
                      : "border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                DONATE
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className={`text-blue-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 hover:pb-1 transition ${
                  pathname === "/register"
                    ? "border-b-2 border-blue-500 pb-1"
                    : ""
                }`}
              >
                REGISTER NOW
              </Link>
            </li>
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            className={`md:hidden relative z-50 p-2 rounded-lg transition-all duration-300 ${
              isVolunteerPage || isRegisterPage
                ? "text-black hover:bg-black/10 active:bg-black/20"
                : "text-white hover:bg-white/10 active:bg-white/20"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-center gap-1.5">
              <span
                className={`block h-0.5 w-full rounded-full transition-all duration-300 ${
                  isVolunteerPage || isRegisterPage ? "bg-black" : "bg-white"
                } ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-full transition-all duration-300 ${
                  isVolunteerPage || isRegisterPage ? "bg-black" : "bg-white"
                } ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-full rounded-full transition-all duration-300 ${
                  isVolunteerPage || isRegisterPage ? "bg-black" : "bg-white"
                } ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Mobile Menu */}
        <div
          className={`md:hidden relative z-40 mt-4 transition-all duration-300 ease-out ${
            isMenuOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <ul
            className="flex flex-col gap-1 pb-4 text-sm font-medium rounded-lg bg-black/80 text-white shadow-xl backdrop-blur-md p-4"
          >
            <li>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-md hover:bg-opacity-20 transition-all duration-200 ${
                  pathname === "/"
                    ? "bg-white/20 text-white font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-md hover:bg-opacity-20 transition-all duration-200 ${
                  pathname === "/about"
                    ? "bg-white/20 text-white font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/volunteer"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-md hover:bg-opacity-20 transition-all duration-200 ${
                  pathname === "/volunteer"
                    ? "bg-white/20 text-white font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                VOLUNTEER
              </Link>
            </li>
            <li>
              <Link
                href="/donate"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-md hover:bg-opacity-20 transition-all duration-200 ${
                  pathname === "/donate"
                    ? "bg-white/20 text-white font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                DONATE
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 rounded-md transition-all duration-200 ${
                  pathname === "/register"
                    ? "bg-blue-500/20 text-blue-400 font-semibold"
                    : "text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                }`}
              >
                REGISTER NOW
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar