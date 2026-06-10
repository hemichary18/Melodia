import mongoose, { Document, Schema } from 'mongoose';

export interface IPartySession extends Document {
  hostId: mongoose.Types.ObjectId;
  name: string;
  activeGuests: mongoose.Types.ObjectId[];
  currentSong?: {
    songId: mongoose.Types.ObjectId;
    startTime: Date;
    paused: boolean;
    pauseTime?: Date;
  };
  queue: {
    songId: mongoose.Types.ObjectId;
    addedBy: mongoose.Types.ObjectId;
    votes: number;
    voters: mongoose.Types.ObjectId[];
  }[];
  status: 'active' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

const PartySessionSchema: Schema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  activeGuests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  currentSong: {
    songId: { type: Schema.Types.ObjectId, ref: 'Song' },
    startTime: { type: Date },
    paused: { type: Boolean, default: false },
    pauseTime: { type: Date }
  },
  queue: [{
    songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    votes: { type: Number, default: 0 },
    voters: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }],
  status: { type: String, enum: ['active', 'ended'], default: 'active' }
}, {
  timestamps: true
});

export default mongoose.model<IPartySession>('PartySession', PartySessionSchema);
