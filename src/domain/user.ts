interface User {
    _id: string;
    name?: string;
    email: string;
    password: string;
    phone?: string;
    isBlocked?: boolean;
    cart?: {
    }[];
    wallet?: number | null;
    isGoogle?: boolean;
}

export default User;
