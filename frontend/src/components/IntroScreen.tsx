import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show intro for 2.5 seconds before fading out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out animation to finish before unmounting
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ 
                duration: 1, 
                ease: [0.175, 0.885, 0.32, 1.275] // Custom spring
              }}
              className="w-24 h-24 md:w-32 md:h-32 mb-6 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center shadow-2xl shadow-primary/40"
            >
              <svg className="w-12 h-12 md:w-16 md:h-16 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            >
              Melodia
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-4 text-pink-500/80 tracking-widest uppercase text-sm font-semibold"
            >
              Your Premium Music Experience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
