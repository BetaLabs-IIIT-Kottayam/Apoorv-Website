import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Ninja from "../assets/Ninja.png";

const Events = () => {
  interface Event {
    title: string;
    category: string;
    date: string;
    description: string;
    details: string;
  }

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events = [
    {
      title: "Code Katana",
      category: "Tech",
      date: "Mar 15",
      description:
        "A coding competition where developers showcase their programming prowess through intense challenges.",
      details:
        "Participants will solve complex algorithmic problems, demonstrating speed, efficiency, and innovative problem-solving skills.",
    },
    {
      title: "Robo Ronin",
      category: "Robotics",
      date: "Mar 16",
      description:
        "An epic robotics tournament featuring cutting-edge autonomous and remote-controlled robots.",
      details:
        "Teams design and battle advanced robotic systems in multiple challenge categories.",
    },
    {
      title: "Digital Dojo",
      category: "Workshop",
      date: "Mar 17",
      description:
        "Intensive technical workshops for skill enhancement and technological learning.",
      details:
        "Expert-led sessions covering emerging technologies, hands-on coding, and professional development.",
    },
  ];

  const FanModal = ({
    event,
    onClose,
  }: {
    event: Event;
    onClose: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.div
        className="relative w-[800px] h-[500px] 
        bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] 
        rounded-t-[400px] rounded-b-2xl 
        border-8 border-red-900/30 
        shadow-2xl shadow-red-900/40 
        overflow-hidden"
        initial={{
          scale: 0.5,
          transformOrigin: "bottom center",
          rotate: -20,
          skew: 10,
        }}
        animate={{
          scale: 1,
          rotate: 0,
          skew: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Elegant Border Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-2 border-4 border-dashed border-red-900/20 rounded-t-[380px] rounded-b-xl"></div>
          <div className="absolute inset-6 border-2 border-solid border-red-900/10 rounded-t-[360px] rounded-b-xl"></div>
        </div>

        {/* Cute Ninja Cartoon */}
        {/* <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: [0, -5, 5, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="absolute bottom-4 right-1 w-32 h-32"
        > */}
          <img src={Ninja} alt="Ninja Cartoon" className="absolute bottom-6 w-42 h-32" />
        {/* </motion.div> */}

        {/* Rest of the modal content remains the same */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
          <h2
            className="text-6xl font-gang mb-6 text-red-500 font-bold 
            drop-shadow-[0_0_10px_rgba(255,26,26,0.3)]
            bg-white/5 px-6 py-2 rounded-xl"
          >
            {event.title}
          </h2>
          <div className="flex justify-center gap-8 mb-6 text-white">
            <span className="font-gang text-xl text-red-400 bg-white/10 px-4 py-2 rounded-full">
              {event.category}
            </span>
            <span className="font-gang text-xl text-white/70 bg-white/10 px-4 py-2 rounded-full">
              {event.date}
            </span>
          </div>
          <p
            className="font-gang text-2xl text-white/80 max-w-2xl mb-4 
            bg-white/5 px-6 py-4 rounded-xl"
          >
            {event.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-gang text-5xl text-white mb-16 text-center"
        >
          Battlegrounds
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                rotate: Math.random() > 0.5 ? 2 : -2,
                transition: { duration: 0.2 },
              }}
              onClick={() => setSelectedEvent(event)}
              className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/10 cursor-pointer hover:border-red-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-gang text-2xl text-white">{event.title}</h3>
                <span className="font-gang text-red-500">{event.date}</span>
              </div>
              <p className="font-gang text-gray-400 mb-4">{event.category}</p>
              <div className="w-full py-3 bg-red-500/20 text-red-500 rounded-lg text-center">
                View Details
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <FanModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
