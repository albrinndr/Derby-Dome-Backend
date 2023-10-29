import mongoose, { Schema, Document, Model } from 'mongoose';
import Banner from '../../domain/banner';

const bannerSchema: Schema = new Schema<Banner & Document>({
    name: { type: String, required: true },
    image: { type: String },
    text: { type: String },
    color: { type: String },
}, {
    timestamps: true
});

const BannerModel: Model<Banner & Document> = mongoose.model<Banner & Document>('Banner', bannerSchema);

export default BannerModel;

