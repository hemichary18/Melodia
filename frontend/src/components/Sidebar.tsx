import { useLocation, Link } from 'react-router-dom';
import { FiHome, FiSettings, FiUploadCloud, FiUsers, FiGrid, FiSearch } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

export const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const navItems = [
    { name: 'Home', icon: FiHome, path: '/' },
    { name: 'Search', icon: FiSearch, path: '/search' },
    { name: 'Library', icon: BiLibrary, path: '/library' },
    { name: 'Communities', icon: FiUsers, path: '/communities' },
    { name: 'Modes', icon: FiGrid, path: '/modes' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-full glass flex-col p-6 z-10 border-r border-white/5 relative">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Melodia</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 ml-2">Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                  isActive ? 'text-foreground' : 'text-gray-400 hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          {!isAuthenticated && (
            <Link to="/login" className="flex items-center gap-4 px-4 py-3 rounded-xl text-primary hover:text-pink-500 transition-colors font-semibold">
              <span className="font-medium">Sign In</span>
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="flex items-center gap-4 px-4 py-3 rounded-xl text-primary hover:text-pink-500 transition-colors font-medium">
              <FiUploadCloud className="w-5 h-5" />
              <span>Admin Upload</span>
            </Link>
          )}
          <Link to="/settings" className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-colors">
            <FiSettings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-background/90 backdrop-blur-xl z-50 border-t border-white/5 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
