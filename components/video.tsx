"use client"
import { useEffect, useRef, useState } from "react"

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: any) => any
      PlayerState: {
        UNSTARTED: number
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
      }
    }
  }
}

export default function Video() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const playerRef = useRef<any>(null)
  const preloadPlayerRef = useRef<any>(null)
  const isMobileRef = useRef<boolean>(false)

  // YouTube video ID
  const youtubeVideoId = "Obu6rr8MYH8"

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                           (typeof window !== 'undefined' && window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Preload video when component mounts
  useEffect(() => {
    // Load YouTube IFrame API for preloading
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const createPreloadPlayer = () => {
      if (preloadPlayerRef.current || !window.YT || !window.YT.Player) return

      try {
        // Create hidden preload player
        const preloadDiv = document.createElement('div')
        preloadDiv.id = 'youtube-preload-player'
        preloadDiv.style.position = 'absolute'
        preloadDiv.style.width = '1px'
        preloadDiv.style.height = '1px'
        preloadDiv.style.opacity = '0'
        preloadDiv.style.pointerEvents = 'none'
        preloadDiv.style.top = '-9999px'
        document.body.appendChild(preloadDiv)

        preloadPlayerRef.current = new window.YT.Player('youtube-preload-player', {
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            vq: 'hd2160',
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              // Cue video (don't load/play) to preload metadata only
              try {
                event.target.cueVideoById(youtubeVideoId, 0, 'hd2160')
                // Set quality to 4K
                setTimeout(() => {
                  try {
                    const availableQualities = event.target.getAvailableQualityLevels()
                    const qualityOrder = ['hd2160', 'hd1440', 'hd1080', 'hd720']
                    for (const quality of qualityOrder) {
                      if (availableQualities.includes(quality)) {
                        event.target.setPlaybackQuality(quality)
                        break
                      }
                    }
                  } catch (e) {}
                }, 500)
              } catch (e) {}
            }
          }
        })
      } catch (e) {
        console.log('Preload player creation failed:', e)
      }
    }

    // Wait for API to be ready
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT)
        createPreloadPlayer()
      }
    }, 100)

    return () => {
      clearInterval(checkYT)
      if (preloadPlayerRef.current) {
        try {
          preloadPlayerRef.current.destroy()
        } catch (e) {}
        preloadPlayerRef.current = null
      }
      const preloadDiv = document.getElementById('youtube-preload-player')
      if (preloadDiv) {
        preloadDiv.remove()
      }
    }
  }, [youtubeVideoId])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVideoOpen])

  // Load YouTube IFrame API and set highest quality
  useEffect(() => {
    if (!isVideoOpen) {
      // Stop and destroy player when modal closes
      if (playerRef.current) {
        try {
          playerRef.current.stopVideo()
          playerRef.current.pauseVideo()
        } catch (e) {}
        try {
          playerRef.current.destroy()
        } catch (e) {}
        playerRef.current = null
      }
      return
    }
    
    const isMobile = isMobileRef.current

    let timeoutId: NodeJS.Timeout

    // Function to create player with highest quality
    const createPlayer = () => {
      if (playerRef.current) return // Already created
      
      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 1, // Autoplay on all devices
            rel: 0,
            modestbranding: 1,
            playsinline: 1, // Critical for iOS - plays inline instead of fullscreen
            // Request high quality (lower for mobile to load faster)
            vq: isMobile ? 'hd720' : 'hd2160',
            iv_load_policy: 3,
            cc_load_policy: 0,
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              // Set playback quality
              const setQuality = () => {
                try {
                  const availableQualities = event.target.getAvailableQualityLevels()
                  // Mobile: prioritize faster loading qualities; Desktop: prioritize 4K
                  const qualityOrder = isMobile 
                    ? ['hd720', 'hd1080', 'large', 'medium', 'hd1440', 'hd2160']
                    : ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small']
                  for (const quality of qualityOrder) {
                    if (availableQualities.includes(quality)) {
                      event.target.setPlaybackQuality(quality)
                      try {
                        if (event.target.setPlaybackQualityRange) {
                          event.target.setPlaybackQualityRange(quality, quality)
                        }
                      } catch (e) {}
                      break
                    }
                  }
                } catch (e) {
                  // Quality setting failed
                }
              }
              
              // Set quality immediately
              setQuality()
              
              // Play video immediately on all devices
              try {
                event.target.playVideo()
              } catch (e) {}
              
              // Set quality again after a short delay
              setTimeout(() => {
                setQuality()
              }, 500)
            },
            onStateChange: (event: any) => {
              // Continuously ensure quality is set to highest
              if (event.data === window.YT.PlayerState.PLAYING || 
                  event.data === window.YT.PlayerState.BUFFERING) {
                try {
                  const availableQualities = event.target.getAvailableQualityLevels()
                  const qualityOrder = isMobile 
                    ? ['hd720', 'hd1080', 'large', 'medium']
                    : ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small']
                  for (const quality of qualityOrder) {
                    if (availableQualities.includes(quality)) {
                      event.target.setPlaybackQuality(quality)
                      break
                    }
                  }
                } catch (e) {}
              }
            }
          }
        })
      } catch (e) {
        console.log('Error creating YouTube player:', e)
      }
    }

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      // Set up callback for when API loads
      const originalCallback = (window as any).onYouTubeIframeAPIReady
      ;(window as any).onYouTubeIframeAPIReady = () => {
        if (originalCallback) originalCallback()
        createPlayer()
      }

      // Load YouTube IFrame API script if not already loaded
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      }

      // Fallback: check periodically if API loaded
      timeoutId = setInterval(() => {
        if (window.YT && window.YT.Player && !playerRef.current) {
          createPlayer()
        }
      }, 100)
    }

    return () => {
      if (timeoutId) clearInterval(timeoutId)
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          // Player might already be destroyed
        }
        playerRef.current = null
      }
    }
  }, [isVideoOpen, youtubeVideoId])

  return (
    <>
    
      <section ref={sectionRef} className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#fffcf3] min-h-auto lg:h-[75vh] flex items-center">
        {/* Top and bottom gradient shadow overlays */}
        <div className="hidden md:block pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 via-black/5 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 via-black/5 to-transparent" />

        <div className={`relative max-w-7xl mx-auto w-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-14 md:gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-1 flex flex-col items-center justify-center text-center gap-6 sm:gap-8 md:gap-6">
              <p className="text-lg sm:text-2xl md:text-2xl font-bold text-blue-500 leading-relaxed sm:px-4">
                Hear more about Gospel Conference, our hope, and student's testimonials.
              </p>
              <img
                src="/video-section-bg.svg"
                alt="Arrow"
                className="hidden md:block w-3/5 max-w-[320px] h-auto scale-[0.9] object-contain"
              />
            </div>
            <div 
              className="lg:col-span-2 relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer w-full shadow-lg mt-4 sm:mt-6 md:mt-0"
              onClick={() => setIsVideoOpen(true)}
            >
              <img
                src="/video_thumbnail.svg"
                alt="Conference testimonial video"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-4">
                <div className="relative group/play">
                  {/* Outer ring animation */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75 group-hover/play:opacity-100"></div>
                  
                  {/* Play button circle */}
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-4 sm:p-5 md:p-6 group-hover/play:bg-white group-hover/play:scale-110 transition-all duration-300 shadow-2xl">
                    {/* Play icon */}
                    <svg 
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black ml-1" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Modal */}
      {isVideoOpen && (
        <div 
          className="video-modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-50 text-white hover:text-gray-300 transition-colors"
            aria-label="Close video"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Video container */}
          <div 
            className="relative w-full max-w-5xl mx-4 aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <div id="youtube-player" className="w-full h-full rounded-lg shadow-2xl"></div>


          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
