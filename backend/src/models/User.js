import mongoose, { Document, Schema } from 'mongoose';
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ARTIST"] = "ARTIST";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: false }, // Optional for Google users
    username: { type: String, required: true, unique: true, trim: true },
    profilePictureUrl: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likedSongs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
    recentlyPlayed: [{
            song: { type: Schema.Types.ObjectId, ref: 'Song' },
            playedAt: { type: Date, default: Date.now }
        }]
}, {
    timestamps: true
});
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map