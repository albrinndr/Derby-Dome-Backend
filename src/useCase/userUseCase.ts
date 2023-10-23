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

    // async profile(_id: string) {
    //     const user = await this.UserRepository.findById(_id);
    //     if(user){
    //         return {
    //             status:200,
    //             data:user
    //         }
    //     }else{
    //         throw new Error('User not found!');
    //     }
    // }

    async updateProfile(user: User) {
        const userData = await this.UserRepository.findById(user._id);
        if (userData) {
            userData.name = user.name || userData.name;
            userData.phone = user.phone || userData.phone;
            if (user.password) {
                userData.password = await this.Encrypt.generateHash(user.password) || userData.password;
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
