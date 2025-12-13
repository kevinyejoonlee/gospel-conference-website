import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, type } = body // type: 'register' or 'volunteer'

    // Validate required fields based on type
    if (type === 'donate') {
      const donationAmount = body.amount || 0
      if (donationAmount < 100) { // Minimum $1.00 (100 cents)
        return NextResponse.json(
          { error: 'Minimum donation amount is $1.00' },
          { status: 400 }
        )
      }
    } else if (!formData.email || !formData.firstName || !formData.lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Determine price based on type
    let amount: number
    if (type === 'donate') {
      amount = body.amount || 0 // Amount in cents from donation form
    } else if (type === 'register') {
      amount = 5000 // $50.00 in cents
    } else {
      amount = 0 // Volunteers are free
    }
    
    const currency = 'cad' // Canadian dollars

    // Create customer metadata with all form data
    const metadata: Record<string, string> = {
      type: type || 'register',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
    }

    // Add type-specific metadata
    if (type === 'donate') {
      metadata.donationAmount = ((body.amount || 0) / 100).toFixed(2)
      metadata.donorName = formData.firstName || 'Anonymous'
    } else if (type === 'register') {
      // Registration-specific fields
      metadata.preferredName = formData.preferredName || ''
      metadata.phoneNumber = formData.phoneNumber || formData.emergencyContact || ''
      metadata.dateOfBirth = formData.dateOfBirth || ''
      metadata.address = formData.address || ''
      metadata.church = formData.church || formData.churchAttendance || ''
      metadata.grade = formData.grade || ''
      metadata.tshirtSize = formData.tshirtSize || ''
      metadata.allergies = formData.allergies || ''
      metadata.photoConsent = formData.photoConsent || ''
      metadata.specialNotes = formData.specialNotes || ''
      metadata.isChristian = formData.isChristian || ''
      metadata.healthCardNumber = formData.healthCardNumber || ''
      metadata.emergencyContact = formData.emergencyContact || ''
    }
    // Volunteer-specific fields are handled separately below

    // Add volunteer-specific fields
    if (type === 'volunteer') {
      metadata.preferredName = formData.preferredName || ''
      metadata.dateOfBirth = formData.dateOfBirth || ''
      metadata.address = formData.address || ''
      metadata.phoneNumber = formData.phoneNumber || ''
      metadata.churchAttendance = formData.churchAttendance || ''
      metadata.leadershipCapacity = formData.leadershipCapacity || ''
      metadata.testimony = formData.testimony || ''
      metadata.gospel = formData.gospel || ''
      metadata.groupLeading = formData.groupLeading || ''
      metadata.agreement = formData.agreement || ''
    }

    // Create Stripe Checkout Session
    // For volunteers (free), use setup mode to collect info without charging
    // For donations/registrations (paid), use payment mode
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: amount > 0 ? 'payment' : 'setup', // Setup mode for free volunteers
      customer_email: formData.email || undefined,
      line_items: amount > 0 ? [
        {
          price_data: {
            currency,
            product_data: {
              name: type === 'donate'
                ? 'Gospel Conference 2026 Donation'
                : type === 'register' 
                ? 'Gospel Conference 2026 Registration' 
                : 'Gospel Conference 2026 Volunteer Application',
              description: type === 'donate'
                ? `Donation to Gospel Conference 2026 - $${(amount / 100).toFixed(2)}`
                : type === 'register'
                ? 'Registration for Gospel Conference 2026'
                : 'Volunteer application for Gospel Conference 2026',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ] : [],
      metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${type === 'donate' ? 'donate' : type === 'volunteer' ? 'volunteer' : 'register'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${type === 'donate' ? 'donate' : type === 'volunteer' ? 'volunteer' : 'register'}?canceled=true`,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}



