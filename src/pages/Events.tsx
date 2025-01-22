// src/pages/Events.jsx
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { CherryBlossom } from "../components/CherryBlossom";

const Events = () => {
  const events = [
    { title: "Code Katana", category: "Tech", date: "Mar 15" },
    { title: "Robo Ronin", category: "Robotics", date: "Mar 16" },
    { title: "Digital Dojo", category: "Workshop", date: "Mar 17" },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CherryBlossom />
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-akira text-5xl text-white mb-16 text-center"
        >
          Battlegrounds
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-shippori text-2xl text-white">{event.title}</h3>
                <span className="font-inter text-red-500">{event.date}</span>
              </div>
              <p className="font-inter text-gray-400 mb-4">{event.category}</p>
              <button className="w-full py-3 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition">
                Learn More
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Events;