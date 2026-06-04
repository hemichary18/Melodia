import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiClock, FiHeart, FiEdit3, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface ProfileMenuProps {
  onEditProfile?: () => void;
}

export const ProfileMenu = ({ onEditProfile }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => !document.documentElement.classList.contains('light'));
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const { user, logout } = useAuthStore();
  const pause = usePlayerStore((state) => state.pause);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    logout();
    navigate('/login');
  };

  const avatarUrl = user?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Felix'}`;

  return (
    <div className="relative" ref={menuRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition overflow-hidden"
      >
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-14 w-64 glass-card rounded-2xl p-2 shadow-2xl z-50 border border-white/10"
          >
            {!showSleepTimer ? (
              <>
                <div className="px-4 py-3 border-b border-white/10 mb-2">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      if (onEditProfile) onEditProfile();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiEdit3 className="w-4 h-4" /> Edit Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <FiHeart className="w-4 h-4" /> Favorites
                  </button>
                  <button 
                    onClick={() => setShowSleepTimer(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiClock className="w-4 h-4" /> Sleep Timer
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />} 
                      Appearance
                    </div>
                    <span className="text-xs text-muted-foreground">{isDarkMode ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2">
                <div className="flex items-center gap-2 px-2 py-2 mb-2 border-b border-white/10 cursor-pointer text-foreground hover:text-primary transition" onClick={() => setShowSleepTimer(false)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-semibold">Sleep Timer</span>
                </div>
                <div className="space-y-1">
                  {[5, 10, 15, 20, 30, 60, 120].map(mins => (
                    <button 
                      key={mins}
                      onClick={() => {
                        setTimeout(() => pause(), mins * 60 * 1000);
                        setShowSleepTimer(false);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {mins >= 60 ? `${mins / 60} hr` : `${mins} min`}
                    </button>
                  ))}
                  <button 
                    onClick={() => {
                      setShowSleepTimer(false);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2 border-t border-white/5 pt-2"
                  >
                    Cancel timer
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
