import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMoon, FiSun, FiVolume2, FiLogOut, FiEdit3 } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { EditProfileModal } from '../../components/EditProfileModal';

export const Settings = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return document.documentElement.classList.contains('light');
  });

  const toggleTheme = () => {
    const isLight = document.documentElement.classList.toggle('light');
    setIsLightMode(isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
      setIsLightMode(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FiUser className="text-primary" /> Profile
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink-500 shadow-xl shadow-primary/20 shrink-0">
              {user?.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white uppercase">
                  {user?.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-bold text-foreground">{user?.username}</h4>
              <p className="text-muted-foreground">{user?.email || 'No email provided'}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {user?.role}
              </div>
            </div>
            <button 
              onClick={() => setIsEditProfileOpen(true)}
              className="mt-4 md:mt-0 px-6 py-2 bg-white/10 hover:bg-white/20 text-foreground font-medium rounded-xl transition-colors border border-white/10 flex items-center gap-2"
            >
              <FiEdit3 /> Edit Profile
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <FiMoon className="text-pink-500" /> Appearance
          </h3>
          
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 className="text-foreground font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">Switch between Dark and Light mode</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="w-14 h-8 bg-black/40 rounded-full p-1 relative transition-colors shadow-inner flex items-center border border-white/10"
            >
              <motion.div 
                layout
                className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                animate={{ x: isLightMode ? 24 : 0 }}
              >
                {isLightMode ? <FiSun className="w-4 h-4 text-orange-500" /> : <FiMoon className="w-4 h-4 text-blue-500" />}
              </motion.div>
            </button>
          </div>
        </section>

        {/* Audio Quality Section */}
        <section className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <FiVolume2 className="text-primary" /> Audio Quality
          </h3>
          
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <h4 className="text-foreground font-medium">High Quality Audio</h4>
              <p className="text-sm text-muted-foreground">Stream in 320kbps when available</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer border border-white/10">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="text-foreground font-medium">Normalize Volume</h4>
              <p className="text-sm text-muted-foreground">Set all songs to the same volume level</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer border border-white/10">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-12">
          <button 
            onClick={handleLogout}
            className="w-full md:w-auto px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-2"
          >
            <FiLogOut /> Log Out
          </button>
        </section>
      </div>

      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </div>
  );
};
