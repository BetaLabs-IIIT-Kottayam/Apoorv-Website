import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
// import Ninja from "../assets/Ninja.png";
import BackgroundImage from "../assets/cherryBlossom.png";
import Loader from "../components/Loader";

const Events = () => {
  interface Event {
    title: string;
    category: string;
    description: string;
    details: string;
  }

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Wait for loader to complete before showing content
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3200); // 2000ms for loader + 1500ms for transition
    return () => clearTimeout(timer);
  }, []);
  
  const events = [
    {
        "title": "Solo Sizzle",
        "description": "Get ready for a mesmerizing celebration of rhythm, grace, and unparalleled talent! Apoorv'25  proudly presents the Solo Sizzle,\nwhere individual performers take center stage to showcase their passion and prowess in a dance extravaganza like never before. \nIt's not just a dance, it's a camvas for self expression and innovation.",
        "category": "Dance",
        "details": "https://makemypass.com/solosizzle"
    },
    {
        "title": "Pulse and Beats",
        "description": "Experience the beauty and power of dance at  Apoorv'25's PULSE AND BEATS! With stunning costumes and mesmerizing \nlighting, the stage will burst with color and energy, transport us to a realm of pure artistic expression.\nOur group dancing event is jam-packed with addictive music and high-energy dances.",
        "category": "Dance",
        "details": "https://makemypass.com/pulse-and-beats"
    },
    {
        "title": "Ultimate Dance Showdown",
        "description": "The Ultimate Dance Showdown is a high-energy event where teams of five showcase their dance prowess. \nEach team must include a minimum of one female member. Prepare for an electrifying competition filled \nwith diverse talents and creative spot choreography.Compete in a high-energy dance battle for the title of ultimate champions.",
        "category": "Dance",
        "details": "https://makemypass.com/ultimate-dance-showdown"
    },
    {
        "title": "Stage Buster",
        "description": "Experience the thrill of cinema live on stage! In this team-based event, 2-3 members recreate iconic movie scenes and embody unforgettable characters. \nWith rounds focusing on scene recreation and character impersonation, participants showcase their creativity, acting skills, and love for storytelling.",
        "category": "Art",
        "details": "https://makemypass.com/stage-buster"
    },
    // {
    //     "title": "Cinephile",
    //     "description": "Join the ultimate movie trivia challenge at Apoorv Cinephile! Over three days, approach random people and ask quirky questions about movies. \nTest your knowledge, share fun facts, and enjoy the surprises along the way!",
    //     "category": "Quiz",
    //     "details": "Link not available."
    // },
    {
        "title": "48 Hours Flicks",
        "description": "Cinevedika presents \"48-Hour Flicks\" at Apoorv'25—an electrifying challenge where teams race against time to script, shoot, and edit a short film in just 48 hours! \nForm your team, receive a unique concept at registration, and bring your creative vision to life. Think fast, film faster, and make every second count!",
        "category": "Art",
        "details": "https://makemypass.com/48-hour-flicks"
    },
    {
        "title": "Reel to Real",
        "description": "Apoorv'25 presents \"Reel to Real: Character Comeback\"—a stage for movie lovers to bring their favorite characters to life! \nDress up, deliver an iconic dialogue, and showcase your acting skills for exciting prizes. Whether hero or villain, step into the spotlight and celebrate the magic of cinema. ",
        "category": "General",
        "details": "https://makemypass.com/reel-to-real"
    },
    {
        "title": "Printscapes",
        "description": "Dive into a world where ink dances with imagination and every print tells a story. Explore the magic of monoprinting, where no two artworks are ever the same.\nWith each press, textures come alive, colors collide, and unexpected beauty emerges. Embrace the unpredictable and transform it into art. Create, discover, and leave your mark.",
        "category": "Dance",
        "details": "https://makemypass.com/print-scapes"
    },
    {
        "title": "Face off",
        "description": "Transform faces into living canvases! \nOur face painting competition is a colorful celebration of artistic talent.Brush, blend, and bring your imagination to life on the human face.\nFrom whimsical designs to intricate details, let your face painting artistry shine.Join us for a lively contest where creativity knows no bounds. ",
        "category": "Art",
        "details": "https://makemypass.com/face-off"
    },
    {
        "title": "Beyond the harmony",
        "description": " Beyond the Harmony - Apoorv '25 ! Ready to let your voice shine at Beyond the Harmony? \nThis is your stage to showcase your vocal talent and unleash your creativity. Whether you're a beginner or a pro, it's your time to shine!\nThe event offers a chance to perform, win exciting prizes , and be part of an inspiring and captivating musical experience.",
        "category": "Music",
        "details": "https://makemypass.com/beyondtheharmony"
    },
    {
        "title": "Strings and Keys",
        "description": "Strings and Keys -Apoorv '25! Get ready to showcase your talent at Strings and Keys—Apoorv's instrumental competition!\nWhether you're a beginner or a pro, this is your chance to let your music shine.\nOpen to all music lovers, the event offers exciting prizes, a stage to perform, and an experience to remember.",
        "category": "Music",
        "details": "https://makemypass.com/strings-and-keys"
    },
    {
        "title": "Vogue fusion",
        "description": "The Vogue Fusion -APOORV 25!Gear up to dazzle the world with your talent!The fusion wear combines elements from different cultures and eras, creating unique and versatile outfits.\n The vogue fusion is the chance to show your unique fusion of different styles and let people be amazed with your outfits.\nLets add beauty to the apoorv and light up our campus with our outfits",
        "category": "General",
        "details": "https://makemypass.com/vogue-fusion"
    },
    {
        "title": "Apoorv's Got Latent",
        "description": "Do you have what it takes to impress? At Apoorv's Got Latent, step into the spotlight and showcase your unique talents!\nWhether it's storytelling, music, dance, art, stand-up comedy, or something extraordinary, this is your moment to shine. \ndon't hold back—let's see what you've got! ",
        "category": "Dance",
        "details": "https://makemypass.com/apoorvs-got-latent"
    },
    {
        "title": "Synapse",
        "description": "Synapse, our college's online photography contest held during the annual fest, welcomes talented photographers from within and beyond our campus to exhibit their best work.\nWith enticing cash prizes for winners, this digital showcase adds an exciting dimension to our vibrant visual celebration.",
        "category": "General",
        "details": "https://makemypass.com/synapse"
    },
    {
        "title": "Chromus",
        "description": "Dive into the art of storytelling with Chromus-a battleground where creativity meets pixels. Choose your category, from Title Sequence to Social Cause Awareness, and let your edits paint the narrative. Join us at Apoorv for an unforgettable celebration of visual mastery and imagination.",
        "category": "Art",
        "details": "https://makemypass.com/chromus"
    },
    {
        "title": "Project Tsukuyomi\n",
        "description": "Project Tsukuyomi is an extraordinary treasure hunt where you and your team will embark on a journey of secrets, riddles, and challenges. \nWork together to decipher cryptic clues, solve intricate puzzles, and navigate unexpected twists, all while racing against rival groups. \nStrategy, teamwork, and sharp thinking are your greatest assets in this thrilling quest for victory.",
        "category": "General",
        "details": "https://makemypass.com/project-tsukuyomi"
    },
    {
        "title": "Verse Voyage(Poetry)",
        "description": "Step into the realm of rhythm and emotion with Verse Voyage, Apoorv '25's premier poetry competition!Whether your words ow like a gentle stream or crash like thunderous waves, \nthis is your chance to create something unforgettable. Let your verses paint vivid imagery, stir deep emotions, and leave a lasting impact on every reader.",
        "category": "General",
        "details": "https://makemypass.com/verse-voyage"
    },
    {
        "title": "Writers Rumble(Short Story)",
        "description": "Prepare to unleash the power of words in Writer's Rumble, Apoorv '25's ultimate short story competition! This literary showdown will test your creativity, storytelling prowess, \nand ability to captivate readers with compelling narratives. Whether you weave heart-wrenching dramas, pulse-pounding thrillers, or lighthearted tales, \nthis is your chance to leave a lasting impression.\n",
        "category": "Art",
        "details": "https://makemypass.com/writers-rumble"
    },
    {
        "title": "Open Mic",
        "description": "A chance to step onto the stage, a mic in your hand, and unleash those words—be it a poem, rap, stand-up, story, beatbox, or monologue. No rules, no judgment, just a few ears\nto listen... or maybe a chance to impress your crush! Who knows? They might just fall for your killer knock-knock jokes!\n",
        "category": "General",
        "details": "https://makemypass.com/open-mic"
    },
    {
        "title": "Trivia Rush",
        "description": "Calling all trivia buffs, knowledge enthusiasts, and quick thinkers to put their brains to the test in this high-stakes showdown of intelligence and strategy. \nGet ready to challenge yourself and your peers in an electrifying atmosphere filled with excitement and fun.\nAs the tension rises and the stakes get higher, only one team will emerge as the ultimate champion of the trivia showdown. Will it be you? \n",
        "category": "Quiz",
        "details": "https://makemypass.com/trivia-rush"
    },
    {
        "title": "MUN",
        "description": "Ever wonder what it takes to be a world leader? We'll give you the chance to find out and dive into the world of diplomacy and debate! \nApoorv 2025 presents the Model United Nations (MUN), your chance to step into the shoes of a world leader and tackle pressing international issues.\nForge diplomatic alliances, and craft innovative solutions for a brighter future.",
        "category": "General",
        "details": "https://makemypass.com/mun"
    },
    {
        "title": "Animaniac",
        "description": "In a realm where only the fiercest intellects and quickest minds endure, Animaniac, Apoorv'25's ultimate anime event, awaits. \nWarriors unite in squads of four, forging alliances beyond college boundaries for a high-stakes battle. \nEvery question is a duel, every answer a decisive strike—but knowledge alone won't be enough. Unpredictable power-ups can shift the tides in an instant, \nturning victory into defeat. Outsmart your opponents, seize every opportunity, and claim the title of Ultimate Anime Champion!",
        "category": "Art",
        "details": "https://makemypass.com/animaniac"
    },
    {
        "title": "Traders Turf",
        "description": "Description not available.",
        "category": "General",
        "details": "https://makemypass.com/traders-turf"
    },
    {
        "title": "The Samurai Saga",
        "description": "Description not available.",
        "category": "General",
        "details": "https://makemypass.com/the-samurai-saga"
    },
    {
        "title": "Hackoona Matata",
        "description": "Hackoona Matata is an exhilarating hackathon where teams of 4-5 participants come together to solve problem statements across various elds like tech, healthcare,\nsustainability, and more. In race against time, teams collaborate to build innovative solutions, showcase their skills, and pitch their ideas to expert judges.",
        "category": "Art",
        "details": "https://unstop.com/hackathons/hackoona-matata-apoorv-2025-indian-institute-of-information-technology-iiit-kottayam-1411738?lb=uvNliz6B&utm_medium=Share&utm_source=shortUrl"
    },
    {
        "title": " Last Bot Standing",
        "description": "Welcome to the ultimate bot battle royale—where only the strongest, smartest, and most savage survive! Build, program, \nand unleash your robot into the combat arena, where it will face off against others in a no-holds-barred mechanical showdown. \nOutmaneuver, outthink, and outlast your opponents until only one bot remains victorious!",
        "category": "Art",
        "details": "https://makemypass.com/last-bot-standing"
    },
    {
        "title": "Break It to Make It",
        "description": "Break it down, crack the code, and rebuild it better! In this brain-melting challenge, you'll be given a mysterious electronic circuit and tasked with reverse-engineering its secrets.\nWith only a simulation tool and your wits, you must decode, reconstruct, and prove your hacker-level hardware skills. If you love puzzles, this is your playground!",
        "category": "General",
        "details": "https://makemypass.com/break-it-to-make-it"
    },
    {
        "title": "Chaos by Design",
        "description": "Welcome to the dark side of design! In this chaotically cursed competition, your mission is to create the most frustratingly functional user interface ever seen. \nThink buttons that run away, pop-ups that never close, and passwords that change as you type—all in the name of beautifully bad UX. Make the judges suffer,\n make them laugh, and prove you truly understand how NOT to design a UI.",
        "category": "General",
        "details": "https://makemypass.com/chaos-by-design"
    },
    {
        "title": "Digital Detective Hunt",
        "description": "Step into the shoes of a cyber detective in this thrilling hunt to uncover the identity of an anonymous target! Armed with clues and basic yet powerful cyber tools, you'll navigate the\ndigital world to track down the mystery person. Decode, analyze, and investigate like a pro, all while honing your cybersecurity skills. Get ready to uncover secrets and feel like a true\ncyber sleuth!",
        "category": "General",
        "details": "https://makemypass.com/digital-treasure-hunt"
    },
    {
        "title": "Valorant",
        "description": "Apoorv 25's Valorant competitions feature teams from around the world competing in exciting tournaments.\nThe focus is on teamwork, communication, and skill, making it an intense and competitive game for both players and fans.",
        "category": "General",
        "details": "https://makemypass.com/valorant"
    },
    {
        "title": "Freefire",
        "description": "Apoorv 25's Free Fire competitions showcase intense battles where teams from around the world compete in high-energy tournaments. \nWith a focus on strategy, precision, and survival, the event promises an electrifying experience for both participants and spectators.",
        "category": "Art",
        "details": "https://makemypass.com/free-fire"
    },
    {
        "title": "BGMI",
        "description": "Apoorv 25's BGMI competitions feature teams from around the world competing in exciting tournaments. \nThe focus is on teamwork, communication, and skill, making it an intense and competitive game for both players and fans.",
        "category": "General",
        "details": "https://makemypass.com/bgmi"
    },
    {
        "title": "Capture the Flag",
        "description": "Description not available.",
        "category": "General",
        "details": "https://makemypass.com/apoorv-ctf"
    },
    {
        "title": "Code quest",
        "description": "Welcome to the ultimate test of coding prowess at Apoorv Tech Fest! \nCodeQuest is designed to challenge participants through unique and strategic rounds that will push their problem-solving skills to the limit. \nSpanning two intense days, the competition will test coding speed, logical thinking, adaptability, and teamwork. Get ready to compete against the best minds and prove your coding excellence!",
        "category": "Art",
        "details": "https://makemypass.com/code-quest"
    },
    {
        "title": "Turings Twisted Tales\n",
        "description": "Description not available.",
        "category": "General",
        "details": "https://makemypass.com/turings-twisted-tales"
    },
    {
        "title": "Gamevita 3.0",
        "description": "Welcome to Apoorv's GameVita 4.0! A 72-hour game dev extravaganza where you'llunleash your creativity, choose any engine or framework, and create the coolest\nsoftware. The theme will be revealed at the start of the challenge, sparking your imagination and setting the stage for an epic journey.",
        "category": "Art",
        "details": "https://makemypass.com/game-vita-3-0"
    },
  ];

  // Extract unique categories from events data
  const uniqueCategories = [...new Set(events.map(event => event.category))];

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter events based on search term and selected categories
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(event.category);
    
    return matchesSearch && matchesCategory;
  });

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
            </div>
            <p
              className="font-gang text-base md:text-2xl text-white/80 max-w-2xl mb-4 
              bg-white/5 px-4 md:px-6 py-2 md:py-4 rounded-xl filter contrast-100 tracking-widest font-extralight"
            >
              {event.description}
            </p>

            <div className="flex justify-center">
              <button className="font-gang px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-none transition-colors duration-300 tracking-widest text-sm">
                <a
                  href={event.details}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  REGISTER NOW
                </a>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  
  return (
    <div className="relative min-h-screen bg-black">
      <Loader pageName="Events" />

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

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 bg-white/5 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-gang"
                />
                <svg 
                  className="absolute right-4 top-3 w-6 h-6 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="max-w-4xl mx-auto">
                <h3 className="text-white font-gang text-lg mb-3">Filter by category:</h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueCategories.map(category => (
                    <div 
                      key={category}
                      className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all ${
                        selectedCategories.includes(category) 
                          ? 'bg-red-500/30 border border-red-500/80' 
                          : 'bg-white/5 border border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      <div className={`w-4 h-4 border ${
                        selectedCategories.includes(category) 
                          ? 'border-red-500 bg-red-500/80' 
                          : 'border-white/60'
                        } rounded mr-2 flex items-center justify-center`}
                      >
                        {selectedCategories.includes(category) && (
                          <svg 
                            className="w-3 h-3 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="3" 
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-white font-gang">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* No results message */}
            {filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-white/70 font-gang text-xl">No events found matching your search criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                  }}
                  className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors font-gang"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

            {/* Events Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
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

      {/* Event Detail Modal */}
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