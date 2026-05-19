import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Interview() {

  const navigate = useNavigate();

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "question",
      text: "Tell me about yourself."
    }
  ]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  // Generate next AI question
  const generateQuestion = async () => {

    if (answer.trim() === "") return;

    const updatedMessages = [
      ...messages,
      {
        type: "answer",
        text: answer
      }
    ];

    setMessages(updatedMessages);

    const currentAnswer = answer;

    setAnswer("");

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/generate-question",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            answer: currentAnswer,
            role: "Frontend Developer"
          })
        }
      );

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          type: "question",
          text: data.question
        }
      ]);

    } catch (error) {

      console.log(error);

      setMessages([
        ...updatedMessages,
        {
          type: "question",
          text: "Error generating question."
        }
      ]);
    }

    setLoading(false);
  };

  // Generate AI feedback report
  const generateFeedback = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/generate-feedback",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            messages: messages
          })
        }
      );

      const data = await response.json();

      console.log(data);

      localStorage.setItem(
        "interviewFeedback",
        JSON.stringify(data)
      );

      navigate("/results");

    } catch (error) {

      console.log(error);

    }

    setLoading(false);
  };

  // Enter key
  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      generateQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>

      </div>

      {/* Sidebar */}
      <div className="w-[320px] border-r border-white/10 backdrop-blur-xl bg-white/5 p-8 flex flex-col justify-between z-10">

        <div>

          <Link to="/setup">
            <button className="text-gray-400 hover:text-white transition mb-10">
              ← Back
            </button>
          </Link>

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-2xl shadow-blue-500/40 animate-pulse">
              AI
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                FinalRound AI
              </h1>

              <p className="text-gray-400 text-sm">
                Smart Interview Simulator
              </p>
            </div>

          </div>

          {/* Interview Status */}
          <div className="mt-12 space-y-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">
                Role
              </p>

              <h2 className="font-semibold text-lg">
                Frontend Developer
              </h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">
                Questions Asked
              </p>

              <h2 className="font-semibold text-lg">
                {messages.filter(msg => msg.type === "question").length}
              </h2>
            </div>

          </div>

        </div>

        <div className="text-gray-500 text-sm">
          Powered by AI Interview Intelligence
        </div>

      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col z-10">

        {/* Header */}
        <div className="border-b border-white/10 backdrop-blur-xl bg-white/5 px-8 py-5 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">
              Live Interview Session
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Conversational AI Recruiter Experience
            </p>
          </div>

          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">

            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>

            <span className="text-green-300 text-sm font-medium">
              AI Active
            </span>

          </div>

        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.type === "answer"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-2xl px-6 py-5 rounded-3xl shadow-2xl ${
                  msg.type === "question"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-bl-md"
                    : "bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-br-md"
                }`}
              >

                <p className="text-sm opacity-70 mb-2">
                  {msg.type === "question"
                    ? "AI Interviewer"
                    : "You"}
                </p>

                <p className="leading-relaxed text-[15px] whitespace-pre-wrap">
                  {msg.text}
                </p>

              </div>

            </div>

          ))}

          {/* Loading */}
          {loading && (

            <div className="flex justify-start">

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-5 rounded-3xl rounded-bl-md shadow-2xl">

                <p className="text-sm opacity-70 mb-3">
                  AI Interviewer
                </p>

                <div className="flex gap-2">

                  <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>

                  <div className="w-3 h-3 rounded-full bg-white animate-bounce delay-100"></div>

                  <div className="w-3 h-3 rounded-full bg-white animate-bounce delay-200"></div>

                </div>

              </div>

            </div>
          )}

          <div ref={messagesEndRef}></div>

        </div>

        {/* Input */}
        <div className="border-t border-white/10 backdrop-blur-xl bg-white/5 p-6">

          <div className="flex gap-4 items-end">

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="flex-1 bg-white/10 border border-white/10 rounded-3xl px-6 py-5 outline-none resize-none text-white placeholder-gray-400"
              rows="3"
            />

            <button
              onClick={generateQuestion}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition duration-300 px-8 py-5 rounded-3xl font-semibold shadow-2xl"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

            <button
              onClick={generateFeedback}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 transition duration-300 px-8 py-5 rounded-3xl font-semibold shadow-2xl"
            >
              Finish Interview
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview;