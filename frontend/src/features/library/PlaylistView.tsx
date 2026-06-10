import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiMusic } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { usePlayerStore } from '../../store/usePlayerStore';

export const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data } = await api.get(`/playlists/${id}`);
        setPlaylist(data);
      } catch (error) {
        console.error('Failed to fetch playlist', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center py-20">
        <h2 className="text-2xl text-white font-bold mb-4">Playlist not found</h2>
        <button onClick={() => navigate('/library')} className="text-primary hover:underline">Return to Library</button>
      </div>
    );
  }

  const mapToQueue = (apiSongs: any[]) => apiSongs.map(song => ({
    id: song._id,
    title: song.title,
    artist: { name: song.artist?.name || 'Unknown Artist' },
    coverArtUrl: song.coverImage || song.coverArtUrl,
    audioUrl: song.audioUrl,
    lyrics: song.lyrics
  }));

  const coverUrl = playlist.songs.length > 0 && (playlist.songs[0].coverImage || playlist.songs[0].coverArtUrl);

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end gap-6 mb-12">
        <button 
          onClick={() => navigate('/library')}
          className="absolute top-8 left-8 md:static md:w-12 md:h-12 w-10 h-10 bg-white/10 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center mt-12 md:mt-0 flex-shrink-0">
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <FiMusic className="w-20 h-20 text-gray-600" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold tracking-widest text-white/70 uppercase hidden md:block">Playlist</p>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter line-clamp-2">{playlist.title}</h1>
          <p className="text-gray-400 mt-2">{playlist.songs.length} tracks</p>
          
          <button 
            onClick={() => playlist.songs.length > 0 && playQueue(mapToQueue(playlist.songs), 0)}
            disabled={playlist.songs.length === 0}
            className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 hover:bg-pink-600 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlay className="w-6 h-6 ml-1 fill-current" />
          </button>
        </div>
      </div>

      {/* Tracklist */}
      <div className="mt-8 bg-black/20 rounded-3xl p-6 border border-white/5">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 mb-4 px-4 text-sm font-medium text-gray-400 border-b border-white/10 pb-4">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div>Play</div>
        </div>

        {playlist.songs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            This playlist is empty. Add some songs from your library!
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.songs.map((song: any, index: number) => (
              <motion.div 
                key={song._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-3 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="w-8 text-center text-gray-500 group-hover:text-white font-medium">{index + 1}</div>
                <div className="flex items-center gap-4 overflow-hidden">
                  <img src={song.coverImage || song.coverArtUrl} alt="Cover" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-white font-medium truncate">{song.title}</p>
                    <p className="text-sm text-gray-400 truncate">{song.artist?.name || 'Unknown Artist'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => playQueue(mapToQueue(playlist.songs), index)}
                  className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                >
                  <FiPlay className="w-4 h-4 ml-0.5 fill-current" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
