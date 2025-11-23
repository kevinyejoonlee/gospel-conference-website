import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#2a2a2a] text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Footer Icons */}
          <div className="flex items-center gap-6">
            {/* GC Logo */}
            <Image
              src="/images/header/logo.png"
              alt="Gospel Conference Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            
            {/* @ Symbol */}
            <span className="text-2xl">@</span>
            
            {/* Copyright Symbol */}
            <span className="text-2xl">©</span>
          </div>
          
          {/* Copyright Text */}
          <p className="text-sm text-white/70 text-center">
            © {new Date().getFullYear()} Gospel Conference. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}



