import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: { name: string };
  coverArtUrl: string;
  audioUrl: string;
  lyrics?: string;
}

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isDrawerOpen: boolean;
  playSong: (song: Song) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  isDrawerOpen: false,
  playSong: (song) => set({ currentSong: song, queue: [song], currentIndex: 0, isPlaying: true }),
  playQueue: (songs, startIndex = 0) => {
    if (songs.length === 0) return;
    set({
      queue: songs,
      currentIndex: startIndex,
      currentSong: songs[startIndex],
      isPlaying: true
    });
  },
  playNext: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    set({ currentIndex: nextIndex, currentSong: queue[nextIndex], isPlaying: true });
  },
  playPrevious: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ currentIndex: prevIndex, currentSong: queue[prevIndex], isPlaying: true });
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
}));
