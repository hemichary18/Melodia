import mongoose, { Document } from 'mongoose';
export interface IAlbum extends Document {
    title: string;
    artist: mongoose.Types.ObjectId;
    coverArtUrl?: string;
    releaseDate: Date;
    songs: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IAlbum, {}, {}, {}, mongoose.Document<unknown, {}, IAlbum, {}, mongoose.DefaultSchemaOptions> & IAlbum & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAlbum>;
export default _default;
//# sourceMappingURL=Album.d.ts.map