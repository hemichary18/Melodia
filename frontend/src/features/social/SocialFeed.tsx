import { useState, useEffect, useRef } from 'react';
import { PostCard } from './components/PostCard';
import { FiEdit3, FiImage, FiMusic, FiX } from 'react-icons/fi';
import api from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const { user } = useAuthStore();

  // New Post State
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [isSongDropdownOpen, setIsSongDropdownOpen] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchSongs();
  }, []);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get('/social/feed');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch feed', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongs = async () => {
    try {
      const { data } = await api.get('/songs');
      setAllSongs(data.songs || []);
    } catch (error) {
      console.error('Failed to fetch songs', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setPostImagePreview(null);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !postImage && !selectedSong) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      
      if (postImage) {
        const formData = new FormData();
        formData.append('file', postImage);
        formData.append('upload_preset', 'melodia_uploads');
        const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dmv2t4q1o/image/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      }

      await api.post('/social/post', { 
        content: newPost,
        imageUrl,
        attachedSongId: selectedSong ? selectedSong._id : undefined
      });
      
      await fetchFeed();
      
      setNewPost('');
      setPostImage(null);
      setPostImagePreview(null);
      setSelectedSong(null);
    } catch (error) {
      console.error('Failed to create post', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSongs = allSongs.filter(song => 
    song.title.toLowerCase().includes(songSearchQuery.toLowerCase()) || 
    (song.artist?.name || '').toLowerCase().includes(songSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Social Feed</h1>
        <p className="text-gray-400 text-sm">See what the Melodia community is listening to.</p>
      </div>

      <form onSubmit={handlePostSubmit} className="mb-10 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-pink-500 overflow-hidden flex items-center justify-center flex-shrink-0">
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Me" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">{user?.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share a song or your thoughts..."
              className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 resize-none min-h-[60px] placeholder:text-gray-500 text-sm mt-2"
            />

            {/* Attachments Preview */}
            {(postImagePreview || selectedSong) && (
              <div className="mt-4 space-y-3">
                {postImagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-64">
                    <img src={postImagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
                {selectedSong && (
                  <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4 relative border border-white/5">
                    <img src={selectedSong.coverImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedSong.title}</p>
                      <p className="text-xs text-gray-400">{selectedSong.artist?.name}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedSong(null)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                      <FiX />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 relative">
                {/* Image Upload */}
                <label className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full cursor-pointer transition-colors">
                  <FiImage className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>

                {/* Song Selection */}
                <button 
                  type="button"
                  onClick={() => setIsSongDropdownOpen(!isSongDropdownOpen)}
                  className={`p-2 rounded-full transition-colors ${isSongDropdownOpen ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-primary/10'}`}
                >
                  <FiMusic className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isSongDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-[#1f1f22] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-2 border-b border-white/5">
                        <input 
                          type="text" 
                          placeholder="Search for a song..." 
                          value={songSearchQuery}
                          onChange={(e) => setSongSearchQuery(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto no-scrollbar p-2 space-y-1">
                        {filteredSongs.length > 0 ? filteredSongs.map(song => (
                          <div 
                            key={song._id}
                            onClick={() => {
                              setSelectedSong(song);
                              setIsSongDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <img src={song.coverImage} className="w-8 h-8 rounded-md object-cover" alt="" />
                            <div className="truncate">
                              <p className="text-white text-xs font-medium truncate">{song.title}</p>
                              <p className="text-gray-400 text-[10px] truncate">{song.artist?.name}</p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-center text-xs text-gray-500 py-4">No songs found</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || (!newPost.trim() && !postImage && !selectedSong)}
                className="bg-primary hover:bg-pink-600 text-white px-5 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiEdit3 className="w-4 h-4" /> Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 rounded-2xl h-40 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">No posts yet. Be the first to share!</p>
          )}
        </div>
      )}
    </div>
  );
};
