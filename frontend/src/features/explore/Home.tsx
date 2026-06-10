import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiHeart, FiSearch } from 'react-icons/fi';
// ... (I'll need to do this carefully, let's view Home.tsx first)
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ProfileMenu } from '../../components/ProfileMenu';
import { EditProfileModal } from '../../components/EditProfileModal';
import api from '../../services/api';

export const Home = () => {
  const { user } = useAuthStore();
  const playQueue = usePlayerStore((state) => state.playQueue);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await api.get('/songs');
        setSongs(data.songs || []);
      } catch (error) {
        console.error("Failed to fetch songs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const toggleLike = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post(`/users/like-song/${songId}`);
      // Visual feedback can be added later or we can fetch liked state
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  // Format greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour >= 5 && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';

  const mapToQueue = (apiSongs: any[]) => apiSongs.map(song => ({
    id: song._id,
    title: song.title,
    artist: { name: song.artist?.name || 'Unknown Artist' },
    coverArtUrl: song.coverImage || song.coverArtUrl,
    audioUrl: song.audioUrl,
    lyrics: song.lyrics
  }));

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 sticky top-0 z-20 backdrop-blur-xl bg-background/80 -mx-4 md:-mx-8 px-4 md:px-8 py-4 border-b border-white/5">
        <div className="w-full flex-1 max-w-xl md:mr-8 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium placeholder:text-gray-500"
          />
        </div>
        <div className="flex items-center justify-end w-full md:w-auto gap-4 md:gap-6">
          <h2 className="hidden lg:block text-xl font-bold text-gray-300 tracking-tight">
            {greeting}{user ? `, ${user.username}` : ''}
          </h2>
          <ProfileMenu onEditProfile={() => setIsEditProfileOpen(true)} />
        </div>
      </header>

      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />

      <section className="mb-12">
        <h3 className="text-xl font-bold text-foreground mb-6">Recently Added</h3>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {songs.map((song, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={song._id}
                className="group relative glass-card p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                  <img 
                    src={song.coverImage || song.coverArtUrl} 
                    alt={song.title}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => playQueue(mapToQueue(songs), idx)}
                      className="w-12 h-12 bg-primary text-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 hover:bg-pink-600 transition-all"
                    >
                      <FiPlay className="w-5 h-5 ml-1 fill-current" />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={(e) => toggleLike(song._id, e)}
                  className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-pink-500 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10"
                >
                  <FiHeart className="w-5 h-5 fill-current" />
                </button>
                <h4 className="font-bold text-foreground truncate">{song.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{song.artist?.name || 'Unknown Artist'}</p>
              </motion.div>
            ))}
            {songs.length === 0 && (
              <p className="text-muted-foreground col-span-full py-10 text-center">No songs uploaded yet.</p>
            )}
          </div>
        )}
      </section>

      {!loading && songs.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-white mb-6 text-gradient">Made For You</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...songs].reverse().map((song, idx) => (
              <motion.div
                key={`made-${song._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
                  <img src={song.coverImage || song.coverArtUrl} alt={song.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => playQueue(mapToQueue([...songs].reverse()), idx)}
                      className="w-12 h-12 bg-primary text-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 hover:bg-pink-600 transition-all"
                    >
                      <FiPlay className="w-5 h-5 ml-1 fill-current" />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={(e) => toggleLike(song._id, e)}
                  className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-pink-500 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10"
                >
                  <FiHeart className="w-5 h-5 fill-current" />
                </button>
                <h4 className="font-semibold text-white truncate">{song.title}</h4>
                <p className="text-sm text-gray-400 truncate mt-1">{song.artist?.name || 'Unknown Artist'}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
