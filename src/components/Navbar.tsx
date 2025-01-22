// src/components/Navbar.jsx
import { motion } from "framer-motion";
import { NavLink } from "react-router";

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-akira text-2xl text-red-500"
        >
          侍 FEST
        </motion.h1>
        <div className="flex gap-8">
          {['Home', 'Events', 'Sponsors', 'Team'].map((item) => (
            <NavLink
                to={item === 'Home' ? '/' : `${item.toLowerCase()}`}
                key={item}
>
            <motion.div
              whileHover={{ color: '#FF1A1A' }}
              className="text-white font-inter cursor-pointer"
              >
              {item}
            </motion.div>
                </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;