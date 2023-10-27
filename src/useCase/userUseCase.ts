import User from "../domain/user";
import Encrypt from "../infrastructure/utils/bcryptPassword";
import UserRepository from "../infrastructure/repository/userRepository";
import JWTToken from "../infrastructure/utils/generateToken";

class UserUseCase {
    private UserRepository: UserRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;

    constructor(UserRepository: UserRepository, Encrypt: Encrypt, JWTToken: JWTToken) {
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;

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
                        user: 'User is blocked by admin!',
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
                        user: userData,
                        token
                    }
                };
            } else {
                return {
                    status: 400,
                    data: {
                        user: 'Invalid email or password!',
                        token
                    }
                };

            }
        } else {
            return {
                status: 400,
                data: {
                    user: 'Invalid email or password!',
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
            throw new Error('User not found!');
        }
    }

    async updateProfile(user: User, newPassword?: string) {
        const userData = await this.UserRepository.findById(user._id);
        if (userData) {
            userData.name = user.name || userData.name;
            userData.phone = user.phone || userData.phone;
            if (user.password) {
                const passwordMatch = await this.Encrypt.compare(user.password, userData.password);
                if (passwordMatch && newPassword) {
                    userData.password = await this.Encrypt.generateHash(newPassword);
                } else {
                    return {
                        status: 200,
                        data: 'Password does not match!'
                    };
                }
            }
            const updatedUser = await this.UserRepository.save(userData);
            return {
                status: 200,
                data: updatedUser
            };
        } else {
            throw new Error('User not found!');
        }
    }
}

export default UserUseCase;
