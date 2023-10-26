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

    async verifyUser(email: string) {
        const userExists = await this.UserRepository.findByEmail(email);
        if (userExists) {
            return {
                status: 400,
                data: false
            };
        }
        return {
            status: 200,
            data: true
        };
    }

    async signUp(user: User) {
        const hashedPassword = await this.Encrypt.generateHash(user.password);
        const newUser = { ...user, password: hashedPassword };
        await this.UserRepository.save(newUser);
        return {
            status: 200,
            data: newUser
        };
    }

    async login(user: User) {
        const userData = await this.UserRepository.findByEmail(user.email);
        if (userData) {
            if (userData.isBlocked) throw new Error('User is blocked by admin!');
            const passwordMatch = await this.Encrypt.compare(user.password, userData.password);
            if (passwordMatch) {
                const userId = userData?._id;
                let token = '';
                if (userId) token = this.JWTToken.generateToken(userId);
                return {
                    status: 200,
                    data: {
                        user: userData,
                        token
                    }
                };
            } else {
                throw new Error('Invalid email or password!');
            }
        } else {
            throw new Error('Invalid email or password!');
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
                    throw new Error('Password does not match!');
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
