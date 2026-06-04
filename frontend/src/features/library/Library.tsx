import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiHeart } from 'react-icons/fi';
import api from '../../services/api';
import { usePlayerStore } from '../../store/usePlayerStore';

export const Library = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const playSong = usePlayerStore(state => state.playSong);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/library');
      setSongs(data || []);
    } catch (error) {
      console.error('Failed to fetch library', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const toggleLike = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post(`/users/like-song/${songId}`);
      // Remove from UI immediately for snappy UX
      setSongs(prev => prev.filter(song => song._id !== songId));
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto">
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Your Library</h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">The songs you loved.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl backdrop-blur-md border border-white/5">
          <FiHeart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No liked songs yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start exploring and tap the heart icon on songs you like to build your personal library!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {songs.map((song, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
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
                    onClick={() => playSong({
                      id: song._id,
                      title: song.title,
                      artist: { name: song.artist?.name || 'Unknown Artist' },
                      coverArtUrl: song.coverImage || song.coverArtUrl,
                      audioUrl: song.audioUrl
                    })}
                    className="w-12 h-12 bg-primary text-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 hover:bg-pink-600 transition-all"
                  >
                    <FiPlay className="w-5 h-5 ml-1 fill-current" />
                  </button>
                </div>
                <button 
                  onClick={(e) => toggleLike(song._id, e)}
                  className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-pink-500 hover:scale-110 transition-transform"
                >
                  <FiHeart className="w-5 h-5 fill-current" />
                </button>
              </div>
              <h4 className="font-bold text-foreground truncate">{song.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{song.artist?.name || 'Unknown Artist'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
