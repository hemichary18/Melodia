import mongoose, { Document, Schema } from 'mongoose';
const AlbumSchema = new Schema({
    title: { type: String, required: true, trim: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    coverArtUrl: { type: String },
    releaseDate: { type: Date, default: Date.now },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
}, {
    timestamps: true
});
export default mongoose.model('Album', AlbumSchema);
//# sourceMappingURL=Album.js.map