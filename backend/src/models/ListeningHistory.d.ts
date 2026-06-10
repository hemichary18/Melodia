import mongoose, { Document } from 'mongoose';
export interface IListeningHistory extends Document {
    user: mongoose.Types.ObjectId;
    song: mongoose.Types.ObjectId;
    playedAt: Date;
    durationPlayed: number;
}
declare const _default: mongoose.Model<IListeningHistory, {}, {}, {}, mongoose.Document<unknown, {}, IListeningHistory, {}, mongoose.DefaultSchemaOptions> & IListeningHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IListeningHistory>;
export default _default;
//# sourceMappingURL=ListeningHistory.d.ts.map