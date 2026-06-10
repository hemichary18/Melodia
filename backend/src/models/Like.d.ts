import mongoose, { Document } from 'mongoose';
export interface ILike extends Document {
    user: mongoose.Types.ObjectId;
    song: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<ILike, {}, {}, {}, mongoose.Document<unknown, {}, ILike, {}, mongoose.DefaultSchemaOptions> & ILike & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILike>;
export default _default;
//# sourceMappingURL=Like.d.ts.map