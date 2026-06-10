import { useState, useEffect } from 'react';
import { FiUsers, FiMusic, FiArrowRight, FiMessageSquare, FiX, FiImage } from 'react-icons/fi';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const Communities = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Community State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    genre: '',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data } = await api.get('/social/communities');
      setCommunities(data);
    } catch (error) {
      console.error('Failed to fetch communities', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.name.trim() || !newCommunity.genre.trim()) return;
    
    setIsSubmitting(true);
    try {
      let coverImageUrl = '';
      
      // Upload image to cloudinary if exists
      if (coverImage) {
        const formData = new FormData();
        formData.append('file', coverImage);
        formData.append('upload_preset', 'melodia_uploads');
        const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dmv2t4q1o/image/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        coverImageUrl = uploadData.secure_url;
      }

      const { data } = await api.post('/social/communities', {
        ...newCommunity,
        coverImageUrl
      });
      
      setCommunities([data, ...communities] as any);
      setIsCreateModalOpen(false);
      setNewCommunity({ name: '', description: '', genre: '' });
      setCoverImage(null);
      setCoverPreview(null);
    } catch (error) {
      console.error('Failed to create community', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar relative">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Communities</h1>
          <p className="text-gray-400 text-sm">Join groups, discuss your favorite genres, and find new music.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/5"
        >
          Create Community
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card h-48 rounded-2xl animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((community: any) => (
            <div key={community._id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all group cursor-pointer relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
              {community.coverImageUrl ? (
                <img src={community.coverImageUrl} alt={community.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-pink-600/20" />
              )}
              
              <div className="relative z-20 p-6 h-full flex flex-col justify-end min-h-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    {community.genre}
                  </span>
                  <span className="flex items-center gap-1 text-gray-300 text-xs bg-black/40 px-2 py-1 rounded-md backdrop-blur-md">
                    <FiUsers /> {community.members.length} members
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{community.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-2 mb-4">{community.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">Led by <span className="text-white font-medium">{community.adminId.username}</span></span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <FiArrowRight className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {communities.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/20 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FiMusic className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-white font-medium mb-1">No communities found</h3>
              <p className="text-gray-400 text-sm">Be the first to create one!</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button for Social Feed */}
      <button 
        onClick={() => navigate('/social')}
        className="fixed bottom-28 md:bottom-32 right-8 z-50 w-16 h-16 bg-primary hover:bg-pink-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all hover:scale-110 active:scale-95 group"
        title="Open Social Feed"
      >
        <FiMessageSquare className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md">
          Social Feed
        </span>
      </button>

      {/* Create Community Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
              >
                <FiX className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-6">Create Community</h3>
              
              <form onSubmit={handleCreateCommunity} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Community Cover Image</label>
                  <label className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden h-32">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    {coverPreview ? (
                      <img src={coverPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                          <FiImage className="text-gray-400 w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-white">Upload image</span>
                      </>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    placeholder="E.g., Synthwave Lovers"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Genre focus</label>
                  <input 
                    type="text" 
                    required
                    value={newCommunity.genre}
                    onChange={(e) => setNewCommunity({ ...newCommunity, genre: e.target.value })}
                    placeholder="E.g., Electronic"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea 
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    placeholder="What is this community about?"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !newCommunity.name.trim() || !newCommunity.genre.trim()}
                  className="w-full bg-primary hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-primary/20 mt-4 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Create Community'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
