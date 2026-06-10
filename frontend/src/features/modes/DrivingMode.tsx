import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FiMic, FiPlay, FiPause, FiSkipForward, FiSkipBack, FiMapPin, FiX, FiMusic } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../store/usePlayerStore';

export const DrivingMode = () => {
  const navigate = useNavigate();
  const { currentSong, queue, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
  const [isListening, setIsListening] = useState(false);
  const controls = useAnimation();

  // Simulated Voice Command Feedback
  useEffect(() => {
    if (isListening) {
      const timer = setTimeout(() => {
        setIsListening(false);
        togglePlay(); // Toggle play/pause as a fake response
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col font-sans touch-none select-none">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-20 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/30 transition-colors"
      >
        <FiX className="w-8 h-8" />
      </button>

      <div className="absolute top-8 right-8 z-20 flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full text-gray-400">
        <FiMapPin className="w-6 h-6 text-primary" />
        <span className="text-xl font-medium tracking-wider">DRIVE MODE</span>
      </div>

      <main className="flex-1 flex flex-col justify-center items-center p-12">
        <motion.div 
          animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative w-72 h-72 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(236,72,153,0.15)] mb-12"
        >
          <img 
            src={currentSong?.coverArtUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&h=800&fit=crop'} 
            alt="Now Playing" 
            className="w-full h-full object-cover" 
          />
        </motion.div>

        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter text-center line-clamp-1">{currentSong?.title || 'No Song Playing'}</h1>
        <p className="text-3xl text-gray-400 font-medium mb-16 text-center line-clamp-1">{currentSong?.artist?.name || 'Select a song from Library'}</p>

        {/* Massive Controls for Driving */}
        <div className="w-full max-w-3xl flex items-center justify-between gap-8 px-8">
          <button 
            onClick={(e) => { e.stopPropagation(); playPrevious(); }}
            disabled={queue.length <= 1}
            className={`flex-1 h-32 rounded-3xl flex items-center justify-center transition-colors backdrop-blur-md border border-white/5 ${queue.length <= 1 ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white active:bg-white/20'}`}
          >
            <FiSkipBack className="w-12 h-12" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-48 h-48 shrink-0 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center text-white active:scale-95 transition-transform shadow-[0_0_50px_rgba(236,72,153,0.3)]"
          >
            {isPlaying ? <FiPause className="w-20 h-20" /> : <FiPlay className="w-20 h-20 ml-2" />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); playNext(); }}
            disabled={queue.length <= 1}
            className={`flex-1 h-32 rounded-3xl flex items-center justify-center transition-colors backdrop-blur-md border border-white/5 ${queue.length <= 1 ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white active:bg-white/20'}`}
          >
            <FiSkipForward className="w-12 h-12" />
          </button>
        </div>
      </main>

      {/* Voice Command Button */}
      <footer className="p-12 flex justify-center pb-safe">
        <button 
          onClick={() => setIsListening(true)}
          className={`flex items-center gap-6 px-12 py-6 rounded-full font-bold text-2xl transition-all ${isListening ? 'bg-green-500 text-white animate-pulse shadow-[0_0_40px_rgba(34,197,94,0.5)]' : 'bg-white/10 text-gray-300 active:bg-white/20'}`}
        >
          <FiMic className="w-8 h-8" />
          {isListening ? "Listening..." : "Voice Command"}
        </button>
      </footer>
    </div>
  );
};
