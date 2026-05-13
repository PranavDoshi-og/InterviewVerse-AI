import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Setup from "./pages/Setup"
import Interview from "./pages/Interview"
import Results from "./pages/Results"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/setup" element={<Setup />} />

        <Route path="/interview" element={<Interview />} />

        <Route path="/results" element={<Results />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App