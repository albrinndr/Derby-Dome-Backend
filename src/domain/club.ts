export interface Team {
    team?: {
        manager?: {
            name: string,
            image: string;
        };
        players?: {
            name: string,
            shirtNo: number;
            position: string;
            image: string;
            startingXI: boolean;
        }[];
    };
}

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
    bgImg?: string;
    team?: {
        manager?: {
            name: string,
            image: string;
        };
        players?: {
            name: string,
            shirtNo: number;
            position: string;
            image: string;
            startingXI: boolean;
        }[];
    };
}

export default Club;
