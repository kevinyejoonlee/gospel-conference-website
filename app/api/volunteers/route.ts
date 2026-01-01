import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// GET - Fetch all volunteers (optional, for admin use)
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching volunteers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch volunteers' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ volunteers: data || [] })
  } catch (error) {
    console.error('Error in GET /api/volunteers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new volunteer application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      preferredName,
      dateOfBirth,
      address,
      email,
      phoneNumber,
      churchAttendance,
      leadershipCapacity,
      testimony,
      gospel,
      groupLeading,
      agreement
    } = body
    
    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !address || !email || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (!churchAttendance || !leadershipCapacity || !testimony || !gospel || !groupLeading || !agreement) {
      return NextResponse.json(
        { error: 'Missing required form fields' },
        { status: 400 }
      )
    }
    
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('volunteers')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          preferred_name: preferredName || null,
          date_of_birth: dateOfBirth,
          address,
          email,
          phone_number: phoneNumber,
          church_attendance: churchAttendance,
          leadership_capacity: leadershipCapacity,
          testimony,
          gospel,
          group_leading: groupLeading,
          agreement,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating volunteer:', error)
      return NextResponse.json(
        { error: 'Failed to create volunteer application', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, volunteer: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/volunteers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

