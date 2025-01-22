import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Sponsors from "./pages/Sponsors";
import Team from "./pages/Team";
import Developers from "./pages/Developers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/team" element={<Team />} />
        <Route path="/developers" element={<Developers />} />
      </Routes>
    </Router>
  );
}

export default App;