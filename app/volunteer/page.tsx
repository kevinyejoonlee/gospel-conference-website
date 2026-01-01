"use client"

import type React from "react"
import { useState } from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function VolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [dateInput, setDateInput] = useState("")
  const [dateError, setDateError] = useState<string>("")
  const [formError, setFormError] = useState<string>("")

  const handleDateSelect = (date: Date | undefined) => {
    setDateOfBirth(date)
    if (date) {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (date > today) {
        setDateError("Date of birth cannot be in the future")
        setDateInput("")
      } else {
        setDateError("")
        setDateInput(format(date, "MM/dd/yyyy"))
        if (formError) setFormError("")
      }
    } else {
      setDateInput("")
      setDateError("")
      if (formError) setFormError("")
    }
  }

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateInput(value)
    setDateError("")
    if (formError) setFormError("")

    // Try to parse the typed date
    if (value.trim()) {
      try {
        // Try MM/DD/YYYY format
        const parsedDate = parse(value, "MM/dd/yyyy", new Date())
        if (!isNaN(parsedDate.getTime())) {
          const today = new Date()
          today.setHours(23, 59, 59, 999)
          if (parsedDate > today) {
            setDateError("Date of birth cannot be in the future")
            setDateOfBirth(undefined)
          } else {
            setDateOfBirth(parsedDate)
            setDateError("")
          }
        }
      } catch (error) {
        // Invalid date format, but let user keep typing
        setDateOfBirth(undefined)
      }
    } else {
      setDateOfBirth(undefined)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("") // Clear any previous errors

    // Validate date before submission
    if (!dateOfBirth && !dateInput.trim()) {
      setDateError("Please enter your date of birth")
      setFormError("Please enter your date of birth")
      setIsSubmitting(false)
      return
    }

    // If there's dateInput but no dateOfBirth, try to parse it
    if (dateInput.trim() && !dateOfBirth) {
      try {
        const parsedDate = parse(dateInput.trim(), "MM/dd/yyyy", new Date())
        if (isNaN(parsedDate.getTime())) {
          setDateError("Please enter a valid date (MM/DD/YYYY)")
          setFormError("Please enter a valid date (MM/DD/YYYY)")
          setIsSubmitting(false)
          return
        }
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        if (parsedDate > today) {
          setDateError("Date of birth cannot be in the future")
          setFormError("Date of birth cannot be in the future")
          setIsSubmitting(false)
          return
        }
        setDateOfBirth(parsedDate)
        setDateInput(format(parsedDate, "MM/dd/yyyy"))
      } catch (error) {
        setDateError("Please enter a valid date (MM/DD/YYYY)")
        setFormError("Please enter a valid date (MM/DD/YYYY)")
        setIsSubmitting(false)
        return
      }
    }

    setIsSubmitting(true)

    // Create FormData from the form
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Ensure dateOfBirth is in the form data
    if (dateOfBirth) {
      formData.set('dateOfBirth', format(dateOfBirth, "MM/dd/yyyy"))
    }
    
    // Extract form data for Supabase
    const volunteerData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      preferredName: formData.get('preferredName') as string || '',
      dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : formData.get('dateOfBirth') as string,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      churchAttendance: formData.get('churchAttendance') as string,
      leadershipCapacity: formData.get('leadershipCapacity') as string,
      testimony: formData.get('testimony') as string,
      gospel: formData.get('gospel') as string,
      groupLeading: formData.get('groupLeading') as string,
      agreement: formData.get('agreement') as string
    }
    
    // Add unique timestamp to subject to prevent email threading - each submission is a new email
    const timestamp = Date.now()
    const currentSubject = formData.get('_subject') as string || ''
    if (currentSubject) {
      // Extract the base subject (remove any existing timestamp if present)
      const baseSubject = currentSubject.split(' - ').slice(0, 2).join(' - ')
      formData.set('_subject', `${baseSubject} - ${timestamp}`)
    }

    try {
      // Submit to Supabase first
      const supabaseResponse = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerData),
      })

      // Also send email via FormSubmit (continue even if Supabase fails)
      const recipientEmail = atob('aGVsbG9AZ29zcGVsY29uZmVyZW5jZS5jYQ==')
      let emailResponse: Response | null = null
      try {
        emailResponse = await fetch(`https://formsubmit.co/${recipientEmail}`, {
          method: 'POST',
          body: formData,
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Continue to check Supabase response
      }

      // Check if at least one submission succeeded
      if (supabaseResponse.ok || (emailResponse && emailResponse.ok)) {
        setSubmitted(true)
      } else {
        // Both failed - show error
        let errorMessage = 'There was an error submitting your application. Please try again.'
        
        if (!supabaseResponse.ok) {
          try {
            const supabaseError = await supabaseResponse.json().catch(() => null)
            if (supabaseError?.error) {
              errorMessage = `Database error: ${supabaseError.error}. Please try again.`
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
        
        if (!emailResponse || !emailResponse.ok) {
          if (errorMessage.includes('Database error')) {
            errorMessage += ' Also, the email notification failed to send.'
          } else {
            errorMessage = 'Failed to send email notification. Please try again.'
          }
        }
        
        setFormError(errorMessage)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setFormError('Network error: Please check your internet connection and try again.')
      } else {
        setFormError('There was an error submitting the form. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
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
                Due to limited space, application does not guarantee acceptance.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div 
          className="w-full lg:w-[65%] lg:h-[100vh] bg-[#202f5a] px-4 sm:px-5 md:px-8 lg:px-8 xl:px-10 py-6 sm:py-8 pt-4 lg:pt-16 lg:pb-4 relative lg:overflow-y-auto volunteer-scrollbar"
          style={{
            backgroundImage: "url('/volunteer-hue-for-form.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            direction: "rtl"
          }}
        >
          <div className="relative z-10 pb-8 lg:pb-0 h-full lg:flex lg:flex-col lg:justify-between" style={{ direction: "ltr" }}>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mt-4 lg:mt-8 mb-2 sm:mb-2 md:mb-3 lg:mb-3 uppercase leading-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
                VOLUNTEER FOR GOSPEL CONFERENCE 2026
              </h1>

              {submitted ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                  <p className="text-gray-700">
                    Your application has been submitted successfully. We will be in contact with you soon.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit}
                  className="space-y-2 sm:space-y-2.5 lg:space-y-1.5"
                >
                  {/* Hidden fields for FormSubmit */}
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="formType" value="VOLUNTEER" />
                  <input 
                    type="hidden" 
                    name="_autoresponse" 
                    value="Thank you for your interest in volunteering at Gospel Conference 2026! We have received your application and will be in contact with you soon. We appreciate your willingness to serve and look forward to reviewing your application." 
                  />
                  <input type="hidden" name="_autoresponsesubject" value="Thank you for your volunteer application!" />
                  <input 
                    type="hidden" 
                    name="fullName" 
                    value={`${firstName} ${lastName}`.trim()} 
                  />
                  <input 
                    type="hidden" 
                    name="_subject" 
                    value={`[VOLUNTEER] - ${firstName} ${lastName}`.trim()} 
                  />
                  
                  {/* Row 1: First, Last, Preferred */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 lg:gap-1.5">
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        First name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        Last name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        Preferred name
                      </label>
                      <input
                        type="text"
                        name="preferredName"
                        className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                      />
                    </div>
                  </div>

                  {/* Row 2: DOB and Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2 lg:gap-1.5">
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        Date of birth (MM/DD/YYYY) <span className="text-red-400">*</span>
                      </label>
                      <Popover>
                        <div className="relative">
                          <input
                            type="text"
                            name="dateOfBirth"
                            value={dateInput}
                            onChange={handleDateInputChange}
                            required
                            className={cn(
                              "w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] pr-10",
                              dateError ? "focus:ring-red-400" : "focus:ring-blue-400"
                            )}
                          />
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                        </div>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            key={dateOfBirth?.toISOString() || 'no-date'}
                            mode="single"
                            selected={dateOfBirth}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(23, 59, 59, 999)
                              return date > today
                            }}
                            initialFocus
                            defaultMonth={dateOfBirth || new Date()}
                            captionLayout="dropdown"
                            fromYear={1949}
                            toYear={2008}
                          />
                        </PopoverContent>
                      </Popover>
                      {dateError && (
                        <p className="text-red-400 text-xs mt-1">{dateError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        Address (Street, City, Province, Postal Code) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                      />
                    </div>
                  </div>

                  {/* Row 3: Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2 lg:gap-1.5">
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        Email address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                        Phone number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)]"
                      />
                    </div>
                  </div>

                  {/* Questions - Full Width */}
                  <div>
                    <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                      What church do you attend? How long have you been attending your church? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="churchAttendance"
                      required
                      className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                      In what capacity have you served (past or present)? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="leadershipCapacity"
                      required
                      className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                      Please share your testimony <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="testimony"
                      required
                      className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                      What is the gospel? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="gospel"
                      required
                      className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                      How comfortable are you with leading a group? What are your strengths? (Friendliness, knowledge, any character traits, etc.) <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="groupLeading"
                      required
                      className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm mb-1 font-[var(--font-dm-sans-font)]">
                      <span className="md:hidden">Do you agree to the volunteer requirements above? <span className="text-red-400">*</span></span>
                      <span className="hidden md:inline">Do you agree to the requirements on the lefthand side of all volunteers? <span className="text-red-400">*</span></span>
                    </label>
                    <textarea
                      name="agreement"
                      required
                      className="w-full px-4 py-3 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1 bg-gray-200 border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-sm rounded-md font-[var(--font-dm-sans-font)] leading-tight lg:leading-normal"
                      rows={2}
                    />
                  </div>

                  {/* Form Error Message */}
                  {formError && (
                    <div className="mt-3 sm:mt-4 lg:mt-2 mb-2">
                      <p className="text-red-400 text-xs sm:text-sm">{formError}</p>
                    </div>
                  )}

                  <div className="flex justify-start mt-3 sm:mt-4 lg:mt-2 mb-6 sm:mb-8 lg:mb-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#006bcb] hover:bg-[#0059a8] text-white font-bold py-2 px-6 rounded-full transition duration-200 text-xs sm:text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                    </button>
                  </div>
                </form>
              )}
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