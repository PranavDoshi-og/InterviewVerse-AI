function InterviewHeader({ voiceMode, setVoiceMode, loading }) {
  const role = localStorage.getItem("selectedRole") || "Interview";

  return (
    <header className="shrink-0 border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl px-7 py-4 flex items-center justify-between z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white text-base">Interview Session</h2>
            <span className="text-white/20">·</span>
            <span className="text-gray-400 text-sm">{role}</span>
          </div>
          <p className="text-gray-600 text-xs mt-0.5">Conversational AI Recruiter Experience</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* AI Active badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          <span className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-yellow-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
          <span className={`text-xs font-medium ${loading ? "text-yellow-300" : "text-emerald-300"}`}>
            {loading ? "AI Thinking" : "AI Active"}
          </span>
        </div>

        {/* Voice toggle */}
        <button
          onClick={() => setVoiceMode(!voiceMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            voiceMode
              ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
              : "bg-white/10 border border-white/10 text-gray-300 hover:bg-white/15 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
          {voiceMode ? "Text Mode" : "Voice Mode"}
        </button>
      </div>
    </header>
  );
}

export default InterviewHeader;
