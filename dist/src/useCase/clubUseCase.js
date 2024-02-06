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
class ClubUseCase {
    constructor(ClubRepository, Encrypt, JWTToken, FixtureRepository, TicketRepository) {
        this.ClubRepository = ClubRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
        this.FixtureRepository = FixtureRepository;
        this.TicketRepository = TicketRepository;
    }
    signUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubExists = yield this.ClubRepository.findByEmail(email);
            if (clubExists) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "Club already exists!"
                    }
                };
            }
            return {
                status: 200,
                data: {
                    status: true,
                    message: 'Verification otp sent to your email!'
                }
            };
        });
    }
    verifyClub(club) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.Encrypt.generateHash(club.password);
            const newClub = Object.assign(Object.assign({}, club), { password: hashedPassword });
            yield this.ClubRepository.save(newClub);
            return {
                status: 200,
                data: {
                    message: "Club registration successful!"
                }
            };
        });
    }
    login(club) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubData = yield this.ClubRepository.findByEmail(club.email);
            let token = '';
            if (clubData) {
                if (clubData.isBlocked) {
                    return {
                        status: 400,
                        data: {
                            message: 'Club is blocked by admin!',
                            token: ''
                        }
                    };
                }
                const passwordMatch = yield this.Encrypt.compare(club.password, clubData.password);
                if (passwordMatch) {
                    const clubId = clubData === null || clubData === void 0 ? void 0 : clubData._id;
                    if (clubId)
                        token = this.JWTToken.generateToken(clubId, 'club');
                    return {
                        status: 200,
                        data: {
                            club: clubData,
                            token
                        }
                    };
                }
                else {
                    return {
                        status: 400,
                        data: {
                            message: 'Invalid email or password!',
                            token: ''
                        }
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: {
                        message: 'Invalid email or password!',
                        token: ''
                    }
                };
            }
        });
    }
    profile(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield this.ClubRepository.findById(_id);
            if (club) {
                return {
                    status: 200,
                    data: club
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Club not found' }
                };
            }
        });
    }
    updateProfile(id, club, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubData = yield this.ClubRepository.findById(id);
            if (clubData) {
                clubData.name = club.name || clubData.name;
                clubData.phone = club.phone || clubData.phone;
                clubData.image = club.image || clubData.image;
                clubData.address = club.address || clubData.address;
                clubData.contactPerson = club.contactPerson || clubData.contactPerson;
                clubData.description = club.description || clubData.description;
                if (club.password) {
                    const passwordMatch = yield this.Encrypt.compare(club.password, clubData.password);
                    if (passwordMatch && newPassword) {
                        clubData.password = yield this.Encrypt.generateHash(newPassword);
                    }
                    else {
                        return {
                            status: 400,
                            data: { message: 'Password does not match!' }
                        };
                    }
                }
                const updatedClub = yield this.ClubRepository.save(clubData);
                return {
                    status: 200,
                    data: updatedClub
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Club not found' }
                };
            }
        });
    }
    backgroundUpdate(id, bgImg) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubData = yield this.ClubRepository.findById(id);
            if (clubData) {
                clubData.bgImg = bgImg;
                const updatedClub = yield this.ClubRepository.save(clubData);
                return {
                    status: 200,
                    data: { bgImg: updatedClub.bgImg }
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Club not found' }
                };
            }
        });
    }
    getTeamData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.ClubRepository.findTeamById(id);
            return {
                status: 200,
                data: team
            };
        });
    }
    addClubManager(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = yield this.ClubRepository.addManager(id, data);
            return {
                status: 200,
                data: manager
            };
        });
    }
    editClubManager(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = yield this.ClubRepository.editManager(id, data);
            return {
                status: 200,
                data: manager
            };
        });
    }
    addNewPlayer(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ClubRepository.addPlayer(id, data);
            if (!result) {
                return {
                    status: 400,
                    data: { message: "Shirt no. already exists!" }
                };
            }
            else if (result === 'Limit') {
                return {
                    status: 400,
                    data: { message: "Max player limit reached!" }
                };
            }
            else {
                return {
                    status: 200,
                    data: result
                };
            }
        });
    }
    editPlayer(clubId, playerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ClubRepository.editPlayer(clubId, playerId, data);
            if (result === null) {
                return {
                    status: 400,
                    data: { message: "Invalid player id" }
                };
            }
            if (result === false) {
                return {
                    status: 400,
                    data: { message: "Shirt no. already exists!" }
                };
            }
            else {
                return {
                    status: 200,
                    data: result
                };
            }
        });
    }
    deleteClubPlayer(clubId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ClubRepository.deletePlayer(clubId, playerId);
            if (result) {
                return {
                    status: 200,
                    data: "Player removed!"
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: "An error occurred" }
                };
            }
        });
    }
    changeStartingXI(clubId, plId, p2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ClubRepository.swapStartingXI(clubId, plId, p2Id);
            if (result) {
                return {
                    status: 200,
                    data: result
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: "An error occurred!" }
                };
            }
        });
    }
    clubDashboardSalesAndExpense(clubId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const exp = yield this.FixtureRepository.clubExpenditure(clubId, year);
            const profit = yield this.TicketRepository.clubTicketProfit(clubId, year);
            return {
                status: 200,
                data: {
                    years: exp.displayYears,
                    exp: exp.totalPrices,
                    profit: profit,
                }
            };
        });
    }
    ;
    clubDashboardContent(clubId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sectionCountData = yield this.TicketRepository.clubTicketSectionCountForDashboard(clubId);
            const club = yield this.ClubRepository.findById(clubId);
            const upcomingFixtures = yield this.FixtureRepository.findUpcomingFixtures(clubId);
            upcomingFixtures.sort((a, b) => a.createdAt - b.createdAt);
            const salesArr = {};
            for (const fixture of upcomingFixtures) {
                const salesPrice = yield this.TicketRepository.fixtureTicketSales(fixture._id);
                salesArr[fixture._id] = salesPrice;
            }
            return {
                status: 200,
                data: {
                    sectionCount: sectionCountData,
                    followers: ((_a = club === null || club === void 0 ? void 0 : club.followers) === null || _a === void 0 ? void 0 : _a.length) || 0,
                    fixtures: upcomingFixtures,
                    fixtureSales: salesArr
                }
            };
        });
    }
    //forgotPassword
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield this.ClubRepository.findByEmail(email);
            if (!club) {
                return {
                    status: 400,
                    data: { status: false, message: "Enter a valid email!" }
                };
            }
            else if (club.isBlocked) {
                return {
                    status: 400,
                    data: { status: false, message: "You are blocked by admin. Sorry!" }
                };
            }
            else {
                return {
                    status: 200,
                    data: { status: true, message: "Otp have been sent to your email!" }
                };
            }
        });
    }
    forgotPasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield this.ClubRepository.findByEmail(email);
            const hashedPassword = yield this.Encrypt.generateHash(password);
            if (club && club.password) {
                club.password = hashedPassword;
                yield this.ClubRepository.save(club);
                return {
                    status: 200,
                    data: club
                };
            }
            else {
                return {
                    status: 200,
                    data: { message: "An error occurred. Please try again!" }
                };
            }
        });
    }
}
exports.default = ClubUseCase;
