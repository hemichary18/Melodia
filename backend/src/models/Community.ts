import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  description: string;
  genre: string;
  coverImageUrl?: string;
  adminId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  genre: { type: String, required: true },
  coverImageUrl: { type: String },
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rules: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model<ICommunity>('Community', CommunitySchema);
