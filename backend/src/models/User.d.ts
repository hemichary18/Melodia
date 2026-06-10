import mongoose, { Document } from 'mongoose';
export declare enum UserRole {
    USER = "USER",
    ARTIST = "ARTIST",
    ADMIN = "ADMIN"
}
export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    username: string;
    profilePictureUrl?: string;
    googleId?: string;
    authProvider: 'local' | 'google';
    role: UserRole;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    likedSongs: mongoose.Types.ObjectId[];
    playlists: mongoose.Types.ObjectId[];
    recentlyPlayed: {
        song: mongoose.Types.ObjectId;
        playedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map