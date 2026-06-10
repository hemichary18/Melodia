import mongoose, { Document } from 'mongoose';
export interface ISong extends Document {
    title: string;
    artist: mongoose.Types.ObjectId;
    album?: mongoose.Types.ObjectId;
    genre: string;
    duration: number;
    coverImage: string;
    audioUrl: string;
    lyrics?: string;
    releaseDate: Date;
    playCount: number;
    likesCount: number;
    isTrending: boolean;
    tags: string[];
    uploadedBy?: mongoose.Types.ObjectId;
    status: 'active' | 'draft' | 'blocked';
}
declare const _default: mongoose.Model<ISong, {}, {}, {}, mongoose.Document<unknown, {}, ISong, {}, mongoose.DefaultSchemaOptions> & ISong & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISong>;
export default _default;
//# sourceMappingURL=Song.d.ts.map