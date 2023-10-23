import AdminRepository from "../infrastructure/repository/adminRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import Admin from "../domain/admin";
import Encrypt from "../infrastructure/utils/bcryptPassword";
import JWTToken from "../infrastructure/utils/generateToken";

class AdminUseCase {
    private AdminRepository: AdminRepository;
    private UserRepository: UserRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    constructor(AdminRepository: AdminRepository, Encrypt: Encrypt, JWTToken: JWTToken, UserRepository: UserRepository) {
        this.AdminRepository = AdminRepository;
        this.UserRepository = UserRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
    }

    async login(admin: Admin) {
        const adminData = await this.AdminRepository.findByEmail(admin.email);
        if (adminData) {
            const passwordMatch = await this.Encrypt.compare(admin.password, adminData.password);
            if (passwordMatch) {
                const token = this.JWTToken.generateToken(adminData._id);
                return {
                    status: 200,
                    data: {
                        admin: adminData,
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

    async getUsers() {
        const userList = await this.UserRepository.findAllUsers();
        return {
            status: 200,
            data: userList
        };
    }

    async blockUser(_id: string) {
        const user = await this.UserRepository.findById(_id);
        if (user) {
            user.isBlocked = !user.isBlocked;
            const updatedUser = await this.UserRepository.save(user);
            return {
                status: 200,
                data: updatedUser
            };
        } else {
            throw new Error('User not found!');
        }
    }
}

export default AdminUseCase;
