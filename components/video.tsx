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
  const [isBuffering, setIsBuffering] = useState(false)
  const [countdown, setCountdown] = useState(9)
  const sectionRef = useRef<HTMLElement>(null)
  const playerRef = useRef<any>(null)
  const preloadPlayerRef = useRef<any>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasUserClickedPlay = useRef<boolean>(false)
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
      setIsBuffering(true)
      setCountdown(9)
      hasUserClickedPlay.current = false
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
    
    // Start countdown timer
    setIsBuffering(true)
    setCountdown(9)
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
            countdownIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    let timeoutId: NodeJS.Timeout

    // Function to create player with highest quality
    const createPlayer = () => {
      if (playerRef.current) return // Already created
      
      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: 0, // Don't autoplay immediately - let it buffer at high quality first
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            // Request 4K quality in URL
            vq: 'hd2160',
            // Additional quality hints
            iv_load_policy: 3,
            cc_load_policy: 0,
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              // Set playback quality to 4K immediately
              const setQuality = () => {
                try {
                  const availableQualities = event.target.getAvailableQualityLevels()
                  // Prioritize 4K first
                  const qualityOrder = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small']
                  for (const quality of qualityOrder) {
                    if (availableQualities.includes(quality)) {
                      event.target.setPlaybackQuality(quality)
                      // Also try setPlaybackQualityRange if available
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
              
              // Load the video (cue it, don't play)
              try {
                event.target.cueVideoById(youtubeVideoId, 0, 'hd2160')
              } catch (e) {
                try {
                  event.target.cueVideoById(youtubeVideoId, 0)
                } catch (e2) {
                  event.target.cueVideoById(youtubeVideoId)
                }
              }
              
              // Start buffering process without playing
              setTimeout(() => {
                try {
                  setQuality()
                  // Start loading/buffering by playing briefly, then immediately pause
                  event.target.playVideo()
                  
                  // Immediately pause to let it buffer without playing
                  setTimeout(() => {
                    try {
                      event.target.pauseVideo()
                    } catch (e) {}
                  }, 100)
                  
                  // Set quality continuously while buffering
                  const qualityIntervals = [200, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 9000]
                  qualityIntervals.forEach(delay => {
                    setTimeout(setQuality, delay)
                  })
                  
                  // After 9 seconds of buffering, go fullscreen then auto-play the video
                  setTimeout(() => {
                    try {
                      setQuality() // One final quality check
                      setIsBuffering(false)
                      setCountdown(0)
                      
                      // Request fullscreen right before playing (skip on mobile - fullscreen requires user gesture)
                      const requestFullscreen = () => {
                        // Skip fullscreen on mobile devices
                        if (isMobileRef.current) {
                          return
                        }
                        
                        const playerElement = document.getElementById('youtube-player')
                        if (playerElement) {
                          // Try YouTube Player API fullscreen first (if available)
                          try {
                            // Try to get the iframe inside the player element
                            const iframe = playerElement.querySelector('iframe')
                            if (iframe) {
                              // Try to make the iframe fullscreen
                              if (iframe.requestFullscreen) {
                                iframe.requestFullscreen().catch(() => {
                                  tryFullscreenFallback(playerElement)
                                })
                                return
                              } else if ((iframe as any).webkitRequestFullscreen) {
                                (iframe as any).webkitRequestFullscreen()
                                return
                              } else if ((iframe as any).mozRequestFullScreen) {
                                (iframe as any).mozRequestFullScreen()
                                return
                              } else if ((iframe as any).msRequestFullscreen) {
                                (iframe as any).msRequestFullscreen()
                                return
                              }
                            }
                          } catch (e) {}
                          
                          // Fallback: try player element itself
                          tryFullscreenFallback(playerElement)
                        }
                      }
                      
                      const tryFullscreenFallback = (element: HTMLElement) => {
                        if (element.requestFullscreen) {
                          element.requestFullscreen().catch(() => {
                            // Try modal container as last resort
                            const modal = element.closest('.video-modal-container')
                            if (modal && (modal as any).requestFullscreen) {
                              (modal as any).requestFullscreen().catch(() => {})
                            }
                          })
                        } else if ((element as any).webkitRequestFullscreen) {
                          (element as any).webkitRequestFullscreen()
                        } else if ((element as any).mozRequestFullScreen) {
                          (element as any).mozRequestFullScreen()
                        } else if ((element as any).msRequestFullscreen) {
                          (element as any).msRequestFullscreen()
                        } else {
                          // Last resort: modal container
                          const modal = element.closest('.video-modal-container')
                          if (modal) {
                            if ((modal as any).requestFullscreen) {
                              (modal as any).requestFullscreen().catch(() => {})
                            } else if ((modal as any).webkitRequestFullscreen) {
                              (modal as any).webkitRequestFullscreen()
                            } else if ((modal as any).mozRequestFullScreen) {
                              (modal as any).mozRequestFullScreen()
                            } else if ((modal as any).msRequestFullscreen) {
                              (modal as any).msRequestFullscreen()
                            }
                          }
                        }
                      }
                      
                      // Request fullscreen immediately, then play right after (skipped on mobile)
                      requestFullscreen()
                      
                      // Play video immediately after fullscreen request (browser will handle the timing)
                      // On mobile, video will play inline
                      hasUserClickedPlay.current = true
                      event.target.playVideo()
                    } catch (e) {
                      setIsBuffering(false)
                      setCountdown(0)
                      hasUserClickedPlay.current = true
                      event.target.playVideo()
                    }
                  }, 9000) // 9 seconds of buffering
                } catch (e) {
                  setIsBuffering(false)
                  setCountdown(0)
                }
              }, 300) // Small delay to ensure player is ready
            },
            onStateChange: (event: any) => {
              // Continuously ensure quality is set to highest
              if (event.data === window.YT.PlayerState.PLAYING || 
                  event.data === window.YT.PlayerState.BUFFERING) {
                try {
                  const availableQualities = event.target.getAvailableQualityLevels()
                  const qualityOrder = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small']
                  for (const quality of qualityOrder) {
                    if (availableQualities.includes(quality)) {
                      event.target.setPlaybackQuality(quality)
                      break
                    }
                  }
                } catch (e) {}
              }
              // If video starts playing without user interaction (before countdown), pause it
              // Only allow playing if countdown is done (hasUserClickedPlay is true) or if modal is open
              if (event.data === window.YT.PlayerState.PLAYING && !hasUserClickedPlay.current && isBuffering) {
                try {
                  event.target.pauseVideo()
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
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 via-black/5 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 via-black/5 to-transparent" />

        <div className={`relative max-w-7xl mx-auto w-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-14 md:gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-1 flex flex-col items-center justify-center text-center gap-6 sm:gap-8 md:gap-6">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-500 leading-relaxed px-2 sm:px-4">
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
            
            {/* Loading indicator with countdown */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-white text-sm sm:text-base font-medium">Loading highest quality in...</p>
                    <p className={`text-3xl sm:text-4xl md:text-5xl font-bold mt-2 transition-colors duration-300 ${
                      countdown === 3 ? 'text-green-400' :
                      countdown === 2 ? 'text-blue-400' :
                      countdown === 1 ? 'text-yellow-400' :
                      countdown === 0 ? 'text-red-400' :
                      'text-white'
                    }`}>{countdown}</p>
                  </div>
                </div>
              </div>
            )}

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
