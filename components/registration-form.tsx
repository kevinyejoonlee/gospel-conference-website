"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkout } from "@/components/checkout"

type FormStep = "attendee" | "checkout"

interface AttendeeInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  gradeLevel: string
}

export function RegistrationForm() {
  const [step, setStep] = useState<FormStep>("attendee")
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradeLevel: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAttendeeInfo((prev) => ({ ...prev, [name]: value }))
  }

  const isFormValid = attendeeInfo.firstName && attendeeInfo.lastName && attendeeInfo.email && attendeeInfo.gradeLevel

  if (step === "checkout") {
    return (
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Registering:</p>
          <p className="font-semibold text-foreground">
            {attendeeInfo.firstName} {attendeeInfo.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{attendeeInfo.email}</p>
          <button onClick={() => setStep("attendee")} className="mt-2 text-xs text-primary hover:underline">
            ← Back to edit
          </button>
        </div>
        <Checkout productId="conference-ticket" />
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        isFormValid && setStep("checkout")
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">First Name</label>
          <Input
            name="firstName"
            value={attendeeInfo.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Last Name</label>
          <Input
            name="lastName"
            value={attendeeInfo.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
        <Input
          name="email"
          type="email"
          value={attendeeInfo.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">Phone</label>
        <Input
          name="phone"
          type="tel"
          value={attendeeInfo.phone}
          onChange={handleInputChange}
          placeholder="(416) 555-0000"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">Grade Level</label>
        <select
          name="gradeLevel"
          value={attendeeInfo.gradeLevel}
          onChange={handleInputChange}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
          required
        >
          <option value="">Select your grade</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        Proceed to Payment
      </Button>
    </form>
  )
}
