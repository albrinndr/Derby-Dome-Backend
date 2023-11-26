export interface Team {
    team?: {
        manager?: {
            name?: string,
            image?: string;
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

export interface Manager {
    name?: string,
    image?: string;
}

export interface Player {
    _id?: string;
    name?: string,
    shirtNo?: number;
    position?: string;
    image?: string;
    startingXI?: boolean;
}

export interface NotificationI {
    fixtureId: string;
    message: string;
    isRead: string[];
    date: Date;
}


interface Club {
    _id: string;
    name?: string;
    email: string;
    phone?: string;
    image?: string;
    password: string;
    isBlocked?: boolean;
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
    followers: string[];
    notifications: [{
        fixtureId: string;
        message: string;
        isRead: string[];
        date: Date;
    }];
}

export default Club;
