import User from "../domain/user";
import Encrypt from "../infrastructure/services/bcryptPassword";
import UserRepository from "../infrastructure/repository/userRepository";
import JWTToken from "../infrastructure/services/generateToken";
import BannerRepository from "../infrastructure/repository/bannerRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import StadiumRepository from "../infrastructure/repository/stadiumRepository";

class UserUseCase {
    private UserRepository: UserRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    private BannerRepository: BannerRepository;
    private FixtureRepository: FixtureRepository;
    private StadiumRepository: StadiumRepository;

    constructor(UserRepository: UserRepository, Encrypt: Encrypt, JWTToken: JWTToken,
        BannerRepository: BannerRepository, FixtureRepository: FixtureRepository,
        StadiumRepository: StadiumRepository
    ) {
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
        this.BannerRepository = BannerRepository;
        this.FixtureRepository = FixtureRepository;
        this.StadiumRepository = StadiumRepository;

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

            if (passwordMatch) {
                const userId = userData?._id;
                if (userId) token = this.JWTToken.generateToken(userId);
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
        const fixtures = (await this.FixtureRepository.findAllFixtures()).reverse();
        const seats = await this.StadiumRepository.getAllSeats();
        const prices = seats.map((seat: any) => seat.price);
        prices.sort((a, b) => a - b);

        const minPrice = prices[0] ? prices[0] : 0;

        let fixtureData = [];
        if (fixtures.length > 3) fixtureData = fixtures.slice(0, 3);
        else fixtureData = fixtures;
        return {
            status: 200,
            data: { banners: banners, fixtures: fixtureData,minPrice }
        };
    }
}

export default UserUseCase;
