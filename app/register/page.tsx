"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

function RegisterForm() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    address: "",
    email: "",
    emergencyContact: "",
    healthCardNumber: "",
    church: "",
    isChristian: "",
    grade: "",
    tshirtSize: "",
    allergies: "",
    photoConsent: "",
    specialNotes: "",
  })

  useEffect(() => {
    // Check for success or cancel from Stripe redirect
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    
    if (success === 'true') {
      alert('Registration successful! Thank you for registering for Gospel Conference 2026.')
      // Optionally reset form or redirect
    } else if (canceled === 'true') {
      alert('Payment was canceled. You can try again when ready.')
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        alert('Please fill in all required fields (First Name, Last Name, Email)')
        setIsLoading(false)
        return
      }

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          type: 'register',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error: any) {
      console.error('Error submitting form:', error)
      alert(error.message || 'An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

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

        {/* Right: Registration Form Section - Full width on mobile, 67% on desktop */}
        <div className="w-full lg:w-2/3 lg:h-[100vh] bg-[#fffcf3] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 sm:pt-8 md:pt-12 lg:pt-24 pb-8 sm:pb-10 md:pb-12 lg:pb-4 overflow-y-auto lg:overflow-y-auto" style={{ direction: "rtl" }}>
          <div className="max-w-4xl mx-auto w-full" style={{ direction: "ltr" }}>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0" style={{ color: '#428ce4', letterSpacing: '0.5px' }}>
              REGISTER FOR GOSPEL CONFERENCE 2026
            </h1>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 px-2 sm:px-0">
            {/* Row 1: First, Last, Preferred */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Preferred Name</label>
                <input
                  type="text"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Row 2: DOB and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Date of Birth (MM/DD/YYYY)</label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Address (Street, City, Province, Postal Code)
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Row 3: Email and Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Emergency Contact (Relationship and Phone #)
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Health Card Number */}
            <div>
              <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Health Card Number</label>
              <input
                type="text"
                name="healthCardNumber"
                value={formData.healthCardNumber}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Church */}
            <div>
              <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">What church do you attend?</label>
              <input
                type="text"
                name="church"
                value={formData.church}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Row: Are you Christian, Grade, T-shirt Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Are you Christian?</label>
                <select
                  name="isChristian"
                  value={formData.isChristian}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Select your grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                >
                  <option value="">Select...</option>
                  {[7, 8, 9, 10, 11, 12].map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Select your t-shirt size</label>
                <select
                  name="tshirtSize"
                  value={formData.tshirtSize}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                >
                  <option value="">Select...</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
            </div>

            {/* Row: Allergies and Photo Consent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Any allergies or food restrictions?
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Do you consent to having your photo taken?
                </label>
                <select
                  name="photoConsent"
                  value={formData.photoConsent}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Any special notes?</label>
              <textarea
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm uppercase mt-4 sm:mt-6 hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#428ce4' }}
            >
              {isLoading ? 'PROCESSING...' : 'PAY NOW'}
            </button>
          </form>
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
