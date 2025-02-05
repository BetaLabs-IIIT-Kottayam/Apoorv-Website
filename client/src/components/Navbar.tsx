import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router"

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = ["Home", "Events", "Sponsors", "Merch", "Team", "Developers"]

  return (
    <nav className="fixed w-full z-50 bg-transparent border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-gang text-2xl text-white">
          侍 FEST
        </motion.h1>

        {/* Hamburger Icon for Mobile/Tablet */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none z-50">
            <span
              className={`block w-6 h-0.5 bg-white mb-1 transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white mb-1 transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex gap-8">
          {navItems.map((item) => (
            <Link to={item === "Home" ? "/" : `/${item.toLowerCase()}`} key={item} className="relative group">
              <motion.div
                whileHover={{ color: "#FF1A1A" }}
                className="text-white font-gang cursor-pointer transition-colors duration-300"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile/Nav Toggle Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-full bg-black bg-opacity-90 flex items-center justify-center z-40"
            >
              <div className="flex flex-col gap-8 items-center">
                {navItems.map((item) => (
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    key={item}
                    onClick={() => setIsOpen(false)} // Close menu on item click
                    className="text-white font-gang text-3xl"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar

