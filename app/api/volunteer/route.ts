import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData } = body

    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Helper function to truncate metadata values to Stripe's 500 character limit
    const truncateMetadata = (value: string, maxLength: number = 500): string => {
      if (!value) return ''
      return value.length > maxLength ? value.substring(0, maxLength) : value
    }

    // Create customer metadata with ALL form data fields
    // Note: Stripe metadata has a 500 character limit per key
    const metadata: Record<string, string> = {
      type: 'volunteer',
      // Personal Information
      firstName: truncateMetadata(formData.firstName || ''),
      lastName: truncateMetadata(formData.lastName || ''),
      preferredName: truncateMetadata(formData.preferredName || ''),
      email: truncateMetadata(formData.email || ''),
      phoneNumber: truncateMetadata(formData.phoneNumber || ''),
      dateOfBirth: truncateMetadata(formData.dateOfBirth || ''),
      address: truncateMetadata(formData.address || ''),
      // Application Questions
      churchAttendance: truncateMetadata(formData.churchAttendance || ''),
      leadershipCapacity: truncateMetadata(formData.leadershipCapacity || ''),
      testimony: truncateMetadata(formData.testimony || ''),
      gospel: truncateMetadata(formData.gospel || ''),
      groupLeading: truncateMetadata(formData.groupLeading || ''),
      agreement: truncateMetadata(formData.agreement || ''),
    }

    // Create or find customer in Stripe (no payment, just storing data)
    let customer
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: formData.email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        // Update existing customer
        customer = await stripe.customers.update(existingCustomers.data[0].id, {
          metadata: {
            ...metadata,
            registrationDate: new Date().toISOString(),
            registrationType: 'volunteer',
            lastUpdated: new Date().toISOString(),
          },
        })
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          metadata: {
            ...metadata,
            registrationDate: new Date().toISOString(),
            registrationType: 'volunteer',
          },
        })
      }
      console.log('✅ Stripe customer created/updated:', customer.id)
    } catch (stripeError: any) {
      console.error('Error creating/updating Stripe customer:', stripeError)
      // Continue even if Stripe fails - we'll still send the email
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const adminEmail = process.env.RESEND_TEST_EMAIL || 'hello@gospelconference.ca'

    // Send confirmation email to volunteer
    try {
      if (resendApiKey) {
        const resend = new Resend(resendApiKey)
        
        await resend.emails.send({
          from: `Gospel Conference <${fromEmail}>`,
          to: [formData.email],
          subject: 'Thank You for Your Volunteer Application - Gospel Conference 2026',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; border-bottom: 2px solid #428ce4; padding-bottom: 10px;">
                Thank You for Your Interest!
              </h2>
              <p style="line-height: 1.6; color: #333;">
                Dear ${formData.firstName || 'Volunteer'},
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
          text: `Dear ${formData.firstName || 'Volunteer'},

Thank you for your interest in volunteering at Gospel Conference 2026! We have received your application and are excited about your willingness to serve.

We are primarily looking for small group leaders. The students will be divided into groups, and each group will have 2-3 leaders.

What happens next?
Due to limited space, application does not guarantee acceptance. However, we will be in contact with you regarding your application status.

If you have any questions, please feel free to reach out to us.

Blessings,
The Gospel Conference Team`,
        })
        console.log('✅ Volunteer confirmation email sent to:', formData.email)
      } else {
        console.log('⚠️ RESEND_API_KEY not configured - skipping email')
      }
    } catch (emailError: any) {
      console.error('Error sending volunteer confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      if (resendApiKey) {
        const resend = new Resend(resendApiKey)
        
        await resend.emails.send({
          from: `Gospel Conference <${fromEmail}>`,
          to: [adminEmail],
          subject: `New Volunteer Application: ${formData.firstName} ${formData.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; border-bottom: 2px solid #428ce4; padding-bottom: 10px;">
                New Volunteer Application
              </h2>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Personal Information</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.firstName} ${formData.lastName}${formData.preferredName ? ` (${formData.preferredName})` : ''}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #428ce4;">${formData.email}</a></p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phoneNumber || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Date of Birth:</strong> ${formData.dateOfBirth || 'N/A'}</p>
                <p style="margin: 5px 0;"><strong>Address:</strong> ${formData.address || 'N/A'}</p>
                
                <h3 style="color: #333; margin-top: 20px;">Application Details</h3>
                <p style="margin: 5px 0;"><strong>Church Attendance:</strong></p>
                <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px; margin: 5px 0;">${formData.churchAttendance || 'N/A'}</p>
                
                <p style="margin: 10px 0 5px 0;"><strong>Leadership Capacity:</strong></p>
                <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px; margin: 5px 0;">${formData.leadershipCapacity || 'N/A'}</p>
                
                <p style="margin: 10px 0 5px 0;"><strong>Testimony:</strong></p>
                <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px; margin: 5px 0;">${formData.testimony || 'N/A'}</p>
                
                <p style="margin: 10px 0 5px 0;"><strong>What is the gospel?</strong></p>
                <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px; margin: 5px 0;">${formData.gospel || 'N/A'}</p>
                
                <p style="margin: 10px 0 5px 0;"><strong>Group Leading Comfort/Strengths:</strong></p>
                <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px; margin: 5px 0;">${formData.groupLeading || 'N/A'}</p>
                
                <p style="margin: 10px 0 5px 0;"><strong>Agreement:</strong></p>
                <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px; margin: 5px 0;">${formData.agreement || 'N/A'}</p>
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
          text: `New Volunteer Application

Personal Information:
Name: ${formData.firstName} ${formData.lastName}${formData.preferredName ? ` (${formData.preferredName})` : ''}
Email: ${formData.email}
Phone: ${formData.phoneNumber || 'N/A'}
Date of Birth: ${formData.dateOfBirth || 'N/A'}
Address: ${formData.address || 'N/A'}

Application Details:
Church Attendance: ${formData.churchAttendance || 'N/A'}

Leadership Capacity: ${formData.leadershipCapacity || 'N/A'}

Testimony: ${formData.testimony || 'N/A'}

What is the gospel? ${formData.gospel || 'N/A'}

Group Leading Comfort/Strengths: ${formData.groupLeading || 'N/A'}

Agreement: ${formData.agreement || 'N/A'}

Submitted: ${new Date().toLocaleString()}`,
        })
        console.log('✅ Volunteer application notification sent to admin:', adminEmail)
      }
    } catch (emailError: any) {
      console.error('Error sending admin notification email:', emailError)
      // Don't fail the request if email fails
    }

    // Log the submission
    console.log('✅ VOLUNTEER APPLICATION SUBMITTED:', {
      customerId: customer?.id,
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ 
      success: true,
      message: 'Volunteer application submitted successfully',
      customerId: customer?.id,
    })
  } catch (error: any) {
    console.error('Error processing volunteer application:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit volunteer application' },
      { status: 500 }
    )
  }
}

