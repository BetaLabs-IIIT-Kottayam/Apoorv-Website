import { motion } from "framer-motion";

// Dummy data for developers
const developers = [
  { id: 1, name: "Ryu Hayabusa", role: "Frontend Developer" },
  { id: 2, name: "Kasumi", role: "Backend Developer" },
  { id: 3, name: "Ayane", role: "UI/UX Designer" },
];

const Developers = () => {
  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-6xl font-shippori text-primary text-center mb-8">
        Developers
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {developers.map((dev) => (
          <motion.div
            key={dev.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-64 bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            {/* Add developer photo here */}
            {/* Example: <img src="/dev1.jpg" alt={dev.name} className="w-24 h-24 rounded-full object-cover" /> */}
            <div className="w-24 h-24 bg-gradient-to-r from-accent to-gray-800 rounded-full flex items-center justify-center">
              <p className="text-white font-shippori text-center">
                {dev.name.split(" ")[0][0]}
                {/* {dev.name.split(" ")[1][0]} */}
              </p>
            </div>
            <h2 className="text-lg font-shippori text-white mt-2">
              {dev.name}
            </h2>
            <p className="text-sm text-gray-300 font-noto">{dev.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Developers;