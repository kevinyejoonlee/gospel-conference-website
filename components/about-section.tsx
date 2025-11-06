"use client"

import { useState, useEffect } from "react"
import { SpeakersSection } from "@/components/speakers-section"

export function AboutWithSpeakers() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <section id="about" className="w-full pt-20 md:pt-32 pb-16 md:pb-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-10 md:space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">About the Conference</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join us for an inspiring time of worship, teaching, and fellowship.
              </p>
            </div>

            {/* Instagram Video Embed - Playable iframe */}
            {isClient && (
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                    <iframe
                      src="https://www.instagram.com/p/DHUdxSFPT4f/embed/"
                      className="absolute top-0 left-0 w-full h-full border-0 rounded-lg shadow-lg"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="Gospel Conference Video"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <SpeakersSection />
    </>
  )
}

