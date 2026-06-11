import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSocketStore } from './useSocketStore';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'auth-storage',
    }
  )
);
