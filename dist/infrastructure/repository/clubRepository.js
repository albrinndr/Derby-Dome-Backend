"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clubModel_1 = __importDefault(require("../db/clubModel"));
class ClubRepository {
    save(club) {
        return __awaiter(this, void 0, void 0, function* () {
            const newClub = new clubModel_1.default(club);
            yield newClub.save();
            return newClub;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield clubModel_1.default.findOne({ email });
            return club;
        });
    }
    findById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const club = yield clubModel_1.default.findById({ _id });
                if (club)
                    return club;
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    findAllClubs() {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield clubModel_1.default.find({}).select('-password');
            return club;
        });
    }
    findTeamById(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield clubModel_1.default.findOne({ _id: clubId }).select('team').exec();
            if (club && club.team) {
                return club.team;
            }
            return {};
        });
    }
    addManager(clubId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, image } = data;
            const club = yield clubModel_1.default.findOneAndUpdate({ _id: clubId }, { $set: { "team.manager.name": name, "team.manager.image": image } }, { new: true });
            return club;
        });
    }
    editManager(clubId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.image) {
                const club = yield clubModel_1.default.findOneAndUpdate({ _id: clubId }, { $set: { "team.manager.name": data.name, "team.manager.image": data.image } }, { new: true });
                return club;
            }
            else {
                const club = yield clubModel_1.default.findOneAndUpdate({ _id: clubId }, { $set: { "team.manager.name": data.name } }, { new: true });
                return club;
            }
        });
    }
    addPlayer(clubId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield clubModel_1.default.findOne({ _id: clubId, 'team.players.shirtNo': data.shirtNo }, 'team.players.$').exec();
            if (player) {
                return false;
            }
            const club = yield clubModel_1.default.findOne({ _id: clubId }, 'team.players').exec();
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
                const updatedClub = yield clubModel_1.default.findOneAndUpdate({ _id: clubId }, { $push: { 'team.players': playerData } }, { new: true });
                return updatedClub;
            }
        });
    }
    editPlayer(clubId, playerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield clubModel_1.default.findOne({
                _id: clubId,
                'team.players': {
                    $elemMatch: { $and: [{ _id: { $ne: playerId } }, { shirtNo: data.shirtNo }] }
                }
            });
            if (player) {
                return false;
            }
            let updatedPlayer = yield clubModel_1.default.findOneAndUpdate({ _id: clubId, 'team.players._id': playerId }, {
                $set: {
                    'team.players.$.name': data.name,
                    'team.players.$.shirtNo': data.shirtNo,
                    'team.players.$.position': data.position,
                }
            }, { new: true });
            if (data.image) {
                updatedPlayer = yield clubModel_1.default.findOneAndUpdate({ _id: clubId, 'team.players._id': playerId }, {
                    $set: {
                        'team.players.$.image': data.image,
                    }
                }, { new: true });
            }
            return updatedPlayer;
        });
    }
    deletePlayer(clubId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedPlayer = yield clubModel_1.default.findOneAndUpdate({ _id: clubId }, { $pull: { 'team.players': { _id: playerId } } }, { new: true });
            return updatedPlayer;
        });
    }
    swapStartingXI(clubId, player1Id, player2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clubModel_1.default.findOneAndUpdate({ _id: clubId, 'team.players._id': player1Id }, {
                $set: {
                    'team.players.$.startingXI': true
                }
            });
            const player2Update = yield clubModel_1.default.findOneAndUpdate({ _id: clubId, 'team.players._id': player2Id }, {
                $set: {
                    'team.players.$.startingXI': false
                }
            }, { new: true });
            return player2Update;
        });
    }
    findTeamPlayerCount(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield clubModel_1.default.findOne({ _id: clubId }, 'team.players').exec();
            if (club && club.team && club.team.players) {
                if (club.team.players.length >= 11) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    }
    followClub(userId, clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const club = yield clubModel_1.default.findOneAndUpdate({ _id: clubId, followers: userId }, { $pull: { followers: userId } }, { new: true });
                if (!club) {
                    yield clubModel_1.default.updateOne({ _id: clubId }, { $addToSet: { followers: userId } });
                    return 'You are now following!';
                }
                return 'You have unfollowed!';
            }
            catch (error) {
                return false;
            }
        });
    }
    sendNotification(clubId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const club = yield clubModel_1.default.findOne({ _id: clubId });
                if (!club) {
                    return null;
                }
                if (club.notifications) {
                    club.notifications.push(notification);
                    const updatedClub = yield club.save();
                    console.log('noti send');
                    return updatedClub;
                }
                return club;
            }
            catch (error) {
            }
        });
    }
    removeNotification(fixtureId, clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const club = yield clubModel_1.default.findOne({ _id: clubId });
                if (!club) {
                    return null;
                }
                const updatedClub = yield clubModel_1.default.findOneAndUpdate({ _id: clubId }, { $pull: { notifications: { fixtureId: fixtureId } } }, { new: true });
                console.log('noti removed');
                return updatedClub;
            }
            catch (error) {
            }
        });
    }
    findUserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield clubModel_1.default.aggregate([
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
            }
            catch (error) {
                return [];
            }
        });
    }
    readNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield clubModel_1.default.updateMany({
                    followers: userId,
                    notifications: { $elemMatch: { isRead: { $ne: userId } } }
                }, { $addToSet: { 'notifications.$[elem].isRead': userId.toString() } }, { arrayFilters: [{ 'elem.isRead': { $ne: userId } }] });
                return result;
            }
            catch (error) {
                const err = error;
                console.log(err.message);
            }
        });
    }
    userFollowedClubs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubs = yield clubModel_1.default.find({ followers: userId.toString() });
                return clubs;
            }
            catch (error) {
                return [];
            }
        });
    }
}
exports.default = ClubRepository;
