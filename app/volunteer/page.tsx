import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative z-10">
        <section className="w-full min-h-screen relative overflow-hidden">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(to right, #f5d7b3, #f8e8d5, #faf5f0)'
            }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left - Title and Info */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-league-spartan font-black text-white">
                  VOLUNTEER FOR GOSPEL CONFERENCE
                </h1>
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-league-spartan font-black text-white">
                  2026
                </h2>
                
                <div className="space-y-4 text-white text-base md:text-lg leading-relaxed mt-8">
                  <p>
                    Thank you for your interest in volunteering at Gospel Conference.
                  </p>
                  <p>
                    All volunteers will be small group leaders. There will be 2-3 leaders per small group.
                  </p>
                  <p>
                    All leaders must be friendly and able to (or willing to learn to) lead conversations, facilitate discussions, and answer questions. All leaders must be present and lead in example, and prioritize building relationships with and edifying the attendees.
                  </p>
                  <p>
                    Due to limited space, application does not guarantee acceptance. However, we will be in contact with you well in advance of the conference!
                  </p>
                </div>
              </div>

              {/* Right - Application Form */}
              <div className="bg-white rounded-lg p-6 md:p-8 lg:p-10 shadow-lg">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth (MM/DD/YYYY)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address (Street, City, Province, Postal Code)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">What church do you attend?</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">How long have you been attending your church?</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">In what capacity have you served (past or present)</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Please share your testimony</label>
                    <textarea rows={5} className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">What is the gospel?</label>
                    <textarea rows={5} className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Do you agree to the following requirements of all volunteers?</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded" />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-[#C86611] text-white font-inter font-bold text-lg uppercase py-4 rounded-lg hover:bg-[#B85A0F] transition-colors"
                  >
                    SUBMIT APPLICATION
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

