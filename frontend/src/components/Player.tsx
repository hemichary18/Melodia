import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart, FiMic } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { useState } from 'react';
import { FullScreenPlayer } from './FullScreenPlayer';

export const Player = () => {
  const { currentSong, queue, isPlaying, togglePlay, volume, setVolume, progress, duration, playNext, playPrevious, audioElement } = usePlayerStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialViewMode, setInitialViewMode] = useState<'album' | 'lyrics'>('album');

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const newTime = percent * duration;
    audioElement.currentTime = newTime;
    usePlayerStore.setState({ progress: newTime });
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
    <>
      <AnimatePresence>
        {!isExpanded && (
          <motion.div 
            key="bottom-player"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.closest('.prevent-expand')) return;
              setInitialViewMode('album');
              setIsExpanded(true);
            }}
            className="h-20 md:h-24 glass border-t border-white/5 fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-4 md:px-6 flex items-center justify-between shadow-2xl cursor-pointer hover:bg-white/5 transition-colors"
          >
      
      {/* Current Song Info */}
      <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/4">
        <div 
          onClick={() => {
            setInitialViewMode('album');
            setIsExpanded(true);
          }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden relative group shrink-0 shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          <img 
            src={currentSong.coverArtUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80"} 
            alt="Album Cover" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-bold rotate-45">⤢</span>
          </div>
        </div>
        <div className="truncate">
          <h4 className="text-foreground font-medium text-xs md:text-sm truncate">{currentSong.title}</h4>
          <p className="text-gray-400 text-[10px] md:text-xs truncate">{currentSong.artist?.name || 'Unknown Artist'}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 ml-2">
          <button className="text-muted-foreground hover:text-pink-500 transition-colors">
            <FiHeart className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setInitialViewMode('lyrics');
              setIsExpanded(true);
            }}
            className="text-muted-foreground hover:text-primary cursor-pointer transition-colors tooltip-trigger"
            title="Open Full Screen Lyrics"
          >
            <FiMic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 max-w-2xl px-4 md:px-0">
          <div className="flex items-center gap-6 justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); playPrevious(); }}
              disabled={queue.length <= 1}
              className={`transition-colors group ${queue.length <= 1 ? 'text-gray-600 cursor-not-allowed' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <FiSkipBack className="w-5 h-5 group-active:scale-95 transition-transform" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-10 h-10 bg-primary hover:bg-pink-600 text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-1" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); playNext(); }}
              disabled={queue.length <= 1}
              className={`transition-colors group ${queue.length <= 1 ? 'text-gray-600 cursor-not-allowed' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <FiSkipForward className="w-5 h-5 group-active:scale-95 transition-transform" />
            </button>
          </div>
        
        <div className="hidden md:flex items-center gap-3 w-full">
          <span className="text-[10px] md:text-xs text-gray-400 w-8 text-right">{formatTime(progress)}</span>
          <div 
            className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group py-2 flex items-center relative prevent-expand"
            onClick={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
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
          className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group flex items-center relative prevent-expand"
          onClick={(e) => {
            e.stopPropagation();
            handleVolume(e);
          }}
        >
          <div className="absolute left-0 h-1.5 bg-white/20 w-full rounded-full" />
          <div 
            className="h-1.5 bg-white group-hover:bg-primary transition-colors rounded-full relative pointer-events-none" 
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
      
      {/* Mobile progress bar (very bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 md:hidden prevent-expand" onClick={(e) => {
        e.stopPropagation();
        handleSeek(e);
      }}>
        <div 
          className="h-full bg-primary"
          style={{ width: `${(progress / (duration || 1)) * 100}%` }}
        />
      </div>

          </motion.div>
        )}
      </AnimatePresence>

      <FullScreenPlayer 
        isExpanded={isExpanded} 
        onClose={() => setIsExpanded(false)} 
        initialViewMode={initialViewMode}
      />
    </>
  );
};
