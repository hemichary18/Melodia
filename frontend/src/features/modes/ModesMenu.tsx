import { useNavigate } from 'react-router-dom';
import { FiCoffee, FiRadio, FiMapPin, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const ModesMenu = () => {
  const navigate = useNavigate();

  const modes = [
    { name: 'Focus Mode', description: 'Pomodoro timer & Lo-Fi beats', icon: FiCoffee, path: '/focus', color: 'from-pink-500 to-primary' },
    { name: 'Party Mode', description: 'Collaborative queue & live chat', icon: FiRadio, path: '/party', color: 'from-purple-500 to-indigo-500' },
    { name: 'Driving Mode', description: 'Distraction-free massive controls', icon: FiMapPin, path: '/driving', color: 'from-blue-500 to-cyan-500' },
    { name: 'Sleep Mode', description: 'Sleep timer & ambient sounds', icon: FiMoon, path: '/sleep', color: 'from-indigo-600 to-blue-900' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Experience Modes</h1>
        <p className="text-gray-400">Transform how you listen to music with specialized immersive modes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((mode, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(mode.path)}
            className={`cursor-pointer overflow-hidden rounded-3xl relative p-8 border border-white/10 glass-card group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative z-10 flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center shadow-lg`}>
                <mode.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{mode.name}</h3>
                <p className="text-gray-400">{mode.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
