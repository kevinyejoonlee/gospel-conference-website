import { RegistrationForm } from "@/components/registration-form"

export function RegistrationSection() {
  return (
    <section id="registration" className="w-full py-16 md:py-24 bg-gray-200">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="space-y-10 md:space-y-12">
          {/* Section Title with yellow GC26 highlight */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-gray-800">REGISTER FOR </span>
              <span className="text-yellow-500">GC26</span>
              <span className="text-gray-800"> NOW</span>
            </h2>
          </div>

          {/* Registration Form Container */}
          <div className="bg-white rounded-lg border-2 border-[#007bff] p-6 md:p-8 lg:p-10 shadow-lg">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </section>
  )
}