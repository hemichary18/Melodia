import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export const GlobalAudio = () => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    setProgress, 
    setDuration, 
    setAudioElement 
  } = usePlayerStore();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (audioRef.current.src !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl;
        setProgress(0);
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying, setProgress]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    usePlayerStore.setState({ isPlaying: false });
    // Automatically play next if queue has more items? Optional.
    // usePlayerStore.getState().playNext(); 
  };

  return (
    <audio 
      ref={audioRef} 
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onLoadedMetadata={handleTimeUpdate}
    />
  );
};
