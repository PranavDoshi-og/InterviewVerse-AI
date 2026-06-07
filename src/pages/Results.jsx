import { useEffect, useState } from "react";
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
} from "lucide-react";

const Results = () => {

  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedFeedback = localStorage.getItem(
      "interviewFeedback"
    );

    if (storedFeedback) {
      setFeedback(JSON.parse(storedFeedback));
    }

    setLoading(false);

  }, []);

  // =========================
  // PDF DOWNLOAD
  // =========================
  const downloadPDF = () => {

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(22);

    doc.text("InterviewVerse AI Report", 20, y);

    y += 20;

    doc.setFontSize(14);

    doc.text(
      `Overall Score: ${feedback.overall_score || 82}%`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Technical Score: ${feedback.technical_score || 75}%`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Communication Score: ${feedback.communication_score || 80}%`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Problem Solving Score: ${feedback.problem_solving_score || 78}%`,
      20,
      y
    );

    y += 20;

    doc.setFontSize(18);

    doc.text("Strengths", 20, y);

    y += 10;

    doc.setFontSize(12);

    (feedback.strengths || []).forEach((item) => {

      doc.text(`• ${item}`, 25, y);

      y += 8;
    });

    y += 10;

    doc.setFontSize(18);

    doc.text("Improvements", 20, y);

    y += 10;

    doc.setFontSize(12);

    (feedback.improvements || []).forEach((item) => {

      doc.text(`• ${item}`, 25, y);

      y += 8;
    });

    y += 10;

    if (feedback.recommended_topics) {

      doc.setFontSize(18);

      doc.text("Recommended Topics", 20, y);

      y += 10;

      doc.setFontSize(12);

      feedback.recommended_topics.forEach((item) => {

        doc.text(`• ${item}`, 25, y);

        y += 8;
      });

      y += 10;
    }

    if (feedback.career_roadmap) {

      doc.setFontSize(18);

      doc.text("Career Roadmap", 20, y);

      y += 10;

      doc.setFontSize(12);

      feedback.career_roadmap.forEach(
        (item, index) => {

          doc.text(
            `${index + 1}. ${item}`,
            25,
            y
          );

          y += 8;
        }
      );

      y += 10;
    }

    doc.setFontSize(18);

    doc.text("Final Feedback", 20, y);

    y += 10;

    doc.setFontSize(12);

    const splitFeedback = doc.splitTextToSize(
      feedback.final_feedback ||
      "Strong interview performance.",
      170
    );

    doc.text(splitFeedback, 20, y);

    doc.save("InterviewVerse_AI_Report.pdf");
  };

  if (loading) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        Generating AI Feedback...
      </div>
    );
  }

  if (!feedback) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        No feedback available.
      </div>
    );
  }
  // =========================
// VOICE ANALYTICS
// =========================
const voice = feedback.voiceAnalytics || {};

const confidence = voice.confidenceScore || 0;
const wpm = voice.wpm || 0;
const fillerWords = voice.fillerWords || 0;
const duration = voice.duration || 0;
const getCommunicationRecommendation = () => {
  if (confidence >= 85 && fillerWords <= 3) {
    return "Excellent communication skills. You sound confident, clear, and interview-ready.";
  }

  if (confidence >= 70 && fillerWords <= 6) {
    return "Good communication overall. Try reducing filler words and adding more structured responses.";
  }

  if (confidence >= 50) {
    return "Average communication performance. Focus on confidence, clarity, and speaking pace.";
  }

  return "Practice mock interviews more frequently to improve confidence and verbal delivery.";
};
  const readinessScore = Math.min(
  100,
  Math.round(
    ((feedback.overall_score || 70) * 0.7) +
    (confidence * 0.2) +
    (Math.max(0, 100 - fillerWords * 5) * 0.1)
  )
);
  const scores = [
    {
      title: "Technical Skills",
      score: feedback.technical_score || 75,
      icon: <Brain size={28} />,
    },
    {
      title: "Communication",
      score: feedback.communication_score || 80,
      icon: <MessageSquare size={28} />,
    },
    {
      title: "Problem Solving",
      score: feedback.problem_solving_score || 78,
      icon: <Target size={28} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-10">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >

        {/* HEADER */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Interview Report
          </h1>

          <p className="text-zinc-400 text-lg">
            Performance analysis generated by AI
          </p>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={downloadPDF}
            className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
          >
            Download PDF Report
          </button>
          <button
  onClick={() => window.location.href = "/history"}
  className="mt-4 ml-4 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
>
  View Interview History
</button>

        </div>

        {/* OVERALL SCORE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 mb-10 shadow-2xl"
        >

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div>

              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Trophy className="text-yellow-400" />
                Overall Score
              </h2>

              <p className="text-zinc-400 text-lg">
                AI evaluated your interview performance.
              </p>

            </div>

            <div className="relative w-40 h-40">

              <div className="absolute inset-0 rounded-full border-[10px] border-zinc-700"></div>

              <div
                className="absolute inset-0 rounded-full border-[10px] border-cyan-400"
                style={{
                  clipPath: `inset(${100 - (feedback.overall_score || 82)}% 0 0 0)`,
                }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                {feedback.overall_score || 82}%
              </div>

            </div>

          </div>

        </motion.div>

        {/* INTERVIEW READINESS SCORE */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-5 mb-8"
>
  <h2 className="text-2xl font-bold mb-2">
    🚀 Interview Readiness Score
  </h2>

  <div className="flex flex-col md:flex-row items-center justify-between gap-6">

    <div className="text-4xl font-bold text-green-400">

      {readinessScore}/100
    </div>

    <div className="text-sm text-zinc-300 max-w-xl">
      {readinessScore >= 85
        ? "You are highly prepared for real-world interviews."
        : readinessScore >= 70
        ? "You are close to being interview-ready. Keep practicing and refining your answers."
        : "More preparation is recommended before attending technical interviews."}
    </div>

  </div>
</motion.div>          
        {/* SCORE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {scores.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 hover:scale-105 transition-all duration-300"
            >

              <div className="flex items-center justify-between mb-6">

                <div className="text-cyan-400">
                  {item.icon}
                </div>

                <span className="text-3xl font-bold">
                  {item.score}%
                </span>

              </div>

              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>

              <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 1 }}
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full"
                />

              </div>

            </motion.div>

          ))}

        </div>

        {/* STRENGTHS + IMPROVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8"
          >

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-400">
              <CheckCircle />
              Strengths
            </h2>

            <div className="space-y-4">

              {(feedback.strengths || []).map(
                (strength, index) => (

                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl"
                  >

                    <p>{strength}</p>

                  </motion.div>
                )
              )}

            </div>

          </motion.div>

          {/* Improvements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8"
          >

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-red-400">
              <AlertTriangle />
              Areas to Improve
            </h2>

            <div className="space-y-4">

              {(feedback.improvements || []).map(
                (weakness, index) => (

                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
                  >

                    <p>{weakness}</p>

                  </motion.div>
                )
              )}

            </div>

          </motion.div>

        </div>
        {/* LEARNING RESOURCES */}
{feedback.recommended_topics?.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 mb-10"
  >
    <h2 className="text-2xl font-bold mb-5">
      📚 Recommended Learning Topics
    </h2>

    <div className="flex flex-wrap gap-3">
      {feedback.recommended_topics.map((topic, index) => (
        <div
          key={index}
          className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
        >
          {topic}
        </div>
      ))}
    </div>
  </motion.div>
)}
{/* CAREER ROADMAP */}
{feedback.career_roadmap?.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 mb-10"
  >
    <h2 className="text-2xl font-bold mb-6">
      🛣️ Career Roadmap
    </h2>

    <div className="space-y-4">
      {feedback.career_roadmap.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">
            {index + 1}
          </div>

          <div className="flex-1 bg-zinc-800 rounded-xl p-4">
            {step}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
)}
        
        {/* COMMUNICATION ANALYSIS */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 mb-10"
>
  <h2 className="text-3xl font-bold mb-8">
    🎤 Communication Analysis
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

    <div className="bg-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Confidence Score
      </p>

      <h3 className="text-4xl font-bold text-cyan-400">
        {confidence}
      </h3>

      <p className="text-sm text-zinc-500">
        /100
      </p>
    </div>

    <div className="bg-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Speaking Pace
      </p>

      <h3 className="text-4xl font-bold text-purple-400">
        {wpm}
      </h3>

      <p className="text-sm text-zinc-500">
        WPM
      </p>
    </div>

    <div className="bg-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Filler Words
      </p>

      <h3 className="text-4xl font-bold text-yellow-400">
        {fillerWords}
      </h3>
    </div>

    <div className="bg-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-400 mb-2">
        Duration
      </p>

      <h3 className="text-4xl font-bold text-green-400">
        {duration}
      </h3>

      <p className="text-sm text-zinc-500">
        sec
      </p>
    </div>

  </div>
  <div className="mt-8 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
  <h3 className="text-xl font-semibold mb-3 text-cyan-400">
    Communication Recommendation
  </h3>

  <p className="text-zinc-300">
    {getCommunicationRecommendation()}
  </p>
</div>
</motion.div>
        {/* FINAL FEEDBACK */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-8"
        >

          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Star className="text-yellow-400" />
            AI Recommendation
          </h2>

          <p className="text-lg leading-8 text-zinc-300">

            {feedback.final_feedback ||
              "You demonstrated strong potential during the interview. Focus on improving clarity and technical depth to perform even better in future interviews."}

          </p>

        </motion.div>

      </motion.div>

    </div>
  );
};

export default Results;