import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Developers from "./pages/Developers";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Merch from "./pages/Merch";
import Notfound from "./pages/Notfound";
import Sponsors from "./pages/Sponsors";
import Team from "./pages/Team";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isAdminRoute = window.location.pathname.startsWith("/admin");
  return (
    <Router>
      {!isAdminRoute && <AudioPlayer />}
      <div className={isLoading ? "hidden" : ""}>
        {!isAdminRoute && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/team" element={<Team />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </Router>
  );
}

export default App;
