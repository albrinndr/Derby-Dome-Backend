import User from "../domain/user";
import Encrypt from "../infrastructure/services/bcryptPassword";
import UserRepository from "../infrastructure/repository/userRepository";
import JWTToken from "../infrastructure/services/generateToken";
import BannerRepository from "../infrastructure/repository/bannerRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import StadiumRepository from "../infrastructure/repository/stadiumRepository";
import ClubRepository from "../infrastructure/repository/clubRepository";
import Fixture from "../domain/fixture";
import CartRepository from "../infrastructure/repository/cartRepository";
import CouponRepository from "../infrastructure/repository/couponRepository";
import TicketRepository from "../infrastructure/repository/ticketRepository";

class UserUseCase {
    private UserRepository: UserRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    private BannerRepository: BannerRepository;
    private FixtureRepository: FixtureRepository;
    private StadiumRepository: StadiumRepository;
    private ClubRepository: ClubRepository;
    private CartRepository: CartRepository;
    private CouponRepository: CouponRepository;
    private TicketRepository: TicketRepository;


    constructor(UserRepository: UserRepository, Encrypt: Encrypt, JWTToken: JWTToken,
        BannerRepository: BannerRepository, FixtureRepository: FixtureRepository,
        StadiumRepository: StadiumRepository, ClubRepository: ClubRepository,
        CartRepository: CartRepository, CouponRepository: CouponRepository, TicketRepository: TicketRepository
    ) {
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

    async signUp(email: string) {
        const userExists = await this.UserRepository.findByEmail(email);
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
    }

    async verifyUser(user: User) {
        const hashedPassword = await this.Encrypt.generateHash(user.password);
        const newUser = { ...user, password: hashedPassword };
        await this.UserRepository.save(newUser);
        return {
            status: 200,
            data: { status: true, message: 'User Registration successful!' }
        };
    }

    async login(user: User) {
        const userData = await this.UserRepository.findByEmail(user.email);
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

            const passwordMatch = await this.Encrypt.compare(user.password, userData.password);

            if (passwordMatch || user.isGoogle) {
                const userId = userData?._id;
                if (userId) token = this.JWTToken.generateToken(userId, 'user');
                return {
                    status: 200,
                    data: {
                        message: userData,
                        token
                    }
                };
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Invalid email or password!',
                        token
                    }
                };

            }
        } else {
            return {
                status: 400,
                data: {
                    message: 'Invalid email or password!',
                    token
                }
            };
        }
    }

    async profile(_id: string) {
        const user = await this.UserRepository.findById(_id);
        if (user) {
            return {
                status: 200,
                data: user
            };
        } else {
            return {
                status: 400,
                data: { message: 'User not found' }
            };
        }
    }

    async updateProfile(id: string, user: User, newPassword?: string) {
        const userData = await this.UserRepository.findById(id);
        if (userData) {
            userData.name = user.name || userData.name;
            userData.phone = user.phone || userData.phone;
            userData.profilePic = user.profilePic || userData.profilePic;
            if (user.password) {
                const passwordMatch = await this.Encrypt.compare(user.password, userData.password);
                if (passwordMatch && newPassword) {
                    userData.password = await this.Encrypt.generateHash(newPassword);
                } else {
                    return {
                        status: 400,
                        data: { message: 'Password does not match!' }
                    };
                }
            }
            const updatedUser = await this.UserRepository.save(userData);
            return {
                status: 200,
                data: updatedUser
            };
        } else {
            return {
                status: 400,
                data: { message: 'User not found' }
            };
        }
    }

    async userHome() {
        const banners = await this.BannerRepository.findAll();
        let fixtures = (await this.FixtureRepository.findAllFixtures()).reverse();
        fixtures = fixtures.filter((fixture: any) => fixture.status === 'active');
        const seats = await this.StadiumRepository.getAllSeats();
        let clubs = await this.ClubRepository.findAllClubs();

        if (clubs && clubs.length > 0) {
            clubs = clubs?.filter((club: any) => club.isBlocked === false);
            if (clubs.length > 4) clubs = clubs.slice(0, 4);
        }

        const prices = seats.map((seat: any) => seat.price.economy);
        prices.sort((a, b) => a - b);
        const minPrice = prices[0] ? prices[0] : 0;

        let fixtureData: Fixture[] = [];
        if (fixtures.length > 0) fixtureData = fixtures;

        if (fixtures.length > 0) {
            const currentDate = new Date().setHours(0, 0, 0, 0);
            fixtureData = fixtureData.filter((fixture: any) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));

            fixtureData = fixtureData.filter((fixture: any) => {
                const today = new Date();
                const checkDate = new Date(fixture.checkDate);

                // Convert both dates to the same time zone (UTC) for accurate comparison
                today.setHours(0, 0, 0, 0);
                checkDate.setHours(0, 0, 0, 0);
                return today > checkDate;
            });
        }

        if (fixtureData.length > 3) fixtureData = fixtureData.slice(0, 3);

        return {
            status: 200,
            data: { banners: banners, fixtures: fixtureData, minPrice, clubs }
        };
    }

    async allFixtures() {
        let fixtures = (await this.FixtureRepository.findAllFixtures()).reverse();
        fixtures = fixtures.filter((fixture: any) => fixture.status === 'active');
        const clubs = await this.ClubRepository.findAllClubs();

        const currentDate = new Date().setHours(0, 0, 0, 0);
        fixtures = fixtures.filter((fixture: any) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));

        return {
            status: 200,
            data: {
                fixtures: fixtures,
                clubs: clubs
            }
        };
    }

    async userSearch() {
        let fixtures: Fixture[] = (await this.FixtureRepository.findAllFixtures()).reverse();
        fixtures = fixtures.filter((fixture: any) => fixture.status === 'active');

        const clubs = await this.ClubRepository.findAllClubs();

        const currentDate = new Date().setHours(0, 0, 0, 0);
        fixtures = fixtures.filter((fixture: any) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));

        fixtures = fixtures.filter((fixture: Fixture) => {
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

    }

    async fixtureDetails(id: string) {
        const result = await this.FixtureRepository.findByIdNotCancelled(id);
        return {
            status: 200,
            data: result
        };
    }

    async clubDetails(id: string) {
        const club = await this.ClubRepository.findById(id);
        let fixtures = await this.FixtureRepository.findFixturesByClubId(id);
        const currentDate = new Date().setHours(0, 0, 0, 0);
        fixtures = fixtures.filter((fixture: any) => currentDate < (new Date(fixture.date).setHours(0, 0, 0, 0)));

        fixtures = fixtures.filter((fixture: Fixture) => {
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
    }

    async bookingPage(id: string, userId: string) {
        const fixture = await this.FixtureRepository.findByIdNotCancelled(id);
        const seats = await this.StadiumRepository.getAllSeats();
        const cartData = await this.CartRepository.cartDataForBooking(userId, id);

        return {
            status: 200,
            data: {
                fixture,
                seats,
                cartData: cartData.standCounts,
                vipCartSeats: cartData.vipCartSeats
            }
        };
    }

    async getCartDataForCheckout(userId: string) {
        const cart = await this.CartRepository.cartDataForCheckout(userId);
        let fixture = {};
        if (cart) {
            fixture = await this.FixtureRepository.findByIdNotCancelled(cart.fixtureId);
        }
        const coupons = await this.CouponRepository.findAvailableCoupons();
        return {
            status: 200,
            data: {
                cart,
                fixture,
                coupons
            }
        };
    }


    async allReviews() {
        let reviews = await this.StadiumRepository.allReviews();
        reviews = reviews.sort((a: any, b: any) => b.createdAt - a.createdAt);
        return {
            status: 200,
            data: reviews
        };
    }

    async singleUserReview(userId: string) {
        const purchased = await this.TicketRepository.userTickets(userId);
        if (purchased.length > 0) {
            const review = await this.StadiumRepository.singleUserReview(userId);
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
        } else {
            return {
                status: 200,
                data: {
                    purchased: false
                }
            };
        }
    }

    async followClub(userId: string, clubId: string) {
        if (userId && clubId) {
            const follow = await this.ClubRepository.followClub(userId, clubId);
            if (follow) {
                return {
                    status: 200,
                    data: follow
                };
            } else {
                return {
                    status: 400,
                    data: { message: 'An error occurred! Please try again.' }
                };
            }

        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again.' }
            };
        }
    }

    async userNotifications(userId: string) {
        const notifications = await this.ClubRepository.findUserNotifications(userId);
        return {
            status: 200,
            data: notifications
        };
    }

    async newNotificationCount(userId: string) {
        const notifications = await this.ClubRepository.findUserNotifications(userId);
        let count = 0;
        notifications.forEach((notification) => {
            if (!notification.notification.isRead.includes(userId.toString())) count++;
        });
        return {
            status: 200,
            data: count
        };
    }

    async readNotification(userId: string) {
        await this.ClubRepository.readNotification(userId);
        return {
            status: 200,
            data: 'Success'
        };
    }

    // forget password

    async forgotPassword(email: string) {
        const user = await this.UserRepository.findByEmail(email);
        if (!user) {
            return {
                status: 400,
                data: { status: false, message: "Enter a valid email!" }
            };
        } else if (user.isBlocked) {
            return {
                status: 400,
                data: { status: false, message: "You are blocked by admin. Sorry!" }
            };
        } else {
            return {
                status: 200,
                data: { status: true, message: "Otp have been sent to your email!" }
            };
        }
    };

    async forgotPasswordChange(email: string, password: string) {
        const user = await this.UserRepository.findByEmail(email);

        const hashedPassword = await this.Encrypt.generateHash(password);
        if (user && user.password) {
            user.password = hashedPassword;
            await this.UserRepository.save(user);
            return {
                status: 200,
                data: user
            };
        } else {
            return {
                status: 200,
                data: { message: "An error occurred. Please try again!" }
            };
        }
    }
}

export default UserUseCase;
