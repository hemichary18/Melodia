import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Artist from './models/Artist.js';
import Album from './models/Album.js';
import Song from './models/Song.js';
import Playlist from './models/Playlist.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/melodia';
    await mongoose.connect(uri);
    console.log('MongoDB Connected to:', uri);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data and indexes...');
    await Artist.collection.drop().catch(() => {});
    await Album.collection.drop().catch(() => {});
    await Song.collection.drop().catch(() => {});
    await Playlist.collection.drop().catch(() => {});
    // Intentionally not clearing Users so you keep your login!

    console.log('Creating artists...');
    const theWeeknd = await Artist.create({
      name: 'The Weeknd',
      bio: 'Canadian singer, songwriter, and record producer.',
      image: 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?q=80&w=400&h=400&fit=crop',
      verified: true,
      followers: 1500000,
    });

    const daftPunk = await Artist.create({
      name: 'Daft Punk',
      bio: 'French electronic music duo.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=400&fit=crop',
      verified: true,
      followers: 2000000,
    });

    console.log('Creating albums...');
    const starboy = await Album.create({
      title: 'Starboy',
      artist: theWeeknd._id,
      coverArtUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&fit=crop',
      releaseYear: 2016,
      genre: 'R&B'
    });

    const discovery = await Album.create({
      title: 'Discovery',
      artist: daftPunk._id,
      coverArtUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=400&h=400&fit=crop',
      releaseYear: 2001,
      genre: 'Electronic'
    });

    console.log('Creating songs...');
    await Song.insertMany([
      {
        title: 'Starboy',
        artist: theWeeknd._id,
        album: starboy._id,
        genre: 'R&B',
        duration: 230,
        coverImage: starboy.coverArtUrl,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
        isTrending: true,
        tags: ['rnb', 'pop'],
        playCount: 150000,
        likesCount: 10000,
      },
      {
        title: 'I Feel It Coming',
        artist: theWeeknd._id,
        album: starboy._id,
        genre: 'R&B',
        duration: 269,
        coverImage: starboy.coverArtUrl,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
        isTrending: true,
        tags: ['rnb', 'electronic'],
        playCount: 120000,
        likesCount: 8000,
      },
      {
        title: 'One More Time',
        artist: daftPunk._id,
        album: discovery._id,
        genre: 'Electronic',
        duration: 320,
        coverImage: discovery.coverArtUrl,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder audio
        isTrending: false,
        tags: ['dance', 'electronic', 'house'],
        playCount: 500000,
        likesCount: 45000,
      },
      {
        title: 'Harder, Better, Faster, Stronger',
        artist: daftPunk._id,
        album: discovery._id,
        genre: 'Electronic',
        duration: 224,
        coverImage: discovery.coverArtUrl,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Placeholder audio
        isTrending: true,
        tags: ['dance', 'electronic', 'house', 'workout'],
        playCount: 800000,
        likesCount: 65000,
      }
    ]);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

seedData();
