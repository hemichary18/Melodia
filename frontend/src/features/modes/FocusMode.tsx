import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCoffee, FiBook, FiPlay, FiPause, FiRefreshCw, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const FocusMode = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // LoFi Player State
  const LOFI_TRACKS = [
    { title: 'Midnight Study', artist: 'Lofi AI', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { title: 'Rainy Cafe', artist: 'Chillhop', url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3' },
    { title: 'Morning Coffee', artist: 'Beatsmith', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2dbec17812.mp3' }
  ];
  const [currentLofiIndex, setCurrentLofiIndex] = useState(0);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isLofiPlaying) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [isLofiPlaying, currentLofiIndex]);

  const MODES = {
    pomodoro: { time: 25 * 60, label: 'Deep Focus', icon: FiBook, color: 'from-primary to-pink-500' },
    shortBreak: { time: 5 * 60, label: 'Short Break', icon: FiCoffee, color: 'from-blue-500 to-cyan-500' },
    longBreak: { time: 15 * 60, label: 'Long Break', icon: FiClock, color: 'from-green-500 to-emerald-500' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'pomodoro') setSessionCount(c => c + 1);
      // Play sound here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const ActiveIcon = MODES[mode].icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
      {/* LoFi Background Video / Animation */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
         <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&h=1080&fit=crop" alt="Focus Background" className="w-full h-full object-cover filter blur-sm" />
         <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
      </div>
      <audio 
        ref={audioRef} 
        src={LOFI_TRACKS[currentLofiIndex].url} 
        onEnded={() => setCurrentLofiIndex((prev) => (prev + 1) % LOFI_TRACKS.length)}
      />

      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md"
      >
        <FiX className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-lg glass-card p-10 rounded-[3rem] border border-white/10 flex flex-col items-center shadow-2xl">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full mb-12 backdrop-blur-md">
          {(Object.keys(MODES) as Array<keyof typeof MODES>).map((k) => (
            <button
              key={k}
              onClick={() => switchMode(k)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === k ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {MODES[k].label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center mb-12">
          <motion.div 
            key={mode}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-64 h-64 rounded-full bg-gradient-to-tr ${MODES[mode].color} p-1`}
          >
            <div className="w-full h-full bg-[#0a0a0a]/90 rounded-full flex flex-col items-center justify-center backdrop-blur-xl">
              <ActiveIcon className={`w-8 h-8 mb-2 ${mode === 'pomodoro' ? 'text-pink-500' : mode === 'shortBreak' ? 'text-cyan-500' : 'text-emerald-500'}`} />
              <h1 className="text-6xl font-black text-white tabular-nums tracking-tighter">
                {formatTime(timeLeft)}
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl hover:scale-105 active:scale-95 bg-gradient-to-tr ${MODES[mode].color}`}
          >
            {isActive ? <FiPause className="w-8 h-8" /> : <FiPlay className="w-8 h-8 ml-1" />}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 text-center text-gray-400">
          <p className="text-sm uppercase tracking-widest font-semibold mb-1">Session</p>
          <div className="flex items-center gap-2 justify-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < (sessionCount % 4) ? 'bg-primary shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'bg-white/10'}`} />
            ))}
          </div>
          <p className="text-xs mt-3 opacity-60">Complete 4 Pomodoros for a long break</p>
        </div>

      </div>

      {/* LoFi Player Module (Mini) */}
      <div className="absolute bottom-6 right-6 z-20 glass-card p-4 rounded-2xl flex items-center gap-4 w-80 backdrop-blur-xl border border-white/10">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0 cursor-pointer" onClick={() => setCurrentLofiIndex((i) => (i + 1) % LOFI_TRACKS.length)}>
           <FiHeadphones className="text-white w-6 h-6" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{LOFI_TRACKS[currentLofiIndex].title}</p>
          <p className="text-xs text-gray-400 truncate">{LOFI_TRACKS[currentLofiIndex].artist}</p>
        </div>
        <button 
          onClick={() => setIsLofiPlaying(!isLofiPlaying)}
          className="text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
        >
          {isLofiPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-0.5" />}
        </button>
      </div>
    </div>
  );
};

// Import missing icon
import { FiHeadphones } from 'react-icons/fi';
