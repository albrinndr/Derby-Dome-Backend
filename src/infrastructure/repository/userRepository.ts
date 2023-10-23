import User from "../../domain/user";
import UserModel from "../db/userModel";
import UserRepo from "../../useCase/interface/userRepo";

class UserRepository implements UserRepo {
    async save(user: User): Promise<User> {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        return user;
    }

    async findById(_id: string): Promise<User | null> {
        const user = await UserModel.findById({ _id });
        return user;
    }

    async findAllUsers(): Promise<{}[] | null> {
        const users = await UserModel.find({}).select('-password');;
        return users;
    }

}

export default UserRepository;
