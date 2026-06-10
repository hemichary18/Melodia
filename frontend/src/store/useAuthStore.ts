import { create } from 'zustand';
import { useSocketStore } from './useSocketStore';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
    useSocketStore.getState().connect();
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    useSocketStore.getState().disconnect();
  },
}));
