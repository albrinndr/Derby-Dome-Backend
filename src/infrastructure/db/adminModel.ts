import mongoose, { Schema, Document, Model } from 'mongoose';
import Admin from '../../domain/admin';


const adminSchema: Schema = new Schema<Admin & Document>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

const AdminModel: Model<Admin & Document> = mongoose.model<Admin & Document>('Admin', adminSchema);

export default AdminModel;

