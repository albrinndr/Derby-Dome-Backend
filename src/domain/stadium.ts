export interface Time {
    id: string;
    time: string,
    price: number,
    showDate?: Date;
}

export interface Seats {
    stand: string,
    price: {
        vip: number;
        premium: number;
        economy: number;
    };
}

interface Stadium {
    timings: [{
        time: string,
        price: number,
        showDate?: Date;
    }],
    seats: [{
        stand: string,
        price: {
            vip: number;
            premium: number;
            economy: number;
        };
    }];
}
export default Stadium;
