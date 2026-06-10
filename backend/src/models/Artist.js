import mongoose, { Document, Schema } from 'mongoose';
const ArtistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    verified: { type: Boolean, default: false },
    followers: { type: Number, default: 0 }
}, {
    timestamps: true
});
export default mongoose.model('Artist', ArtistSchema);
//# sourceMappingURL=Artist.js.map