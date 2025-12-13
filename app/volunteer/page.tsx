"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function VolunteerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    address: "",
    email: "",
    phoneNumber: "",
    churchAttendance: "",
    leadershipCapacity: "",
    testimony: "",
    gospel: "",
    groupLeading: "",
    agreement: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Validate all required fields (except preferredName)
      const requiredFields = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        churchAttendance: formData.churchAttendance,
        leadershipCapacity: formData.leadershipCapacity,
        testimony: formData.testimony,
        gospel: formData.gospel,
        groupLeading: formData.groupLeading,
        agreement: formData.agreement,
      }

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value || value.trim() === '')
        .map(([key]) => {
          // Convert camelCase to readable format
          return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
        })

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields:\n${missingFields.join('\n')}`)
        setIsLoading(false)
        return
      }

      // Submit form data directly to volunteer API
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      // Show success message and reset form
      alert('Application submitted successfully! Thank you for your interest in volunteering. We will be in contact with you soon.')
      setFormData({
        firstName: "",
        lastName: "",
        preferredName: "",
        dateOfBirth: "",
        address: "",
        email: "",
        phoneNumber: "",
        churchAttendance: "",
        leadershipCapacity: "",
        testimony: "",
        gospel: "",
        groupLeading: "",
        agreement: "",
      })
      setIsLoading(false)
    } catch (error: any) {
      console.error('Error submitting form:', error)
      alert(error.message || 'An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fffcf3] flex flex-col">
      <Navbar />

      <div className="flex flex-col lg:flex-row">
        {/* Left: Info Section */}
        <div className="w-full lg:w-[35%] bg-[#fffcf3] px-4 sm:px-5 md:px-8 lg:px-8 py-8 sm:py-8 pt-24 sm:pt-24 md:pt-28 lg:pt-16 lg:flex lg:flex-col lg:justify-center">
          <div className="w-[80%] mx-auto">
            <h1 className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-gray-900 mb-4 sm:mb-3 leading-tight font-[var(--font-dm-sans-font)]">
              Thank you for your interest in volunteering at Gospel Conference.
            </h1>

            <div className="space-y-5 sm:space-y-5 text-gray-900 text-base sm:text-lg leading-tight font-[var(--font-dm-sans-font)]">
            <p>
              We are primarily looking for small group leaders. The students will be divided into groups. Each group will
              have 2-3 leaders.
            </p>

            <p>
              All leaders must be friendly and able to (or willing to learn to) lead conversations, facilitate
              discussions, and answer questions.
            </p>

            <p>
              All leaders must be present and lead by example, and prioritize building relationships with and edifying the
              attendees.
            </p>

            <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-600 mt-3 sm:mt-2.5 mb-6 lg:mb-0 leading-tight">
              Due to limited space, application does not guarantee acceptance. However, we will be in contact with you if
              in absence at the conference!
            </p>
          </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div 
          className="w-full lg:w-[65%] lg:h-[100vh] bg-[#202f5a] px-4 sm:px-5 md:px-8 lg:px-8 xl:px-10 py-6 sm:py-8 pt-4 lg:pt-16 lg:pb-4 relative lg:overflow-y-auto volunteer-scrollbar"
          style={{
            backgroundImage: "url('/volunteer hue for form.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            direction: "rtl"
          }}
        >
          <div className="relative z-10 pb-8 lg:pb-0 h-full lg:flex lg:flex-col lg:justify-between" style={{ direction: "ltr" }}>
            <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mt-4 lg:mt-8 mb-2 sm:mb-2 md:mb-3 lg:mb-3 uppercase leading-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>VOLUNTEER FOR GOSPEL CONFERENCE 2026</h1>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5 lg:space-y-1.5">
            {/* Row 1: First, Last, Preferred */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 lg:gap-1.5">
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">First name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Last name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Preferred name</label>
                <input
                  type="text"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
            </div>

            {/* Row 2: DOB and Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2 lg:gap-1.5">
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Date of birth (MM/DD/YYYY) <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Address (Street, City, Province, Postal Code) <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
            </div>

            {/* Row 3: Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2 lg:gap-1.5">
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Email address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
              <div>
                <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Phone number <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                />
              </div>
            </div>

            {/* Questions - Full Width */}
            <div>
              <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">What church do you attend? How long have you been attending your church? <span className="text-red-400">*</span></label>
              <textarea
                name="churchAttendance"
                value={formData.churchAttendance}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">In what capacity have you served (past or present)? <span className="text-red-400">*</span></label>
              <textarea
                name="leadershipCapacity"
                value={formData.leadershipCapacity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Please share your testimony <span className="text-red-400">*</span></label>
              <textarea
                name="testimony"
                value={formData.testimony}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">What is the gospel? <span className="text-red-400">*</span></label>
              <textarea
                name="gospel"
                value={formData.gospel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">How comfortable are you with leading a group? What are your strengths? (Friendliness, knowledge, any character traits, etc.) <span className="text-red-400">*</span></label>
              <textarea
                name="groupLeading"
                value={formData.groupLeading}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">Do you agree to the requirements on the lefthand side of all volunteers? <span className="text-red-400">*</span></label>
              <textarea
                name="agreement"
                value={formData.agreement}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                rows={2}
              />
            </div>

            <div className="flex justify-start mt-3 sm:mt-4 lg:mt-2 mb-6 sm:mb-8 lg:mb-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#006bcb] hover:bg-[#0059a8] text-white font-bold py-2 px-6 rounded-full transition duration-200 text-xs sm:text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </div>
          </form>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function Volunteer() {
  return <VolunteerForm />
}