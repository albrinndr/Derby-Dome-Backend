import mongoose, { Schema, Document, Model } from 'mongoose';
import Stadium from '../../domain/stadium';

const StadiumSchema: Schema = new Schema<Stadium & Document>({
    timings: [{
        time: { type: String, required: true },
        price: { type: Number, required: true },
        newPrice: { type: Number },
        delete: { type: Boolean, default: false },
        changeDate: { type: Date, default: new Date(new Date().setDate(new Date().getDate() + 12)) }
    }]
}, {
    timestamps: true
});

const StadiumModel: Model<Stadium & Document> = mongoose.model<Stadium & Document>('Stadium', StadiumSchema);

export default StadiumModel;

