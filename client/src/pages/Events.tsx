import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
// import Ninja from "../assets/Ninja.png";
import BackgroundImage from "../assets/cherryBlossom.png"; // Add your portrait image
import Loader from "../components/Loader";

const Events = () => {
  interface Event {
    title: string;
    category: string;
    date: string;
    description: string;
    details: string;
  }

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  // Wait for loader to complete before showing content
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3200); // 2000ms for loader + 1500ms for transition
    return () => clearTimeout(timer);
  }, []);
  const events = [
    // CULTURAL CLUB - DANCE
    {
      title: "Solo Sizzle",
      category: "Dance",
      date: "Mar 18",
      description:
        "Get ready for a mesmerizing celebration of rhythm, grace, and unparalleled talent! Apoorv 25  proudly presents the Solo Sizzle,where individual performers take center stage to showcase their passion and prowess in a dance extravaganza like never before. It's not just a dance, it's a canvas for self expression and innovation.",
      details:
        "Dancers take the stage to showcase their passion and prowess in a breathtaking solo dance performance.",
    },
    {
      title: "Pulse and Beats",
      category: "Dance",
      date: "Mar 19",
      description:
        "Experience the beauty and power of dance at  Apoorv 25's PULSE AND BEATS! With stunning costumes and mesmerizing lighting, the stage will burst with color and energy, transport us to a realm of pure artistic expression.Our group dancing event is jam-packed with addictive music and high-energy dances.",
      details:
        "Teams will set the stage on fire with synchronized choreography, dynamic energy, and captivating storytelling through dance.",
    },
    {
      title: "Ultimate Dance Showdown",
      category: "Dance",
      date: "Mar 20",
      description:
        "The Ultimate Dance Showdown is a high-energy event where teams of five showcase their dance prowess. Each team must include a minimum of one female member. Prepare for an electrifying competition filled with diverse talents and creative spot choreography.Compete in a high-energy dance battle for the title of ultimate champions.",
      details:
        "Each team of five, including at least one female member, will face off in a dynamic dance competition featuring diverse styles and creativity.",
    },

    // CULTURAL CLUB - MUSIC
    {
      title: "Beyond the Harmony",
      category: "Music",
      date: "Mar 21",
      description:
        "Beyond the Harmony - Apoorv 25 ! Ready to let your voice shine at Beyond the Harmony? This is your stage to showcase your vocal talent and unleash your creativity. Whether you're a beginner or a pro, it's your time to shine!The event offers a chance to perform, win exciting prizes , and be part of an inspiring and captivating musical experience.",
      details:
        "Step up, grab the mic, and let your voice shine in this inspiring and captivating musical experience!",
    },
    {
      title: "Strings and Keys",
      category: "Music",
      date: "Mar 22",
      description:
        "Strings and Keys -Apoorv '25! Get ready to showcase your talent at Strings and Keys—Apoorv's instrumental competition!Whether you're a beginner or a pro, this is your chance to let your music shine.Open to all music lovers, the event offers exciting prizes, a stage to perform, and an experience to remember.",
      details:
        "Whether you're a beginner or a pro, this event offers you the chance to showcase your instrumental skills and win exciting prizes.",
    },

    // CULTURAL CLUB - DRAMA
    {
      title: "Stage Buster",
      category: "Drama",
      date: "Mar 23",
      description:
        "Experience the thrill of cinema live on stage! In this team-based event, 2-3 members recreate iconic movie scenes and embody unforgettable characters. With rounds focusing on scene recreation and character impersonation, participants showcase their creativity, acting skills, and love for storytelling.",
      details:
        "Teams of 2-3 members will bring cinematic magic to life, showcasing their acting skills and storytelling abilities.",
    },

    // CULTURAL CLUB - ART
    {
      title: "Printscapes",
      category: "Art",
      date: "Mar 24",
      description:
        "Dive into a world where ink dances with imagination and every print tells a story. Explore the magic of monoprinting, where no two artworks are ever the same.With each press, textures come alive, colors collide, and unexpected beauty emerges. Embrace the unpredictable and transform it into art. Create, discover, and leave your mark.",
      details:
        "Experiment with textures and colors as you bring your creative vision to life through the unpredictable magic of printmaking.",
    },
    {
      title: "Face Off",
      category: "Art",
      date: "Mar 25",
      description:
        "Transform faces into living canvases! Our face painting competition is a colorful celebration of artistic talent.Brush, blend, and bring your imagination to life on the human face.From whimsical designs to intricate details, let your face painting artistry shine.Join us for a lively contest where creativity knows no bounds. ",
      details:
        "Unleash your creativity and transform faces with vibrant colors, intricate details, and captivating designs.",
    },
    //FASHION CLUB
    {
      title: "Vogue Fusion",
      category: "Fashion",
      date: "Mar 25",
      description:
        "The Vogue Fusion -APOORV 25!Gear up to dazzle the world with your talent!The fusion wear combines elements from different cultures and eras, creating unique and versatile outfits.The vogue fusion is the chance to show your unique fusion of different styles and let people be amazed with your outfits.Lets add beauty to the apoorv and light up our campus with our outfits",
      details:
        "Unleash your creativity and transform faces with vibrant colors, intricate details, and captivating designs.",
    },
    //CINEVEDIKA
    {
      title: "48-Hour Flicks",
      category: "Short Film",
      duration: "48 hours",
      date: "Mar 25",
      description:
        "An electrifying challenge where teams race against time to script, shoot, and edit a short film in just 48 hours!",
      details: "Think fast, film faster, and make every second count!",
    },
    {
      title: "Reel to Real: Character Comeback",
      category: "Acting",
      date: "Mar 25",
      description:
        "A stage for movie lovers to bring their favorite characters to life!",
      details: "Step into the spotlight and celebrate the magic of cinema",
    },
    // TECH CLUB
    {
      title: "Hackoona Matata",
      category: "Hackathon",
      date: "Mar 26",
      description:
        "Hackoona Matata is an exhilarating hackathon where teams of 4-5 participants come together to solve problem statements across various elds like tech, healthcare,sustainability, and more. In race against time, teams collaborate to build innovative solutions, showcase their skills, and pitch their ideas to expert judges.",
      details:
        "Collaborate, code, and create groundbreaking projects across various domains like tech, healthcare, and sustainability.",
    },
    {
      title: "Last Bot Standing",
      category: "Robotics",
      date: "Mar 27",
      description:
        "Welcome to the ultimate bot battle royale—where only the strongest, smartest, and most savage survive! Build, program, and unleash your robot into the combat arena, where it will face off against others in a no-holds-barred mechanical showdown. Outmaneuver, outthink, and outlast your opponents until only one bot remains victorious!",
      details:
        "Design, build, and program your robot to outmaneuver and outlast the competition in this thrilling mechanical showdown.",
    },
    {
      title: "Break It to Make It",
      category: "Tech Challenge",
      date: "Mar 28",
      description:
        "Break it down, crack the code, and rebuild it better! In this brain-melting challenge, you’ll be given a mysterious electronic circuit and tasked with reverse-engineering its secrets.With only a simulation tool and your wits, you must decode, reconstruct, and prove your hacker-level hardware skills. If you love puzzles, this is your playground!",
      details:
        "Use your problem-solving skills and simulation tools to crack the code and prove your hardware expertise.",
    },
    {
      title: "Chaos by Design",
      category: "Tech Challenge",
      date: "Mar 28",
      description:
        "Welcome to the dark side of design! In this chaotically cursed competition, your mission is to create the most frustratingly functional user interface ever seen. Think buttons that run away, pop-ups that never close, and passwords that change as you type—all in the name of beautifully bad UX. Make the judges suffer,make them laugh, and prove you truly understand how NOT to design a UI",
      details:
        "Use your problem-solving skills and simulation tools to crack the code and prove your hardware expertise.",
    },
    {
      title: "Digital Detective Hunt",
      category: "Tech Challenge",
      date: "Mar 28",
      description:
        "Step into the shoes of a cyber detective in this thrilling hunt to uncover the identity of an anonymous target! Armed with clues and basic yet powerful cyber tools, you'll navigate thedigital world to track down the mystery person. Decode, analyze, and investigate like a pro, all while honing your cybersecurity skills. Get ready to uncover secrets and feel like a true cyber sleuth!",
      details:
        "Use your problem-solving skills and simulation tools to crack the code and prove your hardware expertise.",
    },

    // SPORTS CLUB
    {
      title: "Valorant Showdown",
      category: "E-Sports",
      date: "Mar 29",
      description:
        "An adrenaline-pumping Valorant tournament featuring top teams competing for glory!",
      details:
        "Teams will battle it out in high-stakes matches, showcasing their strategy, communication, and precision.",
    },
    {
      title: "Free Fire Frenzy",
      category: "E-Sports",
      date: "Mar 30",
      description:
        "An intense Free Fire tournament where teams compete in fast-paced survival battles!",
      details:
        "With strategy, precision, and teamwork, only the best will claim victory in this electrifying gaming event.",
    },
    {
      title: "BGMI Blitz",
      category: "E-Sports",
      date: "Mar 31",
      description:
        "A high-stakes BGMI competition where players showcase their skills and battle for dominance!",
      details:
        "Join teams from around the world as they fight for supremacy in this competitive gaming showdown.",
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
        className="relative w-full max-w-[800px] min-h-[300px] 
        bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] 
        rounded-2xl                  
        border-8 border-red-900/30 
        shadow-2xl shadow-red-900/40 
        overflow-hidden"
        initial={{
          origin: "bottom center",
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
          <div
            className="absolute inset-2 border-4 border-dashed border-red-900/20 
            rounded-xl"
          ></div>
          <div
            className="absolute inset-6 border-2 border-solid border-red-900/10 
            rounded-xl"
          ></div>
        </div>

        {/* Cute Ninja Cartoon - Commented out for now */}
        {/* <img 
          src={Ninja} 
          alt="Ninja Cartoon" 
          className="absolute bottom-6 w-42 h-32" 
        /> */}

        {/* Modal Content */}
        <div className="relative py-8 px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <h2
              className="text-3xl md:text-6xl font-gang mb-4 md:mb-6 text-red-500 font-bold 
              drop-shadow-[0_0_10px_rgba(255,26,26,0.3)]
              bg-white/5 px-4 md:px-6 py-2 rounded-xl"
            >
              {event.title}
            </h2>
            <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6 text-white">
              <span className="font-gang text-base md:text-xl text-red-400 bg-white/10 px-3 md:px-4 py-1 md:py-2 rounded-full">
                {event.category}
              </span>
              <span className="font-gang text-base md:text-xl text-white/70 bg-white/10 px-3 md:px-4 py-1 md:py-2 rounded-full">
                {event.date}
              </span>
            </div>
            <p
              className="font-gang text-base md:text-2xl text-white/80 max-w-2xl mb-4 
              bg-white/5 px-4 md:px-6 py-2 md:py-4 rounded-xl"
            >
              {event.description}
            </p>
            <p
              className="font-gang text-sm md:text-xl text-white/60 max-w-2xl
              bg-white/5 px-4 md:px-6 py-2 md:py-4 rounded-xl"
            >
              {event.details}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  return (
    <div className="relative min-h-screen bg-black">
      <Loader />

      {/* Background Image Container */}
      {contentVisible && (
        <div
          className="fixed inset-0 bg-cover bg-no-repeat bg-right opacity-40"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "50%",
            backgroundPosition: "right center",
            filter: "brightness(120%)",
            zIndex: 0,
          }}
        ></div>
      )}

      {/* Enhanced Responsive Background Image Adjustments */}
      <style>
        {`
          @media (max-width: 1024px) {
            div[style*="background-size: 50%"] {
              background-size: 70%;
              background-position: right center;
            }
          }
          @media (max-width: 768px) {
            div[style*="background-size: 50%"] {
              background-size: cover !important;
              background-position: center center !important;
              width: 100% !important;
              height: 100% !important;
            }
          }
          @media (max-width: 480px) {
            div[style*="background-size: 10%"] {
              background-size: 50%;
              background-position: center center !important;
              transform: scale(1.1);
            }
          }
        `}
      </style>

      {/* Scrollable Content Container with Fade In Animation */}
      <AnimatePresence>
        {contentVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-gang text-5xl text-white mb-8 text-center relative z-10"
            >
              BATTLE<span className="text-red-500">.</span>GROUNDS
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: Math.random() > 0.5 ? 2 : -2,
                    transition: { duration: 0.2 },
                  }}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white/5 backdrop-blur-lg p-6 sm:p-8 rounded-xl border border-white/10 cursor-pointer hover:border-red-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <h3 className="font-gang text-xl sm:text-2xl text-white">
                      {event.title}
                    </h3>
                    <span className="font-gang text-red-500">{event.date}</span>
                  </div>
                  <p className="font-gang text-gray-400 mb-4">
                    {event.category}
                  </p>
                  <div className="w-full py-2 sm:py-3 bg-red-500/20 text-red-500 rounded-lg text-center">
                    View Details
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
