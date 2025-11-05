"use client"

export function SpeakersSection() {
  return (
    <section id="speakers" className="w-full py-16 md:py-24" style={{ background: "linear-gradient(to bottom, #7a1e1e, #8b2a2a, #a83a2a)" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-16">
          {/* Main Speaker */}
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide">MAIN SPEAKER</h2>
            <div 
              className="rounded-xl p-8 md:p-12 shadow-xl"
              style={{ 
                background: "linear-gradient(to bottom right, #7a1e1e, #8b2a2a)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Speaker Image */}
                <div className="shrink-0">
                  <img
                    src="/images/chad-van-dixhoorn.jpg"
                    alt="Chad Van Dixhoorn"
                    className="w-48 h-48 md:w-64 md:h-64 rounded-xl object-cover shadow-lg"
                    style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/256?text=Chad+Van+Dixhoorn"
                    }}
                  />
                </div>
                
                {/* Speaker Info */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold" style={{ color: "#f4e4bc" }}>CHAD VAN DIXHOORN</h3>
                  <p className="text-lg md:text-xl text-white leading-relaxed">
                    CVD is the lead pastor at this american church of the PCA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seminar Speakers */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center tracking-wide">SEMINAR SPEAKERS</h2>
            
            <div className="space-y-8">
              {/* Kyle Hackman */}
              <div 
                className="rounded-xl p-6 md:p-8 shadow-xl"
                style={{ 
                  background: "linear-gradient(to bottom right, #7a1e1e, #8b2a2a, #a83a2a)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <img
                    src="/images/kyle-hackman.jpg"
                    alt="Kyle Hackman"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-md shrink-0"
                    style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/160?text=Kyle+Hackman"
                    }}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#fbbf24" }}>KYLE HACKMAN</h3>
                    <p className="text-white leading-relaxed">
                      Kyle Hackman is the pastor at Christ Church Toronto of the PCA.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lyndon Jost */}
              <div 
                className="rounded-xl p-6 md:p-8 shadow-xl"
                style={{ 
                  background: "linear-gradient(to bottom right, #7a1e1e, #8b2a2a, #a83a2a)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex-1 text-center md:text-left order-2 md:order-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#fbbf24" }}>LYNDON JOST</h3>
                    <p className="text-white leading-relaxed">
                      Lyndon Jost is the associate pastor at Christ Church Toronto of the PCA.
                    </p>
                  </div>
                  <img
                    src="/images/lyndon-jost.jpg"
                    alt="Lyndon Jost"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-md shrink-0 order-1 md:order-2"
                    style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/160?text=Lyndon+Jost"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

