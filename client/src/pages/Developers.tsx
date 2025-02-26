import { motion } from "framer-motion";
import BackgroundImage from "../assets/samurai.png";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import akhileshImage from "../assets/developers/akhilesh.jpg";
import anshumohanImage from "../assets/developers/Anshumohan.jpg";
import shashankImage from "../assets/developers/Shashank.jpg";
import { Github, Linkedin } from "lucide-react";

const Developers = () => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  const developers = [
    { 
      id: 1, 
      name: "Shashank Upadhyay", 
      role: "Dev", 
      imageUri: shashankImage,
      github: "https://github.com/U-Shashank",
      linkedin: "https://linkedin.com/in/shashanku30"
    },
    {
      id: 2,
      name: "Anshumohan Acharya",
      role: "Dev",
      imageUri: anshumohanImage,
      github: "https://github.com/AnshumohanAcharya",
      linkedin: "https://linkedin.com/in/anshumohan-acharya-b95628238"
    },
    { 
      id: 3, 
      name: "Akhilesh Nekar", 
      role: "Dev", 
      imageUri: akhileshImage,
      github: "https://github.com/akhilesh-1306",
      linkedin: "https://linkedin.com/in/akhilesh-nekar-3008a6258"
    },
  ];

  return (
    <div className="min-h-screen bg-black py-24 px-8">
      <Loader pageName="Developers" />

      {contentVisible && (
        <div
          className="fixed inset-0 bg-cover bg-no-repeat bg-right opacity-40"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "40%",
            backgroundPosition: "right center",
            filter: "brightness(120%)",
            zIndex: 0,
          }}
        />
      )}

      {contentVisible && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-gang text-5xl text-white mb-8 text-center relative z-10"
          >
            DEV<span className="text-red-500">.</span>ELOPERS
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -20, transition: { duration: 0.3 } }}
                className="relative z-10 backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-8 hover:border-red-500/50 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-5 rounded-xl" />

                <div className="relative z-10">
                  <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden rounded-lg">
                    <div
                      className="absolute inset-0 bg-[url('/dev-pattern.png')] bg-cover bg-center 
                      opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src={dev.imageUri} alt={dev.name}></img>
                    </div>
                  </div>

                  <h3 className="font-gang text-2xl text-white mb-2">
                    {dev.name.toUpperCase()}
                  </h3>
                  <p className="font-gang text-red-500">
                    {dev.role.toUpperCase()}
                  </p>

                  <div className="mt-6 h-[2px] bg-gradient-to-r from-red-500 to-transparent w-1/2" />
                  
                  <div className="mt-4 flex space-x-4">
                    <a 
                      href={dev.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-red-500 transition-colors duration-300"
                    >
                      <Github size={24} />
                    </a>
                    <a 
                      href={dev.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-red-500 transition-colors duration-300"
                    >
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Developers;
