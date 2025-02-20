// src/pages/Home.jsx
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { CherryBlossom } from "../components/CherryBlossom";
import gate from "../assets/gate.png";
import { Link } from "react-router";
import Loader from "../components/Loader";

const Home = () => {
  const titleMap = [
    { jp: 'ア', en: 'A' },
    { jp: 'プ', en: 'P' },
    { jp: 'ー', en: 'O' },
    { jp: 'ル', en: 'O' },
    { jp: 'ヴ', en: 'R' },
    { jp: ' ', en: 'V' },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 -top-10 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/30">
          <img 
            src={gate} 
            alt="Torii Gate" 
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(80%) brightness(120%)" }}
          />
        </div>
        <CherryBlossom />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center text-center px-8 py-24">
          <div className="max-w-4xl mx-auto w-full">
            {/* Title Section */}
            <div className="mb-12 relative h-40">
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                {/* Main Title */}
                <div className="flex items-baseline gap-2">
                  {titleMap.map((char, index) => (
                    <span
                      key={index}
                      className="font-gang text-5xl md:text-6xl text-white"
                    >
                      {char.en}
                    </span>
                  ))}
                  <span className="font-gang text-5xl md:text-4xl text-red-500">
                    2025
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-1 bg-red-500 w-48 mx-auto mb-12" />

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-gang text-lg md:text-xl text-gray-400 mb-16"
            >
              We are a global community of warriors, craftsmen, and visionaries. 
              Our mission is to preserve ancient traditions and forge new legacies. 
              Join us in the quest to unlock the secrets of the future.
            </motion.p>

            {/* CTA Button */}
            <Link to="/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white font-gang px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-red-500/30 transition-all"
              >
              Embrace the Challenge
            </motion.button>
              </Link>
          </div>
        </main>

        {/* Continuous Marquee Footer */}
      </div>
    </div>
  );
};

export default Home;
