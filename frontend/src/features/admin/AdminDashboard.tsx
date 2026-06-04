import { useState, useRef } from 'react';
import { FiUploadCloud, FiMusic, FiImage, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';

export const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [genre, setGenre] = useState('');
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File, resourceType: 'auto' | 'video' | 'image' = 'auto') => {
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistName || !genre || !audioFile || !imageFile) {
      setError('Please fill in all fields and select both files.');
      return;
    }

    setIsUploading(true);
    setError('');
    setMessage('');
    setProgress(10);

    try {
      // 1. Upload Cover Image to Cloudinary
      const coverImage = await uploadToCloudinary(imageFile, 'image');
      setProgress(40);

      // 2. Upload Audio File to Cloudinary
      // Cloudinary treats audio as 'video' resource_type or 'raw', 'video' is usually best for mp3
      const audioUrl = await uploadToCloudinary(audioFile, 'video');
      setProgress(80);

      // 3. Save song metadata to backend MongoDB
      // We will first find or create the Artist on the backend, then create the song
      await api.post('/songs', {
        title,
        artistName,
        genre,
        coverImage,
        audioUrl,
        duration: 180 // Optional: Extract actual duration or use dummy
      });

      setProgress(100);
      setMessage('Song uploaded and saved to database successfully!');
      
      // Reset form
      setTitle('');
      setArtistName('');
      setGenre('');
      setAudioFile(null);
      setImageFile(null);
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';

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
    <div className="p-8 pb-32 max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-2">Upload new songs to the platform</p>
      </header>

      <div className="glass-card p-8 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {progress > 0 && (
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Song Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blinding Lights"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Artist Name</label>
              <input 
                type="text" 
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g. The Weeknd"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Genre</label>
            <input 
              type="text" 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Synthpop, R&B"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isUploading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Audio Upload */}
            <div 
              className={`border-2 border-dashed ${audioFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'} rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all`}
              onClick={() => audioInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={audioInputRef} 
                className="hidden" 
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
              <FiMusic className={`w-10 h-10 mb-4 ${audioFile ? 'text-primary' : 'text-muted-foreground'}`} />
              <h4 className="text-sm font-medium text-foreground">
                {audioFile ? audioFile.name : 'Click to upload MP3'}
              </h4>
              <p className="text-xs text-muted-foreground mt-2">Maximum file size 50MB</p>
            </div>

            {/* Image Upload */}
            <div 
              className={`border-2 border-dashed ${imageFile ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'} rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden`}
              onClick={() => imageInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
              ) : null}
              <FiImage className={`w-10 h-10 mb-4 ${imageFile ? 'text-primary' : 'text-muted-foreground'} relative z-10`} />
              <h4 className="text-sm font-medium text-foreground relative z-10">
                {imageFile ? imageFile.name : 'Click to upload Album Cover'}
              </h4>
              <p className="text-xs text-muted-foreground mt-2 relative z-10">JPEG, PNG up to 5MB</p>
            </div>

          </div>

          <button 
            type="submit"
            disabled={isUploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Uploading... {progress}%
              </>
            ) : (
              <>
                <FiUploadCloud className="w-5 h-5" />
                Upload to Cloudinary & Save
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};
