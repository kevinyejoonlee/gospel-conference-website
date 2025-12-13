"use client"

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import Image from 'next/image'

const photos = [
  'DSC01733.jpg',
  'DSC01735.jpg',
  'DSC01737.jpg',
  'DSC01740.jpg',
  'DSC01744.jpg',
  'DSC01746.jpg',
  'DSC01751.jpg',
  'DSC01761.jpg',
  'DSC01762.jpg',
  'DSC01763.jpg',
  'DSC01765.jpg',
  'DSC01770.jpg',
  'DSC01780.jpg',
  'DSC01782.jpg',
  'DSC01783.jpg',
  'DSC01784.jpg',
  'DSC01785.jpg',
  'DSC01789.jpg',
  'DSC01790.jpg',
  'DSC01792.jpg',
  'DSC01793.jpg',
  'DSC01794.jpg',
  'DSC01795.jpg',
  'DSC01807.jpg',
  'DSC01810.jpg',
  'DSC01812.jpg',
  'DSC01815.jpg',
  'DSC01830.jpg',
  'DSC01832.jpg',
  'DSC01834.jpg',
  'DSC01839.jpg',
  'DSC01841.jpg',
  'DSC01845.jpg',
  'DSC01849.jpg',
  'DSC01851.jpg',
  'DSC01852.jpg',
  'DSC01854.jpg',
  'DSC05366.jpg',
  'DSC05367.jpg',
  'DSC05374.jpg',
  'DSC05376.jpg',
]

export function PhotoGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dragAnimationFrameRef = useRef<number | null>(null)
  const positionRef = useRef(0)
  const speedMultiplierRef = useRef(1)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dragStartXRef = useRef(0)
  const dragStartPositionRef = useRef(0)
  const lastMouseXRef = useRef(0)
  const containerWidthRef = useRef(0)
  const photoWidthPxRef = useRef(0)
  const totalPhotoWidthRef = useRef(0)
  const maxPositionRef = useRef(0)
  const baseSpeed = 0.3 // Base scroll speed in pixels per frame
  
  const getGap = useCallback(() => {
    if (typeof window === 'undefined') return 16
    return window.innerWidth < 768 ? 16 : 16 // 16px gap for both
  }, [])

  // Duplicate photos for seamless infinite scroll - fewer on mobile to save memory
  const duplicatedPhotos = isMobile ? [...photos, ...photos] : [...photos, ...photos, ...photos]

  // Show 1 image on mobile (100% width), 3 images on desktop (33.333% width)
  const getPhotoWidth = useCallback(() => {
    if (typeof window === 'undefined') return 33.333
    return window.innerWidth < 768 ? 100 : 33.333 // md breakpoint is 768px
  }, [])

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cache width calculations
  const updateWidthCache = useCallback(() => {
    if (containerRef.current) {
      containerWidthRef.current = containerRef.current.offsetWidth
      const photoWidth = getPhotoWidth()
      const gap = getGap()
      photoWidthPxRef.current = (containerWidthRef.current * photoWidth) / 100
      totalPhotoWidthRef.current = photoWidthPxRef.current + gap
      maxPositionRef.current = photos.length * totalPhotoWidthRef.current
      
      // Mark as ready when we have valid dimensions
      if (containerWidthRef.current > 0 && maxPositionRef.current > 0) {
        setIsReady(true)
        // Reset position when cache updates
        positionRef.current = 0
        if (scrollRef.current) {
          scrollRef.current.style.transform = 'translate3d(0, 0, 0)'
        }
      }
    }
  }, [getPhotoWidth, getGap])

  // Update width cache on mount and resize
  useLayoutEffect(() => {
    // Delay to ensure container has dimensions, especially on mobile
    const timer = setTimeout(() => {
      updateWidthCache()
    }, 100)
    
    const handleResize = () => {
      updateWidthCache()
      // Reset position on resize to prevent off-screen images
      positionRef.current = 0
      if (scrollRef.current) {
        scrollRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateWidthCache])

  // Sync speedMultiplier ref with state
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier
  }, [speedMultiplier])


  // Auto-scroll animation using transform (only when not dragging)
  useEffect(() => {
    const animate = () => {
      if (scrollRef.current && !isDragging && isReady && maxPositionRef.current > 0) {
        positionRef.current += baseSpeed * speedMultiplierRef.current
        
        // Reset position when we've scrolled through one set of photos
        if (positionRef.current >= maxPositionRef.current) {
          positionRef.current = 0
        }
        
        scrollRef.current.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Only start animation if width cache is ready
    if (!isDragging && isReady && maxPositionRef.current > 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isDragging, isReady])

  // Update position during drag using RAF for smoothness
  const updateDragPosition = useCallback((deltaX: number) => {
    if (!scrollRef.current) return
    
    const newPosition = dragStartPositionRef.current - deltaX
    
    // Handle wrapping for infinite scroll
    let finalPosition = newPosition
    if (newPosition < 0) {
      finalPosition = maxPositionRef.current + newPosition
    } else if (newPosition >= maxPositionRef.current) {
      finalPosition = newPosition - maxPositionRef.current
    }
    
    positionRef.current = finalPosition
    scrollRef.current.style.transform = `translate3d(-${finalPosition}px, 0, 0)`
  }, [])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    dragStartXRef.current = e.clientX
    dragStartPositionRef.current = positionRef.current
    lastMouseXRef.current = e.clientX
    e.preventDefault()
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    dragStartXRef.current = e.touches[0].clientX
    dragStartPositionRef.current = positionRef.current
    lastMouseXRef.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && scrollRef.current) {
      const deltaX = e.touches[0].clientX - dragStartXRef.current
      updateDragPosition(deltaX)
    }
  }, [isDragging, updateDragPosition])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Throttled speed multiplier update
  const speedUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updateSpeedMultiplier = useCallback((newMultiplier: number) => {
    if (speedUpdateTimeoutRef.current) {
      clearTimeout(speedUpdateTimeoutRef.current)
    }
    speedUpdateTimeoutRef.current = setTimeout(() => {
      setSpeedMultiplier(newMultiplier)
    }, 16) // ~60fps updates
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && scrollRef.current) {
      const deltaX = e.clientX - dragStartXRef.current
      updateDragPosition(deltaX)
    } else if (!isDragging && containerRef.current && !isMobile) {
      // Speed control based on mouse position (only when not dragging and not on mobile)
      const rect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const containerWidth = rect.width
      
      // Map mouse position to speed multiplier (left = slower, right = faster)
      const normalizedX = mouseX / containerWidth
      const newMultiplier = 0.2 + (normalizedX * 2.8)
      updateSpeedMultiplier(Math.max(0.2, Math.min(3, newMultiplier)))
    }
  }, [isDragging, updateDragPosition, updateSpeedMultiplier, isMobile])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse wheel handler for speed control
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!isDragging && !isMobile) {
      const delta = e.deltaY
      const newMultiplier = Math.max(0.1, Math.min(5, speedMultiplier + (delta > 0 ? 0.1 : -0.1)))
      setSpeedMultiplier(newMultiplier)
    }
  }, [speedMultiplier, isDragging, isMobile])

  // Reset speed when mouse leaves
  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setSpeedMultiplier(1)
    }
    setIsDragging(false)
  }, [isDragging])

  // Global mouse and touch handlers for dragging outside component
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartXRef.current
        if (dragAnimationFrameRef.current) {
          cancelAnimationFrame(dragAnimationFrameRef.current)
        }
        dragAnimationFrameRef.current = requestAnimationFrame(() => {
          updateDragPosition(deltaX)
        })
      }
    }

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - dragStartXRef.current
        if (dragAnimationFrameRef.current) {
          cancelAnimationFrame(dragAnimationFrameRef.current)
        }
        dragAnimationFrameRef.current = requestAnimationFrame(() => {
          updateDragPosition(deltaX)
        })
      }
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      if (dragAnimationFrameRef.current) {
        cancelAnimationFrame(dragAnimationFrameRef.current)
        dragAnimationFrameRef.current = null
      }
    }

    const handleGlobalTouchEnd = () => {
      setIsDragging(false)
      if (dragAnimationFrameRef.current) {
        cancelAnimationFrame(dragAnimationFrameRef.current)
        dragAnimationFrameRef.current = null
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
      window.addEventListener('mouseup', handleGlobalMouseUp)
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true })
      window.addEventListener('touchend', handleGlobalTouchEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', handleGlobalTouchEnd)
      if (dragAnimationFrameRef.current) {
        cancelAnimationFrame(dragAnimationFrameRef.current)
        dragAnimationFrameRef.current = null
      }
      if (speedUpdateTimeoutRef.current) {
        clearTimeout(speedUpdateTimeoutRef.current)
      }
    }
  }, [isDragging, updateDragPosition])

  return (
    <div 
      ref={containerRef}
      className="w-full h-[40vh] md:h-screen bg-black relative overflow-hidden"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h2 className="text-white text-3xl md:text-6xl font-bold uppercase tracking-wider">
          Photo Gallery
        </h2>
      </div>
      
      <div 
        className="relative h-full flex items-center overflow-hidden cursor-grab active:cursor-grabbing z-0"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'contents',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          ref={scrollRef}
          className="flex items-center gap-4 select-none relative z-0"
          style={{
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {duplicatedPhotos.map((photo, index) => (
            <div
              key={`${photo}-${index}`}
              className="shrink-0 relative"
              style={{
                width: isMobile ? '100vw' : 'calc(33.333vw - 1rem)',
                height: isMobile ? '30vh' : '80vh',
                minHeight: isMobile ? '30vh' : '80vh',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <Image
                src={`/photos/${photo}`}
                alt={`Gallery photo ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading={isMobile ? (index < 3 ? 'eager' : 'lazy') : (index < 9 ? 'eager' : 'lazy')}
                priority={index < 1}
                quality={isMobile ? 75 : 90}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}