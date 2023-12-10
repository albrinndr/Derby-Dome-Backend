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
Object.defineProperty(exports, "__esModule", { value: true });
class FixtureUseCase {
    constructor(FixtureRepository, ClubRepository, StadiumRepository, PaymentRepository, ScheduleTask, UserRepository) {
        this.FixtureRepository = FixtureRepository;
        this.ClubRepository = ClubRepository;
        this.StadiumRepository = StadiumRepository;
        this.PaymentRepository = PaymentRepository;
        this.ScheduleTask = ScheduleTask;
        this.UserRepository = UserRepository;
    }
    fixtureContent(date, clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            let allFixtures = yield this.FixtureRepository.findAllFixtures();
            // console.log(allFixtures);
            let allClubs = yield this.ClubRepository.findAllClubs();
            let allTimes = yield this.StadiumRepository.findAllTime();
            if (allClubs)
                allClubs = allClubs.filter((club) => club._id != clubId.toString());
            if (allTimes)
                allTimes = allTimes.filter((time) => new Date(time.showDate) <= new Date(date));
            //converting incoming date for checking
            const formDate = new Date(date);
            const validateDate = formDate.toISOString().split('T')[0];
            if (allFixtures)
                allFixtures = allFixtures.filter((fixture) => {
                    //converting fixture date for checking
                    const fixtureDate = new Date(fixture.date);
                    const searchDate = fixtureDate.toISOString().split('T')[0];
                    return searchDate == validateDate;
                });
            if (allFixtures.length) {
                allFixtures.forEach((fixture) => {
                    if (allClubs && fixture.awayTeamId && fixture.awayTeamId._id && fixture.status == "active") {
                        // allClubs = allClubs.filter((club: any) => {
                        //     club._id.toString() != fixture.awayTeamId._id.toString();
                        // });
                        for (let i = allClubs.length - 1; i >= 0; i--) {
                            const club = allClubs[i];
                            const existsInFixture = allFixtures.some((fixture) => {
                                var _a, _b, _c, _d;
                                if (fixture.status === 'active' && (((_b = (_a = fixture.clubId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) === club._id.toString() || ((_d = (_c = fixture.awayTeamId) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString()) === club._id.toString())) {
                                    return true;
                                }
                                return false;
                            });
                            if (existsInFixture) {
                                allClubs.splice(i, 1); // Remove club from allClubs array
                            }
                        }
                    }
                    if (allTimes && fixture.status == "active") {
                        allTimes = allTimes.filter((time) => time.time != fixture.time);
                    }
                });
            }
            const clubXIExists = yield this.ClubRepository.findTeamPlayerCount(clubId);
            if (!allTimes || allTimes.length < 1) {
                return {
                    status: 200,
                    data: false
                };
            }
            return {
                status: 200,
                data: { times: allTimes, clubs: allClubs, team: clubXIExists }
            };
        });
    }
    paymentGenerate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.awayTeamId) {
                const club = yield this.ClubRepository.findById(data.awayTeamId);
                if (!club) {
                    return {
                        status: 400,
                        data: { message: 'Select a valid club!' }
                    };
                }
                else {
                    const price = data.price || 100;
                    const fixtureName = `${data.title} against ${club.name} at ${data.time}`;
                    const stripeId = yield this.PaymentRepository.confirmPayment(price, fixtureName);
                    return {
                        status: 200,
                        data: { stripeSessionId: stripeId }
                    };
                }
            }
            else {
                const price = data.price || 100;
                const fixtureName = `${data.title} against ${data.awayTeam} at ${data.time}`;
                const stripeId = yield this.PaymentRepository.confirmPayment(price, fixtureName);
                return {
                    status: 200,
                    data: { stripeSessionId: stripeId }
                };
            }
        });
    }
    addNewFixture(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (data.awayTeamId) {
                const club = yield this.ClubRepository.findById(data.awayTeamId);
                if (!club) {
                    return {
                        status: 400,
                        data: { message: 'Select a valid club!' }
                    };
                }
                let checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + 2);
                const fixture = Object.assign(Object.assign({}, data), { awayTeam: club.name, awayTeamLogo: club.image, clubId: data.clubId, checkDate: checkDate });
                const newFixture = yield this.FixtureRepository.saveFixture(fixture);
                //notification task scheduling
                const notificationData = {
                    fixtureId: newFixture._id,
                    message: `Book your tickets for the upcoming match against ${newFixture.awayTeam}`,
                    isRead: [],
                    date: new Date()
                };
                //setting user notification tokens
                const userBrowserTokens = [];
                const users = yield this.UserRepository.findAllUsers();
                const homeClub = yield this.ClubRepository.findById(data.clubId);
                if (users && homeClub) {
                    for (const user of users) {
                        if (((_a = homeClub.followers) === null || _a === void 0 ? void 0 : _a.includes(user._id)) && !user.isBlocked) {
                            userBrowserTokens.push({
                                token: user.browserToken,
                                club: homeClub.name,
                                poster: data.poster
                            });
                        }
                    }
                }
                yield this.ScheduleTask.notificationManagement(newFixture.checkDate, newFixture.date, () => this.sendNotification(newFixture._id, data.clubId, notificationData), () => this.removeNotification(newFixture._id, data.clubId, notificationData), userBrowserTokens);
                return {
                    status: 200,
                    // data: newFixture
                    data: newFixture
                };
            }
            else {
                let checkDate = new Date();
                checkDate.setDate(checkDate.getDate() + 2);
                const fixture = Object.assign(Object.assign({}, data), { clubId: data.clubId, checkDate: checkDate });
                const newFixture = yield this.FixtureRepository.saveFixture(fixture);
                //notification task scheduling
                const notificationData = {
                    fixtureId: newFixture._id,
                    message: `Book your tickets for the upcoming match against ${newFixture.awayTeam}`,
                    isRead: [],
                    date: new Date()
                };
                //setting user notification tokens
                const userBrowserTokens = [];
                const users = yield this.UserRepository.findAllUsers();
                const homeClub = yield this.ClubRepository.findById(data.clubId);
                if (users && homeClub) {
                    for (const user of users) {
                        if (((_b = homeClub.followers) === null || _b === void 0 ? void 0 : _b.includes(user._id)) && !user.isBlocked) {
                            userBrowserTokens.push({
                                token: user.browserToken,
                                club: homeClub.name,
                                poster: data.poster
                            });
                        }
                    }
                }
                yield this.ScheduleTask.notificationManagement(newFixture.checkDate, newFixture.date, () => this.sendNotification(newFixture._id, data.clubId, notificationData), () => this.removeNotification(newFixture._id, data.clubId, notificationData), userBrowserTokens);
                return {
                    status: 200,
                    // data: newFixture
                    data: newFixture
                };
            }
        });
    }
    clubFixtures(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fixtures = yield this.FixtureRepository.findFixturesByClubId(id);
            fixtures.sort((a, b) => b.createdAt - a.createdAt);
            return {
                status: 200,
                data: fixtures
            };
        });
    }
    cancelFixture(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelled = yield this.FixtureRepository.findFixtureByIdAndCancel(id);
            if (cancelled) {
                return {
                    status: 200,
                    data: 'Fixture has been cancelled!'
                };
            }
            else {
                return {
                    status: 400,
                    data: 'Invalid fixture'
                };
            }
        });
    }
    sendNotification(fixtureId, clubId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const fixture = yield this.FixtureRepository.findByIdNotCancelled(fixtureId);
            if (fixture) {
                console.log('inside send');
                yield this.ClubRepository.sendNotification(clubId, notification);
            }
        });
    }
    removeNotification(fixtureId, clubId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            const fixture = yield this.FixtureRepository.findByIdNotCancelled(fixtureId);
            if (fixture) {
                console.log('inside remove');
                yield this.ClubRepository.removeNotification(fixtureId, clubId);
            }
        });
    }
}
exports.default = FixtureUseCase;
