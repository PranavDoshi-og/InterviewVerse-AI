import { Link } from "react-router-dom";

const tips = [
  "Use the STAR method: Situation, Task, Action, Result.",
  "Be specific — numbers and outcomes impress.",
  "Pause before answering. It shows you think.",
  "Ask clarifying questions when needed.",
];

function InterviewSidebar({ messages, loading }) {
  const questionCount = messages.filter((m) => m.type === "question").length;
  const answerCount = messages.filter((m) => m.type === "answer").length;
  const role = localStorage.getItem("selectedRole") || "Not selected";
  const progress = Math.min(Math.round((answerCount / 8) * 100), 100);

  return (
    <aside className="w-[300px] shrink-0 border-r border-white/10 bg-white/[0.03] backdrop-blur-2xl flex flex-col z-10 overflow-y-auto">
      {/* Logo + Back */}
      <div className="p-6 border-b border-white/10">
        <Link to="/setup">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6 group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Setup
          </button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-500/30">
            AI
          </div>
          <div>
            <p className="font-semibold text-white text-sm">FinalRound AI</p>
            <p className="text-gray-500 text-xs">Interview Simulator</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 space-y-3">
        {/* Role */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">Current Role</p>
          <p className="font-semibold text-white text-sm truncate">{role}</p>
        </div>

        {/* Questions */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5">Questions Asked</p>
            <p className="font-bold text-white text-2xl">{questionCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-500 text-xs uppercase tracking-widest">Progress</p>
            <span className="text-cyan-400 text-xs font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-600 text-xs mt-2">{answerCount} / 8 answers given</p>
        </div>

        {/* AI Status */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">AI Status</p>
            <p className={`text-sm font-medium ${loading ? "text-yellow-300" : "text-emerald-300"}`}>
              {loading ? "Thinking…" : "Ready"}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-5 mt-auto border-t border-white/10">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Quick Tips</p>
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-gray-400 text-xs leading-relaxed">
              <span className="text-cyan-500 mt-0.5 shrink-0">▸</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default InterviewSidebar;
