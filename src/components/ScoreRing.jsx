import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * ScoreRing — animated SVG circular progress indicator
 *
 * Props:
 *   score       {number}   0–100
 *   size        {number}   SVG width/height in px (default 140)
 *   stroke      {number}   Ring thickness (default 10)
 *   gradient    {string[]} Two-stop gradient colors (default cyan→purple)
 *   label       {string}   Text below the score number
 *   delay       {number}   Animation delay in seconds (default 0)
 *   fontSize    {number}   Score number font size (default 32)
 */
export default function ScoreRing({
  score = 0,
  size = 140,
  stroke = 10,
  gradient = ["#22d3ee", "#a855f7"],
  label = "",
  delay = 0,
  fontSize = 32,
}) {
  const id = useRef(`ring-${Math.random().toString(36).slice(2, 8)}`).current;

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const dashOffset = useTransform(
    progress,
    [0, 100],
    [circumference, circumference - (circumference * score) / 100]
  );

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [score, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
          <filter id={`${id}-glow`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />

        {/* Progress arc */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          filter={`url(#${id}-glow)`}
        />
      </svg>

      {/* Score label — rendered outside SVG so text stays upright */}
      <div
        className="flex flex-col items-center"
        style={{ marginTop: -(size + 8), height: size }}
      >
        <div className="flex items-center justify-center w-full h-full flex-col">
          <motion.span
            className="font-black tabular-nums"
            style={{
              fontSize,
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            <CountUp to={score} delay={delay} />%
          </motion.span>
          {label && (
            <span
              className="text-xs font-medium tracking-widest uppercase mt-1"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated number counter */
function CountUp({ to, delay = 0 }) {
  const val = useMotionValue(0);
  const rounded = useTransform(val, (v) => Math.round(v));
  const displayRef = useRef(null);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (displayRef.current) displayRef.current.textContent = v;
    });
    const controls = animate(val, to, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [to, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={displayRef}>0</span>;
}
