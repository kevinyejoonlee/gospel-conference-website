import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { IntroSection } from "@/components/intro-section"
import { SpeakersSection } from "@/components/speakers-section"
import { RegistrationSection } from "@/components/registration-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative z-10">
        <Hero />
        <IntroSection />
        <SpeakersSection />
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  )
}