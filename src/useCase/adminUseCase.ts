import AdminRepository from "../infrastructure/repository/adminRepository";
import Admin from "../domain/admin";
import Encrypt from "../infrastructure/utils/bcryptPassword";
import JWTToken from "../infrastructure/utils/generateToken";

class AdminUseCase {
    private AdminRepository: AdminRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    constructor(AdminRepository: AdminRepository, Encrypt: Encrypt, JWTToken: JWTToken) {
        this.AdminRepository = AdminRepository;
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
}

export default AdminUseCase;
