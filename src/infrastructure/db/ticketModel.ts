import mongoose, { ObjectId, Schema, Document } from "mongoose";

interface Ticket extends Document {
    userId: ObjectId;
    fixtureId: ObjectId;
    stand: string;
    section: string;
    seats: [{
        row: string;
        userSeats: number[];
    }];
    ticketCount: number;
    price: number;
    paymentType: string;
    coupon: boolean;
    qrCode: string;
    isCancelled: boolean;
    cancelledDate: Date;
}


const TicketSchema = new Schema<Ticket>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    fixtureId: { type: Schema.Types.ObjectId, required: true, ref: 'Fixture' },
    stand: { type: String, required: true },
    section: { type: String, required: true },
    seats: [{
        row: { type: String, required: true },
        userSeats: [{ type: Number }]
    }],
    ticketCount: { type: Number, required: true },
    price: { type: Number, required: true },
    paymentType: { type: String, required: true },
    coupon: { type: Boolean, default: false },
    qrCode: { type: String, required: true },
    isCancelled: { type: Boolean, default: false },
    cancelledDate: { type: Date }
}, {
    timestamps: true
});

const TicketModel = mongoose.model<Ticket>('Ticket', TicketSchema);

export default TicketModel;
