import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCamera } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { user, login } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!username.trim()) return;
    setIsSaving(true);
    setError('');
    
    try {
      const { data } = await api.put('/users/profile', { username });
      // Update local store
      login(data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl border border-white/10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-foreground transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10">
                  <img 
                    src={user?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <FiCamera className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-foreground/50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/25 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
