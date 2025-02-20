import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import BackgroundImage from "../assets/dragon2.png";

import { teamMembers, TeamMemberConfig } from "../config/teamConfig";

interface TeamMember extends TeamMemberConfig {
  url: string;
}

const Team = () => {
  const [contentVisible, setContentVisible] = useState(false);
  const [teamLogos, setTeamLogos] = useState<TeamMember[]>([]);

  useEffect(() => {
    const importLogos = async () => {
      const images = import.meta.glob(
        "../assets/team/*.{png,jpg,svg,webp,HEIC}",
        {
          eager: true,
          as: "url",
        }
      );

      const imageMap = new Map(
        Object.entries(images).map(([path, url]) => {
          const fileName = path.split("/").pop()?.split(".")[0] || "";
          return [fileName, url];
        })
      );

      // Create team members array in the specified order
      const orderedMembers = teamMembers
        .map((member) => {
          const url = imageMap.get(member.name);
          if (!url) {
            console.warn(`No image found for team member: ${member.name}`);
            return null;
          }
          return {
            ...member,
            url,
          };
        })
        .filter((member): member is TeamMember => member !== null);

      setTeamLogos(orderedMembers);
    };

    importLogos();
  }, []);

  // Wait for loader to complete before showing content
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const mentors = teamLogos.slice(0, 7);
  const others = teamLogos.slice(7);

  return (
    <div className="min-h-screen bg-black py-24 px-8">
      <Loader pageName="Team"/>
      {contentVisible && (
        <div
          className="fixed inset-0 bg-cover bg-no-repeat opacity-80"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "50%",
            backgroundPosition: "left center",
            filter: "brightness(120%)",
            zIndex: 0,
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-gang text-5xl text-white mb-8 text-center relative z-10"
          >
            THE<span className="text-red-500">.</span>CLAN
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
            {mentors.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -20 }}
                className="relative bg-black border-2 border-white/20 p-8"
              >
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10" />
                <div className="relative z-10">
                  <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden">
                    <img
                      src={member.url}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-gang text-2xl text-white mb-2">
                    {member.name}
                  </h3>
                  <div className="mt-6 h-[2px] bg-gradient-to-r from-red-500 to-transparent w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {others.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -20 }}
                className="relative bg-black border-2 border-white/10 p-8"
              >
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10" />
                <div className="relative z-10">
                  <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden">
                    <img
                      src={member.url}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-gang text-2xl text-white mb-2">
                    {member.name}
                  </h3>
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
