import { useEffect, useRef } from "react";

function ChatBubble({ msg, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Trigger CSS fade-in
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  const isAI = msg.type === "question";

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: isAI ? "translateY(10px)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        transitionDelay: `${Math.min(index * 40, 200)}ms`,
      }}
      className={`flex items-end gap-3 ${isAI ? "justify-start" : "justify-end"}`}
    >
      {/* AI Avatar */}
      {isAI && (
        <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/20 mb-1">
          AI
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[70%]">
        <p className={`text-[10px] font-medium tracking-wider uppercase ${isAI ? "text-cyan-400/70 ml-1" : "text-purple-300/70 text-right mr-1"}`}>
          {isAI ? "AI Interviewer" : "You"}
        </p>

        <div
          className={`px-5 py-4 shadow-2xl ${
            isAI
              ? "bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/20 rounded-3xl rounded-bl-md backdrop-blur-xl"
              : "bg-white/10 border border-white/10 rounded-3xl rounded-br-md backdrop-blur-xl"
          }`}
        >
          {isAI && (
            <div className="flex gap-1 items-center mb-2">
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              <div className="w-1 h-1 rounded-full bg-blue-400" />
              <div className="w-1 h-1 rounded-full bg-purple-400" />
            </div>
          )}
          <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap">
            {msg.text}
          </p>
        </div>
      </div>

      {/* User Avatar */}
      {!isAI && (
        <div className="w-8 h-8 shrink-0 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-gray-300 mb-1">
          You
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
