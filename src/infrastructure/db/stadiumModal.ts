import mongoose, { Schema, Document, Model } from 'mongoose';
import Stadium from '../../domain/stadium';

const seat = {
    vip: { type: Number, default: 1 },
    premium: { type: Number, default: 1 },
    economy: { type: Number, default: 1 }
};

const StadiumSchema: Schema = new Schema<Stadium & Document>({
    timings: [{
        time: { type: String, required: true },
        price: { type: Number, required: true },
        showDate: { type: Date, default: new Date(new Date().setDate(new Date().getDate() + 17)) }
    }],
    // seats: {
    //     north: seat,
    //     south: seat,
    //     east: seat,
    //     west: { vip: { type: Number, default: 1 }, premium: { type: Number, default: 1 } }
    // }
    seats: [{
        stand: { type: String },
        price: {
            vip: { type: Number },
            premium: { type: Number },
            economy: { type: Number }
        }
    }],
    reviews: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number },
        review: { type: String },
        createdAt: { type: Date, default: Date.now() }
    }]
}, {
    timestamps: true
});

const StadiumModel: Model<Stadium & Document> = mongoose.model<Stadium & Document>('Stadium', StadiumSchema);

export default StadiumModel;

