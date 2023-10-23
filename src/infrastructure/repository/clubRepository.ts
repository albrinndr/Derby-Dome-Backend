import Club from "../../domain/club";
import ClubModel from "../db/clubModel";
import ClubRepo from "../../useCase/interface/clubRepo";

class ClubRepository implements ClubRepo {
    async save(club: Club): Promise<Club> {
        const newClub = new ClubModel(club);
        await newClub.save();
        return newClub;
    }

    async findByEmail(email: string): Promise<Club | null> {
        const club = await ClubModel.findOne({ email });
        return club;
    }

    async findById(_id: string): Promise<Club | null> {
        const club = await ClubModel.findById({ _id });
        return club;
    }
}

export default ClubRepository;
