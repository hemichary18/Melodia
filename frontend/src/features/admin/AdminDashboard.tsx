import { useState } from 'react';
import { FiUploadCloud, FiMusic, FiImage, FiCheckCircle, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import * as jsmediatags from 'jsmediatags';

interface SongUpload {
  id: string;
  title: string;
  artistName: string;
  genre: string;
  audioFile: File | null;
  imageFile: File | null;
  lyricsFile: File | null;
}

export const AdminDashboard = () => {
  const [songs, setSongs] = useState<SongUpload[]>([{
    id: Date.now().toString(),
    title: '',
    artistName: '',
    genre: '',
    audioFile: null,
    imageFile: null,
    lyricsFile: null,
  }]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const addSong = () => {
    setSongs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      title: '', artistName: '', genre: '', audioFile: null, imageFile: null, lyricsFile: null
    }]);
  };

  const removeSong = (id: string) => {
    if (songs.length === 1) return;
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  const updateSong = (id: string, updates: Partial<SongUpload>) => {
    setSongs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const uploadToCloudinary = async (file: File, resourceType: 'auto' | 'video' | 'image' | 'raw' = 'auto') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Melodia');
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name} to Cloudinary`);
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) {
      updateSong(id, { audioFile: null });
      return;
    }
    updateSong(id, { audioFile: file });
    
    jsmediatags.read(file, {
      onSuccess: function(tag) {
        const tags = tag.tags;
        setSongs(prev => prev.map(s => {
          if (s.id !== id) return s;
          const updates: Partial<SongUpload> = {};
          if (tags.title && !s.title) updates.title = tags.title;
          if (tags.artist && !s.artistName) updates.artistName = tags.artist;
          if (tags.genre && !s.genre) updates.genre = tags.genre;
          
          if (tags.picture && !s.imageFile) {
            try {
              const data = tags.picture.data;
              const format = tags.picture.format;
              const byteArray = new Uint8Array(data);
              const blob = new Blob([byteArray], { type: format });
              const coverFile = new File([blob], 'cover.jpg', { type: format });
              updates.imageFile = coverFile;
            } catch (err) {
              console.error('Failed to extract image from ID3 tags', err);
            }
          }
          return { ...s, ...updates };
        }));
      },
      onError: function(error) {
        console.error('Failed to parse ID3 tags:', error);
      }
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    for (const song of songs) {
      if (!song.title || !song.artistName || !song.audioFile || !song.imageFile) {
        setError('Please fill in Song Title, Artist Name, MP3, and Album Cover for all songs.');
        return;
      }
    }

    setIsUploading(true);
    setError('');
    setMessage('');
    setProgress(5);

    try {
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const baseProgress = (i / songs.length) * 100;
        const progressStep = 100 / songs.length;
        
        setProgress(baseProgress + progressStep * 0.2);
        const coverImage = await uploadToCloudinary(song.imageFile!, 'image');
        
        setProgress(baseProgress + progressStep * 0.5);
        const audioUrl = await uploadToCloudinary(song.audioFile!, 'video');
        
        setProgress(baseProgress + progressStep * 0.8);
        let lyricsUrl = '';
        if (song.lyricsFile) {
          lyricsUrl = await uploadToCloudinary(song.lyricsFile, 'raw');
        }
        
        setProgress(baseProgress + progressStep * 0.9);
        await api.post('/songs', {
          title: song.title,
          artistName: song.artistName,
          genre: song.genre || 'Unknown',
          coverImage,
          audioUrl,
          lyrics: lyricsUrl,
          duration: 180 
        });
      }

      setProgress(100);
      setMessage(`Successfully uploaded ${songs.length} song${songs.length > 1 ? 's' : ''}!`);
      
      // Reset form
      setSongs([{
        id: Date.now().toString(),
        title: '', artistName: '', genre: '', audioFile: null, imageFile: null, lyricsFile: null
      }]);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'An error occurred during upload.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-5xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-2">Batch upload new songs to the platform</p>
      </header>

      <div className="glass-card p-4 md:p-8 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {progress > 0 && (
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-12">
          
          {error && (
            <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-xl text-destructive-foreground text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-50 text-sm flex items-center gap-2">
              <FiCheckCircle className="w-5 h-5 text-green-400" />
              {message}
            </div>
          )}

          <div className="space-y-8">
            {songs.map((song, index) => (
              <div key={song.id} className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl relative group">
                {songs.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeSong(song.id)}
                    className="absolute top-2 right-2 md:-top-3 md:-right-3 w-8 h-8 bg-destructive hover:bg-destructive/80 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-10"
                    title="Remove Song"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
                
                <h3 className="text-lg font-bold text-white/50 mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">{index + 1}</span>
                  Song Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Song Title</label>
                    <input 
                      type="text" 
                      value={song.title}
                      onChange={(e) => updateSong(song.id, { title: e.target.value })}
                      placeholder="e.g. Blinding Lights"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      disabled={isUploading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Artist Name</label>
                    <input 
                      type="text" 
                      value={song.artistName}
                      onChange={(e) => updateSong(song.id, { artistName: e.target.value })}
                      placeholder="e.g. The Weeknd"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Audio Upload */}
                  <label className={`border-2 border-dashed ${song.audioFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'} rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="audio/*"
                      onChange={(e) => handleAudioChange(e, song.id)}
                      disabled={isUploading}
                    />
                    <FiMusic className={`w-8 h-8 mb-3 ${song.audioFile ? 'text-primary' : 'text-muted-foreground'}`} />
                    <h4 className="text-xs font-medium text-foreground truncate max-w-[150px]">
                      {song.audioFile ? song.audioFile.name : 'Upload MP3'}
                    </h4>
                  </label>

                  {/* Image Upload */}
                  <label className={`border-2 border-dashed ${song.imageFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'} rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => updateSong(song.id, { imageFile: e.target.files?.[0] || null })}
                      disabled={isUploading}
                    />
                    {song.imageFile && (
                      <img src={URL.createObjectURL(song.imageFile)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
                    )}
                    <FiImage className={`w-8 h-8 mb-3 ${song.imageFile ? 'text-primary' : 'text-muted-foreground'} relative z-10`} />
                    <h4 className="text-xs font-medium text-foreground truncate max-w-[150px] relative z-10">
                      {song.imageFile ? song.imageFile.name : 'Album Cover'}
                    </h4>
                  </label>

                  {/* Lyrics Upload */}
                  <label className={`border-2 border-dashed ${song.lyricsFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'} rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".lrc,.txt"
                      onChange={(e) => updateSong(song.id, { lyricsFile: e.target.files?.[0] || null })}
                      disabled={isUploading}
                    />
                    <div className={`w-8 h-8 mb-3 rounded-full flex items-center justify-center ${song.lyricsFile ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                      <span className="font-bold text-[10px]">LRC</span>
                    </div>
                    <h4 className="text-xs font-medium text-foreground truncate max-w-[150px]">
                      {song.lyricsFile ? song.lyricsFile.name : 'Lyrics File'}
                    </h4>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="button"
              onClick={addSong}
              disabled={isUploading}
              className="flex-1 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-medium py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Another Song
            </button>
            <button 
              type="submit"
              disabled={isUploading}
              className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Uploading... {Math.round(progress)}%
                </>
              ) : (
                <>
                  <FiUploadCloud className="w-5 h-5" />
                  Upload All to Database
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
