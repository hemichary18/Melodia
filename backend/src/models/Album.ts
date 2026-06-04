import mongoose, { Document, Schema } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  artist: mongoose.Types.ObjectId;
  coverArtUrl?: string;
  releaseDate: Date;
  songs: mongoose.Types.ObjectId[];
}

const AlbumSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  coverArtUrl: { type: String },
  releaseDate: { type: Date, default: Date.now },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
}, {
  timestamps: true
});

export default mongoose.model<IAlbum>('Album', AlbumSchema);
