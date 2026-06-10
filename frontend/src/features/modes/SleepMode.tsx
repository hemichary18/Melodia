import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiCloudRain, FiWind, FiVolume2, FiX, FiPlay, FiPause } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const SleepMode = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [isActive, setIsActive] = useState(false);
  const [activeSound, setActiveSound] = useState('rain');

  const SOUNDS = [
    { id: 'rain', label: 'Rain Drops', icon: FiCloudRain, url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3d1a8775f0.mp3' },
    { id: 'wind', label: 'Soft Wind', icon: FiWind, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_651a0b3294.mp3' },
    { id: 'waves', label: 'Ocean Waves', icon: FiVolume2, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8dd9b8b991.mp3' } // Using volume2 as a wave placeholder
  ];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isActive) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [isActive, activeSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Logic to pause all audio and lock device
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustTimer = (mins: number) => {
    setTimeLeft(Math.max(0, timeLeft + (mins * 60)));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050510] overflow-hidden flex flex-col font-sans">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-20 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <FiX className="w-6 h-6" />
      </button>

      <audio 
        ref={audioRef} 
        src={SOUNDS.find(s => s.id === activeSound)?.url} 
        loop
      />

      {/* Gentle Animated Stars/Night Sky */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() * 0.5 + 0.1 }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        <FiMoon className="w-16 h-16 text-indigo-400 mb-8" />
        <h1 className="text-3xl font-medium text-white mb-2 tracking-wide">Sleep Timer</h1>
        <p className="text-gray-500 mb-12">Music will fade out and pause automatically.</p>

        {/* Timer Display */}
        <div className="text-8xl font-thin text-white tracking-tighter mb-12 font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {formatTime(timeLeft)}
        </div>

        {/* Timer Adjustments */}
        <div className="flex items-center gap-4 mb-16">
          <button onClick={() => adjustTimer(-5)} className="px-6 py-3 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 transition">
            - 5m
          </button>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${isActive ? 'bg-indigo-600/50 hover:bg-indigo-600/70 shadow-indigo-500/20' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {isActive ? <FiPause className="w-8 h-8" /> : <FiPlay className="w-8 h-8 ml-1" />}
          </button>
          <button onClick={() => adjustTimer(5)} className="px-6 py-3 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 transition">
            + 5m
          </button>
        </div>

        {/* Ambient Sounds Selector */}
        <div className="w-full max-w-md">
          <p className="text-center text-sm text-gray-500 font-medium mb-6 uppercase tracking-widest">Ambient Sounds</p>
          <div className="flex justify-center gap-4">
            {SOUNDS.map((sound) => {
              const Icon = sound.icon;
              const isSelected = activeSound === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => setActiveSound(sound.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl w-28 transition-all ${isSelected ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'bg-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300 border border-transparent'}`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="text-xs font-medium">{sound.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
