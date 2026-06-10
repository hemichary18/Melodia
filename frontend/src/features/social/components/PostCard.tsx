import { FiHeart, FiMessageCircle, FiShare2, FiPlayCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface PostProps {
  post: {
    _id: string;
    userId: { username: string; profilePictureUrl?: string };
    content: string;
    attachedSongId?: { title: string; coverImage: string; audioUrl: string; _id: string; artist: { name: string } };
    imageUrl?: string;
    likes: string[];
    comments: any[];
    createdAt: string;
  };
}

export const PostCard = ({ post }: PostProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-pink-500 overflow-hidden flex items-center justify-center">
          {post.userId.profilePictureUrl ? (
            <img src={post.userId.profilePictureUrl} alt={post.userId.username} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-sm">{post.userId.username.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-white">{post.userId.username}</h4>
          <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <p className="text-gray-200 text-sm">{post.content}</p>

      {post.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-white/10 mt-3 relative aspect-video">
          <img src={post.imageUrl} alt="Post attachment" className="w-full h-full object-cover" />
        </div>
      )}

      {post.attachedSongId && (
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
          <img src={post.attachedSongId.coverImage} alt="Song cover" className="w-12 h-12 rounded-lg object-cover shadow-md" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{post.attachedSongId.title}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FiPlayCircle /> Listen Now
            </p>
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-gray-400 text-sm">
        <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
          <FiHeart className="w-5 h-5" />
          <span>{post.likes.length}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <FiMessageCircle className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-white transition-colors">
          <FiShare2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </motion.div>
  );
};
