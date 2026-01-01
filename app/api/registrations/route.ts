import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'

// GET - Fetch all registrations (optional, for admin use)
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching registrations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ registrations: data || [] })
  } catch (error) {
    console.error('Error in GET /api/registrations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new registration
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
      emergencyContact,
      healthCardNumber,
      church,
      isChristian,
      grade,
      tshirtSize,
      allergies,
      photoConsent,
      specialNotes,
      feePaid,
      paymentMethod
    } = body
    
    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !address || !email || !emergencyContact || !healthCardNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (!church || !isChristian || !grade || !tshirtSize || feePaid === undefined || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required form fields' },
        { status: 400 }
      )
    }
    
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          preferred_name: preferredName || null,
          date_of_birth: dateOfBirth,
          address,
          email,
          emergency_contact: emergencyContact,
          health_card_number: healthCardNumber,
          church,
          is_christian: isChristian,
          grade: parseInt(grade) || null,
          tshirt_size: tshirtSize,
          allergies: allergies || null,
          photo_consent: photoConsent || null,
          special_notes: specialNotes || null,
          fee_paid: feePaid === true || feePaid === 'true',
          payment_method: paymentMethod,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating registration:', error)
      return NextResponse.json(
        { error: 'Failed to create registration', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, registration: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/registrations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

