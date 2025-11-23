import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative z-10">
        {/* Hero Image */}
        <section className="w-full h-[50vh] relative overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/home/speakers-section.png"
              alt="Conference audience"
              fill
              className="object-cover object-center"
              quality={90}
              sizes="100vw"
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="w-full py-16 md:py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(to right, #f5d7b3, #f8e8d5, #faf5f0)'
            }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-inter font-bold text-[#C86611] mb-12 text-center">
              Interested in financially supporting Gospel Conference?
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left Column - Donation Purpose */}
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-inter font-bold text-white mb-6">
                  Your donation will be used for:
                </h2>
                <ul className="space-y-3 text-white text-base md:text-lg leading-relaxed">
                  <li>• Retreat costs (speaker fee, equipment fee, volunteer costs, etc.)</li>
                  <li>• Accountrements (goodie bags, books, t-shirts, etc.)</li>
                  <li>• Subsidizing students in disadvantageous circumstances</li>
                </ul>
              </div>

              {/* Right Column - Donation Options */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <button className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 text-black font-inter font-semibold hover:border-[#C86611] transition-colors">
                    $25
                  </button>
                  <button className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 text-black font-inter font-semibold hover:border-[#C86611] transition-colors">
                    $50
                  </button>
                  <button className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 text-black font-inter font-semibold hover:border-[#C86611] transition-colors">
                    $100
                  </button>
                  <button className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 text-black font-inter font-semibold hover:border-[#C86611] transition-colors">
                    $150
                  </button>
                  <button className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 text-black font-inter font-semibold hover:border-[#C86611] transition-colors">
                    $200
                  </button>
                  <button className="bg-white border-2 border-gray-300 rounded-lg py-4 px-4 text-black font-inter font-semibold hover:border-[#C86611] transition-colors">
                    $500
                  </button>
                </div>
                
                <div className="flex items-center border-2 border-gray-300 rounded-lg bg-white">
                  <span className="px-4 text-gray-600 font-inter">$</span>
                  <input 
                    type="number" 
                    placeholder="Custom amount"
                    className="flex-1 py-4 px-2 border-0 rounded-lg focus:outline-none"
                  />
                </div>
                
                <button className="w-full bg-[#C86611] text-white font-inter font-bold text-lg uppercase py-4 rounded-lg hover:bg-[#B85A0F] transition-colors">
                  DONATE
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

