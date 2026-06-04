import { create } from 'zustand';

interface PlayerState {
  currentSong: any | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playSong: (song: any) => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
}));
