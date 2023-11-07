import Club, { Manager, Player, Team } from "../../domain/club";
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

    async addManager(clubId: string, data: Manager): Promise<any> {
        const { name, image } = data;
        const club = await ClubModel.findOneAndUpdate(
            { _id: clubId },
            { $set: { "team.manager.name": name, "team.manager.image": image } },
            { new: true }
        );
        return club;
    }

    async editManager(clubId: string, data: Manager): Promise<any> {
        if (data.image) {
            const club = await ClubModel.findOneAndUpdate(
                { _id: clubId },
                { $set: { "team.manager.name": data.name, "team.manager.image": data.image } },
                { new: true }
            );
            return club;
        } else {
            const club = await ClubModel.findOneAndUpdate(
                { _id: clubId },
                { $set: { "team.manager.name": data.name } },
                { new: true }
            );
            return club;
        }
    }

    async addPlayer(clubId: string, data: Player): Promise<any> {
        const player = await ClubModel.findOne({ _id: clubId, 'team.players.shirtNo': data.shirtNo }, 'team.players.$').exec();

        if (player) {
            return false;
        }

        const club = await ClubModel.findOne({ _id: clubId }, 'team.players').exec();
        if (club && club.team && club.team.players) {
            const playerData = {
                name: data.name,
                shirtNo: data.shirtNo,
                position: data.position,
                image: data.image,
                startingXI: false
            };
            if (club.team.players.length < 11) {
                playerData.startingXI = true;
            }
            if (club.team.players.length >= 23) {
                return 'Limit';
            }

            const updatedClub = await ClubModel.findOneAndUpdate(
                { _id: clubId },
                { $push: { 'team.players': playerData } },
                { new: true }
            );
            return updatedClub;
        }
    }

    async editPlayer(clubId: string, playerId: string, data: Player): Promise<any> {
        const player = await ClubModel.findOne({
            _id: clubId,
            'team.players': {
                $elemMatch: { $and: [{ _id: { $ne: playerId } }, { shirtNo: data.shirtNo }] }
            }
        });

        if (player) {
            return false;
        }

        let updatedPlayer = await ClubModel.findOneAndUpdate(
            { _id: clubId, 'team.players._id': playerId },
            {
                $set: {
                    'team.players.$.name': data.name,
                    'team.players.$.shirtNo': data.shirtNo,
                    'team.players.$.position': data.position,
                }
            },
            { new: true }
        );
        if (data.image) {
            updatedPlayer = await ClubModel.findOneAndUpdate(
                { _id: clubId, 'team.players._id': playerId },
                {
                    $set: {
                        'team.players.$.image': data.image,
                    }
                },
                { new: true }
            );
        }
        return updatedPlayer;
    }

    async deletePlayer(clubId: string, playerId: string): Promise<any> {
        let updatedPlayer = await ClubModel.findOneAndUpdate(
            { _id: clubId },
            { $pull: { 'team.players': { _id: playerId } } },
            { new: true }
        );
        return updatedPlayer;
    }
}

export default ClubRepository;
