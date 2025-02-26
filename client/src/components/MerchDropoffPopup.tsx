import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MerchDropoffPopupProps {
  imageUrl: string;
  onClose: () => void;
  autoCloseTime?: number; // Time in ms before auto-closing
}

const MerchDropoffPopup = ({
  imageUrl,
  onClose,
  autoCloseTime = 0 // Default to no auto-close
} : MerchDropoffPopupProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close functionality if a time is specified
    if (autoCloseTime > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation to complete before calling onClose
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        //   transition={{ duration: 1 }}
          className="fixed inset-0 bottom-60 z-40 flex items-center justify-center bg-black/80"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-red-500/30 max-w-md md:max-w-lg h-[350px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleClose} 
              aria-label="Close popup"
              className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-lg"
            >
              <motion.img
                src={imageUrl}
                alt="Exclusive merchandise drop"
                className="w-full object-cover"
                // transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MerchDropoffPopup;