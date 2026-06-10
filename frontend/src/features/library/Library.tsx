import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiHeart, FiPlus, FiMusic, FiX, FiTrash2, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { usePlayerStore } from '../../store/usePlayerStore';

export const Library = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<any[]>([]); // liked songs
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [allAvailableSongs, setAllAvailableSongs] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'likes' | 'playlists'>('likes');
  
  // Playlist Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const { playQueue } = usePlayerStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [libraryRes, playlistsRes, allSongsRes] = await Promise.all([
        api.get('/users/library'),
        api.get('/playlists'),
        api.get('/songs')
      ]);
      setSongs(libraryRes.data || []);
      setPlaylists(playlistsRes.data || []);
      setAllAvailableSongs(allSongsRes.data.songs || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    try {
      await api.post('/playlists', { 
        title: newPlaylistTitle,
        songs: selectedSongIds 
      });
      // Refresh playlists to get populated songs
      const playlistsRes = await api.get('/playlists');
      setPlaylists(playlistsRes.data || []);
      
      setIsCreateModalOpen(false);
      setNewPlaylistTitle('');
      setSelectedSongIds([]);
    } catch (error) {
      console.error('Failed to create playlist', error);
    }
  };

  const handleDeletePlaylist = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete playlist', error);
    }
  };

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

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

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
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Your Library</h2>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 mt-8 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('likes')}
            className={`pb-4 text-sm md:text-base font-medium transition-colors relative ${activeTab === 'likes' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Liked Songs
            {activeTab === 'likes' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('playlists')}
            className={`pb-4 text-sm md:text-base font-medium transition-colors relative ${activeTab === 'playlists' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Playlists
            {activeTab === 'playlists' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'likes' ? (
        songs.length === 0 ? (
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
                      onClick={() => playQueue(mapToQueue(songs), idx)}
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
        )
      ) : (
        /* Playlists Tab */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {/* Create Playlist Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="group glass-card p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center aspect-square border-dashed border-2 border-white/20 hover:border-primary/50"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
              <FiPlus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-white text-center">Create Playlist</h4>
          </motion.div>

          {/* User Playlists */}
          {playlists.map((playlist, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={playlist._id}
              onClick={() => navigate(`/playlist/${playlist._id}`)}
              className="group relative glass-card p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
                {playlist.songs.length > 0 && (playlist.songs[0]?.coverImage || playlist.songs[0]?.coverArtUrl) ? (
                  <img src={playlist.songs[0].coverImage || playlist.songs[0].coverArtUrl} alt="Cover" className="object-cover w-full h-full" />
                ) : (
                  <FiMusic className="w-12 h-12 text-gray-600" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playlist.songs.length > 0) {
                        playQueue(mapToQueue(playlist.songs), 0);
                      }
                    }}
                    className="w-12 h-12 bg-primary text-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 hover:bg-pink-600 transition-all"
                  >
                    <FiPlay className="w-5 h-5 ml-1 fill-current" />
                  </button>
                </div>
                <button 
                  onClick={(e) => handleDeletePlaylist(playlist._id, e)}
                  className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 hover:text-destructive hover:scale-110 transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold text-foreground truncate">{playlist.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{playlist.songs.length} tracks</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-32 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-xl relative shadow-2xl max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
              >
                <FiX className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-6">Create New Playlist</h3>
              
              <form onSubmit={handleCreatePlaylist} className="flex flex-col flex-1 overflow-hidden">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Playlist Name</label>
                  <input 
                    type="text" 
                    autoFocus
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    placeholder="My Awesome Mix"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="flex-1 overflow-y-auto mb-6 no-scrollbar border border-white/5 rounded-xl p-2 bg-black/20">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 px-2 pt-2">Select Songs ({selectedSongIds.length} selected)</h4>
                  <div className="space-y-1">
                    {allAvailableSongs.map(song => (
                      <div 
                        key={song._id}
                        onClick={() => toggleSongSelection(song._id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedSongIds.includes(song._id) ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={song.coverImage} className="w-10 h-10 rounded-md object-cover" alt="" />
                          <div className="truncate">
                            <p className="text-white text-sm font-medium truncate">{song.title}</p>
                            <p className="text-gray-400 text-xs truncate">{song.artist?.name}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedSongIds.includes(song._id) ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                          {selectedSongIds.includes(song._id) && <FiCheck className="text-white w-3 h-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!newPlaylistTitle.trim()}
                  className="w-full bg-primary hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-primary/20 mt-auto"
                >
                  Create Playlist
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
