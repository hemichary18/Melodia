import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  attachedSongId?: mongoose.Types.ObjectId;
  attachedAlbumId?: mongoose.Types.ObjectId;
  attachedPlaylistId?: mongoose.Types.ObjectId;
  communityId?: mongoose.Types.ObjectId;
  imageUrl?: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialPostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  attachedSongId: { type: Schema.Types.ObjectId, ref: 'Song' },
  attachedAlbumId: { type: Schema.Types.ObjectId, ref: 'Album' },
  attachedPlaylistId: { type: Schema.Types.ObjectId, ref: 'Playlist' },
  communityId: { type: Schema.Types.ObjectId, ref: 'Community' }, // If posted inside a community
  imageUrl: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);
