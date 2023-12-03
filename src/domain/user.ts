interface User {
    _id: string;
    name?: string;
    email: string;
    password: string;
    phone?: string;
    isBlocked?: boolean;
    wallet?: number | null;
    isGoogle?: boolean;
    profilePic?: string;
    browserToken:string
}

export default User;
