import { NextRequest, NextResponse } from 'next/server'

// Use Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// POST - Handle contact form submission
// Note: This route is kept for backwards compatibility but is no longer used.
// The footer form now submits directly to FormSubmit from the client.
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint is deprecated. Please use the contact form which submits directly to FormSubmit.' 
    },
    { status: 410 } // 410 Gone - indicates the resource is no longer available
  )
}

