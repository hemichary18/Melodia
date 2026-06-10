import mongoose, { Document, Schema } from 'mongoose';

export interface IKaraokeScore extends Document {
  userId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
  score: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Legendary';
  metrics: {
    pitchAccuracy: number;
    rhythmAccuracy: number;
    timingAccuracy: number;
    vocalStability: number;
  };
  recordingUrl?: string; // Optional if user saves the recording
  createdAt: Date;
  updatedAt: Date;
}

const KaraokeScoreSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  rank: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Legendary'], required: true },
  metrics: {
    pitchAccuracy: { type: Number, default: 0 },
    rhythmAccuracy: { type: Number, default: 0 },
    timingAccuracy: { type: Number, default: 0 },
    vocalStability: { type: Number, default: 0 }
  },
  recordingUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IKaraokeScore>('KaraokeScore', KaraokeScoreSchema);
