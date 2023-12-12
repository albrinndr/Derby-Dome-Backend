import mongoose, { Schema, Document, Model } from 'mongoose';
import CouponI from '../../domain/coupon';


const CouponSchema: Schema = new Schema<CouponI & Document>({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    discount: { type: Number, required: true },
    minPrice: { type: Number, required: true },
    startingDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    users: [{ type: String }],
    isLoyalty: { type: Boolean, default: false },
    loyaltyId: { type: String },
    loyaltyUsed: { type: Boolean, default: false }
}, {
    timestamps: true
});

const CouponModel: Model<CouponI & Document> = mongoose.model<CouponI & Document>('Coupon', CouponSchema);

export default CouponModel;

