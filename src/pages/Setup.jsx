import { useState } from "react"
import { Link } from "react-router-dom"

function Setup() {

  const [role, setRole] = useState("")
  const [type, setType] = useState("")
  const [resume, setResume] = useState(null)

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500 opacity-20 blur-[150px] rounded-full"></div>

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto">

        <Link to="/">
          <button className="mb-8 text-gray-400 hover:text-white transition">
            ← Back
          </button>
        </Link>

        <h1 className="text-5xl font-bold mb-4">
          Setup Your Interview
        </h1>

        <p className="text-gray-400 text-lg mb-12">
          Customize your AI interview experience and upload your resume.
        </p>

        {/* Form */}
        <div className="space-y-8">

          {/* Role */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Select Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500"
            >
              <option value="">Choose a role</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Data Analyst</option>
              <option>UI/UX Designer</option>
            </select>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Interview Style
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500"
            >
              <option value="">Choose interview style</option>
              <option>Strict HR</option>
              <option>Friendly Recruiter</option>
              <option>Technical Interviewer</option>
              <option>Startup Founder</option>
            </select>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-lg font-semibold mb-3">
              Upload Resume
            </label>

            <div className="border-2 border-dashed border-gray-700 rounded-3xl p-10 text-center bg-gray-950">

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                className="mb-4"
              />

              {resume ? (
                <p className="text-green-400">
                  Uploaded: {resume.name}
                </p>
              ) : (
                <p className="text-gray-400">
                  Upload your resume for personalized questions
                </p>
              )}

            </div>
          </div>

          {/* Start Button */}
          <Link to="/interview">

            <button className="w-full bg-blue-500 hover:bg-blue-600 py-5 rounded-2xl text-xl font-semibold transition duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/30">
              Start AI Interview
            </button>

          </Link>

        </div>

      </div>

    </div>
  )
}

export default Setup