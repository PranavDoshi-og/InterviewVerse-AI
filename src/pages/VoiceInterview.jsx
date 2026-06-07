import { useState, useEffect, useRef, useCallback } from "react";

// ── Analytics helpers (internal only — never rendered) ───────────────────────

const FILLER_WORDS = ["um", "uh", "like", "basically", "actually"];

function countFillers(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const counts = {};
  let total = 0;
  FILLER_WORDS.forEach((f) => (counts[f] = 0));
  words.forEach((w) => {
    if (FILLER_WORDS.includes(w)) { counts[w]++; total++; }
  });
  return { counts, total };
}

function calcWPM(text, seconds) {
  if (seconds < 1) return 0;
  return Math.round(((text.match(/\b\w+\b/g) || []).length / seconds) * 60);
}

function calcConfidence(wpm, fillerTotal, wordCount) {
  if (wordCount === 0) return 0;
  const pacePenalty = wpm < 80 ? 25 : wpm < 110 ? 10 : wpm > 200 ? 20 : wpm > 170 ? 8 : 0;
  const fillerPenalty = Math.min((fillerTotal / wordCount) * 200, 40);
  return Math.max(0, Math.min(100, Math.round(100 - pacePenalty - fillerPenalty)));
}

// ── Tiny sub-components ───────────────────────────────────────────────────────

function RecordingPulse() {
  return (
    <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(248,113,113,0.28)", animation: "viPulse 1.5s ease-out infinite" }} />
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(248,113,113,0.15)", animation: "viPulse 1.5s ease-out 0.55s infinite" }} />
      <span className="relative w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#f87171" }}>
        <span className="w-1 h-1 rounded-full bg-white" />
      </span>
    </div>
  );
}

function Waveform({ active }) {
  const BARS = 16;
  return (
    <div className="flex items-center gap-[2px] h-5">
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full"
          style={{
            background: active ? `rgba(99,202,183,${0.45 + (i % 3) * 0.18})` : "rgba(255,255,255,0.1)",
            height: active ? undefined : "3px",
            animation: active ? `viWave ${0.5 + (i % 6) * 0.09}s ease-in-out infinite alternate` : "none",
            animationDelay: `${(i * 0.04).toFixed(3)}s`,
          }}
        />
      ))}
    </div>
  );
}

function Timer({ seconds }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <span className="tabular-nums text-xs" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
      {mm}:{ss}
    </span>
  );
}

// ── VoiceInterview ────────────────────────────────────────────────────────────

/**
 * Props:
 *   question    {string}    Accepted but not rendered (parent already shows it)
 *   onComplete  {function}  ({ transcript, analytics }) — analytics hidden from UI
 *   maxSeconds  {number}    Hard recording cap (default 120)
 */
export default function VoiceInterview({
  question = "",   // kept for internal/future use
  onComplete,
  maxSeconds = 120,
}) {
  const [phase, setPhase]           = useState("idle"); // idle | recording | done
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [elapsed, setElapsed]       = useState(0);
  const [error, setError]           = useState(null);

  const recognitionRef      = useRef(null);
  const timerRef            = useRef(null);
  const startTimeRef        = useRef(null);
  const finalTranscriptRef  = useRef("");
  const analyticsRef        = useRef(null); // never surfaced in UI

  // Timer
  useEffect(() => {
    if (phase !== "recording") return;
    startTimeRef.current = Date.now() - elapsed * 1000;
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(secs);
      if (secs >= maxSeconds) stopRecording();
    }, 500);
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Speech recognition
  const setupRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Web Speech API unsupported. Use Chrome or Edge."); return null; }
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscriptRef.current += chunk + " ";
        else interim += chunk;
      }
      setTranscript(finalTranscriptRef.current);
      setInterimText(interim);
    };
    r.onerror = (e) => { if (e.error !== "no-speech") setError(`Mic error: ${e.error}`); };
    return r;
  }, []);

  const startRecording = useCallback(() => {
    setError(null);
    finalTranscriptRef.current = "";
    analyticsRef.current = null;
    setTranscript(""); setInterimText(""); setElapsed(0);
    const r = setupRecognition();
    if (!r) return;
    recognitionRef.current = r;
    try { r.start(); setPhase("recording"); }
    catch { setError("Could not access microphone. Allow mic permissions and retry."); }
  }, [setupRecognition]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    clearInterval(timerRef.current);
    const raw = (finalTranscriptRef.current + " " + interimText).trim();
    const secs = Math.max(elapsed, 1);
    const wordCount = (raw.match(/\b\w+\b/g) || []).length;
    const wpm = calcWPM(raw, secs);
    const { counts: fillerCounts, total: fillerTotal } = countFillers(raw);
    analyticsRef.current = { duration: secs, wordCount, wpm, fillerCounts, fillerTotal, confidence: calcConfidence(wpm, fillerTotal, wordCount) };
    setTranscript(raw); setInterimText(""); setPhase("done");
  }, [elapsed, interimText]);

  const handleUseAnswer = useCallback(() => {
    onComplete?.({ transcript, analytics: analyticsRef.current });
  }, [transcript, onComplete]);

  const reset = () => {
    setPhase("idle"); setTranscript(""); setInterimText(""); setElapsed(0); setError(null);
    finalTranscriptRef.current = ""; analyticsRef.current = null;
  };

  const hasText = transcript.trim().length > 0;

  return (
    <>
      <style>{`
        @keyframes viPulse  { 0% { transform:scale(1); opacity:.7; } 100% { transform:scale(2.4); opacity:0; } }
        @keyframes viWave   { from { height:3px; } to { height:18px; } }
        @keyframes viFadeUp { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .vi-fade-up { animation: viFadeUp 0.25s ease both; }
      `}</style>

      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          fontFamily: "'DM Sans','Inter',sans-serif",
        }}
      >
        {/* ── Transcript area (only when recording or done) ── */}
        {(phase === "recording" || phase === "done") && (
          <div
            className="px-4 pt-3 pb-2 vi-fade-up"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              style={{
                minHeight: "44px",
                maxHeight: "96px",
                overflowY: "auto",
              }}
            >
              {hasText || interimText ? (
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {transcript}
                  {interimText && (
                    <span style={{ color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
                      {" "}{interimText}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                  Listening…
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Toolbar row ── */}
        <div className="flex items-center gap-2 px-3 py-2.5">

          {/* Error */}
          {error && (
            <span className="flex-1 text-xs truncate vi-fade-up" style={{ color: "#fca5a5" }}>
              {error}
            </span>
          )}

          {/* IDLE — Start Recording */}
          {!error && phase === "idle" && (
            <button
              onClick={startRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg,#63cab7,#4db8a5)",
                color: "#0c1a18",
                boxShadow: "0 2px 12px rgba(99,202,183,0.28)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v7a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 9h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.92V21h3v2H8v-2h3v-2.08A7 7 0 0 1 5 12z" />
              </svg>
              Start Recording
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.12)" }} />
            </button>
          )}

          {/* RECORDING — pulse + waveform + timer + Stop */}
          {phase === "recording" && (
            <>
              <RecordingPulse />
              <div className="flex-1"><Waveform active /></div>
              <Timer seconds={elapsed} />
              <button
                onClick={stopRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ml-1"
                style={{
                  background: "rgba(248,113,113,0.12)",
                  border: "1px solid rgba(248,113,113,0.26)",
                  color: "#fca5a5",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                </svg>
                Stop
              </button>
            </>
          )}

          {/* DONE — waveform (static) + elapsed + Retry + Use Answer */}
          {phase === "done" && (
            <>
              <div className="flex-1"><Waveform active={false} /></div>
              <Timer seconds={elapsed} />
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M1 4v6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10" />
                  <path d="M23 20v-6h-6M3.51 15a9 9 0 0 0 14.85 3.36L23 14" />
                </svg>
                Retry
              </button>
              <button
                onClick={handleUseAnswer}
                disabled={!hasText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 relative overflow-hidden group disabled:opacity-35 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg,#7b9eff,#6b7ef0)",
                  color: "#fff",
                  boxShadow: hasText ? "0 2px 12px rgba(123,158,255,0.28)" : "none",
                }}
              >
                Use Answer
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.08)" }} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
