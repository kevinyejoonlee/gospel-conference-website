"use client"

import Link from "next/link"
import { Mail, Instagram } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function Footer() {
  const pathname = usePathname()
  const isDonateOrRegisterPage = pathname === "/donate" || pathname === "/register"
  const [formData, setFormData] = useState({
    email: "",
    message: "",
    website: "", // Honeypot field - hidden from users
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)

  // Load reCAPTCHA v3 script
  useEffect(() => {
    // Only load reCAPTCHA if site key is configured
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setRecaptchaLoaded(true)
        })
      }
    }
    script.onerror = () => {
      // If script fails to load (e.g., localhost not in domains), continue without reCAPTCHA
      console.warn('reCAPTCHA script failed to load. Form will work without bot protection.')
      setRecaptchaLoaded(false)
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="recaptcha"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check - if this field is filled, it's a bot
    // Only check if it has a meaningful value (not just whitespace or empty)
    if (formData.website && formData.website.trim().length > 0) {
      console.log('Bot detected via honeypot')
      setSubmitStatus("error")
      setErrorMessage("Invalid request. Please try again.")
      return
    }
    
    // Validate input
    if (!formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus("error")
      setErrorMessage("Please fill in both your email and message.")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitStatus("error")
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage("")

    try {
      // Get reCAPTCHA token (optional - form works without it)
      let recaptchaToken = ''
      if (recaptchaLoaded && window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        try {
          recaptchaToken = await window.grecaptcha.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            { action: 'contact_form' }
          )
        } catch (recaptchaError) {
          // Continue without token if reCAPTCHA fails (e.g., localhost not in domains)
          console.warn('reCAPTCHA token generation failed. Continuing without bot protection:', recaptchaError)
          recaptchaToken = ''
        }
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setErrorMessage("")
        setFormData({ email: "", message: "", website: "" })
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null)
          setErrorMessage("")
        }, 5000)
      } else {
        console.error("API Error:", data)
        setSubmitStatus("error")
        // Show specific error message from API, or fallback to generic message
        setErrorMessage(
          data.error || 
          (response.status === 429 
            ? "Too many requests. Please wait a moment and try again." 
            : "Failed to send message. Please try again later.")
        )
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
              SEND US AN EMAIL
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Honeypot field - hidden from users, bots will fill it */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  opacity: 0,
                  pointerEvents: 'none',
                  visibility: 'hidden'
                }}
                aria-hidden="true"
              />
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm mb-2 text-white">
                  your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/30 pb-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors duration-200 autofill-styled"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm mb-2 text-white">
                  your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/30 pb-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white resize-none transition-colors duration-200"
                ></textarea>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send →"}
                  </button>
                  {submitStatus === "success" && (
                    <span className="text-xs text-green-400">Message sent successfully! We'll get back to you soon.</span>
                  )}
                </div>
                {submitStatus === "error" && errorMessage && (
                  <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
                )}
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
