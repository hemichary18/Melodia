import mongoose, { Document, Schema } from 'mongoose';
const ListeningHistorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    song: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
    playedAt: { type: Date, default: Date.now },
    durationPlayed: { type: Number, required: true } // in seconds
});
// Index for efficient queries based on user and time
ListeningHistorySchema.index({ user: 1, playedAt: -1 });
export default mongoose.model('ListeningHistory', ListeningHistorySchema);
//# sourceMappingURL=ListeningHistory.js.map