import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Role definitions ────────────────────────────────────────────────────────
const ROLES = [
  {
    id: "Frontend Developer",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    desc: "React, Vue, CSS, UI/UX",
  },
  {
    id: "Backend Developer",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    desc: "Node, Python, APIs, DBs",
  },
  {
    id: "Full Stack Developer",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    desc: "End-to-end, cloud, systems",
  },
  {
    id: "Data Analyst",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    desc: "SQL, Excel, BI, statistics",
  },
  {
    id: "AI/ML Engineer",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    desc: "PyTorch, LLMs, MLOps",
  },
  {
    id: "DevOps Engineer",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
    ),
    desc: "CI/CD, Docker, Kubernetes",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
function Setup() {
  // ── ALL ORIGINAL STATE (names unchanged) ──
  const navigate = useNavigate();
  const [role, setRole] = useState("Frontend Developer");
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);

  // NEW UI state (no originals modified)
  const [step, setStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const fileInputRef = useRef(null);

  // ── ORIGINAL upload handler (untouched logic) ──
  const handleResumeUpload = async () => {
    if (!resume) {
      // replaced alert with inline error
      setUploadError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", resume);

    try {
      setUploading(true);
      setUploadError(false);

      const response = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      localStorage.setItem("selectedRole", role);
      navigate("/interview");
    } catch (error) {
      console.log(error);
      setUploadError(true);
    }

    setUploading(false);
  };

  // ── Drag & drop handlers ──
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      setUploadError(false);
    }
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setResume(file); setUploadError(false); }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-2xl z-10">

        {/* ── Header ── */}
        <div className="text-center mb-10" style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Interview Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Interview{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Setup
            </span>
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
            Upload your resume and prepare for an AI-powered interview experience tailored to your role.
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center gap-3 mb-8" style={{ animation: "fadeUp 0.5s ease 0.08s both" }}>
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => { if (s === 2 && step === 1) return; setStep(s); }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  step === s
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300"
                    : s < step
                    ? "text-gray-400 border border-white/10 bg-white/5 hover:bg-white/10"
                    : "text-gray-600 border border-white/5 bg-white/[0.02] cursor-default"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s ? "bg-cyan-500 text-black" : s < step ? "bg-white/20 text-gray-300" : "bg-white/5 text-gray-600"
                }`}>
                  {s < step ? "✓" : s}
                </span>
                {s === 1 ? "Choose Role" : "Upload Resume"}
              </button>
              {s === 1 && (
                <div className={`w-10 h-px transition-all duration-500 ${step === 2 ? "bg-cyan-500/50" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Card ── */}
        <div
          className="bg-white/[0.04] border border-white/10 backdrop-blur-2xl rounded-3xl p-7 sm:p-10 shadow-2xl"
          style={{ animation: "fadeUp 0.5s ease 0.12s both" }}
        >

          {/* ══ STEP 1: Role Selection ══ */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Choose your role</h2>
                <p className="text-gray-500 text-sm">Select the position you're interviewing for.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {ROLES.map((r) => {
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                        active
                          ? "border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/10"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20"
                      }`}
                      style={active ? { boxShadow: "0 0 0 1px rgba(6,182,212,0.3), 0 8px 32px rgba(6,182,212,0.08)" } : {}}
                    >
                      {/* Icon bubble */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30"
                          : "bg-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-gray-200"
                      }`}>
                        {r.icon}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-medium text-sm ${active ? "text-white" : "text-gray-300"}`}>{r.id}</p>
                        <p className="text-gray-600 text-xs mt-0.5 truncate">{r.desc}</p>
                      </div>
                      {/* Active check */}
                      {active && (
                        <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}

          {/* ══ STEP 2: Resume Upload ══ */}
          {step === 2 && (
            <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Upload your resume</h2>
                <p className="text-gray-500 text-sm">PDF only · Used to personalize your interview questions.</p>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-10 flex flex-col items-center justify-center text-center mb-4 ${
                  resume
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : dragOver
                    ? "border-cyan-400/60 bg-cyan-500/5 scale-[1.01]"
                    : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                }`}
              >
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {resume ? (
                  /* Success state */
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-emerald-300 font-semibold text-sm mb-1">✓ Resume Selected</p>
                    <p className="text-gray-400 text-xs break-all px-4">{resume.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResume(null); }}
                      className="mt-4 text-gray-600 hover:text-gray-300 text-xs underline underline-offset-2 transition-colors"
                    >
                      Choose a different file
                    </button>
                  </>
                ) : (
                  /* Upload prompt */
                  <>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      dragOver
                        ? "bg-cyan-500/20 border border-cyan-500/40"
                        : "bg-white/5 border border-white/10"
                    }`}>
                      <svg className={`w-7 h-7 transition-colors ${dragOver ? "text-cyan-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-medium text-sm mb-1">
                      {dragOver ? "Drop your PDF here" : "Drag & drop your resume"}
                    </p>
                    <p className="text-gray-600 text-xs">or click to browse</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
                      <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-300 text-[10px] font-semibold uppercase tracking-wider">PDF</span>
                    </div>
                  </>
                )}
              </div>

              {/* Error banner */}
              {uploadError && (
                <div
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-2xl px-4 py-3.5 mb-4"
                  style={{ animation: "fadeUp 0.3s ease forwards" }}
                >
                  <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className="text-red-300 font-semibold text-sm">⚠ Resume upload failed</p>
                    <p className="text-red-400/70 text-xs mt-0.5">Please check your file and try again.</p>
                  </div>
                  <button
                    onClick={() => setUploadError(false)}
                    className="ml-auto text-red-400/50 hover:text-red-300 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Loading state */}
              {uploading && (
                <div
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-4"
                  style={{ animation: "fadeUp 0.3s ease forwards" }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Uploading Resume…</p>
                    <p className="text-gray-500 text-xs mt-0.5">Please wait while AI analyzes your resume.</p>
                  </div>
                </div>
              )}

              {/* CTA row */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={uploading}
                  className="px-5 py-4 rounded-2xl text-sm font-medium text-gray-400 border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:text-white transition-all duration-200 disabled:opacity-40"
                >
                  ← Back
                </button>

                <button
                  onClick={handleResumeUpload}
                  disabled={uploading}
                  className="flex-1 py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 shadow-xl shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Analyzing Resume…
                    </>
                  ) : (
                    <>
                      Start Interview
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-gray-700 text-xs mt-6" style={{ animation: "fadeUp 0.5s ease 0.2s both" }}>
          Your resume is used only to personalize your interview session and is not stored.
        </p>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Setup;
