import { motion } from "framer-motion";

/**
 * ScoreCard — glassmorphism metric card with animated progress bar
 *
 * Props:
 *   title       {string}     Label
 *   score       {number}     0–100
 *   icon        {ReactNode}  Lucide or custom icon
 *   gradient    {string[]}   Two-stop gradient for bar ["#color1","#color2"]
 *   delay       {number}     Framer Motion stagger delay
 *   accent      {string}     Icon accent color (tailwind or hex)
 */
export default function ScoreCard({
  title,
  score = 0,
  icon,
  gradient = ["#22d3ee", "#a855f7"],
  delay = 0,
  accent = "#22d3ee",
}) {
  const scoreColor =
    score >= 80 ? "#4ade80" : score >= 60 ? "#facc15" : "#f87171";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="rounded-2xl p-6 flex flex-col gap-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
          }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <span
          className="text-3xl font-black tabular-nums"
          style={{ color: scoreColor }}
        >
          {score}
          <span className="text-base font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
            %
          </span>
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
        {title}
      </p>

      {/* Progress bar */}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 5, background: "rgba(255,255,255,0.07)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
            borderRadius: 99,
            boxShadow: `0 0 8px ${gradient[0]}60`,
          }}
        />
      </div>
    </motion.div>
  );
}
