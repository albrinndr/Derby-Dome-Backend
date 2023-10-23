import { ObjectId } from 'mongoose';

interface User {
    _id?: ObjectId;
    name?: string;
    email: string;
    password: string;
    phone?: string;
    isBlocked?: boolean;
    cart?: {
    }[];
    wallet?: number | null;
}

export default User;
