import mongoose, { Document } from 'mongoose';
export interface IArtist extends Document {
    user?: mongoose.Types.ObjectId;
    name: string;
    bio?: string;
    image?: string;
    verified: boolean;
    followers: number;
}
declare const _default: mongoose.Model<IArtist, {}, {}, {}, mongoose.Document<unknown, {}, IArtist, {}, mongoose.DefaultSchemaOptions> & IArtist & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IArtist>;
export default _default;
//# sourceMappingURL=Artist.d.ts.map