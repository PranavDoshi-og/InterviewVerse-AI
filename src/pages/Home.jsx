import { Link } from "react-router-dom"
import { FileText, Mic, BarChart3 } from "lucide-react"

function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500 opacity-20 blur-[150px] rounded-full"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800 relative z-10">

        <h1 className="text-2xl font-bold tracking-wide">
          FinalRound AI
        </h1>

        <Link to="/setup">
          <button className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition duration-300">
            Get Started
          </button>
        </Link>

      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 relative z-10">

        <p className="text-blue-400 font-semibold mb-4 tracking-widest uppercase">
          AI-Powered Interview Simulator
        </p>

        <h1 className="text-6xl md:text-7xl font-bold max-w-5xl leading-tight">
          Ace Your Interviews With
          <span className="text-blue-500"> Realistic AI Recruiters</span>
        </h1>

        <p className="text-gray-400 text-lg mt-8 max-w-2xl leading-relaxed">
          Upload your resume, practice realistic interviews,
          receive personalized feedback, and improve your confidence
          with AI-powered interview simulations.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-12">

          <Link to="/setup">
            <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition duration-300 hover:scale-105 shadow-lg shadow-blue-500/30">
              Start Interview
            </button>
          </Link>

          <button className="border border-gray-700 px-8 py-4 rounded-2xl text-lg hover:bg-gray-900 transition duration-300">
            Watch Demo
          </button>

        </div>

      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-10 pb-24 relative z-10">

        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 hover:border-blue-500 transition duration-300 hover:-translate-y-2">

          <FileText className="w-12 h-12 text-blue-500 mb-5" />

          <h2 className="text-2xl font-bold mb-4">
            Resume-Based Questions
          </h2>

          <p className="text-gray-400 leading-relaxed">
            AI analyzes your resume and generates personalized
            interview questions based on your projects,
            skills, and experience.
          </p>

        </div>

        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 hover:border-blue-500 transition duration-300 hover:-translate-y-2">

          <Mic className="w-12 h-12 text-blue-500 mb-5" />

          <h2 className="text-2xl font-bold mb-4">
            Realistic AI Interviewers
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Practice with HR, technical, startup,
            and behavioral interview styles that feel
            like real hiring rounds.
          </p>

        </div>

        <div className="border border-gray-800 rounded-3xl p-8 bg-gray-950 hover:border-blue-500 transition duration-300 hover:-translate-y-2">

          <BarChart3 className="w-12 h-12 text-blue-500 mb-5" />

          <h2 className="text-2xl font-bold mb-4">
            Instant AI Feedback
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Get confidence analysis, communication insights,
            technical depth scoring, and actionable
            improvement suggestions instantly.
          </p>

        </div>

      </section>

    </div>
  )
}

export default Home