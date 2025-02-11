import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Montana from "./components/StaggerAnimation";
import Developers from "./pages/Developers";
import Events from "./pages/Events";
import Merch from "./pages/Merch";
import Notfound from "./pages/Notfound";
import Sponsors from "./pages/Sponsors";
import Team from "./pages/Team";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import Cancellation from "./pages/Cancellation";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const navTimer = setTimeout(() => {
      setShowNav(true);
    }, 75); // Show Navbar after 7200 milliseconds

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
            <Route path="/" element={<Montana />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/team" element={<Team />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/shipping-policy" element={<Shipping />} />
            <Route path="/cancellation-refund" element={<Cancellation />} />
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