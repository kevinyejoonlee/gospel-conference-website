"use client"

export function Header() {
  const scrollToRegistration = () => {
    const element = document.getElementById("registration")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToAbout = () => {
    const element = document.getElementById("about")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToSpeakers = () => {
    const element = document.getElementById("speakers")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="bg-primary text-primary-foreground py-4 md:py-6 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-black-bg.png"
            alt="Gospel Conference Logo"
            className="w-10 h-10 object-contain"
            style={{ background: "transparent" }}
            onError={(e) => {
              // Fallback to original if new logo fails
              const target = e.target as HTMLImageElement
              target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/efd5328a-9f28-4cc6-aa7a-772c9d70d630-RkDCgi6OMRgbdJKxlKBMbjP5sREnR8.png"
            }}
          />
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <button onClick={scrollToHome} className="hover:opacity-80 transition-opacity">
            HOME
          </button>
          <button onClick={scrollToAbout} className="hover:opacity-80 transition-opacity">
            ABOUT
          </button>
          <button onClick={scrollToSpeakers} className="hover:opacity-80 transition-opacity">
            SPEAKERS
          </button>
          <button
            onClick={scrollToRegistration}
            className="bg-white text-primary px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all"
          >
            REGISTER NOW
          </button>
        </nav>
      </div>
    </header>
  )
}
