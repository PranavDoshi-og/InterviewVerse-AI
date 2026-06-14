import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import VoiceInterview from "./VoiceInterview";
import InterviewSidebar from "../components/InterviewSidebar";
import InterviewHeader from "../components/InterviewHeader";
import ChatBubble from "../components/ChatBubble";

function Interview() {
  // ─── ALL ORIGINAL STATE (names unchanged) ───────────────────────────────
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceAnalytics, setVoiceAnalytics] = useState(null);
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // NEW: track whether a voice transcript just arrived (for the banner)
  const [voiceCaptured, setVoiceCaptured] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "question",
      text: "Tell me about yourself.",
    },
  ]);

  // ─── AUTO SCROLL (original logic) ───────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ─── VOICE COMPLETE (original logic) ────────────────────────────────────
  const handleVoiceComplete = (result) => {
    console.log("VOICE RESULT:", result);
    setAnswer(result.transcript);
    setVoiceAnalytics(result.analytics);
    setVoiceCaptured(true); // show the banner
  };

  // Clear banner when user edits the textarea manually
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    if (voiceCaptured) setVoiceCaptured(false);
  };

  // ─── GENERATE QUESTION (original logic, untouched) ──────────────────────
  const generateQuestion = async () => {
    if (answer.trim() === "") return;

    const updatedMessages = [
      ...messages,
      { type: "answer", text: answer },
    ];

    setMessages(updatedMessages);
    const currentAnswer = answer;
    setAnswer("");
    setVoiceCaptured(false);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: currentAnswer,
          role: localStorage.getItem("selectedRole"),
        }),
      });

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        { type: "question", text: data.question },
      ]);
    } catch (error) {
      console.log(error);
      setMessages([
        ...updatedMessages,
        { type: "question", text: "Error generating question." },
      ]);
    }

    setLoading(false);
  };

  // ─── GENERATE FEEDBACK (original logic, untouched) ──────────────────────
  const generateFeedback = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      console.log(data);
      // FIX: standardised to camelCase "voiceAnalytics" — matches Results.jsx
      data.voiceAnalytics = voiceAnalytics;

      // SAVE CURRENT FEEDBACK
      localStorage.setItem("interviewFeedback", JSON.stringify(data));

      // SAVE INTERVIEW HISTORY
      const existingHistory =
        JSON.parse(localStorage.getItem("interviewHistory")) || [];

      const newInterview = {
        date: new Date().toLocaleString(),
        role: localStorage.getItem("selectedRole"),
        score: data.overall_score,
        feedback: data,
      };

      existingHistory.unshift(newInterview);
      localStorage.setItem("interviewHistory", JSON.stringify(existingHistory));

      // GO TO RESULTS PAGE
      navigate("/results");
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // ─── ENTER KEY (original logic, untouched) ──────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateQuestion();
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#080810] text-white flex overflow-hidden relative">

      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-900/10 blur-[100px] rounded-full" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Left Sidebar ── */}
      <InterviewSidebar messages={messages} loading={loading} />

      {/* ── Main Column ── */}
      <div className="flex-1 flex flex-col min-w-0 z-10">

        {/* ── Header ── */}
        <InterviewHeader
          voiceMode={voiceMode}
          setVoiceMode={setVoiceMode}
          loading={loading}
        />

        {/* ── Chat Messages ── */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 scroll-smooth">

          {messages.map((msg, index) => (
            <ChatBubble key={index} msg={msg} index={index} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div
              style={{
                animation: "fadeSlideIn 0.35s ease forwards",
              }}
              className="flex items-end gap-3 justify-start"
            >
              <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/20 mb-1">
                AI
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-medium tracking-wider uppercase text-cyan-400/70 ml-1">
                  AI Interviewer
                </p>
                <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
                  <div className="flex gap-2 items-center">
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-cyan-400"
                      style={{ animation: "typingBounce 1.1s ease-in-out infinite" }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-blue-400"
                      style={{ animation: "typingBounce 1.1s ease-in-out 0.18s infinite" }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full bg-purple-400"
                      style={{ animation: "typingBounce 1.1s ease-in-out 0.36s infinite" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Bottom Input Area ── */}
        <div className="shrink-0 border-t border-white/10 bg-white/[0.03] backdrop-blur-2xl p-5 space-y-3">

          {/* Voice section */}
          {voiceMode && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <VoiceInterview
                question={
                  messages[messages.length - 1]?.type === "question"
                    ? messages[messages.length - 1].text
                    : ""
                }
                onComplete={handleVoiceComplete}
              />
            </div>
          )}

          {/* Voice captured banner */}
          {voiceCaptured && answer.trim() !== "" && (
            <div
              style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
              className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/25 rounded-2xl px-4 py-3"
            >
              <span className="text-lg">🎤</span>
              <p className="text-purple-200 text-sm font-medium">
                Voice answer captured successfully.{" "}
                <span className="text-purple-300 font-semibold">
                  Press Send to submit.
                </span>
              </p>
            </div>
          )}

          {/* Input row */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={handleAnswerChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
                rows={3}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/10 rounded-3xl px-6 py-4 outline-none resize-none text-white placeholder-gray-600 transition-all duration-200 text-sm leading-relaxed"
              />
              {/* Character hint */}
              {answer.length > 0 && (
                <p className="absolute bottom-3 right-5 text-gray-600 text-xs pointer-events-none">
                  {answer.length} chars
                </p>
              )}
            </div>

            {/* Send */}
            <button
              onClick={generateQuestion}
              disabled={loading || answer.trim() === ""}
              className="shrink-0 h-[72px] px-7 rounded-3xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Thinking
                </>
              ) : (
                <>
                  Send
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </>
              )}
            </button>

            {/* Finish */}
            <button
              onClick={generateFeedback}
              disabled={loading}
              className="shrink-0 h-[72px] px-7 rounded-3xl font-semibold text-sm bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finish
            </button>
          </div>

        </div>
      </div>

      {/* ── Global keyframe animations (injected once) ── */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Interview;
