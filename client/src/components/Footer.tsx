import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.footer 
    className="fixed bottom-0 w-full bg-black/80 border-t border-red-500/30 py-3 overflow-hidden z-10"
    initial={{ y: 50 }}
    animate={{ y: 0 }}
    transition={{ delay: 2 }}
  >
    <div className="relative flex overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="flex items-center mx-8">
            <span className="text-red-500 font-gang mx-2">⚔</span>
            <span className="text-white font-gang">
              CRAFTED BY BETALABS 
            </span>
            <span className="text-red-500 font-gang mx-2">⚔</span>
          </span>
        ))}
      </div>
      
      {/* Duplicate for seamless loop */}
      <div className="animate-marquee absolute top-0 whitespace-nowrap flex items-center">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="flex items-center mx-8">
            <span className="text-red-500 font-gang mx-2">⚔</span>
            <span className="text-white font-gang">
            CRAFTED BY BETALABS 
            </span>
            <span className="text-red-500 font-gang mx-2">⚔</span>
          </span>
        ))}
      </div>
    </div>
  </motion.footer>
  )
}

export default Footer