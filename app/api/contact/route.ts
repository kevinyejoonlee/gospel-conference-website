import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const adminEmail = 'hello@gospelconference.ca'

// POST - Handle contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const displayName = name.trim() || "Guest"
    const userEmail = email.trim()
    const userMessage = message.trim()

    // Prepare FormSubmit data
    // Decode base64 email to prevent scraping (same as other forms)
    const recipientEmail = atob('aGVsbG9AZ29zcGVsY29uZmVyZW5jZS5jYQ==')
    
    const formData = new FormData()
    formData.append('formType', 'QUESTION')
    formData.append('name', displayName)
    formData.append('email', userEmail)
    formData.append('message', userMessage)
    
    // Add unique timestamp to prevent email threading
    const timestamp = Date.now()
    formData.append('_subject', `[QUESTION] - ${displayName} - ${timestamp}`)
    formData.append('_captcha', 'false')
    formData.append('_template', 'table')
    
    // Auto-response email to the user
    formData.append('_autoresponse', `Hi ${displayName},\n\nThank you for reaching out to Gospel Conference! We have received your question and will get back to you as soon as possible.\n\nWe appreciate your interest and look forward to connecting with you.\n\nBlessings,\nThe Gospel Conference Team\n\n---\nThis is an automated response. If you have any urgent questions, please contact us directly at ${adminEmail}`)
    formData.append('_autoresponsesubject', 'Thank you for contacting Gospel Conference!')
    
    // Set reply-to so admin can reply directly
    formData.append('_replyto', userEmail)

    // Send email via FormSubmit
    let emailResponse: Response | null = null
    try {
      emailResponse = await fetch(`https://formsubmit.co/${recipientEmail}`, {
        method: 'POST',
        body: formData,
      })
    } catch (emailError) {
      console.error('Error sending email via FormSubmit:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      )
    }

    // Check if email was sent successfully
    if (!emailResponse || !emailResponse.ok) {
      console.error('FormSubmit returned error:', emailResponse?.status, emailResponse?.statusText)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully. You should receive a confirmation email shortly.' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in POST /api/contact:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

