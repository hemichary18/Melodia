import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMusic, FiUsers, FiThumbsUp, FiThumbsDown, FiPlay, FiSkipForward, FiSettings, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '../../store/useSocketStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { usePlayerStore } from '../../store/usePlayerStore';

export const PartyMode = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocketStore();
  const { user } = useAuthStore();
  const { currentSong, isPlaying, togglePlay, playNext } = usePlayerStore();
  
  const [queue, setQueue] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState(1);
  const [search, setSearch] = useState('');
  const [allSongs, setAllSongs] = useState<any[]>([]);
  
  const isHost = true; // Hardcoded for demo

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await api.get('/songs');
        setAllSongs(data.songs || []);
      } catch (error) {
        console.error('Failed to fetch songs', error);
      }
    };
    fetchSongs();

    if (!isConnected || !socket || !user) return;

    socket.emit('join_room', 'party_global', user.username);

    socket.on('queue_updated', (newQueue) => {
      setQueue(newQueue);
    });

    socket.on('user_joined', () => setActiveUsers(u => u + 1));
    socket.on('user_left', () => setActiveUsers(u => Math.max(1, u - 1)));

    return () => {
      socket.emit('leave_room', 'party_global', user.username);
      socket.off('queue_updated');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [isConnected, socket, user]);

  const addToQueue = (song: any) => {
    if (!socket) return;
    const newQueue = [...queue, { ...song, votes: 0, addedBy: user?.username }];
    setQueue(newQueue);
    socket.emit('sync_queue', 'party_global', newQueue);
    setSearch('');
  };

  const voteSong = (index: number, val: number) => {
    if (!socket) return;
    const newQueue = [...queue];
    newQueue[index].votes += val;
    // Sort by votes
    newQueue.sort((a, b) => b.votes - a.votes);
    setQueue(newQueue);
    socket.emit('sync_queue', 'party_global', newQueue);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f15] overflow-hidden flex flex-col font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]" />
      </div>

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition">
             <FiX className="w-5 h-5" />
           </button>
           <div>
             <h1 className="text-xl font-bold text-white flex items-center gap-2">
               <FiMusic className="text-primary" /> Melodia Global Party
             </h1>
             <p className="text-sm text-primary flex items-center gap-1 font-medium">
               <FiUsers /> {activeUsers} Listening Now
             </p>
           </div>
        </div>
        {isHost && (
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition">
            <FiSettings /> Host Controls
          </button>
        )}
      </header>

      <main className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left: Player & Current Song */}
        <div className="w-1/2 p-12 flex flex-col justify-center items-center border-r border-white/5">
           <motion.div 
             animate={isPlaying ? { scale: [1, 1.02, 1] } : { scale: 1 }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-96 h-96 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden mb-8 bg-white/5"
           >
             <img src={currentSong?.coverArtUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&h=800&fit=crop"} alt="Now Playing" className="w-full h-full object-cover" />
           </motion.div>
           <h2 className="text-4xl font-black text-white mb-2 tracking-tight line-clamp-1">{currentSong?.title || 'No Song Playing'}</h2>
           <p className="text-xl text-gray-400 mb-10 line-clamp-1">{currentSong?.artist?.name || 'Waiting for host...'}</p>

           {isHost && (
             <div className="flex items-center gap-6">
               <button 
                 onClick={togglePlay}
                 className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition shadow-lg shadow-primary/30"
               >
                 {isPlaying ? <FiPause className="w-6 h-6" /> : <FiPlay className="w-6 h-6 ml-1" />}
               </button>
               <button 
                 onClick={playNext}
                 className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
               >
                 <FiSkipForward className="w-5 h-5" />
               </button>
             </div>
           )}
        </div>

        {/* Right: Collaborative Queue */}
        <div className="w-1/2 p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Up Next</h3>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search to add to queue..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition"
            />
            
            {/* Search Results */}
            {search && (
              <div className="mt-2 bg-gray-900 rounded-xl border border-white/10 overflow-hidden absolute w-[calc(50%-4rem)] z-20">
                {allSongs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || (s.artist?.name || '').toLowerCase().includes(search.toLowerCase())).slice(0, 5).map(song => (
                  <div key={song._id} className="p-3 hover:bg-white/5 flex items-center justify-between cursor-pointer" onClick={() => addToQueue(song)}>
                    <div className="flex items-center gap-3">
                      <img src={song.coverImage || song.coverArtUrl} className="w-10 h-10 rounded-md object-cover" />
                      <div>
                        <p className="text-white text-sm font-bold truncate max-w-[200px]">{song.title}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">{song.artist?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <span className="text-primary text-sm font-medium">+ Add</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar relative z-10">
            {queue.map((song, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx} 
                className="glass-card p-4 rounded-xl flex items-center gap-4 border border-white/5"
              >
                <div className="font-bold text-gray-500 w-4">{idx + 1}</div>
                <img src={song.coverImage || song.coverArtUrl} alt="Cover" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-white font-bold truncate">{song.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{song.artist?.name || 'Unknown'} • Added by {song.addedBy}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => voteSong(idx, 1)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-green-400 transition">
                    <FiThumbsUp />
                  </button>
                  <span className="text-white font-bold w-4 text-center">{song.votes}</span>
                  <button onClick={() => voteSong(idx, -1)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition">
                    <FiThumbsDown />
                  </button>
                </div>
              </motion.div>
            ))}
            {queue.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 pt-20">
                <FiMusic className="w-12 h-12 mb-4 opacity-50" />
                <p>The queue is empty.</p>
                <p className="text-sm">Search for a song to get the party started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
