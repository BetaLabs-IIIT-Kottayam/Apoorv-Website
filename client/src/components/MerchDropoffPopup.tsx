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
    if (autoCloseTime > 0) {
      const timer = setTimeout(handleClose, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 top-10 z-40 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-xs sm:max-w-sm md:max-w-md w-full bg-gradient-to-br from-gray-900 to-black rounded-lg border border-red-500/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleClose} 
              aria-label="Close popup"
              className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="relative">
              <img
                src={imageUrl}
                alt="Exclusive merchandise"
                className="w-full h-auto object-contain"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MerchDropoffPopup;
