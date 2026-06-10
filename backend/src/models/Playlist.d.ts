import mongoose, { Document } from 'mongoose';
export interface IPlaylist extends Document {
    title: string;
    description?: string;
    coverArtUrl?: string;
    creator: mongoose.Types.ObjectId;
    songs: mongoose.Types.ObjectId[];
    isPublic: boolean;
    isAIGenerated: boolean;
}
declare const _default: mongoose.Model<IPlaylist, {}, {}, {}, mongoose.Document<unknown, {}, IPlaylist, {}, mongoose.DefaultSchemaOptions> & IPlaylist & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPlaylist>;
export default _default;
//# sourceMappingURL=Playlist.d.ts.map