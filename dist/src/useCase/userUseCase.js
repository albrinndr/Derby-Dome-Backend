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
class UserUseCase {
    constructor(UserRepository, Encrypt, JWTToken, BannerRepository, FixtureRepository, StadiumRepository, ClubRepository, CartRepository, CouponRepository, TicketRepository) {
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
        this.BannerRepository = BannerRepository;
        this.FixtureRepository = FixtureRepository;
        this.StadiumRepository = StadiumRepository;
        this.ClubRepository = ClubRepository;
        this.CartRepository = CartRepository;
        this.CouponRepository = CouponRepository;
        this.TicketRepository = TicketRepository;
    }
    signUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.UserRepository.findByEmail(email);
            if (userExists) {
                return {
                    status: 400,
                    data: {
                        status: false,
                        message: "User already exists!"
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
    verifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.Encrypt.generateHash(user.password);
            const newUser = Object.assign(Object.assign({}, user), { password: hashedPassword });
            yield this.UserRepository.save(newUser);
            return {
                status: 200,
                data: { status: true, message: 'User Registration successful!' }
            };
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.UserRepository.findByEmail(user.email);
            let token = '';
            if (userData) {
                if (userData.isBlocked) {
                    return {
                        status: 400,
                        data: {
                            message: 'You have been blocked by admin!',
                            token: ''
                        }
                    };
                }
                const passwordMatch = yield this.Encrypt.compare(user.password, userData.password);
                if (passwordMatch || user.isGoogle) {
                    const userId = userData === null || userData === void 0 ? void 0 : userData._id;
                    if (userId)
                        token = this.JWTToken.generateToken(userId, 'user');
                    return {
                        status: 200,
                        data: {
                            message: userData,
                            token
                        }
                    };
                }
                else {
                    return {
                        status: 400,
                        data: {
                            message: 'Invalid email or password!',
                            token
                        }
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: {
                        message: 'Invalid email or password!',
                        token
                    }
                };
            }
        });
    }
    profile(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findById(_id);
            if (user) {
                return {
                    status: 200,
                    data: user
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'User not found' }
                };
            }
        });
    }
    updateProfile(id, user, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.UserRepository.findById(id);
            if (userData) {
                userData.name = user.name || userData.name;
                userData.phone = user.phone || userData.phone;
                userData.profilePic = user.profilePic || userData.profilePic;
                if (user.password) {
                    const passwordMatch = yield this.Encrypt.compare(user.password, userData.password);
                    if (passwordMatch && newPassword) {
                        userData.password = yield this.Encrypt.generateHash(newPassword);
                    }
                    else {
                        return {
                            status: 400,
                            data: { message: 'Password does not match!' }
                        };
                    }
                }
                const updatedUser = yield this.UserRepository.save(userData);
                return {
                    status: 200,
                    data: updatedUser
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'User not found' }
                };
            }
        });
    }
    userHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const banners = yield this.BannerRepository.findAll();
            let fixtures = (yield this.FixtureRepository.findAllFixtures()).reverse();
            fixtures = fixtures.filter((fixture) => fixture.status === 'active');
            const seats = yield this.StadiumRepository.getAllSeats();
            let clubs = yield this.ClubRepository.findAllClubs();
            if (clubs && clubs.length > 0) {
                clubs = clubs === null || clubs === void 0 ? void 0 : clubs.filter((club) => club.isBlocked === false);
                if (clubs.length > 4)
                    clubs = clubs.slice(0, 4);
            }
            const prices = seats.map((seat) => seat.price.economy);
            prices.sort((a, b) => a - b);
            const minPrice = prices[0] ? prices[0] : 0;
            let fixtureData = [];
            if (fixtures.length > 0)
                fixtureData = fixtures;
            if (fixtures.length > 0) {
                const currentDate = new Date().setHours(0, 0, 0, 0);
                fixtureData = fixtureData.filter((fixture) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));
                fixtureData = fixtureData.filter((fixture) => {
                    const today = new Date();
                    const checkDate = new Date(fixture.checkDate);
                    // Convert both dates to the same time zone (UTC) for accurate comparison
                    today.setHours(0, 0, 0, 0);
                    checkDate.setHours(0, 0, 0, 0);
                    return today > checkDate;
                });
            }
            if (fixtureData.length > 3)
                fixtureData = fixtureData.slice(0, 3);
            return {
                status: 200,
                data: { banners: banners, fixtures: fixtureData, minPrice, clubs }
            };
        });
    }
    allFixtures() {
        return __awaiter(this, void 0, void 0, function* () {
            let fixtures = (yield this.FixtureRepository.findAllFixtures()).reverse();
            fixtures = fixtures.filter((fixture) => fixture.status === 'active');
            const clubs = yield this.ClubRepository.findAllClubs();
            const currentDate = new Date().setHours(0, 0, 0, 0);
            fixtures = fixtures.filter((fixture) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));
            return {
                status: 200,
                data: {
                    fixtures: fixtures,
                    clubs: clubs
                }
            };
        });
    }
    userSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            let fixtures = (yield this.FixtureRepository.findAllFixtures()).reverse();
            fixtures = fixtures.filter((fixture) => fixture.status === 'active');
            const clubs = yield this.ClubRepository.findAllClubs();
            const currentDate = new Date().setHours(0, 0, 0, 0);
            fixtures = fixtures.filter((fixture) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));
            fixtures = fixtures.filter((fixture) => {
                if (fixture.checkDate) {
                    const today = new Date();
                    const checkDate = new Date(fixture.checkDate);
                    today.setHours(0, 0, 0, 0);
                    checkDate.setHours(0, 0, 0, 0);
                    return today > checkDate;
                }
            });
            return {
                status: 200,
                data: {
                    fixtures: fixtures,
                    clubs: clubs,
                }
            };
        });
    }
    fixtureDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.FixtureRepository.findByIdNotCancelled(id);
            return {
                status: 200,
                data: result
            };
        });
    }
    clubDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const club = yield this.ClubRepository.findById(id);
            let fixtures = yield this.FixtureRepository.findFixturesByClubId(id);
            const currentDate = new Date().setHours(0, 0, 0, 0);
            fixtures = fixtures.filter((fixture) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));
            fixtures = fixtures.filter((fixture) => {
                if (fixture.checkDate) {
                    const today = new Date();
                    const checkDate = new Date(fixture.checkDate);
                    today.setHours(0, 0, 0, 0);
                    checkDate.setHours(0, 0, 0, 0);
                    return today > checkDate;
                }
            });
            let slicedFixtures = fixtures.length > 3 ? fixtures.slice(0, 3) : fixtures;
            return {
                status: 200,
                data: {
                    club,
                    fixtures: slicedFixtures
                }
            };
        });
    }
    bookingPage(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fixture = yield this.FixtureRepository.findByIdNotCancelled(id);
            const seats = yield this.StadiumRepository.getAllSeats();
            const cartData = yield this.CartRepository.cartDataForBooking(userId, id);
            return {
                status: 200,
                data: {
                    fixture,
                    seats,
                    cartData: cartData.standCounts,
                    vipCartSeats: cartData.vipCartSeats
                }
            };
        });
    }
    getCartDataForCheckout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.CartRepository.cartDataForCheckout(userId);
            let fixture = {};
            if (cart) {
                fixture = yield this.FixtureRepository.findByIdNotCancelled(cart.fixtureId);
            }
            const coupons = yield this.CouponRepository.findAvailableCoupons();
            return {
                status: 200,
                data: {
                    cart,
                    fixture,
                    coupons
                }
            };
        });
    }
    allReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            let reviews = yield this.StadiumRepository.allReviews();
            reviews = reviews.sort((a, b) => b.createdAt - a.createdAt);
            return {
                status: 200,
                data: reviews
            };
        });
    }
    singleUserReview(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchased = yield this.TicketRepository.userTickets(userId);
            if (purchased.length > 0) {
                const review = yield this.StadiumRepository.singleUserReview(userId);
                if (review) {
                    return {
                        status: 200,
                        data: {
                            purchased: true,
                            review
                        }
                    };
                }
                return {
                    status: 200,
                    data: {
                        purchased: true,
                    }
                };
            }
            else {
                return {
                    status: 200,
                    data: {
                        purchased: false
                    }
                };
            }
        });
    }
    followClub(userId, clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId && clubId) {
                const follow = yield this.ClubRepository.followClub(userId, clubId);
                if (follow) {
                    return {
                        status: 200,
                        data: follow
                    };
                }
                else {
                    return {
                        status: 400,
                        data: { message: 'An error occurred! Please try again.' }
                    };
                }
            }
            else {
                return {
                    status: 400,
                    data: { message: 'An error occurred! Please try again.' }
                };
            }
        });
    }
    userNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.ClubRepository.findUserNotifications(userId);
            return {
                status: 200,
                data: notifications
            };
        });
    }
    newNotificationCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.ClubRepository.findUserNotifications(userId);
            let count = 0;
            notifications.forEach((notification) => {
                if (!notification.notification.isRead.includes(userId.toString()))
                    count++;
            });
            return {
                status: 200,
                data: count
            };
        });
    }
    readNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ClubRepository.readNotification(userId);
            if (result) {
                return {
                    status: 200,
                    data: 'Success'
                };
            }
            else {
                return {
                    status: 400,
                    data: "An error occurred"
                };
            }
        });
    }
    // forget password
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findByEmail(email);
            if (!user) {
                return {
                    status: 400,
                    data: { status: false, message: "Enter a valid email!" }
                };
            }
            else if (user.isBlocked) {
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
    ;
    forgotPasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findByEmail(email);
            const hashedPassword = yield this.Encrypt.generateHash(password);
            if (user && user.password) {
                user.password = hashedPassword;
                yield this.UserRepository.save(user);
                return {
                    status: 200,
                    data: user
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
    allFollowedClubs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubs = yield this.ClubRepository.userFollowedClubs(userId);
            return {
                status: 200,
                data: clubs
            };
        });
    }
    ;
    //firebase token for notification
    setBrowserToken(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.UserRepository.findById(userId);
            if (user) {
                user.browserToken = token;
                yield this.UserRepository.save(user);
                return {
                    status: 200,
                    data: user
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'An error occurred!' }
                };
            }
        });
    }
    ;
}
exports.default = UserUseCase;
