import mongoose, { Document, Schema } from 'mongoose';
const LikeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    song: { type: Schema.Types.ObjectId, ref: 'Song', required: true }
}, {
    timestamps: true
});
// Ensure a user can only like a song once
LikeSchema.index({ user: 1, song: 1 }, { unique: true });
export default mongoose.model('Like', LikeSchema);
//# sourceMappingURL=Like.js.map