import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: mongoose.Types.ObjectId;
  album?: mongoose.Types.ObjectId;
  genre: string;
  duration: number;
  coverImage: string;
  audioUrl: string;
  lyrics?: string;
  releaseDate: Date;
  playCount: number;
  likesCount: number;
  isTrending: boolean;
  tags: string[];
  uploadedBy?: mongoose.Types.ObjectId;
  status: 'active' | 'draft' | 'blocked';
}

const SongSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  album: { type: Schema.Types.ObjectId, ref: 'Album' },
  genre: { type: String, required: true, default: 'Unknown' },
  duration: { type: Number, required: true }, // in seconds
  coverImage: { type: String, required: true, default: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300' },
  audioUrl: { type: String, required: true },
  lyrics: { type: String, default: "" },
  releaseDate: { type: Date, default: Date.now },
  playCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  isTrending: { type: Boolean, default: false },
  tags: [{ type: String }],
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'draft', 'blocked'], default: 'active' }
}, {
  timestamps: true
});

export default mongoose.model<ISong>('Song', SongSchema);
