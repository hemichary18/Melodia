import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  song: mongoose.Types.ObjectId;
}

const LikeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  song: { type: Schema.Types.ObjectId, ref: 'Song', required: true }
}, {
  timestamps: true
});

// Ensure a user can only like a song once
LikeSchema.index({ user: 1, song: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
