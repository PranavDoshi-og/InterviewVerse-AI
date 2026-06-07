import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Setup from "./pages/Setup"
import Interview from "./pages/Interview"
import Results from "./pages/Results"
import History from "./pages/History";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/setup" element={<Setup />} />

        <Route path="/interview" element={<Interview />} />

        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App