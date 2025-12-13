import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * GET /api/donations
 * 
 * Returns donation statistics from Stripe.
 * Query parameters:
 * - type: 'donate' | 'register' | 'volunteer' | 'all' (default: 'all')
 * - limit: number of results to return (default: 100, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100)

    // Query Stripe for checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit,
      expand: ['data.customer', 'data.payment_intent'],
    })

    // Filter and process sessions
    const donations: any[] = []
    const registrations: any[] = []
    const volunteers: any[] = []
    
    let totalDonations = 0
    let totalRegistrations = 0
    let totalVolunteers = 0

    for (const session of sessions.data) {
      // Only process completed sessions
      if (session.status !== 'complete') continue

      const metadata = session.metadata || {}
      const sessionType = metadata.type || 'register'
      const amount = session.amount_total ? session.amount_total / 100 : 0 // Convert cents to dollars
      const currency = session.currency?.toUpperCase() || 'CAD'

      const sessionData = {
        id: session.id,
        customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
        email: session.customer_email || metadata.email || '',
        amount,
        currency,
        timestamp: new Date(session.created * 1000).toISOString(),
        metadata,
      }

      if (sessionType === 'donate') {
        donations.push({
          ...sessionData,
          donorName: metadata.donorName || metadata.firstName || 'Anonymous',
        })
        totalDonations += amount
      } else if (sessionType === 'register') {
        registrations.push({
          ...sessionData,
          name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim(),
        })
        totalRegistrations += amount
      } else if (sessionType === 'volunteer') {
        volunteers.push({
          ...sessionData,
          name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim(),
        })
        totalVolunteers += 1
      }
    }

    // Return data based on requested type
    if (type === 'donate') {
      return NextResponse.json({
        type: 'donate',
        total: totalDonations,
        currency: 'CAD',
        count: donations.length,
        donations: donations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      })
    } else if (type === 'register') {
      return NextResponse.json({
        type: 'register',
        total: totalRegistrations,
        currency: 'CAD',
        count: registrations.length,
        registrations: registrations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      })
    } else if (type === 'volunteer') {
      return NextResponse.json({
        type: 'volunteer',
        count: totalVolunteers,
        volunteers: volunteers.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      })
    } else {
      // Return all data
      return NextResponse.json({
        summary: {
          totalDonations: {
            amount: totalDonations,
            currency: 'CAD',
            count: donations.length,
          },
          totalRegistrations: {
            amount: totalRegistrations,
            currency: 'CAD',
            count: registrations.length,
          },
          totalVolunteers: {
            count: totalVolunteers,
          },
          grandTotal: {
            amount: totalDonations + totalRegistrations,
            currency: 'CAD',
          },
        },
        donations: donations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        registrations: registrations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        volunteers: volunteers.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      })
    }
  } catch (error: any) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch donations' },
      { status: 500 }
    )
  }
}

