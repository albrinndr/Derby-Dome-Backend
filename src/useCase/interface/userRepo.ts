import User from "../../domain/user";

interface UserRepo {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}

export default UserRepo;
