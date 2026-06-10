import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (url?: string) => void;
  disconnect: () => void;
}

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (url = SOCKET_URL) => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) return;

    const newSocket = io(url, {
      withCredentials: true,
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      set({ isConnected: true });
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Socket disconnected');
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
