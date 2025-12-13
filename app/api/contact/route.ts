import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Simple in-memory rate limiting (for production, use Redis or a service like Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3 // Max 3 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  // Get IP address from headers (works with most hosting providers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  return ip
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    // New window or expired, reset
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
    // If reCAPTCHA is not configured, allow the request (for development)
    return true
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    // Check if verification was successful and score is acceptable (v3 returns score 0-1)
    return data.success === true && (data.score || 0.5) >= 0.5
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = getRateLimitKey(request)
    const rateLimit = checkRateLimit(ip)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, message, recaptchaToken, website } = body

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.trim()) {
      console.log('Bot detected via honeypot field')
      return NextResponse.json(
        { error: 'Invalid request. Please try again.' },
        { status: 400 }
      )
    }

    // Validate input
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Please fill in both your email and message.' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token (only if token is provided and secret key is configured)
    // If reCAPTCHA fails on localhost, allow the request to proceed (for development)
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
      if (!isValidRecaptcha) {
        // On localhost or if reCAPTCHA isn't properly configured, allow the request
        // This prevents blocking during development
        const isLocalhost = request.headers.get('host')?.includes('localhost') || 
                           request.headers.get('host')?.includes('127.0.0.1')
        
        if (isLocalhost) {
          console.warn('reCAPTCHA verification failed on localhost. Allowing request for development.')
          // Continue without blocking
        } else {
          console.log('reCAPTCHA verification failed')
          return NextResponse.json(
            { error: 'Security verification failed. Please refresh the page and try again.' },
            { status: 400 }
          )
        }
      }
    }

    // Send email using Resend
    // Note: FROM address must be a verified domain in Resend
    // Initially use the Resend default domain, then change to hello@gospelconference.ca after verifying your domain
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured')
      // Fallback to logging if API key is not set
      console.log('Contact Form Submission:', {
        to: 'hello@gospelconference.ca',
        from: email,
        message,
        timestamp: new Date().toISOString(),
      })
      return NextResponse.json(
        { 
          success: true,
          message: 'Email logged (RESEND_API_KEY not configured)' 
        },
        { status: 200 }
      )
    }

    const resend = new Resend(resendApiKey)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    // For localhost testing, you can use a test email address
    // Add RESEND_TEST_EMAIL to .env.local with your email (e.g., your-email@gmail.com)
    // Or add hello@gospelconference.ca as a test recipient in Resend dashboard
    const recipientEmail = process.env.RESEND_TEST_EMAIL || 'hello@gospelconference.ca'
    
    const { data, error } = await resend.emails.send({
      from: `Gospel Conference Contact <${fromEmail}>`,
      to: [recipientEmail],
      replyTo: recipientEmail, // Replies will go to this address
      subject: `Contact Form: Message from ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #428ce4; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>From:</strong> <a href="mailto:${email}" style="color: #428ce4; text-decoration: none;">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the Gospel Conference contact form.<br>
            You can reply directly to this email to respond to ${email}.
          </p>
        </div>
      `,
      text: `From: ${email}\n\nMessage:\n${message}`, // Plain text version
      replyTo: email, // Set reply-to to the user's email so replies go to them
    })
    
    if (error) {
      console.error('Resend error:', error)
      
      // Check if it's a domain verification issue
      const errorMessage = error.message || JSON.stringify(error)
      if (errorMessage.includes('test emails') || errorMessage.includes('verified')) {
        return NextResponse.json(
          { 
            error: 'Email service is being configured. Please try again in a few minutes.',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
          },
          { status: 500 }
        )
      }
      
      // Return user-friendly error message
      return NextResponse.json(
        { 
          error: 'Failed to send message. Please try again later or contact us directly at hello@gospelconference.ca',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data?.id)

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Email sent successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


