import mongoose, { Schema, Document, Model } from 'mongoose';
import Club from '../../domain/club';


const userSchema: Schema = new Schema<Club & Document>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    cart: [{
    }],
    wallet: { type: Number, default: 0 },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    description: { type: String, required: true },
    bgImg: { type: String, default: 'https://res.cloudinary.com/ddzzicdji/image/upload/v1699006744/club-banners/vdwaui8m3bom4cmgohdy.webp' }
}, {
    timestamps: true
});

const ClubModel: Model<Club & Document> = mongoose.model<Club & Document>('Club', userSchema);

export default ClubModel;

