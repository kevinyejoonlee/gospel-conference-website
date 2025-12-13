"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function DonateForm() {
  const searchParams = useSearchParams()
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [raised, setRaised] = useState(0)
  const [isLoadingDonations, setIsLoadingDonations] = useState(true)

  const predefinedAmounts = [25, 50, 100, 150, 200, 500]
  const goal = 3000
  const progressPercentage = (raised / goal) * 100

  // Fetch donation total from Stripe
  const fetchDonationTotal = async () => {
    try {
      setIsLoadingDonations(true)
      const response = await fetch('/api/donations?type=donate')
      const data = await response.json()
      
      if (response.ok && data.total !== undefined) {
        setRaised(data.total)
      }
    } catch (error) {
      console.error('Error fetching donation total:', error)
      // Keep the default value of 0 if fetch fails
    } finally {
      setIsLoadingDonations(false)
    }
  }

  useEffect(() => {
    // Fetch donation total on mount
    fetchDonationTotal()
  }, [])

  useEffect(() => {
    // Check for success or cancel from Stripe redirect
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    
    if (success === 'true') {
      alert('Thank you for your donation! Your support helps make Gospel Conference possible.')
      // Reset form
      setSelectedAmount(null)
      setCustomAmount("")
      setDonorName("")
      setDonorEmail("")
      // Refresh donation total after successful donation
      fetchDonationTotal()
    } else if (canceled === 'true') {
      alert('Donation was canceled. You can try again when ready.')
    }
  }, [searchParams])

  const handleDonate = async () => {
    // Determine donation amount
    const amount = customAmount ? parseFloat(customAmount) : (selectedAmount ? parseFloat(selectedAmount) : 0)
    
    if (amount <= 0) {
      alert('Please select or enter a donation amount.')
      return
    }

    if (amount < 1) {
      alert('Minimum donation amount is $1.00')
      return
    }

    setIsLoading(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            firstName: donorName.split(' ')[0] || donorName,
            lastName: donorName.split(' ').slice(1).join(' ') || '',
            email: donorEmail || '',
            donationAmount: amount,
          },
          type: 'donate',
          amount: Math.round(amount * 100), // Convert to cents
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
      console.error('Error processing donation:', error)
      alert(error.message || 'An error occurred. Please try again.')
      setIsLoading(false)
    }
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Financially support Gospel Conference
          </h2>

          <div className="mb-4 sm:mb-5">
            <p className="font-bold mb-2 text-xs sm:text-sm md:text-base" style={{ color: '#428ce4' }}>GOAL: $3,000.00 CAD</p>
            
            {/* Progress Bar - Filled progress with blue */}
            <div className="relative w-full py-1.5 sm:py-2">
              {isLoadingDonations ? (
                <div className="w-full h-3 sm:h-4 bg-white/80 rounded-full relative shadow-inner flex items-center justify-center">
                  <span className="text-xs text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="w-full h-3 sm:h-4 bg-white/80 rounded-full relative shadow-inner" style={{ overflow: 'visible' }}>
                    {/* Filled blue portion showing progress */}
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${Math.min(progressPercentage, 100)}%`,
                        backgroundColor: '#428ce4',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    />
                    {/* Blue circle indicator at the end of progress */}
                    {progressPercentage > 0 && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-lg transition-all duration-500 ease-out z-10"
                        style={{ 
                          left: `calc(${Math.min(progressPercentage, 100)}% - 8px)`,
                          backgroundColor: '#428ce4'
                        }}
                      />
                    )}
                  </div>
                  {/* Progress text */}
                  <div className="mt-2 flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-semibold" style={{ color: '#428ce4' }}>
                      ${raised.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} raised
                    </span>
                    <span className="text-gray-600">
                      ${Math.max(0, goal - raised).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} left
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Donor Information (Optional) */}
          <div className="mb-4 sm:mb-5 space-y-3">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base text-gray-800 placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Your email (optional, for receipt)"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Amount Selection - 3 columns, 2 rows - Better spacing on mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3 mb-4 sm:mb-5">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
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

          {/* Donate Button - Larger touch target on mobile */}
          <button 
            onClick={handleDonate}
            disabled={isLoading}
            className="w-full text-white font-bold py-3.5 sm:py-4 px-6 rounded-lg transition duration-200 text-sm sm:text-base md:text-lg uppercase tracking-wide hover:opacity-90 active:opacity-75 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#428ce4' }}
          >
            {isLoading ? 'PROCESSING...' : 'DONATE NOW'}
          </button>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
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