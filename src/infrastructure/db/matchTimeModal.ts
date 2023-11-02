import mongoose, { Schema, Document, Model } from 'mongoose';
import MatchTime from '../../domain/matchTime';

const matchTimeSchema: Schema = new Schema<MatchTime & Document>({
    time: { type: String, required: true },
    price: { type: Number, required: true },
    newPrice: { type: Number },
    delete: { type: Boolean, default: false },
    changeDate: { type: Date, default: new Date(new Date().setDate(new Date().getDate() + 12)) }
}, {
    timestamps: true
});

const MatchTimeModel: Model<MatchTime & Document> = mongoose.model<MatchTime & Document>('MatchTime', matchTimeSchema);

export default MatchTimeModel;

