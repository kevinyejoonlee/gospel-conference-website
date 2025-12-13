import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Retrieve the full session to get metadata and payment details
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['customer', 'payment_intent', 'line_items'],
        })

        const metadata = fullSession.metadata || {}
        const sessionType = metadata.type || 'register'
        
        // Extract payment amount from session
        let amount = 0
        let currency = 'cad'
        
        if (fullSession.amount_total) {
          amount = fullSession.amount_total // Amount in cents
          currency = fullSession.currency || 'cad'
        } else if (fullSession.payment_intent) {
          const paymentIntent = typeof fullSession.payment_intent === 'string'
            ? await stripe.paymentIntents.retrieve(fullSession.payment_intent)
            : fullSession.payment_intent
          amount = paymentIntent.amount
          currency = paymentIntent.currency
        }
        
        // Create or update customer in Stripe with all metadata
        let customerId = fullSession.customer as string
        
        if (typeof customerId === 'string') {
          // Update customer with metadata
          await stripe.customers.update(customerId, {
            metadata: {
              ...metadata,
              registrationDate: new Date().toISOString(),
              registrationType: sessionType,
              lastAmount: (amount / 100).toFixed(2),
              lastCurrency: currency,
            },
          })
        } else if (fullSession.customer_email) {
          // Create customer if doesn't exist
          const customer = await stripe.customers.create({
            email: fullSession.customer_email,
            metadata: {
              ...metadata,
              registrationDate: new Date().toISOString(),
              registrationType: sessionType,
              lastAmount: (amount / 100).toFixed(2),
              lastCurrency: currency,
            },
          })
          customerId = customer.id
        }

        // Log the completion with detailed information
        const logData: any = {
          sessionId: session.id,
          customerId,
          email: fullSession.customer_email,
          type: sessionType,
          amount: amount / 100, // Convert cents to dollars
          currency: currency.toUpperCase(),
          timestamp: new Date().toISOString(),
        }

        // Add type-specific logging
        if (sessionType === 'donate') {
          console.log('✅ DONATION RECEIVED:', {
            ...logData,
            donorName: metadata.donorName || metadata.firstName || 'Anonymous',
            donationAmount: metadata.donationAmount || (amount / 100).toFixed(2),
          })
        } else if (sessionType === 'register') {
          console.log('✅ REGISTRATION COMPLETED:', {
            ...logData,
            name: `${metadata.firstName} ${metadata.lastName}`,
          })
        } else if (sessionType === 'volunteer') {
          console.log('✅ VOLUNTEER APPLICATION SUBMITTED:', {
            ...logData,
            name: `${metadata.firstName} ${metadata.lastName}`,
          })

          // Send confirmation email to volunteer
          const volunteerEmail = fullSession.customer_email || metadata.email
          if (volunteerEmail) {
            try {
              const resendApiKey = process.env.RESEND_API_KEY
              if (resendApiKey) {
                const resend = new Resend(resendApiKey)
                const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
                
                await resend.emails.send({
                  from: `Gospel Conference <${fromEmail}>`,
                  to: [volunteerEmail],
                  subject: 'Thank You for Your Volunteer Application - Gospel Conference 2026',
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <h2 style="color: #333; border-bottom: 2px solid #428ce4; padding-bottom: 10px;">
                        Thank You for Your Interest!
                      </h2>
                      <p style="line-height: 1.6; color: #333;">
                        Dear ${metadata.firstName || 'Volunteer'},
                      </p>
                      <p style="line-height: 1.6; color: #333;">
                        Thank you for your interest in volunteering at Gospel Conference 2026! We have received your application and are excited about your willingness to serve.
                      </p>
                      <p style="line-height: 1.6; color: #333;">
                        We are primarily looking for small group leaders. The students will be divided into groups, and each group will have 2-3 leaders.
                      </p>
                      <p style="line-height: 1.6; color: #333;">
                        <strong>What happens next?</strong><br>
                        Due to limited space, application does not guarantee acceptance. However, we will be in contact with you regarding your application status.
                      </p>
                      <p style="line-height: 1.6; color: #333;">
                        If you have any questions, please feel free to reach out to us.
                      </p>
                      <p style="line-height: 1.6; color: #333; margin-top: 30px;">
                        Blessings,<br>
                        <strong>The Gospel Conference Team</strong>
                      </p>
                      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                      <p style="font-size: 12px; color: #666;">
                        This is an automated confirmation email. Please do not reply directly to this email.
                      </p>
                    </div>
                  `,
                  text: `Dear ${metadata.firstName || 'Volunteer'},

Thank you for your interest in volunteering at Gospel Conference 2026! We have received your application and are excited about your willingness to serve.

We are primarily looking for small group leaders. The students will be divided into groups, and each group will have 2-3 leaders.

What happens next?
Due to limited space, application does not guarantee acceptance. However, we will be in contact with you regarding your application status.

If you have any questions, please feel free to reach out to us.

Blessings,
The Gospel Conference Team`,
                })
                console.log('✅ Volunteer confirmation email sent to:', volunteerEmail)
              } else {
                console.log('⚠️ RESEND_API_KEY not configured - skipping email')
              }
            } catch (emailError: any) {
              console.error('Error sending volunteer confirmation email:', emailError)
              // Don't fail the webhook if email fails
            }
          }
        }

        // TODO: You can add database storage here
        // Example: await saveRegistrationToDatabase(metadata, customerId, amount)

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Retrieve the payment intent with expanded data
        const fullPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
          expand: ['customer', 'invoice'],
        })

        const amount = paymentIntent.amount / 100 // Convert cents to dollars
        const currency = paymentIntent.currency.toUpperCase()
        
        console.log('💳 PAYMENT SUCCEEDED:', {
          paymentIntentId: paymentIntent.id,
          amount: `${currency} $${amount.toFixed(2)}`,
          customerId: typeof fullPaymentIntent.customer === 'string' 
            ? fullPaymentIntent.customer 
            : fullPaymentIntent.customer?.id,
          timestamp: new Date().toISOString(),
        })
        
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}



