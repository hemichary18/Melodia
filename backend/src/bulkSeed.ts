import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from './models/Song.js';
import Artist from './models/Artist.js';

// Load backend env for MongoDB
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/melodia';
const BULK_UPLOAD_DIR = path.join(process.cwd(), 'data', 'bulk_upload');

const CLOUDINARY_CLOUD_NAME = 'dkpk3mdx4';
const CLOUDINARY_UPLOAD_PRESET = 'Melodia';

// Helper to upload Buffer to Cloudinary
async function uploadToCloudinary(buffer: Buffer | Uint8Array, resourceType: 'auto' | 'video' | 'image' | 'raw', filename: string): Promise<string> {
  const formData = new FormData();
  const mimeType = resourceType === 'image' ? 'image/jpeg' : 'audio/mpeg';
  const blob = new Blob([buffer as any], { type: mimeType });
  
  formData.append('file', blob, filename);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }
  
  const data = await response.json();
  return data.secure_url;
}

async function runBulkSeed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  if (!fs.existsSync(BULK_UPLOAD_DIR)) {
    console.error(`Directory not found: ${BULK_UPLOAD_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BULK_UPLOAD_DIR).filter(f => f.toLowerCase().endsWith('.mp3'));
  
  if (files.length === 0) {
    console.log(`No .mp3 files found in ${BULK_UPLOAD_DIR}.`);
    process.exit(0);
  }

  console.log(`Found ${files.length} MP3 files. Starting bulk upload...`);

  for (const file of files) {
    const filePath = path.join(BULK_UPLOAD_DIR, file);
    console.log(`\nProcessing: ${file}`);
    
    try {
      // 1. Read File and ID3 Metadata
      const fileBuffer = fs.readFileSync(filePath);
      const metadata = await mm.parseBuffer(fileBuffer, 'audio/mpeg');
      
      const title = metadata.common.title || path.parse(file).name;
      const artistName = metadata.common.artist || 'Unknown Artist';
      const genre = metadata.common.genre?.[0] || 'Unknown';
      const duration = Math.round(metadata.format.duration || 180);

      console.log(` -> Title: ${title}`);
      console.log(` -> Artist: ${artistName}`);

      // 2. Upload Cover Art (if embedded)
      let coverImageUrl = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80';
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        console.log(` -> Found embedded cover art, uploading to Cloudinary...`);
        const coverBuffer = metadata.common.picture![0]!.data;
        coverImageUrl = await uploadToCloudinary(coverBuffer, 'image', `${title}-cover.jpg`);
      }

      // 3. Upload Audio File
      console.log(` -> Uploading audio to Cloudinary...`);
      const audioUrl = await uploadToCloudinary(fileBuffer, 'video', file);

      // 3.5 Upload Lyrics File (if exists)
      let lyricsUrl = '';
      const baseName = path.parse(file).name;
      const lrcPath = path.join(BULK_UPLOAD_DIR, `${baseName}.lrc`);
      const txtPath = path.join(BULK_UPLOAD_DIR, `${baseName}.txt`);
      
      let lyricsFilePath = null;
      if (fs.existsSync(lrcPath)) lyricsFilePath = lrcPath;
      else if (fs.existsSync(txtPath)) lyricsFilePath = txtPath;

      if (lyricsFilePath) {
        console.log(` -> Found lyrics file (${path.basename(lyricsFilePath)}), uploading to Cloudinary...`);
        const lyricsBuffer = fs.readFileSync(lyricsFilePath);
        lyricsUrl = await uploadToCloudinary(lyricsBuffer, 'raw', path.basename(lyricsFilePath));
      }

      // 4. Database operations
      // Find or create artist
      let artist = await Artist.findOne({ name: artistName });
      if (!artist) {
        artist = await Artist.create({
          name: artistName,
          bio: 'Auto-generated bio from bulk upload.',
          image: coverImageUrl,
          verified: false,
          followers: 0
        });
      }

      // Create Song
      const song = await Song.create({
        title,
        artist: artist._id,
        duration,
        audioUrl,
        coverImage: coverImageUrl,
        lyrics: lyricsUrl,
        genre,
        tags: genre ? [genre.toLowerCase()] : []
      });

      console.log(` -> ✅ Successfully saved to database! Song ID: ${song._id}`);
      
    } catch (error) {
      console.error(` -> ❌ Failed to process ${file}:`, error);
    }
  }

  console.log('\n🎉 Bulk seed completed successfully!');
  process.exit(0);
}

runBulkSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
