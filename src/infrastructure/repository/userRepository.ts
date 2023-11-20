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
        const users = await UserModel.find({}).select('-password');
        return users;
    }

    async updateWalletBalance(userId: string, price: number, actionType: string): Promise<boolean> {
        try {
            const user = await this.findById(userId);
            if (user && user.wallet) {
                const walletBalance = user.wallet;
                const newWalletBalance = actionType === 'increment' ? walletBalance + price : walletBalance - price;
                const updated = await UserModel.updateOne({ _id: userId }, { $set: { wallet: newWalletBalance } });
                if (updated) return true;
            }
            return false;
        } catch (error) {
            return false;
        }

    }

}

export default UserRepository;
