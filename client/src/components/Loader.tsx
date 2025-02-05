import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


function Loader() {
    const [showCurtain, setShowCurtain] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setShowCurtain(false), 2000); // Adjust timing as needed
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-full bg-red-900 z-50"
          >
            <div className="flex justify-center items-center h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-white text-3xl font-semibold tracking-widest"
              >
                いらっしゃいませ
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );

}

export default Loader