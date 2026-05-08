import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

/**
 * Public idle ping for Supabase Free — intentionally tiny surface:
 * - GET only, no query params (anything else → 404)
 * - Single `donations` probe with `head: true` (no row bodies over the wire)
 * - 204 + no-store so nothing cacheable or enumerable in JSON
 */
export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.size > 0) {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from('donations')
      .select('amount', { head: true })

    if (error) {
      console.error('Keepalive query failed:', error)
      return new NextResponse(null, { status: 500 })
    }

    return new NextResponse(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('Keepalive error:', err)
    return new NextResponse(null, { status: 500 })
  }
}
