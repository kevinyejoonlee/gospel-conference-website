"use client"

import Link from "next/link"
import { Mail, Instagram } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string>("")

  const copyEmailToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText('hello@gospelconference.ca')
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("") // Clear any previous errors
    
    // Validate email before submission
    const userEmail = email.trim()
    if (!userEmail || !userEmail.includes('@')) {
      setFormError('Please enter a valid email address.')
      return
    }
    
    setIsSubmitting(true)

    const displayName = name.trim() || "Guest"
    const userMessage = message.trim()

    try {
      // Prepare FormSubmit data - submit directly from client for auto-response to work
      const formData = new FormData()
      formData.append('formType', 'QUESTION')
      formData.append('name', displayName)
      formData.append('email', userEmail) // Important: field must be named 'email' for auto-response
      formData.append('message', userMessage)
      
      // Add unique timestamp to prevent email threading
      const timestamp = Date.now()
      formData.append('_subject', `[QUESTION] - ${displayName} - ${timestamp}`)
      formData.append('_captcha', 'false')
      formData.append('_template', 'table')
      
      // Auto-response email to the user
      formData.append('_autoresponse', `Hi ${displayName},\n\nThank you for reaching out to Gospel Conference! We have received your question and will get back to you as soon as possible.\n\nWe appreciate your interest and look forward to connecting with you.\n\nBlessings,\nThe Gospel Conference Team\n\n---\nThis is an automated response. If you have any urgent questions, please contact us directly at hello@gospelconference.ca`)
      formData.append('_autoresponsesubject', 'Thank you for contacting Gospel Conference!')
      formData.append('_next', 'https://gospelconference.ca') // Prevents redirect
      formData.append('_cc', userEmail) // Ensures auto-response is sent
      
      // Set reply-to so admin can reply directly
      formData.append('_replyto', userEmail)

      // Decode base64 email to prevent scraping (same as other forms)
      const recipientEmail = atob('aGVsbG9AZ29zcGVsY29uZmVyZW5jZS5jYQ==')
      
      // Submit directly to FormSubmit from client (required for auto-response to work)
      let emailResponse: Response | null = null
      try {
        emailResponse = await fetch(`https://formsubmit.co/${recipientEmail}`, {
          method: 'POST',
          body: formData,
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }

      if (emailResponse && emailResponse.ok) {
        // Reset form on success
        setName("")
        setEmail("")
        setMessage("")
        setSubmitted(true)
        // Reset submitted state after showing message
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        // Handle error response
        if (!emailResponse) {
          setFormError('Network error: Please check your internet connection and try again.')
          console.error('FormSubmit error: No response received (network error)')
        } else {
          setFormError('There was an error sending your message. Please try again.')
          console.error('FormSubmit error:', emailResponse.status, emailResponse.statusText)
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setFormError('Network error: Please check your internet connection and try again.')
      } else {
        setFormError('There was an error sending your message. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
                src="/footer-logo-alt.svg" 
                alt="Gospel Conference Logo" 
                className="h-20 sm:h-24 md:h-28 lg:h-36 xl:h-40 w-auto"
                width="810"
                height="810"
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
            </div>
          </div>

          {/* Email Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest mb-4 sm:mb-6 uppercase">
              SEND US AN QUESTION
            </h3>
            {submitted ? (
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <p className="text-green-400 text-xs sm:text-sm">
                  Thank you! Your message has been sent successfully.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
              >
              
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm mb-2 text-white">
                  your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/30 pb-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors duration-200 autofill-styled"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm mb-2 text-white">
                  your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/30 pb-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white resize-none transition-colors duration-200"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send →'}
                </button>
              </div>
              {/* Form Error Message */}
              {formError && (
                <div className="mt-2">
                  <p className="text-red-400 text-xs sm:text-sm">{formError}</p>
                </div>
              )}
            </form>
            )}
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest mb-4 sm:mb-6 uppercase">
              GET IN TOUCH
            </h3>
            <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
              <button
                onClick={copyEmailToClipboard}
                className="flex items-center gap-2 sm:gap-3 group hover:text-blue-400 transition-colors duration-200 break-all cursor-pointer"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
                <span className="text-white group-hover:text-blue-400 transition-colors duration-200">
                  hello@gospelconference.ca
                </span>
                {emailCopied && (
                  <span className="text-blue-400 text-[10px] sm:text-xs ml-1 opacity-0 animate-in fade-in duration-200">
                    ✓ Copied!
                  </span>
                )}
              </button>
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