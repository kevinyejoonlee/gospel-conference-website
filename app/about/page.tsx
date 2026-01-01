"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PhotoGallery } from "@/components/photo-gallery"

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* About Gospel Conference Section */}
      <div className="relative min-h-screen md:h-[78vh] bg-black pt-16 pb-12 sm:pb-16 md:pb-8 flex items-start md:items-center justify-center">
        {/* Background with exact same styling as hero */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat hero-bg-mobile md:hero-bg-desktop"
          style={{
            backgroundImage: "url(/hero-bg.svg)",
            backgroundPosition: "center",
            backgroundSize: "auto 165%",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50"></div>
        </div>
        
        {/* Content Container - 80% width on desktop */}
        <div className="relative z-10 w-full lg:w-[80%] max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-0">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Left: Image - 33% width */}
            <div className="w-full lg:w-1/3 relative flex items-center justify-center pt-0 sm:pt-6 md:pt-8 mt-0 sm:mt-8 lg:mt-0">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none lg:w-full">
                {/* Decorative background circle for mobile */}
                <div className="hidden lg:block">
                  <img
                    src="/about image.svg"
                    alt="Gospel Conference Discussion"
                    className="w-full h-auto object-contain border border-white/20 rounded"
                    style={{ maxHeight: '75vh' }}
                  />
                </div>
                {/* Mobile creative design */}
                <div className="lg:hidden relative">
                  {/* Outer glow circle */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 via-purple-500/20 to-blue-600/30 blur-xl scale-110"></div>
                  {/* Image container with circular mask */}
                  <div className="relative rounded-full overflow-hidden border-4 border-white/40 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                    <img
                      src="/about image.svg"
                      alt="Gospel Conference Discussion"
                      className="w-full h-auto object-cover aspect-square"
                    />
                  </div>
                  {/* Decorative corner accents */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-blue-400/60 rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-blue-400/60 rounded-bl-lg"></div>
                </div>
              </div>
            </div>

            {/* Right: Content - 67% width */}
            <div className="w-full lg:w-2/3 flex items-start pt-4 sm:pt-6 md:pt-8">
              <div className="w-full">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-5 uppercase">ABOUT GOSPEL CONFERENCE</h1>

                <div className="space-y-2 sm:space-y-3 text-white text-sm sm:text-base md:text-lg leading-normal">
                  <p>
                    According to the Apostle Paul, there is only "one true gospel," which is based on salvation by grace alone
                    through faith alone in Jesus Christ alone.
                  </p>

                  <p>
                    He considers any "different gospel" to be no gospel at all; that means that nothing beyond the news of
                    Jesus is good. This is most clearly stated in Galatians 1:6-9 where he says that even if an angel preached a different gospel, they should be considered accursed.
                  </p>

                  <p>
                    We are constantly bombarded with what appears to be truth and what appears to be good news to us. But as Paul
                    said to the church in Galatia many centuries ago, there is but one true gospel.
                  </p>

                  <p className="font-bold">
                    Gospel Conference hopes to continue the legacy of preserving and preaching that one true gospel of Jesus
                    Christ in the midst of the noise of our generation.
                  </p>

                  <p>
                    Our hope and prayer is to gather youth across our city to hear, learn, and believe in this gospel because
                    it is the greatest news ever told and the greatest news we could ever tell.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-bg-mobile {
          background-size: auto 165% !important;
        }
        
        @media (min-width: 768px) {
          .hero-bg-desktop {
            background-size: 125% auto !important;
          }
        }
      `}</style>

      {/* Theme Section & Sessions Sidebar */}
      <div className="flex flex-col lg:flex-row relative min-h-screen">
        {/* Left: About Our 2026 Theme */}
        <div 
          className="w-full lg:w-2/3 text-white px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-10 sm:py-12 md:py-16 lg:py-20 relative"
          style={{
            backgroundImage: "url('/about-our-theme-background.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Subtle gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl flex flex-col justify-center h-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6 md:mb-7 uppercase leading-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
              ABOUT OUR <span className="underline decoration-blue-400 decoration-2 underline-offset-4">2026 THEME</span>
            </h2>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-dm-sans-font), sans-serif' }}>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 uppercase tracking-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
                  WHAT DOES "CHRIST THE TRUE AND BETTER" MEAN?
                </h3>
                <p className="leading-relaxed">
                  The Old Testament is full of people, places, and stories that were{" "}
                  <span className="italic">types and shadows</span> pointing to Jesus.
                  When we say Jesus is the true and better, we mean that He is the one who perfectly fulfills what these
                  types and shadows pointed to.{" "}
                  <span className="text-blue-400 font-semibold">
                    It means that Jesus Christ is the fulfillment and perfection of all that came before.
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 uppercase tracking-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
                  WHAT IS A TYPE AND SHADOW?
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <p className="leading-relaxed">
                    <span className="text-blue-400 font-semibold">
                      A type is something or someone in the Old Testament that represents or foreshadows Jesus
                    </span>{" "}
                    — like <em>Adam</em> (who points to Christ as the true man), the Passover lamb (pointing to Jesus as our
                    sacrifice), or the temple (pointing to God's presence with His people).
                  </p>
                  <p className="leading-relaxed">
                    <span className="text-blue-400 font-semibold">
                      A shadow is the outline or hint of the real thing. They show what's coming, but not the full reality
                    </span>{" "}
                    — like the sacrifices and ceremonies of the law were shadows that pointed to Christ's once-for-all sacrifice.
                  </p>
                  <p className="leading-relaxed">
                    <span className="text-blue-400 font-semibold">
                      Figures are symbols or pictures that represent spiritual truths about Christ and His kingdom
                    </span>{" "}
                    — like the bronze serpent lifted up in the wilderness was a figure of Christ lifted up on the cross.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 uppercase tracking-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
                  WHAT ARE THE GOALS WITH THIS YEAR'S THEME?
                </h3>
                <ul className="list-none space-y-2 sm:space-y-2.5 ml-0">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="font-bold text-blue-400 mt-0.5">a.</span>
                    <span className="leading-relaxed">
                      To shine a light on the relevance and significance of the Old Testament, particularly in the New Testament and
                      to our current lives.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="font-bold text-blue-400 mt-0.5">b.</span>
                    <span className="leading-relaxed">
                      To better connect the entire landscape of the gospel, highlighting the majesty of God's authorship.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="font-bold text-blue-400 mt-0.5">c.</span>
                    <span className="leading-relaxed">
                      To better lay out the all-too-familiar "Sunday School bible stories" in a Christ-centered and
                      gospel-informed way.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sessions Sidebar */}
        <div className="w-full lg:w-1/3 bg-[#fffcf3] px-6 sm:px-8 md:px-10 py-10 sm:py-12 md:py-16 lg:py-20 space-y-8 sm:space-y-10 md:space-y-12 relative overflow-hidden flex flex-col justify-center">
          {/* Main Sessions */}
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#A0302A] mb-6 sm:mb-8 uppercase tracking-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
              Main Sessions
            </h3>
            <div className="space-y-4 sm:space-y-5 md:space-y-6" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
              <div>
                <p className="font-bold text-black text-base sm:text-lg md:text-xl mb-1.5 leading-tight">1. Christ the true and better <em>Adam</em></p>
                <p className="text-gray-700 text-sm sm:text-base">Bible Passage</p>
              </div>
              <div>
                <p className="font-bold text-black text-base sm:text-lg md:text-xl mb-1.5 leading-tight">2. Christ the true and better <em>Moses</em></p>
                <p className="text-gray-700 text-sm sm:text-base">Bible Passage</p>
              </div>
              <div>
                <p className="font-bold text-black text-base sm:text-lg md:text-xl mb-1.5 leading-tight">3. Christ the true and better <em>Isaiah</em></p>
                <p className="text-gray-700 text-sm sm:text-base">Bible Passage</p>
              </div>
              <div>
                <p className="font-bold text-black text-base sm:text-lg md:text-xl mb-1.5 leading-tight">4. Christ the true and better <em>David</em></p>
                <p className="text-gray-700 text-sm sm:text-base">Bible Passage</p>
              </div>
            </div>
          </div>

          {/* Seminars */}
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#2A6A9B] mb-6 sm:mb-8 uppercase tracking-tight" style={{ fontFamily: 'var(--font-spartan-font), sans-serif' }}>
              Seminars
            </h3>
            <div className="space-y-4 sm:space-y-5 md:space-y-6" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
              <div>
                <p className="font-bold text-black text-base sm:text-lg md:text-xl mb-1.5 leading-tight">Title of Seminar One</p>
                <p className="text-gray-700 text-sm sm:text-base">Name of speaker</p>
              </div>
              <div>
                <p className="font-bold text-black text-base sm:text-lg md:text-xl mb-1.5 leading-tight">Title of Seminar Two</p>
                <p className="text-gray-700 text-sm sm:text-base">Name of speaker</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Footer */}
      <Footer />
    </div>
  )
}