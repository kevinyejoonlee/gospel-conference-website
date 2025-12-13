"use client"

import Link from "next/link"
import { Mail, Instagram } from "lucide-react"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  const isDonateOrRegisterPage = pathname === "/donate" || pathname === "/register"

  return (
    <footer className="bg-black text-white relative">
      {/* Top border - subtle light brown/gold line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-14 md:mb-16">
          {/* Logo Section */}
          <div className="lg:col-span-1 flex items-center justify-start">
            <div className="mb-4">
              <img 
                src="/Footer Logo.svg" 
                alt="Gospel Conference Logo" 
                className={`h-20 sm:h-24 md:h-28 lg:h-36 xl:h-40 w-auto ${
                  isDonateOrRegisterPage ? "brightness-0 invert" : ""
                }`}
              />
            </div>
          </div>

          {/* Email Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest mb-4 sm:mb-6 uppercase">
              SEND US AN QUESTION
            </h3>
            <form 
              action="https://formspree.io/f/mvgeldgj"
              method="POST"
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm mb-2 text-white">
                  your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent border-b border-white/30 pb-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors duration-200 autofill-styled"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm mb-2 text-white">
                  your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/30 pb-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white resize-none transition-colors duration-200"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                >
                  Send →
                </button>
              </div>
            </form>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest mb-4 sm:mb-6 uppercase">
              GET IN TOUCH
            </h3>
            <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
              <a
                href="mailto:hello@gospelconference.ca"
                className="flex items-center gap-2 sm:gap-3 group hover:text-blue-400 transition-colors duration-200 break-all"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
                <span className="text-white group-hover:text-blue-400 transition-colors duration-200">
                  hello@gospelconference.ca
                </span>
              </a>
              <a
                href="https://instagram.com/GospelConference"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 group hover:text-blue-400 transition-colors duration-200"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
                <span className="text-white group-hover:text-blue-400 transition-colors duration-200">
                  @GospelConference
                </span>
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest mb-4 sm:mb-6 uppercase">
              TABS
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white hover:text-blue-400 transition-colors duration-200 block"
                >
                  home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-blue-400 transition-colors duration-200 block"
                >
                  about
                </Link>
              </li>
              <li>
                <Link
                  href="/volunteer"
                  className="text-white hover:text-blue-400 transition-colors duration-200 block"
                >
                  volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-white hover:text-blue-400 transition-colors duration-200 block"
                >
                  support
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white hover:text-blue-400 transition-colors duration-200 block"
                >
                  register now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Autofill styling for black background - completely transparent */
        input.autofill-styled:-webkit-autofill,
        input.autofill-styled:-webkit-autofill:hover,
        input.autofill-styled:-webkit-autofill:focus,
        input.autofill-styled:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          -webkit-text-fill-color: white !important;
          background-color: transparent !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        /* For Firefox and other browsers */
        input.autofill-styled:autofill {
          background-color: transparent !important;
          color: white !important;
        }
      `}</style>
    </footer>
  )
}

export default Footer