import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import {
  Trophy,
  Brain,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Target,
  Star,
  Download,
  History,
  Zap,
  Mic,
  BarChart2,
  BookOpen,
  Map,
  ChevronRight,
} from "lucide-react";
import ScoreRing from "../components/ScoreRing";
import ScoreCard from "../components/ScoreCard";

// ─── Animation helpers ─────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

// ─── Helpers ───────────────────────────────────────────────────────────────
function getReadinessLabel(score) {
  if (score >= 85) return { text: "Interview Ready", color: "#4ade80" };
  if (score >= 70) return { text: "Almost There",    color: "#facc15" };
  return                 { text: "Needs Practice",   color: "#f87171" };
}

function getCommunicationRec(confidence, fillerWords) {
  if (confidence >= 85 && fillerWords <= 3)
    return "Excellent delivery. You sound confident, clear, and interview-ready.";
  if (confidence >= 70 && fillerWords <= 6)
    return "Good communication. Reducing filler words and adding structure will sharpen your delivery.";
  if (confidence >= 50)
    return "Average performance. Work on confidence, clarity, and speaking pace for stronger impressions.";
  return "Practice mock interviews more frequently to build confidence and verbal fluency.";
}

// Shared glass style
const glass = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
};

// ─── Sub-components ────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, text, color = "#22d3ee" }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <span
        className="text-xs font-bold tracking-[0.18em] uppercase"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {text}
      </span>
    </div>
  );
}

function StatBadge({ value, unit, label, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
        {label}
      </span>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-black tabular-nums" style={{ color }}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
const Results = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("interviewFeedback");
    if (stored) {
      const parsed = JSON.parse(stored);
      // ── FIX: normalise voice analytics field name ──────────────────────
      // Interview.jsx stores the field as "voiceanalytics" (lowercase).
      // Results previously read "voiceAnalytics" (camelCase) — always 0.
      // We canonicalize to "voiceAnalytics" here so both old and new
      // sessions are handled correctly, without touching any other page.
      if (parsed.voiceanalytics && !parsed.voiceAnalytics) {
        parsed.voiceAnalytics = parsed.voiceanalytics;
        delete parsed.voiceanalytics;
      }
      setFeedback(parsed);
    }
    setLoading(false);
  }, []);

  // ─── PDF export ──────────────────────────────────────────────────────────
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    const line = (text, size = 12, indent = 20) => {
      doc.setFontSize(size);
      doc.text(text, indent, y);
      y += size * 0.6 + 4;
    };
    const gap = (n = 8) => { y += n; };

    line("InterviewVerse AI — Performance Report", 22);
    gap();
    line(`Overall Score    : ${feedback.overall_score || 0}%`, 14);
    line(`Technical        : ${feedback.technical_score || 0}%`, 12);
    line(`Communication    : ${feedback.communication_score || 0}%`, 12);
    line(`Problem Solving  : ${feedback.problem_solving_score || 0}%`, 12);
    gap();
    line("STRENGTHS", 16);
    (feedback.strengths || []).forEach((s) => line(`• ${s}`, 11, 26));
    gap();
    line("AREAS TO IMPROVE", 16);
    (feedback.improvements || []).forEach((i) => line(`• ${i}`, 11, 26));
    gap();
    if (feedback.recommended_topics?.length) {
      line("RECOMMENDED TOPICS", 16);
      feedback.recommended_topics.forEach((t) => line(`• ${t}`, 11, 26));
      gap();
    }
    if (feedback.career_roadmap?.length) {
      line("CAREER ROADMAP", 16);
      feedback.career_roadmap.forEach((s, i) => line(`${i + 1}. ${s}`, 11, 26));
      gap();
    }
    line("FINAL RECOMMENDATION", 16);
    const split = doc.splitTextToSize(
      feedback.final_feedback || "Strong interview performance.",
      170
    );
    doc.setFontSize(11);
    doc.text(split, 20, y);
    doc.save("InterviewVerse_AI_Report.pdf");
  };

  // ─── Loading / empty states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
            Loading report…
          </p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-3">No feedback available</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            Complete an interview first to see your results.
          </p>
          <button
            onClick={() => navigate("/setup")}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7)" }}
          >
            Start an Interview
          </button>
        </div>
      </div>
    );
  }

  // ─── Derived values ────────────────────────────────────────────────────────
  const voice       = feedback.voiceAnalytics || {};
  const confidence  = voice.confidence  ?? 0;
  const wpm         = voice.wpm         ?? 0;
  const fillerTotal = voice.fillerTotal ?? 0;
  const duration    = voice.duration    ?? 0;
  const hasVoice    = voice.duration != null;

  const readinessScore = Math.min(
    100,
    Math.round(
      (feedback.overall_score || 70) * 0.7 +
      confidence * 0.2 +
      Math.max(0, 100 - fillerTotal * 5) * 0.1
    )
  );
  const readinessLabel = getReadinessLabel(readinessScore);

  const scoreCards = [
    {
      title:    "Technical Skills",
      score:    feedback.technical_score || 0,
      icon:     <Brain size={18} />,
      gradient: ["#22d3ee", "#6366f1"],
      accent:   "#22d3ee",
    },
    {
      title:    "Communication",
      score:    feedback.communication_score || 0,
      icon:     <MessageSquare size={18} />,
      gradient: ["#a855f7", "#ec4899"],
      accent:   "#a855f7",
    },
    {
      title:    "Problem Solving",
      score:    feedback.problem_solving_score || 0,
      icon:     <Target size={18} />,
      gradient: ["#f59e0b", "#ef4444"],
      accent:   "#f59e0b",
    },
  ];

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{ background: "#080b12", fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700, top: -200, left: "50%",
            transform: "translateX(-60%)",
            background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500, bottom: 100, right: -100,
            background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#22d3ee" }}>
              AI Interview Report
            </p>
            <h1
              className="text-4xl md:text-5xl font-black"
              style={{
                background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Performance Analysis
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ ...glass, color: "rgba(255,255,255,0.6)" }}
            >
              <History size={15} />
              History
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg,#22d3ee,#a855f7)",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(34,211,238,0.25)",
              }}
            >
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </motion.div>

        {/* ── ROW 1: Overall Score · Readiness · Communication Summary ────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Overall Score */}
          <motion.div
            {...fadeUp(0.05)}
            className="rounded-2xl p-7 flex flex-col items-center justify-center gap-4"
            style={glass}
          >
            <SectionLabel icon={Trophy} text="Overall Score" color="#facc15" />
            <ScoreRing
              score={feedback.overall_score || 0}
              size={148}
              stroke={11}
              gradient={["#22d3ee", "#a855f7"]}
              delay={0.1}
              fontSize={34}
            />
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
              AI-evaluated performance
            </p>
          </motion.div>

          {/* Interview Readiness */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl p-7 flex flex-col items-center justify-center gap-4"
            style={glass}
          >
            <SectionLabel icon={Zap} text="Interview Readiness" color="#4ade80" />
            <ScoreRing
              score={readinessScore}
              size={148}
              stroke={11}
              gradient={["#4ade80", "#22d3ee"]}
              delay={0.15}
              fontSize={34}
            />
            <span
              className="text-sm font-bold px-3 py-1 rounded-full"
              style={{
                background: `${readinessLabel.color}18`,
                border: `1px solid ${readinessLabel.color}30`,
                color: readinessLabel.color,
              }}
            >
              {readinessLabel.text}
            </span>
          </motion.div>

          {/* Communication Summary */}
          <motion.div
            {...fadeUp(0.15)}
            className="rounded-2xl p-7 flex flex-col gap-4"
            style={glass}
          >
            <SectionLabel icon={Mic} text="Communication" color="#a855f7" />

            {hasVoice ? (
              <>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <StatBadge value={confidence} label="Confidence" color="#22d3ee" />
                  <StatBadge value={wpm} unit="wpm" label="Pace" color="#a855f7" />
                  <StatBadge value={fillerTotal} label="Fillers" color="#facc15" />
                  <StatBadge value={`${duration}s`} label="Duration" color="#4ade80" />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {getCommunicationRec(confidence, fillerTotal)}
                </p>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                <Mic size={28} style={{ color: "rgba(255,255,255,0.15)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Voice mode was not used in this session.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── ROW 2: Score Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {scoreCards.map((card, i) => (
            <ScoreCard key={card.title} {...card} delay={0.05 + i * 0.07} />
          ))}
        </div>

        {/* ── ROW 3: Strengths + Areas to Improve ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <motion.div {...fadeLeft(0.1)} className="rounded-2xl p-7" style={glass}>
            <SectionLabel icon={CheckCircle} text="Strengths" color="#4ade80" />
            <div className="space-y-3">
              {(feedback.strengths || []).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.12)" }}
                >
                  <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: "#4ade80" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{s}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeRight(0.1)} className="rounded-2xl p-7" style={glass}>
            <SectionLabel icon={AlertTriangle} text="Areas to Improve" color="#f87171" />
            <div className="space-y-3">
              {(feedback.improvements || []).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.12)" }}
                >
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── ROW 4: Learning Resources + Career Roadmap ──────────────────── */}
        {(feedback.recommended_topics?.length > 0 || feedback.career_roadmap?.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {feedback.recommended_topics?.length > 0 && (
              <motion.div {...fadeLeft(0.15)} className="rounded-2xl p-7" style={glass}>
                <SectionLabel icon={BookOpen} text="Recommended Topics" color="#22d3ee" />
                <div className="flex flex-wrap gap-2">
                  {feedback.recommended_topics.map((topic, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="text-sm font-medium px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(34,211,238,0.08)",
                        border: "1px solid rgba(34,211,238,0.18)",
                        color: "#67e8f9",
                      }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {feedback.career_roadmap?.length > 0 && (
              <motion.div {...fadeRight(0.15)} className="rounded-2xl p-7" style={glass}>
                <SectionLabel icon={Map} text="Career Roadmap" color="#a855f7" />
                <div className="space-y-3">
                  {feedback.career_roadmap.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-black"
                        style={{
                          background: "linear-gradient(135deg,#a855f7,#6366f1)",
                          color: "#fff",
                          boxShadow: "0 2px 10px rgba(168,85,247,0.35)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        className="flex-1 rounded-xl px-4 py-3"
                        style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.12)" }}
                      >
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{step}</p>
                      </div>
                      <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ── ROW 5: Voice Analytics Detail ──────────────────────────────── */}
        {hasVoice && (
          <motion.div {...fadeUp(0.2)} className="rounded-2xl p-7" style={glass}>
            <SectionLabel icon={BarChart2} text="Voice Analytics — Detailed" color="#22d3ee" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatBadge value={confidence} unit="/100" label="Confidence Score" color="#22d3ee" />
              <StatBadge value={wpm} unit="wpm" label="Speaking Pace" color="#a855f7" />
              <StatBadge value={fillerTotal} label="Filler Words Used" color="#facc15" />
              <StatBadge value={`${duration}s`} label="Total Duration" color="#4ade80" />
            </div>

            {/* Filler word breakdown */}
            {voice.fillerCounts &&
              Object.values(voice.fillerCounts).some((c) => c > 0) && (
                <div className="mb-6">
                  <p
                    className="text-xs font-semibold mb-3 tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Filler Word Breakdown
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(voice.fillerCounts)
                      .filter(([, count]) => count > 0)
                      .map(([word, count]) => (
                        <div
                          key={word}
                          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg"
                          style={{
                            background: "rgba(250,204,21,0.07)",
                            border: "1px solid rgba(250,204,21,0.15)",
                          }}
                        >
                          <span style={{ color: "#fde68a" }}>"{word}"</span>
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                            style={{ background: "rgba(250,204,21,0.15)", color: "#facc15" }}
                          >
                            ×{count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Speaking pace visual */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Speaking Pace
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{
                    color:
                      wpm >= 110 && wpm <= 170 ? "#4ade80" :
                      wpm < 80                  ? "#60a5fa" :
                                                  "#facc15",
                  }}
                >
                  {wpm < 80 ? "Too slow" : wpm < 110 ? "Slightly slow" : wpm <= 170 ? "Ideal range" : "Too fast"}
                </p>
              </div>
              <div
                className="relative h-2 rounded-full overflow-hidden mb-1"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div className="absolute inset-0 flex">
                  <div className="h-full rounded-l-full" style={{ width: "33%", background: "rgba(96,165,250,0.35)" }} />
                  <div className="h-full" style={{ width: "34%", background: "rgba(74,222,128,0.35)" }} />
                  <div className="h-full rounded-r-full" style={{ width: "33%", background: "rgba(248,113,113,0.35)" }} />
                </div>
                <motion.div
                  className="absolute top-0 w-2 h-2 rounded-full -translate-x-1"
                  style={{ background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
                  initial={{ left: "0%" }}
                  animate={{ left: `${Math.min(99, (wpm / 240) * 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex justify-between">
                {["Slow", "Ideal (110–170 wpm)", "Fast"].map((l) => (
                  <span key={l} className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── BOTTOM: Final AI Recommendation ────────────────────────────── */}
        <motion.div
          {...fadeUp(0.25)}
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.07), rgba(168,85,247,0.07))",
            border: "1px solid rgba(34,211,238,0.15)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(250,204,21,0.1)",
                border: "1px solid rgba(250,204,21,0.2)",
              }}
            >
              <Star size={18} style={{ color: "#facc15" }} />
            </div>
            <div>
              <p
                className="text-xs font-bold tracking-[0.18em] uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                AI Recommendation
              </p>
              <h3 className="font-bold text-white text-lg leading-tight">
                Final Assessment
              </h3>
            </div>
          </div>

          <p className="text-base leading-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            {feedback.final_feedback ||
              "You demonstrated strong potential during the interview. Focus on improving clarity and technical depth to perform even better in future interviews."}
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() => navigate("/setup")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg,#22d3ee,#a855f7)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(34,211,238,0.2)",
              }}
            >
              <Zap size={14} />
              Practice Again
            </button>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ ...glass, color: "rgba(255,255,255,0.6)" }}
            >
              <History size={14} />
              View All Sessions
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ ...glass, color: "rgba(255,255,255,0.6)" }}
            >
              <Download size={14} />
              Export PDF
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Results;
