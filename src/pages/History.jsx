import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const History = () => {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const storedHistory =
      JSON.parse(
        localStorage.getItem("interviewHistory")
      ) || [];

    setHistory(storedHistory);

  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          Interview History
        </h1>

        <p className="text-zinc-400 mb-12">
          Track your interview performance and growth.
        </p>

        <div className="space-y-6">

          {history.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8"
            >

              <div className="flex flex-col md:flex-row justify-between gap-6">

                <div>

                  <h2 className="text-2xl font-bold mb-2">
                    {item.role}
                  </h2>

                  <p className="text-zinc-400">
                    {item.date}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-zinc-400 mb-2">
                    Overall Score
                  </p>

                  <h2 className="text-5xl font-bold text-cyan-400">
                    {item.score}%
                  </h2>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default History;