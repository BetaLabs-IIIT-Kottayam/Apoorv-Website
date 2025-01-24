// src/pages/Home.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { CherryBlossom } from "../components/CherryBlossom";
import gate from "../assets/gate.png";

const Home = () => {
  const [typingState, setTypingState] = useState({
    currentIndex: 0,
    showEnglish: false,
    showYear: false,
    showJapaneseSubtitle: false
  });

  const titleMap = [
    { jp: 'ア', en: 'A' },
    { jp: 'プ', en: 'P' },
    { jp: 'ー', en: 'O' },
    { jp: 'ル', en: 'O' },
    { jp: 'ヴ', en: 'R' },
    { jp: ' ', en: 'V' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (typingState.currentIndex < titleMap.length) {
        setTypingState(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1
        }));
      } else if (!typingState.showEnglish) {
        setTypingState(prev => ({ 
          ...prev, 
          showEnglish: true,
          showYear: true 
        }));
        setTimeout(() => {
          setTypingState(prev => ({ ...prev, showJapaneseSubtitle: true }));
        }, 500);
      }
    }, 202.5);

    return () => clearInterval(timer);
  }, [typingState, titleMap.length]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0">
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
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotateX: 90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      transition={{ delay: index * 0.2025 }}
                    >
                      <AnimatePresence>
                        {index <= typingState.currentIndex && (
                          <motion.span
                            key={`char-${index}`}
                            className="font-gang text-5xl md:text-6xl text-white"
                          >
                            {typingState.showEnglish ? char.en : char.jp}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  {typingState.showYear && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-gang text-5xl md:text-4xl text-red-500"
                    >
                      2025
                    </motion.span>
                  )}
                </div>

                {/* Japanese Subtitle */}
                {/* <AnimatePresence>
                  {typingState.showJapaneseSubtitle && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-gang text-2xl md:text-3xl text-gray-300"
                    >
                      {titleMap.map(char => char.jp).join('')} 2025
                    </motion.div>
                  )}
                </AnimatePresence> */}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white font-gang px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-red-500/30 transition-all"
            >
              Embrace the Challenge
            </motion.button>
          </div>
        </main>

        {/* Continuous Marquee Footer */}
        <motion.footer 
          className="fixed bottom-0 w-full bg-black/80 border-t border-red-500/30 py-3 overflow-hidden"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="relative flex overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="flex items-center mx-8">
                  <span className="text-red-500 font-gang mx-2">⚔</span>
                  <span className="text-white font-gang">
                    CRAFTED BY APOORV CORE TEAM 2025 - 侍 CODE - 
                  </span>
                  <span className="text-red-500 font-gang mx-2">⚔</span>
                </span>
              ))}
            </div>
            
            {/* Duplicate for seamless loop */}
            <div className="animate-marquee absolute top-0 whitespace-nowrap flex items-center">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="flex items-center mx-8">
                  <span className="text-red-500 font-gang mx-2">⚔</span>
                  <span className="text-white font-gang">
                    CRAFTED BY APOORV CORE TEAM 2025 - 侍 CODE - 
                  </span>
                  <span className="text-red-500 font-gang mx-2">⚔</span>
                </span>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;