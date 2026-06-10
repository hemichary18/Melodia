import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketStore } from '../../store/useSocketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { FiSend, FiUsers, FiHeadphones, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Message {
  username: string;
  text?: string;
  timestamp: string;
  type?: 'system' | 'user';
}

export const MusicRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocketStore();
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConnected || !socket || !user || !roomId) return;

    // Join room
    socket.emit('join_room', roomId, user.username);

    // Listeners
    socket.on('receive_message', (data: Message) => {
      setMessages((prev) => [...prev, { ...data, type: 'user' }]);
    });

    socket.on('user_joined', (data: { username: string, timestamp: string }) => {
      setMessages((prev) => [...prev, { username: data.username, text: 'joined the room', timestamp: data.timestamp, type: 'system' }]);
    });

    socket.on('user_left', (data: { username: string, timestamp: string }) => {
      setMessages((prev) => [...prev, { username: data.username, text: 'left the room', timestamp: data.timestamp, type: 'system' }]);
    });

    return () => {
      socket.emit('leave_room', roomId, user.username);
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [isConnected, socket, user, roomId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !user) return;

    const messageData = {
      username: user.username,
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', roomId, messageData);
    setMessages((prev) => [...prev, { ...messageData, type: 'user' }]);
    setInputText('');
  };

  if (!user) return <div className="p-8 text-center text-white">Please log in to join rooms.</div>;

  return (
    <div className="max-w-6xl mx-auto h-full p-4 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden">
      
      {/* Left Panel: Player & Queue */}
      <div className="flex-1 flex flex-col gap-4 lg:gap-6 min-h-[40%] lg:min-h-0 overflow-hidden">
        <div className="glass-card rounded-2xl p-4 lg:p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="overflow-hidden w-full sm:w-auto flex-1 pr-4">
            <h1 className="text-lg lg:text-2xl font-bold text-white flex items-center gap-2 truncate">
              <FiHeadphones className="text-primary shrink-0" /> 
              <span className="truncate">Room: {roomId}</span>
            </h1>
            <p className="text-xs lg:text-sm text-gray-400 mt-1 truncate">Listening together in real-time</p>
          </div>
          <button 
            onClick={() => navigate('/communities')}
            className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-4 py-2 rounded-xl shrink-0 w-full sm:w-auto text-sm lg:text-base font-medium"
          >
            <FiLogOut /> Leave Room
          </button>
        </div>

        <div className="glass-card flex-1 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-gray-400 p-6 text-center min-h-[150px]">
           {/* Placeholder for synchronized player and queue */}
           <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-white/5 flex items-center justify-center mb-4 shrink-0">
             <FiMusic className="w-8 h-8 lg:w-10 lg:h-10 text-gray-500" />
           </div>
           <p className="text-sm lg:text-base max-w-sm">Live Queue & Synchronized Player coming in Party Mode phase.</p>
        </div>
      </div>

      {/* Right Panel: Chat */}
      <div className="w-full lg:w-80 lg:max-w-xs glass-card rounded-2xl border border-white/5 flex flex-col flex-1 lg:flex-initial min-h-[50%] lg:min-h-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2 font-semibold text-white">
          <FiUsers className="text-primary" /> Live Chat
        </div>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.type === 'system' ? 'items-center' : (msg.username === user.username ? 'items-end' : 'items-start')}`}
            >
              {msg.type === 'system' ? (
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                  <span className="font-medium text-gray-400">{msg.username}</span> {msg.text}
                </span>
              ) : (
                <div className={`max-w-[85%] ${msg.username === user.username ? 'bg-primary/20 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white/10 text-gray-200 rounded-r-2xl rounded-tl-2xl'} p-3 text-sm`}>
                  {msg.username !== user.username && (
                    <p className="text-[10px] text-gray-400 mb-1 font-medium">{msg.username}</p>
                  )}
                  <p>{msg.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Chat..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || !isConnected}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-pink-500 disabled:opacity-50 transition-colors"
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Also import FiMusic which was missing above:
import { FiMusic } from 'react-icons/fi';
