import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader"; 
import BackgroundImage from "../assets/dragon2.png"; 

const Team = () => {
  const [contentVisible, setContentVisible] = useState(false);

  const members = [
    { id: 1, name: "TAKESHI", role: "DAIMYO" },
    { id: 2, name: "AKIRA", role: "SOFTWARE SAMURAI" },
    { id: 3, name: "HIKARU", role: "DESIGN NINJA" },
    { id: 3, name: "HIKARU", role: "DESIGN NINJA" },
    { id: 3, name: "HIKARU", role: "DESIGN NINJA" },
    { id: 3, name: "HIKARU", role: "DESIGN NINJA" },
  ];

  // Wait for loader to complete before showing content
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3200); // Adjust the time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black py-24 px-8">
      <Loader />
      {contentVisible && (
        <div
          className="fixed inset-0 bg-cover bg-no-repeat opacity-80"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "50%",
            backgroundPosition: "left center",
            filter: "brightness(120%)",
            zIndex: 0
          }}
        ></div>
      )}
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
      {contentVisible && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-gang text-5xl text-white mb-24 text-center"
          >
            THE<span className="text-red-500">.</span>CLAN
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }} // Start from below
                animate={{ opacity: 1, y: 0 }} // Animate to original position
                transition={{ duration: 0.5, delay: member.id * 0.1 }} // Staggered animation
                whileHover={{ y: -20 }}
                className="relative bg-black border-2 border-white/10 p-8"
              >
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10" />
                
                <div className="relative z-10">
                  <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/member.jpg')] bg-cover bg-center 
                      opacity-80 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <h3 className="font-gang text-2xl text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="font-gang text-red-500">{member.role}</p>
                  
                  <div className="mt-6 h-[2px] bg-gradient-to-r from-red-500 to-transparent w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Team;