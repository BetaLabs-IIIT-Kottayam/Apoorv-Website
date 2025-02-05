import { motion } from "framer-motion";

const developers = [
  { id: 1, name: "Shashank Upadhyay", role: "Frontend Developer" },
  { id: 2, name: "Anshumohan Acharya", role: "Backend Developer" },
  { id: 3, name: "Akhilesh Nekar", role: "UI/UX Designer" },
];

const Developers = () => {
  return (
    <div className="min-h-screen bg-black py-24 px-8">
      <h1 className="font-gang text-5xl text-white mb-24 text-center">
        DEV<span className="text-primary">.</span>ELOPERS
      </h1>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {developers.map((dev) => (
          <motion.div
            key={dev.id}
            whileHover={{ y: -20 }}
            className="relative bg-black border-2 border-white/10 p-8"
          >
            <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10" />
            
            <div className="relative z-10">
              <div className="h-64 bg-white/10 mb-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/dev-pattern.png')] bg-cover bg-center 
                  opacity-80 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-gang text-primary">
                      {dev.name.split(" ")[0][0]}
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-gang text-2xl text-white mb-2">
                {dev.name.toUpperCase()}
              </h3>
              <p className="font-gang text-primary">{dev.role.toUpperCase()}</p>
              
              <div className="mt-6 h-[2px] bg-gradient-to-r from-primary to-transparent w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Developers;