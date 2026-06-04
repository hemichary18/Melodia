import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN'
}

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  username: string;
  profilePictureUrl?: string;
  googleId?: string;
  authProvider: 'local' | 'google';
  role: UserRole;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  likedSongs: mongoose.Types.ObjectId[];
  playlists: mongoose.Types.ObjectId[];
  recentlyPlayed: {
    song: mongoose.Types.ObjectId;
    playedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: false }, // Optional for Google users
  username: { type: String, required: true, unique: true, trim: true },
  profilePictureUrl: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likedSongs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  recentlyPlayed: [{
    song: { type: Schema.Types.ObjectId, ref: 'Song' },
    playedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
