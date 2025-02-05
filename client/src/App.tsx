import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router"; // Use 'react-router-dom' instead of 'react-router'
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
import AdminDashboard from "./pages/AdminPanel";
import Montana from "./components/StaggerAnimation";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const navTimer = setTimeout(() => {
      setShowNav(true);
    }, 7500); // Show Navbar after 7200 milliseconds

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <Router>
      {!isAdminRoute && <AudioPlayer />}
      <div className={isLoading ? "hidden" : ""}>
        {!isAdminRoute && showNav && <Navbar />} {/* Render Navbar correctly */}
        <main>
          <Routes>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/" element={<Montana />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/team" element={<Team />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/testing" element={<Montana />} />
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </main>
        {!isAdminRoute && showNav && <Footer />}
      </div>
    </Router>
  );
}

export default App;