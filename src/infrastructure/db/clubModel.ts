import mongoose, { Schema, Document, Model } from 'mongoose';
import Club from '../../domain/club';


const ClubSchema: Schema = new Schema<Club & Document>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    description: { type: String, required: true },
    bgImg: { type: String, default: 'https://res.cloudinary.com/ddzzicdji/image/upload/v1699006744/club-banners/vdwaui8m3bom4cmgohdy.webp' },
    team: {
        manager: {
            name: { type: String },
            image: { type: String }
        },
        players: [
            {
                name: { type: String },
                shirtNo: { type: Number },
                position: { type: String },
                image: { type: String },
                startingXI: { type: Boolean }
            }
        ]
    },
    followers: [{ type: String }],
    notifications: [{
        fixtureId: { type: Schema.Types.ObjectId, ref: 'Fixture' },
        message: { type: String },
        isRead: [{ type: String }],
        date: { type: Date, default: new Date() }
    }]
}, {
    timestamps: true
});

const ClubModel: Model<Club & Document> = mongoose.model<Club & Document>('Club', ClubSchema);

export default ClubModel;

