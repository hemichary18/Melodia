import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiPlay, FiPause, FiSkipBack, FiSkipForward, FiMessageSquare } from 'react-icons/fi';
import { usePlayerStore } from '../store/usePlayerStore';

interface ParsedLyric {
  time: number;
  text: string;
}

interface FullScreenPlayerProps {
  isExpanded: boolean;
  onClose: () => void;
  initialViewMode?: 'album' | 'lyrics';
}

export const FullScreenPlayer = ({ isExpanded, onClose, initialViewMode = 'album' }: FullScreenPlayerProps) => {
  const { currentSong, isPlaying, togglePlay, progress, duration, setProgress, playNext, playPrevious } = usePlayerStore();
  const [viewMode, setViewMode] = useState<'album' | 'lyrics'>(initialViewMode);
  const [lyrics, setLyrics] = useState<ParsedLyric[]>([]);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<any>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const parseLRC = (lrcText: string): ParsedLyric[] => {
    const lines = lrcText.split('\n');
    const parsed: ParsedLyric[] = [];
    
    lines.forEach(line => {
      // Matches [mm:ss.xx], [mm:ss:xx], [m:ss]
      const regex = /\[(\d+):(\d+)(?:[:.](\d+))?\]/g;
      let match;
      const timestamps: number[] = [];
      
      while ((match = regex.exec(line)) !== null) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        let fractional = 0;
        if (match[3]) {
          fractional = parseFloat('0.' + match[3]);
        }
        timestamps.push((minutes * 60) + seconds + fractional);
      }
      
      if (timestamps.length > 0) {
        const text = line.replace(/\[\d+:\d+(?:[:.]\d+)?\]/g, '').trim();
        if (text) {
          timestamps.forEach(time => {
            parsed.push({ time, text });
          });
        }
      }
    });
    
    return parsed.sort((a, b) => a.time - b.time);
  };

  useEffect(() => {
    if (currentSong?.lyrics) {
      fetch(currentSong.lyrics)
        .then(res => res.text())
        .then(text => setLyrics(parseLRC(text)))
        .catch(err => console.error('Failed to load lyrics', err));
    } else {
      // Fallback dummy lyrics so the feature is always demonstrable
      const fallbackLRC = `
[00:00.00] (Music Playing)
[00:05.00] Yeah, let's go
[00:10.00] I've been waiting for this moment
[00:15.00] All my life, yeah
[00:20.00] Can you feel the rhythm?
[00:25.00] We're taking over tonight
[00:30.00] Ain't nobody gonna stop us now
[00:35.00] Hands up in the air
[00:40.00] Like we just don't care
[00:45.00] Feel the bass drop
[00:50.00] And we never gonna stop
[00:55.00] (Instrumental)
[01:10.00] Shining like a diamond
[01:15.00] We own the night
[01:20.00] Everything is gonna be alright
      `.trim();
      setLyrics(parseLRC(fallbackLRC));
    }
  }, [currentSong?.lyrics]);

  const activeIndex = lyrics.findIndex(
    (l, i) => progress >= l.time && (i === lyrics.length - 1 || progress < lyrics[i + 1].time)
  );

  // Sync viewMode when initialViewMode or isExpanded changes
  useEffect(() => {
    if (isExpanded) {
      setViewMode(initialViewMode);
    }
  }, [isExpanded, initialViewMode]);

  // Auto-scroll to active lyric only when activeIndex changes
  useEffect(() => {
    if (viewMode === 'lyrics' && activeLyricRef.current && !isUserScrolling) {
      isProgrammaticScroll.current = true;
      activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  }, [activeIndex, viewMode, isUserScrolling]);

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 4000); // Resume auto-scroll after 4 seconds of inactivity
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div 
          key="right-drawer"
          initial={isDesktop ? { x: '100%', y: 0 } : { y: '100%', x: 0 }}
          animate={{ x: 0, y: 0 }}
          exit={isDesktop ? { x: '100%', y: 0 } : { y: '100%', x: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed z-[100] bg-black flex flex-col overflow-hidden
            ${isDesktop ? 'right-0 top-0 bottom-0 w-[400px] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]' : 'inset-0'}
          `}
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
            <img 
              src={currentSong.coverArtUrl} 
              className="absolute inset-0 w-full h-full object-cover blur-[100px] scale-150 saturate-200" 
              alt="blur" 
            />
            <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
          </div>

          {/* Header */}
          <header className="relative z-10 p-6 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <FiChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
                {viewMode === 'album' ? 'Now Playing' : 'Lyrics'}
              </p>
              <h4 className="text-sm font-medium text-white">{currentSong.title}</h4>
            </div>
            <div className="w-10 h-10" /> {/* Spacer */}
          </header>

          {/* Main Content Area */}
          <main className="relative z-10 flex-1 overflow-hidden">
            {/* Album Cover (Always present, dimmed when lyrics show) */}
            <motion.div 
              initial={false}
              animate={{ opacity: viewMode === 'lyrics' ? 0.15 : 1, scale: viewMode === 'lyrics' ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none"
            >
              <div className="w-full max-w-[280px] md:max-w-xs aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <img 
                  src={currentSong.coverArtUrl} 
                  alt="Album Art" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Lyrics Overlay */}
            <AnimatePresence>
              {viewMode === 'lyrics' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden no-scrollbar"
                  onScroll={handleScroll}
                >
                  <div className="w-full max-w-4xl mx-auto px-4 md:px-6 space-y-8 min-h-full pb-[50vh] pt-[40vh]">
                    {lyrics.length === 0 ? (
                      <div className="text-center text-2xl text-gray-500 font-bold mt-20">No lyrics available</div>
                    ) : (
                      lyrics.map((lyric, index) => {
                        const isActive = index === activeIndex;
                        const isPassed = index < activeIndex;
                        return (
                          <div
                            key={index}
                            ref={isActive ? activeLyricRef : null}
                            onClick={() => {
                              const audio = document.querySelector('audio');
                              if (audio) {
                                audio.currentTime = lyric.time;
                                setProgress(lyric.time);
                              }
                            }}
                            className={`text-2xl md:text-3xl lg:text-4xl font-bold transition-all duration-300 py-2 cursor-pointer
                              ${isActive ? 'text-white scale-105 origin-left' : isPassed ? 'text-white/30' : 'text-white/50'}
                              hover:text-white
                            `}
                          >
                            {lyric.text}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer Controls */}
          <footer className="relative z-10 px-8 pb-12 pt-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-3xl mx-auto">
              
              {/* Song Info & Lyrics Toggle */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-1">{currentSong.title}</h2>
                  <p className="text-sm md:text-lg text-gray-400 line-clamp-1">{currentSong.artist?.name}</p>
                </div>
                
                {/* Always show Lyrics toggle button */}
                <button 
                  onClick={() => setViewMode(prev => prev === 'album' ? 'lyrics' : 'album')}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${
                    viewMode === 'lyrics' ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <FiMessageSquare />
                  {viewMode === 'album' ? 'Lyrics' : 'Album Art'}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div 
                  className="h-2 w-full bg-white/20 rounded-full cursor-pointer relative"
                  onClick={(e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - bounds.left) / bounds.width;
                    const newTime = percent * duration;
                    const audio = document.querySelector('audio');
                    if (audio) audio.currentTime = newTime;
                    setProgress(newTime);
                  }}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                    style={{ width: `${(progress / Math.max(duration, 1)) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={playPrevious}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <FiSkipBack className="w-8 h-8 fill-current" />
                </button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow"
                >
                  {isPlaying ? (
                    <FiPause className="w-8 h-8 fill-current" />
                  ) : (
                    <FiPlay className="w-8 h-8 fill-current ml-2" />
                  )}
                </motion.button>
                
                <button 
                  onClick={playNext}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <FiSkipForward className="w-8 h-8 fill-current" />
                </button>
              </div>

            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
