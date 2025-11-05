import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AboutWithSpeakers } from "@/components/about-section"
import { RegistrationSection } from "@/components/registration-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AboutWithSpeakers />
        <RegistrationSection />
      </main>
    </div>
  )
}
