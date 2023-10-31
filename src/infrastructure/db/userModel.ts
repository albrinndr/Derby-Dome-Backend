import mongoose, { Schema, Document, Model } from 'mongoose';
import User from '../../domain/user';


const userSchema: Schema = new Schema<User & Document>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isBlocked: { type: Boolean, default: false },
    cart: [{
    }],
    wallet: { type: Number, default: 0 },
    isGoogle: { type: Boolean, default: false },
    profilePic: { type: String, default: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png' }
}, {
    timestamps: true
});

const UserModel: Model<User & Document> = mongoose.model<User & Document>('User', userSchema);

export default UserModel;

