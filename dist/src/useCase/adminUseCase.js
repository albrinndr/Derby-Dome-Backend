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
class AdminUseCase {
    constructor(AdminRepository, Encrypt, JWTToken, UserRepository, ClubRepository, FixtureRepository, TicketRepository) {
        this.AdminRepository = AdminRepository;
        this.UserRepository = UserRepository;
        this.ClubRepository = ClubRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
        this.FixtureRepository = FixtureRepository;
        this.TicketRepository = TicketRepository;
    }
    login(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield this.AdminRepository.findByEmail(admin.email);
            if (adminData) {
                const passwordMatch = yield this.Encrypt.compare(admin.password, adminData.password);
                if (passwordMatch) {
                    const token = this.JWTToken.generateToken(adminData._id, 'admin');
                    return {
                        status: 200,
                        data: {
                            message: 'Logged In',
                            token
                        }
                    };
                }
                else {
                    return {
                        status: 400,
                        data: {
                            message: 'Invalid email or password!',
                            token: null
                        }
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: {
                        message: 'Invalid email or password!',
                        token: null
                    }
                };
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersList = yield this.UserRepository.findAllUsers();
            let filteredUsersList = [];
            if (usersList) {
                filteredUsersList = usersList.map((user) => {
                    const date = new Date(user.createdAt);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    return {
                        _id: user._id || '',
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        isBlocked: user.isBlocked || false,
                        isGoogle: user.isGoogle,
                        createdAt: formattedDate,
                        profilePic: user.profilePic
                    };
                });
            }
            return {
                status: 200,
                data: filteredUsersList
            };
        });
    }
    blockUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findById(_id);
            if (user) {
                user.isBlocked = !user.isBlocked;
                const updatedUser = yield this.UserRepository.save(user);
                return {
                    status: 200,
                    data: updatedUser
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'User not found!' }
                };
            }
        });
    }
    getClubs() {
        return __awaiter(this, void 0, void 0, function* () {
            const clubsList = yield this.ClubRepository.findAllClubs();
            let filteredClubsList = [];
            if (clubsList) {
                filteredClubsList = clubsList.map((club) => {
                    const date = new Date(club.createdAt);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    return {
                        _id: club._id || '',
                        name: club.name || '',
                        email: club.email || '',
                        phone: club.phone || '',
                        isBlocked: club.isBlocked || false,
                        createdAt: formattedDate,
                        image: club.image
                    };
                });
            }
            return {
                status: 200,
                data: filteredClubsList
            };
        });
    }
    blockClub(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield this.ClubRepository.findById(_id);
            if (club) {
                club.isBlocked = !club.isBlocked;
                const updatedClub = yield this.ClubRepository.save(club);
                return {
                    status: 200,
                    data: updatedClub
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Club not found!' }
                };
            }
        });
    }
    dashboardSlotSaleData(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const salesData = yield this.FixtureRepository.slotSaleAdminDashboard(year);
            return {
                status: 200,
                data: {
                    years: salesData.displayYears,
                    profits: salesData.totalPrices
                }
            };
        });
    }
    ;
    dashboardChartAndCardContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const seatSections = yield this.TicketRepository.sectionSelectionCountAdminDashboard();
            const users = yield this.UserRepository.findAllUsers();
            const clubs = yield this.ClubRepository.findAllClubs();
            const tickets = yield this.TicketRepository.ticketsNotCancelled();
            const fixtures = yield this.FixtureRepository.findAllFixturesNotCancelled();
            const totalSales = fixtures.reduce((acc, curr) => acc += curr.price, 0);
            return {
                status: 200,
                data: {
                    sectionData: seatSections,
                    users: (users === null || users === void 0 ? void 0 : users.length) || 0,
                    clubs: (clubs === null || clubs === void 0 ? void 0 : clubs.length) || 0,
                    tickets: tickets.length || 0,
                    totalSales
                }
            };
        });
    }
    dashboardTicketSoldData(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketsSoldData = yield this.TicketRepository.ticketSalesDataAdminDashboard(year);
            return {
                status: 200,
                data: {
                    years: ticketsSoldData.displayYears,
                    count: ticketsSoldData.totalCounts
                }
            };
        });
    }
    allFixtures() {
        return __awaiter(this, void 0, void 0, function* () {
            const fixtures = yield this.FixtureRepository.findAllFixtures();
            return {
                status: 200,
                data: fixtures
            };
        });
    }
}
exports.default = AdminUseCase;
