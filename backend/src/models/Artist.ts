import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  bio?: string;
  image?: string;
  verified: boolean;
  followers: number;
}

const ArtistSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  verified: { type: Boolean, default: false },
  followers: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IArtist>('Artist', ArtistSchema);
