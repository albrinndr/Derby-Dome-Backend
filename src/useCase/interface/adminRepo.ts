import Admin from "../../domain/admin";

interface AdminRepo {
    findByEmail(email: string): Promise<Admin | null>;
}

export default AdminRepo;
