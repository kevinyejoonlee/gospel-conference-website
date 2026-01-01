import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Required for Cloudflare Pages
export const runtime = 'edge'
// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// GET - Fetch total donations
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
    
    if (error) {
      console.error('Error fetching donations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      )
    }
    
    const totalRaised = data?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0
    
    return NextResponse.json({ totalRaised })
  } catch (error) {
    console.error('Error in GET /api/donations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new donation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, amount } = body
    
    if (!name || !email || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and amount' },
        { status: 400 }
      )
    }
    
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('donations')
      .insert([
        {
          name,
          email,
          amount: parseFloat(amount),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating donation:', error)
      return NextResponse.json(
        { error: 'Failed to create donation', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, donation: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/donations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

