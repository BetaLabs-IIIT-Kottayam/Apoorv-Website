import { Route, BrowserRouter as Router, Routes } from "react-router";
import Developers from "./pages/Developers";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import Sponsors from "./pages/Sponsors";
import Team from "./pages/Team";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AudioPlayer from "./components/AudioPlayer";
// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <AudioPlayer />
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/team" element={<Team />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
