import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Required for Cloudflare Pages
export const runtime = 'edge'
// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// GET - Fetch t-shirt counts by size
export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Get counts grouped by size
    const { data, error } = await supabase
      .from('tshirts')
      .select('size')
    
    if (error) {
      console.error('Error fetching t-shirts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch t-shirt counts' },
        { status: 500 }
      )
    }
    
    // Count by size
    const counts: Record<string, number> = {}
    data?.forEach((item) => {
      const size = item.size || 'Unknown'
      counts[size] = (counts[size] || 0) + 1
    })
    
    // Calculate total
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0)
    
    return NextResponse.json({ 
      counts,
      total,
      bySize: Object.entries(counts).map(([size, count]) => ({ size, count }))
    })
  } catch (error) {
    console.error('Error in GET /api/tshirts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add a t-shirt entry (called when someone registers)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { size, registrationId } = body
    
    if (!size) {
      return NextResponse.json(
        { error: 'T-shirt size is required' },
        { status: 400 }
      )
    }
    
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('tshirts')
      .insert([
        {
          size: size.toUpperCase(), // Normalize to uppercase
          registration_id: registrationId || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating t-shirt entry:', error)
      return NextResponse.json(
        { error: 'Failed to create t-shirt entry', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, tshirt: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/tshirts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

