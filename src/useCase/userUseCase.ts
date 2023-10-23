import User from "../domain/user";
import Encrypt from "../infrastructure/utils/bcryptPassword";
import UserRepository from "../infrastructure/repository/userRepository";

class UserUseCase {
    private UserRepository: UserRepository;
    private Encrypt: Encrypt;
    constructor(UserRepository: UserRepository, Encrypt: Encrypt) {
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
    }

    async signUp(user: User) {
        const userExists = await this.UserRepository.findByEmail(user.email);
        if (userExists) {
            throw new Error('User Already Exists!');
        } else {
            const hashedPassword = await this.Encrypt.generateHash(user.password);
            const newUser = { ...user, password: hashedPassword };
            await this.UserRepository.save(newUser);
            return {
                status: 200,
                data: newUser
            };
        }
    }

    async login(user: User) {
        const userData = await this.UserRepository.findByEmail(user.email);
        if (userData) {
            const passwordMatch = await this.Encrypt.compare(user.password, userData.password);
            if (passwordMatch) {
                return {
                    status: 200,
                    data: userData
                };
            } else {
                throw new Error('Invalid email or password!');
            }
        } else {
            throw new Error('Invalid email or password!');
        }
    }
}

export default UserUseCase;
