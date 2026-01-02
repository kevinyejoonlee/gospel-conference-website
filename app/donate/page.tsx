"use client"

import { useState, Suspense, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function DonateForm() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showETransfer, setShowETransfer] = useState(false)
  const [submittedAmount, setSubmittedAmount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingDonation, setPendingDonation] = useState<{amount: number, name: string, email: string} | null>(null)
  const [totalRaised, setTotalRaised] = useState(0)
  const [isLoadingTotal, setIsLoadingTotal] = useState(true)
  const [formError, setFormError] = useState<string>("")
  const goal = 3000
  const progressPercentage = (totalRaised / goal) * 100

  const predefinedAmounts = [25, 50, 100, 150, 200, 500]
  const email = "sheepgatefellowship@gmail.com"

  // Fetch total donations on mount
  useEffect(() => {
    const fetchTotalDonations = async () => {
      try {
        const response = await fetch('/api/donations')
        if (response.ok) {
          const data = await response.json()
          setTotalRaised(data.totalRaised || 0)
        }
      } catch (error) {
        console.error('Error fetching total donations:', error)
      } finally {
        setIsLoadingTotal(false)
      }
    }
    
    fetchTotalDonations()
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("") // Clear any previous errors
    
    // Determine donation amount
    const amount = customAmount ? parseFloat(customAmount) : (selectedAmount ? parseFloat(selectedAmount) : 0)
    
    if (amount <= 0) {
      setFormError('Please select or enter a donation amount.')
      return
    }

    if (amount < 1) {
      setFormError('Minimum donation amount is $1.00')
      return
    }

    if (!donorName || !donorEmail) {
      setFormError('Please provide your name and email.')
      return
    }

    // Store pending donation and show confirmation dialog
    setPendingDonation({ amount, name: donorName, email: donorEmail })
    setShowConfirmDialog(true)
  }

  const confirmDonation = async () => {
    if (!pendingDonation) return

    setIsLoading(true)
    setShowConfirmDialog(false)
    setFormError("") // Clear any previous errors

    try {
      // Submit to Supabase first
      const supabaseResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pendingDonation.name,
          email: pendingDonation.email,
          amount: pendingDonation.amount,
        }),
      })

      // Also send email via FormSubmit (continue even if Supabase fails)
      const formData = new FormData()
      formData.append('formType', 'DONATE')
      formData.append('fullName', pendingDonation.name)
      formData.append('email', pendingDonation.email)
      formData.append('donationAmount', pendingDonation.amount.toString())
      // Add unique timestamp to prevent email threading - each submission is a new email
      const timestamp = Date.now()
      formData.append('_subject', `[DONATE] - ${pendingDonation.name} - ${timestamp}`)
      formData.append('_captcha', 'false')
      formData.append('_template', 'table')
      formData.append('_autoresponse', `Thank you for your generous donation of $${pendingDonation.amount.toFixed(2)} to Gospel Conference 2026! We have received your donation and truly appreciate your support. Your contribution helps make this event possible and will be used to cover event costs (venue, materials, food, etc.). We are grateful for your generosity and look forward to seeing you at the conference!`)
      formData.append('_autoresponsesubject', 'Thank you for your donation to Gospel Conference 2026!')
      formData.append('_next', 'https://gospelconference.ca/donate') // Prevents redirect
      formData.append('_cc', pendingDonation.email) // Ensures auto-response is sent

      // Decode base64 email to prevent scraping
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
        // Update total raised if Supabase succeeded
        if (supabaseResponse.ok) {
          try {
            const supabaseData = await supabaseResponse.json()
            // Refresh total donations
            const totalResponse = await fetch('/api/donations')
            if (totalResponse.ok) {
              const totalData = await totalResponse.json()
              setTotalRaised(totalData.totalRaised || 0)
            }
          } catch (error) {
            console.error('Error updating total:', error)
          }
        }

        // Show e-Transfer instructions
        setSubmittedAmount(pendingDonation.amount)
        setShowETransfer(true)
        setPendingDonation(null)
      } else {
        // Both failed - show error
        let errorMessage = 'There was an error submitting your donation. Please try again.'
        
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
        setPendingDonation(null)
      }
    } catch (error: any) {
      console.error('Error submitting donation:', error)
      setFormError(error.message || 'An unexpected error occurred. Please try again.')
      setPendingDonation(null)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setShowETransfer(false)
    setSelectedAmount(null)
    setCustomAmount("")
    setDonorName("")
    setDonorEmail("")
    setSubmittedAmount(0)
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* Main content container */}
      <div className="flex-1 flex flex-col lg:h-screen">
        {/* Header Image - Smaller on mobile */}
        <div className="w-full h-[25vh] sm:h-[28vh] md:h-[30vh] lg:h-[33vh] relative overflow-hidden shrink-0">
          <img
            src="/donate image.svg"
            alt="Donation Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Donate Sections - Scrollable on mobile, fixed height on desktop */}
        <div className="flex flex-col lg:flex-row flex-1 lg:min-h-0 overflow-y-auto">
          {/* Left: Purpose Section - Light Yellow Background - 66% width */}
          <div className="w-full lg:w-2/3 bg-[#fffcf3] px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-8 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">
              Your donation will help with...
            </h1>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 md:border-l-2 md:border-gray-500 pl-0 md:pl-6 lg:pl-8">
              {/* Retreat Costs */}
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3" style={{ color: '#428ce4' }}>Retreat Costs</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  This includes honorariums for our guest speakers, equipment fees (e.g., minimal rentals for the praise
                  team), and housing and food costs for our volunteers.
                </p>
              </div>

              {/* Accountrements */}
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3" style={{ color: '#428ce4' }}>Accountrements</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  This includes goodies for Gospel Conference attendees; whether it's our goodie bags (notebooks, pens, etc.)
                  t-shirt costs, or christian books to give away.
                </p>
              </div>

              {/* Affordability */}
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3" style={{ color: '#428ce4' }}>Affordability</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  Gospel Conference hopes to continue being affordable for families. Your donation helps us keep our
                  registration fees low.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Donation Section - Gray Blue Background - 33% width */}
          <div className="w-full lg:w-1/3 bg-[#748ead]/44 px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-8 flex flex-col justify-center shadow-lg lg:shadow-xl">
            {!showETransfer ? (
              /* Donation Form */
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Financially support Gospel Conference
                </h2>

                {/* Progress Bar */}
                <div className="mb-4 sm:mb-5">
                  <p className={`font-bold mb-2 text-xs sm:text-sm md:text-base ${totalRaised >= goal ? 'text-green-600' : ''}`} style={totalRaised >= goal ? {} : { color: '#428ce4' }}>
                    {totalRaised >= goal ? '🎉 GOAL REACHED! 🎉' : `GOAL: ${goal.toLocaleString()} CAD`}
                  </p>
                  
                  <div className="relative w-full py-1.5 sm:py-2">
                    <div className="w-full h-3 sm:h-4 bg-white/80 rounded-full relative shadow-inner" style={{ overflow: 'visible' }}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${totalRaised >= goal ? 'animate-pulse' : ''}`}
                        style={{ 
                          width: `${Math.min(progressPercentage, 100)}%`,
                          backgroundColor: totalRaised >= goal ? '#10b981' : '#428ce4',
                          boxShadow: totalRaised >= goal ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}
                      />
                      {progressPercentage > 0 && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-lg transition-all duration-500 ease-out z-10 ${totalRaised >= goal ? 'animate-bounce' : ''}`}
                          style={{ 
                            left: `calc(${Math.min(progressPercentage, 100)}% - 8px)`,
                            backgroundColor: totalRaised >= goal ? '#10b981' : '#428ce4'
                          }}
                        />
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center text-xs sm:text-sm">
                      <span className={`font-semibold ${totalRaised >= goal ? 'text-green-600' : ''}`} style={totalRaised >= goal ? {} : { color: '#428ce4' }}>
                        {isLoadingTotal ? 'Loading...' : `Raised: $${totalRaised.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        {totalRaised >= goal && <span className="ml-2">✓</span>}
                      </span>
                      <span className={totalRaised >= goal ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                        Goal: ${goal.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {totalRaised >= goal && (
                      <div className="mt-2 text-center">
                        <p className="text-xs sm:text-sm font-semibold text-green-600">
                          Thank you for helping us reach our goal! 🙏
                        </p>
                      </div>
                    )}
                  </div>
                </div>


                <form onSubmit={handleSubmit}>
                  {/* Donor Information */}
                  <div className="mb-4 sm:mb-5 space-y-3">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base text-gray-800 placeholder-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="Your email *"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base text-gray-800 placeholder-gray-400"
                    />
                  </div>

                  {/* Amount Selection */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3 mb-4 sm:mb-5">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount.toString())
                          setCustomAmount("")
                        }}
                        className={`py-2.5 sm:py-3 md:py-3.5 px-2 sm:px-3 md:px-4 rounded-lg font-bold text-xs sm:text-sm transition duration-200 border touch-manipulation ${
                          selectedAmount === amount.toString()
                            ? "text-white"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
                        }`}
                        style={selectedAmount === amount.toString() ? {
                          backgroundColor: '#428ce4',
                          borderColor: '#428ce4'
                        } : {}}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="mb-4 sm:mb-5">
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800 px-3 sm:px-4 py-2.5 sm:py-3">$</span>
                      <input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setSelectedAmount(null)
                        }}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none bg-white text-sm sm:text-base text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Form Error Message */}
                  {formError && (
                    <div className="mb-4 sm:mb-5">
                      <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3 sm:p-4">
                        <p className="text-red-700 text-xs sm:text-sm font-medium">{formError}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white font-bold py-3.5 sm:py-4 px-6 rounded-lg transition duration-200 text-sm sm:text-base md:text-lg uppercase tracking-wide hover:opacity-90 active:opacity-75 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#428ce4' }}
                  >
                    {isLoading ? 'SUBMITTING...' : 'CONTINUE TO E-TRANSFER'}
                  </button>
                </form>
              </>
            ) : (
              /* e-Transfer Instructions */
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Complete Your Donation
                </h2>

                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-5">
                  <p className="text-sm font-bold text-green-800 mb-1">
                    ✓ Pledge Recorded: ${submittedAmount.toFixed(2)}
                  </p>
                 
                </div>

                {/* e-Transfer Email */}
                <div className="mb-5">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Send your e-Transfer to:
                  </label>
                  <div className="bg-white rounded-lg border-2 border-gray-300 p-3 sm:p-4">
                    <code className="block text-sm sm:text-base font-mono text-gray-900 break-all mb-3">
                      {email}
                    </code>
                    <button
                      onClick={copyEmail}
                      className="w-full text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition duration-200 text-xs sm:text-sm uppercase tracking-wide hover:opacity-90 active:opacity-75 touch-manipulation"
                      style={{ backgroundColor: '#428ce4' }}
                    >
                      {copied ? '✓ Email Copied!' : 'Copy Email Address'}
                    </button>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-white/50 rounded-lg p-3 sm:p-4 mb-5 border-l-4" style={{ borderColor: '#428ce4' }}>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2">
                    Important
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
                    Please include <strong>"Gospel Conference Donation"</strong> in the notes section of your e-Transfer. 
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-3 pt-3 border-t border-gray-300">
                    A receipt will be issued to your email soon. <br></br> <br></br>
                    <span className="font-semibold">Thank you for your support.</span>
                  </p>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetForm}
                  className="w-full text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition duration-200 text-xs sm:text-sm border border-gray-300 hover:bg-gray-50"
                >
                  ← Make Another Donation
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirm Your Donation</AlertDialogTitle>
            <div className="text-left space-y-3 pt-2">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Donation Amount:</span>
                  <div className="text-lg font-bold" style={{ color: '#428ce4' }}>
                    ${pendingDonation?.amount.toFixed(2)} CAD
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Name:</span>
                  <div className="text-gray-900">{pendingDonation?.name}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>
                  <div className="text-gray-900">{pendingDonation?.email}</div>
                </div>
              </div>
              <AlertDialogDescription className="text-sm text-gray-600 pt-2">
                Please review your donation details. Once confirmed, your pledge will be recorded and you'll receive e-Transfer instructions.
              </AlertDialogDescription>
              <div className="text-xs text-gray-600 leading-relaxed pt-4 mt-4 border-t border-gray-200">
                <p className="font-semibold text-gray-700 mb-1">Non-Profit Disclaimer:</p>
                <p>
                  Gospel Conference and Sheepgate Fellowship are non-profit organizations. All registration fees and donations are used solely to cover event costs (venue, materials, food, etc.) and are not used for profit or personal gain. All funds are managed transparently and used exclusively for the purpose of organizing and running Gospel Conference.
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel 
              onClick={() => setPendingDonation(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDonation}
              className="w-full sm:w-auto text-white font-bold uppercase tracking-wide"
              style={{ backgroundColor: '#428ce4' }}
            >
              Confirm Donation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Donate() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <DonateForm />
    </Suspense>
  )
}