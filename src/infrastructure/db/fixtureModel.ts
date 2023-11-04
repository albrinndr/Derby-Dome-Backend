import mongoose, { ObjectId, Schema, Document } from "mongoose";

interface Fixture extends Document {
    clubId: ObjectId;
    awayTeamId: ObjectId;
    awayTeam: string;
    awayTeamLogo: string;
    date: Date;
    time: string;
    dateTime: Date;
    poster: string;
}


const FixtureSchema = new Schema<Fixture>({
    clubId: { type: Schema.Types.ObjectId, required: true, ref: 'Club' },
    awayTeamId: { type: Schema.Types.ObjectId, ref: 'Club' },
    awayTeam: { type: String },
    awayTeamLogo: { type: String, default: 'https://res.cloudinary.com/ddzzicdji/image/upload/v1699098949/club-logos/uejuc5ybw3wqd9ivewom.png' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    dateTime: { type: Date },
    poster: { type: String }
}, {
    timestamps: true
});

const FixtureModel = mongoose.model<Fixture>('Fixture', FixtureSchema);

export default FixtureModel;
