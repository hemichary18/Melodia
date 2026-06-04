import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { useEffect, useRef, useState } from 'react';

export const Player = () => {
  const { currentSong, isPlaying, togglePlay, volume, setVolume, playSong } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (audioRef.current.src !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl;
        setProgress(0);
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
    setVolume(percent);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) return null;

  return (
    <div className="h-20 md:h-24 glass border-t border-white/5 fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-4 md:px-6 flex items-center justify-between shadow-2xl">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => usePlayerStore.setState({ isPlaying: false })}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      {/* Current Song Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden relative group shrink-0 shadow-md">
          <img 
            src={currentSong.coverArtUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80"} 
            alt="Album Cover" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="truncate">
          <h4 className="text-foreground font-medium text-xs md:text-sm truncate">{currentSong.title}</h4>
          <p className="text-gray-400 text-[10px] md:text-xs truncate">{currentSong.artist?.name || 'Unknown Artist'}</p>
        </div>
        <button className="hidden md:block ml-2 text-muted-foreground hover:text-pink-500 transition-colors">
          <FiHeart className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 max-w-2xl px-4 md:px-0">
        <div className="flex items-center gap-4 md:gap-6 mb-1 md:mb-2">
          <button className="text-gray-400 hover:text-foreground transition-colors hidden md:block">
            <FiSkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg"
          >
            {isPlaying ? (
               <FiPause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            ) : (
               <FiPlay className="w-4 h-4 md:w-5 md:h-5 fill-current ml-1" />
            )}
          </motion.button>

          <button className="text-gray-400 hover:text-foreground transition-colors hidden md:block">
            <FiSkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-3 w-full">
          <span className="text-[10px] md:text-xs text-gray-400 w-8 text-right">{formatTime(progress)}</span>
          <div 
            className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group py-2 flex items-center relative"
            onClick={handleSeek}
          >
            <div className="absolute left-0 h-1.5 bg-white/20 w-full rounded-full" />
            <div 
              className="h-1.5 bg-gradient-to-r from-primary to-pink-500 rounded-full relative group-hover:bg-primary transition-all pointer-events-none"
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow" />
            </div>
          </div>
          <span className="text-[10px] md:text-xs text-gray-400 w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
        <FiVolume2 className="text-gray-400 w-5 h-5" />
        <div 
          className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group flex items-center relative"
          onClick={handleVolume}
        >
          <div className="absolute left-0 h-1.5 bg-white/20 w-full rounded-full" />
          <div 
            className="h-1.5 bg-white group-hover:bg-primary transition-colors rounded-full relative pointer-events-none" 
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
      
      {/* Mobile progress bar (very bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 md:hidden" onClick={handleSeek}>
        <div 
          className="h-full bg-primary"
          style={{ width: `${(progress / (duration || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};
