// src/components/AudioPlayer.jsx
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        top: -window.innerHeight + 100,
        left: -window.innerWidth + 100,
        right: 0,
        bottom: 0
      }}
      className="fixed bottom-8 right-8 z-50 bg-black/90 backdrop-blur-lg p-4 rounded-lg border-2 border-red-500 shadow-xl"
      style={{
        cursor: 'grab',
        width: '64px',
        height: '64px'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.95,
        cursor: 'grabbing'
      }}
    >
      <audio ref={audioRef} loop>
        <source src="/flute.mp3" type="audio/mpeg" />
      </audio>

      {/* Ripple Layers */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-red-500/40"
        animate={{
          scale: isPlaying ? [1, 1.6] : 1,
          opacity: isPlaying ? [0.8, 0] : 0,
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-red-400/30"
        animate={{
          scale: isPlaying ? [1, 2] : 1,
          opacity: isPlaying ? [0.6, 0] : 0,
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      {/* Main Button */}
      <button 
        onClick={togglePlay}
        className="relative z-10 text-red-500 hover:text-red-400 transition-colors w-full h-full flex items-center justify-center"
      >
        {isPlaying ? (
          <motion.svg
            key="pause"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </motion.svg>
        ) : (
          <motion.svg
            key="play"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </motion.svg>
        )}
      </button>

      {/* Pulsing Glow */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-red-500/20 blur-sm"
        animate={{
          opacity: isPlaying ? [0.3, 0.6] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
    </motion.div>
  );
};

export default AudioPlayer;