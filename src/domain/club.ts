interface Club {
    _id: string;
    name?: string;
    email: string;
    phone?: string;
    image?: string;
    password: string;
    isBlocked?: boolean;
    cart?: {
    }[];
    wallet?: number | null;
    contactPerson?: string,
    address?: string,
    description?: string;
    bgImg?:string
}

export default Club;
