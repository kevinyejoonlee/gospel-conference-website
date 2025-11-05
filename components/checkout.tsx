"use client"

import { useCallback, useEffect, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export function Checkout({ productId }: { productId: string }) {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null)
      return await startCheckoutSession(productId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start checkout session"
      setError(errorMessage)
      throw err
    }
  }, [productId])

  useEffect(() => {
    if (window.ApplePaySession?.canMakePayments?.()) {
      setIsApplePayAvailable(true)
    }
  }, [])

  return (
    <div id="checkout" className="space-y-4">
      {isApplePayAvailable && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Apple Pay Available:</span> Fast and secure checkout with Apple Pay
          </p>
        </div>
      )}
      <div className="rounded-lg border border-border overflow-hidden">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        {stripePromise ? (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Stripe is not configured. Please add your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
