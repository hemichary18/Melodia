import mongoose, { Document, Schema } from 'mongoose';

export interface IFocusSession extends Document {
  userId: mongoose.Types.ObjectId;
  duration: number; // in minutes
  mode: 25 | 50 | 90; // Pomodoro intervals
  playlistUsed?: mongoose.Types.ObjectId;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FocusSessionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true },
  mode: { type: Number, enum: [25, 50, 90], required: true },
  playlistUsed: { type: Schema.Types.ObjectId, ref: 'Playlist' },
  completed: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IFocusSession>('FocusSession', FocusSessionSchema);
