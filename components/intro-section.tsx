export function IntroSection() {
  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden">
      {/* Light brown to white gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(to bottom, #d4a574, #e8d5b7, #f5ead8, #ffffff)",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-medium drop-shadow-md">
          Gospel Conference hopes to continue the legacy of preserving and preaching the one true gospel of Jesus Christ in the midst of the noise of our generation.
        </p>
      </div>
    </section>
  )
}



