import { RegistrationForm } from "@/components/registration-form"

export function RegistrationSection() {
  return (
    <section id="registration" className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="space-y-10 md:space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Join Us</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Register below for the Gospel Conference 2025. Complete your information and proceed to secure payment.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8 lg:p-10 shadow-lg">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  )
}
