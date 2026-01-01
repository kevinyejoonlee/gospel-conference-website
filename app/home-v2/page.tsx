import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Video from "@/components/video"
import Sessions from "@/components/sessions"
import Speakers from "@/components/speakers"
import GetInvolved from "@/components/get-involved"
import Sing from "@/components/sing"
import Footer from "@/components/footer"


export default function HomeV2() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Video />
      <Speakers />
      <Sessions />
      <GetInvolved />
      <Sing />
      <Footer />
    </main>
  )
}


