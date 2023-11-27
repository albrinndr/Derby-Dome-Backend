import Club, { AllNotificationsI, Manager, NotificationI, Player, Team } from "../../domain/club";
import ClubModel from "../db/clubModel";
import ClubRepo from "../../useCase/interface/clubRepo";
import { Schema } from "mongoose";

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
        try {
            const club = await ClubModel.findById({ _id });
            if (club) return club;
            return null;
        } catch (error) {
            return null;
        }
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

    async swapStartingXI(clubId: string, player1Id: string, player2Id: string): Promise<any> {
        await ClubModel.findOneAndUpdate(
            { _id: clubId, 'team.players._id': player1Id },
            {
                $set: {
                    'team.players.$.startingXI': true
                }
            }
        );
        const player2Update = await ClubModel.findOneAndUpdate(
            { _id: clubId, 'team.players._id': player2Id },
            {
                $set: {
                    'team.players.$.startingXI': false
                }
            },
            { new: true }
        );
        return player2Update;
    }

    async findTeamPlayerCount(clubId: string): Promise<boolean> {
        const club = await ClubModel.findOne({ _id: clubId }, 'team.players').exec();
        if (club && club.team && club.team.players) {
            if (club.team.players.length >= 11) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    async followClub(userId: string, clubId: string): Promise<any> {
        try {
            const club = await ClubModel.findOneAndUpdate(
                { _id: clubId, followers: userId },
                { $pull: { followers: userId } },
                { new: true }
            );

            if (!club) {
                await ClubModel.updateOne(
                    { _id: clubId },
                    { $addToSet: { followers: userId } }
                );
                return 'You are now following!';
            }
            return 'You have unfollowed!';
        } catch (error) {
            return false;
        }
    }

    async sendNotification(clubId: string, notification: NotificationI): Promise<any> {
        try {
            const club = await ClubModel.findOne({ _id: clubId });

            if (!club) {
                return null;
            }

            club.notifications.push(notification);
            const updatedClub = await club.save();
            console.log('noti send');

            return updatedClub;
        } catch (error) {

        }
    }

    async removeNotification(fixtureId: string, clubId: string): Promise<any> {
        try {
            const club = await ClubModel.findOne({ _id: clubId });

            if (!club) {
                return null;
            }

            const updatedClub = await ClubModel.findOneAndUpdate(
                { _id: clubId },
                { $pull: { notifications: { fixtureId: fixtureId } } },
                { new: true }
            );
            console.log('noti removed');

            return updatedClub;
        } catch (error) {

        }
    }

    async findUserNotifications(userId: string): Promise<AllNotificationsI[]> {
        try {
            const notifications = await ClubModel.aggregate([
                // Match clubs where followers include the given userId
                {
                    $match: {
                        followers: userId.toString()
                    }
                },
                // Unwind the notifications array to work with individual notifications
                {
                    $unwind: "$notifications"
                },
                {
                    $sort: {
                        "notifications.date": -1
                    }
                },
                // Project necessary fields and club information for notifications
                {
                    $project: {
                        _id: 0,
                        clubName: "$name",
                        clubImage: "$image",
                        notification: "$notifications",
                        userId: userId
                    }
                }

            ]);
            return notifications;
        } catch (error) {
            return [];
        }
    }

    async readNotification(userId: string): Promise<any> {
        try {
            await ClubModel.updateMany(
                { followers: userId.toString() },
                { $addToSet: { 'notifications.$.isRead': userId } }
            );
        } catch (error) {

        }
    }
}

export default ClubRepository;
