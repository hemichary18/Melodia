import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from './models/Song.js';
import Artist from './models/Artist.js';

dotenv.config();

const dummySongs = [
  {
    title: 'Neon Nights',
    genre: 'Electronic',
    tags: ['energetic', 'dance', 'party', 'gym'],
    duration: 210,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artistName: 'Synthwave Kings'
  },
  {
    title: 'Midnight Rain',
    genre: 'Lo-Fi',
    tags: ['sad', 'chill', 'rain', 'sleep', 'melancholy'],
    duration: 180,
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    artistName: 'Lofi Dreamer'
  },
  {
    title: 'Morning Coffee',
    genre: 'Acoustic',
    tags: ['chill', 'morning', 'acoustic', 'focus', 'relax'],
    duration: 150,
    coverImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    artistName: 'Acoustic Soul'
  },
  {
    title: 'Adrenaline Rush',
    genre: 'Rock',
    tags: ['energetic', 'gym', 'workout', 'rock', 'hype'],
    duration: 240,
    coverImage: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    artistName: 'The Invincibles'
  },
  {
    title: 'Deep Focus',
    genre: 'Ambient',
    tags: ['focus', 'study', 'ambient', 'work', 'calm'],
    duration: 300,
    coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    artistName: 'Zen Masters'
  },
  {
    title: 'Heartbreak Symphony',
    genre: 'Classical',
    tags: ['sad', 'cry', 'emotional', 'classical', 'melancholy'],
    duration: 280,
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    artistName: 'Luna Strings'
  },
  {
    title: 'Summer Vibes',
    genre: 'Pop',
    tags: ['happy', 'summer', 'pop', 'dance', 'upbeat'],
    duration: 195,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    artistName: 'Sun Kisses'
  },
  {
    title: 'Night Drive',
    genre: 'Synthwave',
    tags: ['chill', 'drive', 'night', 'focus', 'electronic'],
    duration: 260,
    coverImage: 'https://images.unsplash.com/photo-1517594422361-5e18a9949bb2?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    artistName: 'Neon Riders'
  },
  {
    title: 'Workout Anthem',
    genre: 'Hip Hop',
    tags: ['gym', 'workout', 'hype', 'energetic', 'rap'],
    duration: 210,
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    artistName: 'MC Iron'
  },
  {
    title: 'Ocean Lullaby',
    genre: 'Ambient',
    tags: ['sleep', 'relax', 'ocean', 'calm', 'peaceful'],
    duration: 320,
    coverImage: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=500&auto=format&fit=crop&q=60',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    artistName: 'Sleep Sounds'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/melodia';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    // Wipe existing dummy artists and songs
    console.log('Clearing existing dummy songs...');
    const existingSongs = await Song.find({});
    
    // Create Artists and Songs
    for (const item of dummySongs) {
      let artist = await Artist.findOne({ name: item.artistName });
      
      if (!artist) {
        artist = await Artist.create({
          name: item.artistName,
          bio: `Auto-generated dummy artist for ${item.genre}`,
          image: item.coverImage,
          verified: true,
          followers: Math.floor(Math.random() * 10000)
        });
        console.log(`Created artist: ${artist.name}`);
      }

      // Check if song already exists to avoid duplicates
      const songExists = await Song.findOne({ title: item.title, artist: artist._id });
      if (!songExists) {
        await Song.create({
          title: item.title,
          artist: artist._id,
          genre: item.genre,
          duration: item.duration,
          coverImage: item.coverImage,
          audioUrl: item.audioUrl,
          tags: item.tags
        });
        console.log(`Created song: ${item.title}`);
      } else {
        console.log(`Song already exists: ${item.title}`);
      }
    }

    console.log('Seeding complete! 🎵');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
