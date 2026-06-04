import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  title: string;
  description?: string;
  coverArtUrl?: string;
  creator: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  isPublic: boolean;
  isAIGenerated: boolean;
}

const PlaylistSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  coverArtUrl: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  isPublic: { type: Boolean, default: true },
  isAIGenerated: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
