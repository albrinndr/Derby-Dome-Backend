import mongoose, { ObjectId, Schema, Document } from "mongoose";
import { FixtureSeats } from "../../domain/fixture";

interface Fixture extends Document {
    title: string;
    clubId: ObjectId;
    awayTeamId: ObjectId;
    awayTeam: string;
    awayTeamLogo: string;
    date: Date;
    time: string;
    dateTime: Date;
    poster: string;
    status: string;
    rescheduled: boolean;
    price: number;
    checkDate?: Date;
    seats?: any;
}

const SeatDataSchema = {
    seats: [{ type: Number }],
    count: { type: Number, default: 50 }
};
const NormalSeatDataSchema = {
    seats: [{ type: Number }],
    count: { type: Number, default: 100 }
};

const StandSeatsSchema = {
    vip: {
        A: SeatDataSchema,
        B: SeatDataSchema
    },
    premium: {
        C: NormalSeatDataSchema,
        D: NormalSeatDataSchema
    },
    economy: {
        E: NormalSeatDataSchema,
        F: NormalSeatDataSchema
    }
};

const FixtureSchema = new Schema<Fixture>({
    title: { type: String, required: true },
    clubId: { type: Schema.Types.ObjectId, required: true, ref: 'Club' },
    awayTeamId: { type: Schema.Types.ObjectId, ref: 'Club' },
    awayTeam: { type: String },
    awayTeamLogo: { type: String, default: 'https://res.cloudinary.com/ddzzicdji/image/upload/v1699593473/DEFAULT/ilfncp844ygtb7komklz.png' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    dateTime: { type: Date },
    poster: { type: String },
    status: { type: String, default: 'active' },
    rescheduled: { type: Boolean, default: false },
    price: { type: Number, required: true },
    checkDate: { type: Date },
    seats: {
        north: StandSeatsSchema,
        south: StandSeatsSchema,
        east: StandSeatsSchema,
        west: {
            vip: StandSeatsSchema.vip,
            premium: StandSeatsSchema.premium,
        },
    }
}, {
    timestamps: true
});

const FixtureModel = mongoose.model<Fixture>('Fixture', FixtureSchema);

export default FixtureModel;
