"use client"

import { useState, Suspense } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [dateError, setDateError] = useState<string>("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string>("")
  const [feePaid, setFeePaid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [formError, setFormError] = useState<string>("")

  const handleDateSelect = (date: Date | undefined) => {
    setDateOfBirth(date)
    if (date) {
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      if (date > today) {
        setDateError("Date of birth cannot be in the future")
      } else {
        setDateError("")
        if (formError) setFormError("")
      }
    } else {
      setDateError("")
      if (formError) setFormError("")
    }
  }

  const validateEmail = (email: string): boolean => {
    // Basic email validation - must contain @ and at least one character before and after
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("") // Clear any previous errors
    
    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      setFormError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    } else {
      setEmailError("")
    }
    
    // Validate fee payment
    if (!feePaid) {
      setFormError("Please confirm that you have paid or will pay the registration fee")
      setIsSubmitting(false)
      return
    }
    
    // Validate payment method
    if (!paymentMethod) {
      setFormError("Please select a payment method")
      setIsSubmitting(false)
      return
    }
    
    // Validate date before submission
    if (!dateOfBirth) {
      setDateError("Please select your date of birth")
      setFormError("Please select your date of birth")
      setIsSubmitting(false)
      return
    }
    
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (dateOfBirth > today) {
      setDateError("Date of birth cannot be in the future")
      setFormError("Date of birth cannot be in the future")
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(true)

    // Create FormData from the form
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Extract form data for Supabase
    const registrationData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      preferredName: formData.get('preferredName') as string || '',
      dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : '',
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      healthCardNumber: formData.get('healthCardNumber') as string,
      church: formData.get('church') as string,
      isChristian: formData.get('isChristian') as string,
      grade: formData.get('grade') as string,
      tshirtSize: formData.get('tshirtSize') as string,
      allergies: formData.get('allergies') as string || '',
      photoConsent: formData.get('photoConsent') as string || '',
      specialNotes: formData.get('specialNotes') as string || '',
      feePaid: feePaid,
      paymentMethod: paymentMethod
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
      const supabaseResponse = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      // If registration was successful, save t-shirt size to tshirts table
      let registrationId: number | null = null
      if (supabaseResponse.ok) {
        try {
          const registrationResult = await supabaseResponse.json()
          registrationId = registrationResult.registration?.id || null
          
          // Save t-shirt size to tshirts table
          if (registrationData.tshirtSize) {
            try {
              await fetch('/api/tshirts', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  size: registrationData.tshirtSize,
                  registrationId: registrationId
                }),
              })
            } catch (tshirtError) {
              console.error('Error saving t-shirt size:', tshirtError)
              // Don't fail the whole submission if t-shirt save fails
            }
          }
        } catch (parseError) {
          console.error('Error parsing registration response:', parseError)
        }
      }

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
        let errorMessage = 'There was an error submitting your registration. Please try again.'
        
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
      setFormError('There was an error submitting the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#fffcf3]">
      <Navbar />

      {/* Main content - responsive container */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-16 lg:pt-0 relative">
        {/* Left: Promotional Poster Section - 33% width with background SVG - Hidden on mobile/tablet */}
        <div 
          className="hidden lg:block w-full lg:w-1/3 h-screen relative shrink-0 overflow-hidden"
          style={{ 
            backgroundImage: 'url("/about-our-theme-background.svg")',
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
        <div className="w-full lg:w-2/3 lg:h-screen bg-[#fffcf3] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 sm:pt-8 md:pt-12 lg:pt-24 pb-8 sm:pb-10 md:pb-12 lg:pb-4 overflow-y-auto lg:overflow-y-auto relative z-0">
          <div className="max-w-4xl mx-auto w-full relative z-10">
             <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold mt-4 lg:mt-8 mb-3 sm:mb-3 md:mb-4 lg:mb-4 uppercase leading-tight px-2 sm:px-0" style={{ color: '#428ce4', fontFamily: 'var(--font-spartan-font), sans-serif' }}>
                REGISTER FOR GOSPEL CONFERENCE 2026
              </h1>

            {submitted ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                <p className="text-gray-700 mb-4">
                  Your registration has been submitted successfully. We will be in contact with you soon.
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  📄 A receipt will be issued to your email upon confirmation. See you soon!
                  
                </p>
              </div>
            ) : (
            <form 
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 md:space-y-5 px-2 sm:px-0"
            >
            {/* Hidden fields for FormSubmit */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="formType" value="REGISTRATION" />
            <input 
              type="hidden" 
              name="_autoresponse" 
              value="Thank you for registering for Gospel Conference 2026! We have received your registration and will be in contact with you soon. A receipt will be issued to your email upon confirmation. We look forward to seeing you at the conference!" 
            />
            <input type="hidden" name="_autoresponsesubject" value="Thank you for registering for Gospel Conference 2026!" />
            <input type="hidden" name="_next" value="https://gospelconference.ca/register" />
            <input type="hidden" name="_cc" value={email} />
            <input 
              type="hidden" 
              name="fullName" 
              value={`${firstName} ${lastName}`.trim()} 
            />
            <input 
              type="hidden" 
              name="_subject" 
              value={`[REGISTRATION] - ${firstName} ${lastName}`.trim()} 
            />
            <input 
              type="hidden" 
              name="paymentMethod" 
              value={paymentMethod} 
            />
            <input 
              type="hidden" 
              name="Payment Method" 
              value={
                paymentMethod === "e-transfer" 
                  ? "E-Transfer (Send to sheepgatefellowship@gmail.com)"
                  : paymentMethod === "cash"
                  ? "Cash (Pay on the day of the event)"
                  : paymentMethod === "cheque"
                  ? "Cheque (Pay on the day of the event. Cheques payable to: Yang-Mun Korean Church)"
                  : ""
              } 
            />
            
            {/* Honeypot field for spam protection - hidden from users */}
            <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            
            {/* Row 1: First, Last, Preferred */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 relative z-10">
              <div className="relative z-10">
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">First Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md relative z-10"
                />
              </div>
              <div className="relative z-10">
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Last Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md relative z-10"
                />
              </div>
              <div className="relative z-10">
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Preferred Name</label>
                <input
                  type="text"
                  name="preferredName"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md relative z-10"
                />
              </div>
            </div>

            {/* Row 2: DOB and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center justify-start text-left font-normal px-3 sm:px-4 py-2 sm:py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 text-base transition-all shadow-sm hover:shadow-md",
                        dateError 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                          : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
                        !dateOfBirth && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {dateOfBirth ? format(dateOfBirth, "MM/dd/yyyy") : <span>Pick a date</span>}
                    </button>
                  </PopoverTrigger>
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
                      fromYear={2004}
                      toYear={2015}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  type="hidden"
                  name="dateOfBirth"
                  value={dateOfBirth ? format(dateOfBirth, "MM/dd/yyyy") : ""}
                  required
                />
                {dateError && (
                  <p className="text-red-500 text-xs mt-1">{dateError}</p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Address (Street, City, Province, Postal Code) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Row 3: Email and Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Email Address <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError("")
                    if (formError) setFormError("")
                  }}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 text-base transition-all shadow-sm hover:shadow-md ${
                    emailError 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Emergency Contact (Relationship and Phone #) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Health Card Number */}
            <div>
              <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Health Card Number <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="healthCardNumber"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Church */}
            <div>
              <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">What church do you attend? <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="church"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Row: Are you Christian, Grade, T-shirt Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Are you Christian? <span className="text-red-400">*</span></label>
                <select
                  name="isChristian"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Select your grade <span className="text-red-400">*</span></label>
                <select
                  name="grade"
                  required
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
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">Select your t-shirt size <span className="text-red-400">*</span></label>
                <select
                  name="tshirtSize"
                  required
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
                  Any allergies or food restrictions? <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="allergies"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Do you consent to having your photo taken? <span className="text-red-400">*</span>
                </label>
                <select
                  name="photoConsent"
                  required
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
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Registration Fee Payment */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 mb-4">
              <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="feePaid"
                    checked={feePaid}
                    onChange={(e) => {
                      setFeePaid(e.target.checked)
                      if (!e.target.checked) {
                        setPaymentMethod("")
                      }
                      if (formError) setFormError("")
                    }}
                    required
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-semibold text-red-600">* </span>
                      I have paid or will pay the registration fee.
                    </div>
                    <div className="text-gray-600 pl-4">
                      $100 in January, $120 in February
                    </div>
                  
                  </div>
                </label>
              </div>
              
              {feePaid && (
                <div className="mb-4 border-t border-blue-200 pt-4">
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                  Payment Options <span className="text-red-600">*</span> (Please select one):
                </p>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group hover:bg-blue-100/50 rounded-lg p-2 -m-2 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="e-transfer"
                        checked={paymentMethod === "e-transfer"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value)
                          if (formError) setFormError("")
                        }}
                        required
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1">
                          E-Transfer
                        </span>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            Send to <span className="font-semibold text-gray-800">sheepgatefellowship@gmail.com</span>
                          </div>
                          <div className="text-gray-500 italic">
                            Please include <span className="font-semibold not-italic">"Gospel Conference"</span> in the e-transfer notes.
                          </div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer group hover:bg-blue-100/50 rounded-lg p-2 -m-2 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value)
                          if (formError) setFormError("")
                        }}
                        required
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 block">
                          Cash
                        </span>
                        <span className="text-xs text-gray-600 block mt-0.5">
                          Pay on the day of the event
                        </span>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer group hover:bg-blue-100/50 rounded-lg p-2 -m-2 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cheque"
                        checked={paymentMethod === "cheque"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value)
                          if (formError) setFormError("")
                        }}
                        required
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 block">
                          Cheque
                        </span>
                        <span className="text-xs text-gray-600 block mt-0.5">
                          Pay on the day of the event. Cheques payable to: <span className="font-semibold">Yang-Mun Korean Church</span>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-600 leading-relaxed border-t border-blue-200 pt-3">
                <p className="font-semibold text-gray-700 mb-1">Non-Profit Disclaimer:</p>
                <p>
                  Gospel Conference and Sheepgate Fellowship are non-profit organizations. All registration fees and donations are used solely to cover event costs (venue, materials, food, etc.) and are not used for profit or personal gain. All funds are managed transparently and used exclusively for the purpose of organizing and running Gospel Conference.
                </p>
              </div>
            </div>

            {/* Form Error Message */}
            {formError && (
              <div className="mt-4 sm:mt-6 mb-2">
                <p className="text-red-500 text-xs sm:text-sm text-center">{formError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-bold py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-200 text-xs sm:text-sm uppercase mt-4 sm:mt-6 hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#428ce4' }}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
            </button>
          </form>
          )}
          </div>

          {/* Opening Soon Message - COMMENTED OUT
          <div className="max-w-2xl mx-auto w-full" style={{ direction: "ltr" }}>
            <div className="bg-white rounded-2xl p-8 sm:p-12 md:p-16 text-center shadow-xl border-2 border-blue-100">
              <div className="mb-8">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: '#428ce4', fontFamily: 'var(--font-spartan-font)' }}>
                Opening Soon!
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-4 font-[var(--font-dm-sans-font)]">
                Registration for Gospel Conference 2026 will open January 1st, 2026.
              </p>
              <p className="text-base sm:text-lg text-gray-600 font-[var(--font-dm-sans-font)]">
                Check back later or follow us for updates!
              </p>
            </div>
          </div>
          */}
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