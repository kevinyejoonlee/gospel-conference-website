import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative z-10">
        <section id="about" className="w-full py-16 md:py-24 bg-[#F7F5F0]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Left - Image */}
              <div className="relative w-full aspect-[3/4] md:aspect-square">
                <Image
                  src="/images/about/about-page.png"
                  alt="About Gospel Conference"
                  fill
                  className="object-cover rounded-lg border-4 border-blue-600"
                  quality={90}
                />
              </div>

              {/* Right - Text Content */}
              <div className="space-y-6 text-gray-800">
                <h1 className="text-4xl md:text-5xl font-inter font-bold uppercase text-gray-600 tracking-wide">
                  ABOUT GOSPEL CONFERENCE
                </h1>
                
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p>
                    According to the Apostle Paul, there is only "one true gospel," which is based on salvation by grace alone through faith alone in Jesus Christ alone.
                  </p>
                  
                  <p>
                    He considers any "different gospel" to be no gospel at all; that means that nothing beyond the news of Jesus is good. This is most clearly stated in Galatians 1:6-9 where he says that even if an angel preached a different gospel, they should be considered accursed.
                  </p>
                  
                  <p>
                    We are constantly bombarded with what appears to be truth and what appears to be good news to us. But as Paul said to the church in Galatia many centuries ago, there is but one true gospel.
                  </p>
                  
                  <p className="font-bold text-lg md:text-xl">
                    Gospel Conference hopes to continue the legacy of preserving and preaching that one true gospel of Jesus Christ in the midst of the noise of our generation.
                  </p>
                  
                  <p>
                    Our hope and prayer is to gather youth across our city to hear, learn, and believe in this gospel because it is the greatest news ever told and the greatest news we could ever tell.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}