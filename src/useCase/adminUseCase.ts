import AdminRepository from "../infrastructure/repository/adminRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import ClubRepository from "../infrastructure/repository/clubRepository";
import Admin from "../domain/admin";
import Encrypt from "../infrastructure/utils/bcryptPassword";
import JWTToken from "../infrastructure/utils/generateToken";

class AdminUseCase {
    private AdminRepository: AdminRepository;
    private UserRepository: UserRepository;
    private ClubRepository: ClubRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    constructor(AdminRepository: AdminRepository, Encrypt: Encrypt, JWTToken: JWTToken, UserRepository: UserRepository, ClubRepository: ClubRepository) {
        this.AdminRepository = AdminRepository;
        this.UserRepository = UserRepository;
        this.ClubRepository = ClubRepository;
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
                return {
                    status: 400,
                    data: {
                        admin: 'Invalid email or password!',
                        token: null
                    }
                };
            }
        } else {
            return {
                status: 400,
                data: {
                    admin: 'Invalid email or password!',
                    token: null
                }
            };
        }
    }

    async getUsers() {
        const usersList = await this.UserRepository.findAllUsers();
        return {
            status: 200,
            data: usersList
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
            return {
                status: 400,
                data: 'User not found!'
            };
        }
    }

    async getClubs() {
        const clubsList = await this.ClubRepository.findAllClubs();
        return {
            status: 200,
            data: clubsList
        };
    }

    async blockClub(_id: string) {
        const club = await this.ClubRepository.findById(_id);
        if (club) {
            club.isBlocked = !club.isBlocked;
            const updatedClub = await this.ClubRepository.save(club);
            return {
                status: 200,
                data: updatedClub
            };
        } else {
            return {
                status: 400,
                data: 'Club not found!'
            };
        }
    }
}

export default AdminUseCase;
