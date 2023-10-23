import mongoose, { Schema, Document, Model } from 'mongoose';
import User from '../../domain/user';


const userSchema: Schema = new Schema<User & Document>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    cart: [{
    }],
    wallet: { type: Number, default: 0 },
}, {
    timestamps: true
});

const UserModel: Model<User & Document> = mongoose.model<User & Document>('User', userSchema);

export default UserModel;

