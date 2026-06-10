import mongoose, { Document, Schema } from 'mongoose';
const PlaylistSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    coverArtUrl: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    isPublic: { type: Boolean, default: true },
    isAIGenerated: { type: Boolean, default: false }
}, {
    timestamps: true
});
export default mongoose.model('Playlist', PlaylistSchema);
//# sourceMappingURL=Playlist.js.map