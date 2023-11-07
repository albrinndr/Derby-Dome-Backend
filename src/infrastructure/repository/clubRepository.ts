import Club, { Team } from "../../domain/club";
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

    async findAllClubs(): Promise<{}[] | null> {
        const club = await ClubModel.find({}).select('-password');
        return club;
    }

    async findTeamById(clubId: string): Promise<Team | {}> {
        const club = await ClubModel.findOne({ _id: clubId }).select('team').exec();
        if (club && club.team) {
            return club.team;
        }
        return {};
    }
}

export default ClubRepository;
