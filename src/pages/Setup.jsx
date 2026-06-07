import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Setup() {

  const navigate = useNavigate();

  const [role, setRole] = useState("Frontend Developer");

  const [resume, setResume] = useState(null);

  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = async () => {

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();

    formData.append("file", resume);

    try {

      setUploading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      localStorage.setItem("selectedRole", role);

      navigate("/interview");

    } catch (error) {

      console.log(error);

      alert("Resume upload failed");

    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10">

        <h1 className="text-5xl font-bold mb-4">
          Interview Setup
        </h1>

        <p className="text-gray-400 mb-10">
          Upload your resume and start AI-powered personalized interviews.
        </p>

        {/* Role Selection */}
        <div className="mb-8">

          <label className="block mb-3 text-lg font-medium">
            Select Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          >
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>AI/ML Engineer</option>
            <option>DevOps Engineer</option>
          </select>

        </div>

        {/* Resume Upload */}
        <div className="mb-10">

          <label className="block mb-3 text-lg font-medium">
            Upload Resume (PDF)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4"
          />

          {resume && (
            <p className="text-green-400 mt-3">
              Selected: {resume.name}
            </p>
          )}

        </div>

        {/* Start Button */}
        <button
          onClick={handleResumeUpload}
          disabled={uploading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition duration-300 py-5 rounded-2xl font-semibold text-lg shadow-2xl"
        >
          {uploading
            ? "Uploading Resume..."
            : "Start AI Interview"}
        </button>

      </div>

    </div>
  );
}

export default Setup;