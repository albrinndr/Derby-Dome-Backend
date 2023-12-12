import mongoose, { Schema, Document, Model } from 'mongoose';
import LoyaltyOfferI from '../../domain/loyaltyOffer';


const LoyaltyOfferSchema: Schema = new Schema<LoyaltyOfferI & Document>({
    minPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    coins: { type: Number, required: true }
}, {
    timestamps: true
});

const LoyaltyOfferModel: Model<LoyaltyOfferI & Document> = mongoose.model<LoyaltyOfferI & Document>('LoyaltyOffer', LoyaltyOfferSchema);

export default LoyaltyOfferModel;

