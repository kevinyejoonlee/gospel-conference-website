"use client"

export function AboutThemeSection() {
  return (
    <section className="w-full -mt-px">
      <div className="flex flex-col md:flex-row max-w-full">
        {/* Left Column - About Our Theme (55%) */}
        <div className="w-full md:w-[55%] bg-[#0F223F] px-10 py-10">
          <h2 className="text-white text-[40px] font-inter font-bold uppercase tracking-wide mb-6">
            ABOUT OUR THEME
          </h2>
          <p className="text-white text-[15px] md:text-[16px] font-inter leading-[1.5] text-left">
            Gospel Conference hopes to continue the legacy of preserving and preaching the one true gospel of Jesus Christ in the midst of the noise of our generation. Through focused teaching and fellowship, we seek to deepen our understanding of Christ as the fulfillment of all Scripture, seeing how He is the true and better Adam, Moses, Isaiah, and David.
          </p>
        </div>

        {/* Right Column - Main Sessions (45%) */}
        <div className="w-full md:w-[45%] bg-[#F7F5F0] px-10 py-10">
          <h3 className="text-black text-[24px] font-inter font-bold text-center mb-8">
            Main Sessions
          </h3>
          
          <div className="flex flex-col space-y-6">
            {/* Session 1 */}
            <div className="text-left">
              <p className="text-black text-[16px] font-inter font-bold mb-1">
                1. Christ the true and better Adam
              </p>
              <p className="text-gray-600 text-[14px] md:text-[15px] font-inter font-normal">
                1 Corinthians 15:45
              </p>
            </div>

            {/* Session 2 */}
            <div className="text-left">
              <p className="text-black text-[16px] font-inter font-bold mb-1">
                2. Christ the true and better Moses
              </p>
              <p className="text-gray-600 text-[14px] md:text-[15px] font-inter font-normal">
                Hebrews 3:1-6
              </p>
            </div>

            {/* Session 3 */}
            <div className="text-left">
              <p className="text-black text-[16px] font-inter font-bold mb-1">
                3. Christ the true and better Isaiah
              </p>
              <p className="text-gray-600 text-[14px] md:text-[15px] font-inter font-normal">
                Isaiah 53:1-12
              </p>
            </div>

            {/* Session 4 */}
            <div className="text-left">
              <p className="text-black text-[16px] font-inter font-bold mb-1">
                4. Christ the true and better David
              </p>
              <p className="text-gray-600 text-[14px] md:text-[15px] font-inter font-normal">
                2 Samuel 7:12-16
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

