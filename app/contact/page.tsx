import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative z-10">
        <section className="w-full min-h-screen relative overflow-hidden">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(to right, #f5d7b3, #f8e8d5, #faf5f0, #ffffff)'
            }}
          />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 md:px-8 py-16 md:py-24">
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-base md:text-lg font-inter">
                Please send all inquiries to
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                hello@gospelconference.ca
              </h1>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

