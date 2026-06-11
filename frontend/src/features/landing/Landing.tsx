import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMusic, FiHeadphones, FiUsers, FiRadio } from 'react-icons/fi';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <FiMusic className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Melodia</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2">
            Log in
          </Link>
          <Link to="/register" className="bg-white text-black hover:bg-gray-200 font-bold px-6 py-2.5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">The next generation of music streaming</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tight leading-[1.1]">
            Music for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-indigo-500">every mood.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mt-6">
            Melodia transcends traditional listening. Experience AI-curated playlists, global party modes, and seamless community integration all in one beautiful ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-pink-600 text-white font-bold rounded-full shadow-xl shadow-primary/30 flex items-center justify-center gap-2 text-lg"
              >
                Get Started for Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full backdrop-blur-md transition-all text-lg"
              >
                Log In to Account
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mt-32 pb-20"
        >
          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/20 text-left hover:bg-white/5 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiHeadphones className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI DJ Matcher</h3>
            <p className="text-gray-400">Tell the AI how you feel and it will instantly generate a custom smart playlist tailored exactly to your current vibe.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/20 text-left hover:bg-white/5 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiRadio className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Contextual Modes</h3>
            <p className="text-gray-400">Switch seamlessly between Driving Mode, Sleep Mode with ambient sounds, and a minimalist Focus Mode.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/20 text-left hover:bg-white/5 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiUsers className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Global Party</h3>
            <p className="text-gray-400">Join real-time communities, chat with friends, and collaborate on a global listening queue together.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
