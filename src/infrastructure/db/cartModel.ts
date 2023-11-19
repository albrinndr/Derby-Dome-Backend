import mongoose, { ObjectId, Schema, Document } from "mongoose";

interface Cart extends Document {
    userId: ObjectId;
    fixtureId: ObjectId;
    stand: string;
    section: string;
    seats: Array<{
        row: string;
        userSeats: number[];
    }>;
    ticketCount: number;
    price: number;
}


const CartSchema = new Schema<Cart>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    fixtureId: { type: Schema.Types.ObjectId, required: true, ref: 'Fixture' },
    stand: { type: String, required: true },
    section: { type: String, required: true },
    seats: [{
        row: { type: String, required: true },
        userSeats: [{ type: Number }]
    }],
    ticketCount: { type: Number, required: true },
    price: { type: Number, required: true }

}, {
    timestamps: true
});

const CartModel = mongoose.model<Cart>('Cart', CartSchema);

export default CartModel;
