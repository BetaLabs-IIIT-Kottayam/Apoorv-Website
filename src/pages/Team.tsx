import { motion } from "framer-motion";

const Team = () => {
  const members = [
    { id: 1, name: "TAKESHI", role: "DAIMYO" },
    { id: 2, name: "AKIRA", role: "SOFTWARE SAMURAI" },
    { id: 3, name: "HIKARU", role: "DESIGN NINJA" },
  ];

  return (
    <div className="min-h-screen bg-black py-24 px-8">
      <h2 className="font-akira text-5xl text-white mb-24 text-center">
        THE<span className="text-red-500">.</span>CLAN
      </h2>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {members.map((member) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -20 }}
            className="relative bg-black border-2 border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10" />
            
            <div className="relative z-10">
              <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/member.jpg')] bg-cover bg-center 
                  opacity-80 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <h3 className="font-shippori text-2xl text-white mb-2">
                {member.name}
              </h3>
              <p className="font-inter text-red-500">{member.role}</p>
              
              <div className="mt-6 h-[2px] bg-gradient-to-r from-red-500 to-transparent w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;