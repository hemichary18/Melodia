import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlay } from 'react-icons/fi';
import api from '../../services/api';
import { usePlayerStore } from '../../store/usePlayerStore';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const playSong = usePlayerStore(state => state.playSong);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/songs/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/10 rounded-full px-12 py-4 text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground shadow-lg backdrop-blur-md"
          />
        </div>
      </header>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <h3 className="text-xl font-bold mb-2">No results found for "{query}"</h3>
          <p>Please make sure your words are spelled correctly or use less or different keywords.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {results.map((song, idx) => (
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
                      audioUrl: song.audioUrl,
                      lyrics: song.lyrics
                    })}
                    className="w-12 h-12 bg-primary text-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 hover:bg-pink-600 transition-all"
                  >
                    <FiPlay className="w-5 h-5 ml-1 fill-current" />
                  </button>
                </div>
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
