import Admin from "../../domain/admin";
import AdminModel from "../db/adminModel";
import AdminRepo from "../../useCase/interface/adminRepo";

class AdminRepository implements AdminRepo {
    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email });
        return admin;
    }
}

export default AdminRepository;
